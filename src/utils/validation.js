// Regex patterns for field validations
export const NAME_REGEX = /^[\p{L}\s\-'.]+$/u;
export const COMPANY_REGEX = /^[\p{L}\p{N}\s\-',./()&]+$/u;
export const JOB_TITLE_REGEX = /^[\p{L}\p{N}\s\-',./()]+$/u;
export const INVITED_BY_REGEX = /^[\p{L}\p{N}\s\-',./()&]+$/u;
export const COUNTRY_REGEX = /^[\p{L}\s\-'.()]+$/u;
export const PHONE_REGEX = /^\+?[0-9\s\-()]+$/;
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// List of personal email domains to reject for corporate emails
export const PERSONAL_DOMAINS = [
  "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
  "aol.com", "icloud.com", "zoho.com", "protonmail.com", "yandex.com",
  "mail.com", "gmx.com", "rediffmail.com", "yahoo.co.in"
];

/**
 * Validates a person's name (first, last, or full name).
 * @param {string} name 
 * @returns {boolean}
 */
export const isValidName = (name) => {
  return !name || NAME_REGEX.test(name.trim());
};

/**
 * Validates a company name.
 * @param {string} company 
 * @returns {boolean}
 */
export const isValidCompany = (company) => {
  return !company || COMPANY_REGEX.test(company.trim());
};

/**
 * Validates a job title.
 * @param {string} jobTitle 
 * @returns {boolean}
 */
export const isValidJobTitle = (jobTitle) => {
  return !jobTitle || JOB_TITLE_REGEX.test(jobTitle.trim());
};

/**
 * Validates the "Invited By" field.
 * @param {string} invitedBy 
 * @returns {boolean}
 */
export const isValidInvitedBy = (invitedBy) => {
  return !invitedBy || INVITED_BY_REGEX.test(invitedBy.trim());
};

/**
 * Validates a country name.
 * @param {string} country 
 * @returns {boolean}
 */
export const isValidCountry = (country) => {
  return !country || COUNTRY_REGEX.test(country.trim());
};

/**
 * Validates a standard or corporate email address.
 * @param {string} email 
 * @param {boolean} requireCorporate 
 * @returns {{isValid: boolean, error: string}}
 */
export const validateEmail = (email, requireCorporate = false) => {
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
  return { isValid: true, error: "" };
};

/**
 * Validates a phone number.
 * @param {string} phoneNumber 
 * @returns {{isValid: boolean, error: string}}
 */
export const validatePhoneNumber = (phoneNumber) => {
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
  
  return { isValid: true, error: "" };
};
