export const logError = (errorDescription) => {
  const timestamp = new Date().toISOString();
  const newLog = `[${timestamp}] ${errorDescription}`;

  try {
    const existingLogs = JSON.parse(localStorage.getItem("app_error_logs") || "[]");
    existingLogs.push(newLog);

    // Limit to last 50 logs to prevent memory overflow
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }

    localStorage.setItem("app_error_logs", JSON.stringify(existingLogs));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }

  console.error(newLog); // Also output to the developer console
};

export const downloadLogs = () => {
  try {
    const logs = JSON.parse(localStorage.getItem("app_error_logs") || "[]");
    if (logs.length === 0) {
      alert("No error logs recorded yet!");
      return;
    }
    const blob = new Blob([logs.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "error_log.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL resource
  } catch (e) {
    console.error("Failed to download logs:", e);
  }
};

export const clearLogs = () => {
  try {
    localStorage.removeItem("app_error_logs");
    alert("Error logs cleared!");
  } catch (e) {
    console.error("Failed to clear logs:", e);
  }
};

// Expose these methods to the window object so you can run them directly in the browser console
if (typeof window !== "undefined") {
  window.downloadLogs = downloadLogs;
  window.clearLogs = clearLogs;
}
