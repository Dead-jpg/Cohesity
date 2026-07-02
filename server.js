import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = 'db.json';

// Standard Express Middlewares
app.use(cors());
app.use(express.json());

// Validation Regex (matching client validation.js)
const NAME_REGEX = /^[\p{L}\s\-'.]+$/u;
const COMPANY_REGEX = /^[\p{L}\p{N}\s\-',./()&]+$/u;
const JOB_TITLE_REGEX = /^[\p{L}\p{N}\s\-',./()]+$/u;
const INVITED_BY_REGEX = /^[\p{L}\p{N}\s\-',./()&]+$/u;
const PHONE_REGEX = /^\+?[0-9\s\-()]+$/;
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const PERSONAL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
  "aol.com", "icloud.com", "zoho.com", "protonmail.com", "yandex.com",
  "mail.com", "gmx.com", "rediffmail.com", "yahoo.co.in"
];

// Helper: Database Read/Write Functions
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { registrations: [], contacts: [] };
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db file:", err);
    return { registrations: [], contacts: [] };
  }
}

function writeDb(data) {
  try {
    // Keep schema field if it exists
    if (!data.$schema) {
      data.$schema = "./node_modules/json-server/schema.json";
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Error writing db file:", err);
    return false;
  }
}

// Helper: Validation Functions
function validateEmail(email, requireCorporate = false) {
  const value = (email || "").trim();
  if (!value) {
    return { isValid: false, error: "Email is required." };
  }
  if (!EMAIL_REGEX.test(value)) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  if (requireCorporate) {
    const domain = value.substring(value.lastIndexOf("@") + 1).toLowerCase();
    if (PERSONAL_DOMAINS.includes(domain)) {
      return { isValid: false, error: "Please enter a valid corporate email address." };
    }
  }
  return { isValid: true };
}

function validatePhoneNumber(phoneNumber) {
  const value = (phoneNumber || "").trim();
  if (!value) {
    return { isValid: false, error: "Phone number is required." };
  }

  const digits = value.replace(/\D/g, "");
  const isRepeating = /^(\d)\1+$/.test(digits);
  const isSequential = "01234567890123456789".includes(digits) || "98765432109876543210".includes(digits);

  if (!PHONE_REGEX.test(value)) {
    return { isValid: false, error: "Please enter a valid phone number." };
  }
  if (digits.length < 8 || digits.length > 15) {
    return { isValid: false, error: "Please enter a valid phone number (between 8 and 15 digits)." };
  }
  if (isRepeating || isSequential) {
    return { isValid: false, error: "Please enter a valid, active phone number." };
  }

  return { isValid: true };
}

// Helper: Strip HTML tags to prevent XSS/Injection
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

// Helper: Cloudflare Turnstile Siteverify
async function verifyTurnstileToken(token, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || "1x00000000000000000000000000000000AA";
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: ip
      })
    });
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}

// Helper: Web3Forms Notification API
async function sendWeb3FormsNotification(formData) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY || "ff18c819-ef34-494d-be19-7e3850ef6d9e";
  try {
    const body = {
      access_key: accessKey,
      name: formData.name,
      email: formData.email,
      company: formData.company,
      note: formData.note
    };
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      console.warn("Web3Forms backend failed with response status:", response.status);
    }
  } catch (error) {
    console.error("Web3Forms email delivery failed:", error);
  }
}

// Endpoints: Registrations API

// GET /registrations - Retrieve registrations list
app.get('/registrations', (req, res) => {
  const db = readDb();
  res.json(db.registrations || []);
});

// POST /registrations - Add new registration with backend validations & XSS sanitization
app.post('/registrations', async (req, res) => {
  const { firstName, lastName, email, company, jobTitle, phoneNumber, country, invitedBy, optIn } = req.body;

  // 1. Validate inputs
  if (!firstName || !firstName.trim() || !NAME_REGEX.test(firstName.trim())) {
    return res.status(400).json({ error: "First name is invalid or missing." });
  }
  if (!lastName || !lastName.trim() || !NAME_REGEX.test(lastName.trim())) {
    return res.status(400).json({ error: "Last name is invalid or missing." });
  }

  const emailVal = validateEmail(email, true);
  if (!emailVal.isValid) {
    return res.status(400).json({ error: emailVal.error });
  }

  if (!company || !company.trim() || !COMPANY_REGEX.test(company.trim())) {
    return res.status(400).json({ error: "Company name is invalid or missing." });
  }
  if (!jobTitle || !jobTitle.trim() || !JOB_TITLE_REGEX.test(jobTitle.trim())) {
    return res.status(400).json({ error: "Job title is invalid or missing." });
  }

  const phoneVal = validatePhoneNumber(phoneNumber);
  if (!phoneVal.isValid) {
    return res.status(400).json({ error: phoneVal.error });
  }

  if (!country || !country.trim()) {
    return res.status(400).json({ error: "Country is required." });
  }

  if (!invitedBy || !invitedBy.trim() || !INVITED_BY_REGEX.test(invitedBy.trim())) {
    return res.status(400).json({ error: "Invited by representative or company name is required." });
  }

  // 2. Check if email is already registered
  const db = readDb();
  if (!db.registrations) db.registrations = [];
  
  const emailExists = db.registrations.some(
    (reg) => reg.email.toLowerCase().trim() === email.toLowerCase().trim()
  );
  if (emailExists) {
    return res.status(400).json({ error: "This email has already been registered for the event." });
  }

  // 3. Construct and sanitize new registration object
  const newRegistration = {
    firstName: sanitizeString(firstName),
    lastName: sanitizeString(lastName),
    email: sanitizeString(email),
    company: sanitizeString(company),
    jobTitle: sanitizeString(jobTitle),
    phoneNumber: sanitizeString(phoneNumber),
    country: sanitizeString(country),
    invitedBy: sanitizeString(invitedBy),
    optIn: !!optIn,
    status: "Pending",
    registeredAt: new Date().toISOString(),
    id: Math.random().toString(36).substring(2, 13) // Unique random ID string
  };

  db.registrations.push(newRegistration);
  writeDb(db);

  res.status(201).json(newRegistration);
});

