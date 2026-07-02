const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_URL = `${BASE_URL}/registrations`;
const CONTACTS_API_URL = `${BASE_URL}/contacts`;

export const getRegistrations = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch registrations from API");
  }
  return response.json();
};

export const addRegistration = async (formData) => {
  const newReg = {
    ...formData,
    status: "Pending",
    registeredAt: new Date().toISOString()
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newReg)
  });

  if (!response.ok) {
    throw new Error("Failed to post registration to API");
  }
  return response.json();
};

export const updateRegistrationStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status }) 
  });

  if (!response.ok) {
    throw new Error("Failed to update status on API");
  }
  return response.json();
};


export const deleteRegistration = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to delete registration from API");
  }
  return id;
};


export const addContactMessage = async (messageData) => {
  const newMsg = {
    ...messageData,
    submittedAt: new Date().toISOString()
  };

  const response = await fetch(CONTACTS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newMsg)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to post contact message to API");
  }

  const result = await response.json();
  try {
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "ff18c819-ef34-494d-be19-7e3850ef6d9e",
        name: messageData.name,
        email: messageData.email,
        company: messageData.company,
        note: messageData.note
      })
    });
    if (!web3Response.ok) {
      console.warn("Web3Forms client-side delivery failed with status:", web3Response.status);
    }
  } catch (error) {
    console.error("Web3Forms client-side delivery failed:", error);
  }

  return result;
};

export const sendProxyEmail = async (emailData) => {
  const response = await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    throw new Error("Failed to send email via proxy server");
  }
  return response.json();
};
