const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/registrations` : "http://localhost:3001/registrations";

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
    body: JSON.stringify({ status }) // status comes from 
  });

  if (!response.ok) {
    throw new Error("Failed to update status on API");
  }
  return response.json();
};

// DELETE - Delete a registration
export const deleteRegistration = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to delete registration from API");
  }
  return id;
};