// PATCH /registrations/:id - Update registration status (Approved/Disapproved)
app.patch('/registrations/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status field is required." });
  }

  const db = readDb();
  if (!db.registrations) db.registrations = [];

  const index = db.registrations.findIndex((reg) => reg.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Registration record not found." });
  }

  db.registrations[index].status = status;
  writeDb(db);

  res.json(db.registrations[index]);
});

// DELETE /registrations/:id - Remove registration record
app.delete('/registrations/:id', (req, res) => {
  const { id } = req.params;

  const db = readDb();
  if (!db.registrations) db.registrations = [];

  const index = db.registrations.findIndex((reg) => reg.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Registration record not found." });
  }

  db.registrations.splice(index, 1);
  writeDb(db);

  res.json({ id });
});


// Endpoints: Contacts API

// GET /contacts - Retrieve contact requests list
app.get('/contacts', (req, res) => {
  const db = readDb();
  res.json(db.contacts || []);
});

// POST /contacts - Submit contact request with CAPTCHA verification, email proxying & XSS protection
app.post('/contacts', async (req, res) => {
  const { name, email, company, note, turnstileToken } = req.body;

  // 1. Verify CAPTCHA Token
  if (!turnstileToken) {
    return res.status(400).json({ error: "Captcha verification is required." });
  }
  const isCaptchaValid = await verifyTurnstileToken(turnstileToken, req.ip);
  if (!isCaptchaValid) {
    return res.status(400).json({ error: "Captcha verification failed. Please try again." });
  }

  // 2. Validate inputs
  if (name && name.trim() && !NAME_REGEX.test(name.trim())) {
    return res.status(400).json({ error: "Name must only contain letters, spaces, hyphens, dots, and apostrophes." });
  }

  const emailVal = validateEmail(email, false);
  if (!emailVal.isValid) {
    return res.status(400).json({ error: emailVal.error });
  }

  if (company && company.trim() && !COMPANY_REGEX.test(company.trim())) {
    return res.status(400).json({ error: "Company name must only contain letters, numbers, spaces, and basic punctuation." });
  }

  if (!note || !note.trim()) {
    return res.status(400).json({ error: "Note is required." });
  }

  // 3. Construct and sanitize new contact object
  const newContact = {
    name: sanitizeString(name),
    email: sanitizeString(email),
    company: sanitizeString(company),
    note: sanitizeString(note),
    submittedAt: new Date().toISOString(),
    id: Math.random().toString(36).substring(2, 13)
  };

  // Send the Web3Forms email proxy request using sanitized data
  await sendWeb3FormsNotification(newContact);

  const db = readDb();
  if (!db.contacts) db.contacts = [];
  db.contacts.push(newContact);
  writeDb(db);

  res.status(201).json(newContact);
});


// Proxy Endpoint: EmailJS

app.post('/api/send-email', async (req, res) => {
  const { to_name, to_email, subject, message } = req.body;

  if (!to_name || !to_email || !subject || !message) {
    return res.status(400).json({ error: "Missing email transmission fields." });
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID || 'service_7hc5stu';
  const templateId = process.env.EMAILJS_TEMPLATE_ID || 'template_p44ch7q';
  const userId = process.env.EMAILJS_USER_ID || 'dZOxFJZEqZRwwmVi3';
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // Server-only private key

  try {
    const payload = {
      service_id: serviceId,
      template_id: templateId,
      user_id: userId,
      template_params: {
        to_name,
        to_email,
        subject,
        message
      }
    };

    if (privateKey) {
      payload.accessToken = privateKey;
    }

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("EmailJS failed:", errorText);
      return res.status(500).json({ error: `EmailJS error: ${errorText}` });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Email proxy API error:", error);
    res.status(500).json({ error: "Failed to send email through proxy server." });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});
