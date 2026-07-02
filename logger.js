import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'error.log');

export function logError(message, error = null) {
  const timestamp = new Date().toISOString();
  const errorDetails = error ? (error.stack || error.message || error) : "";
  const logLine = `[${timestamp}] ERROR: ${message}${errorDetails ? `\nDetails: ${errorDetails}` : ""}\n\n`;
  try {
    fs.appendFileSync(LOG_FILE, logLine, 'utf8');
  } catch (err) {
    console.error("Failed to write to error.log:", err);
  }
}
