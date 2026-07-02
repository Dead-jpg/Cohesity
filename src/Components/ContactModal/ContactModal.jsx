import { useState, useEffect } from "react";
import "./ContactModal.css";
import { addContactMessage } from "../../utils/db";

import {
  isValidName,
  isValidCompany,
  validateEmail
} from "../../utils/validation";

const ContactModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    note: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  useEffect(() => {
    let widgetId;
    let isMounted = true;

    const renderWidget = () => {
      if (window.turnstile && isMounted) {
        try {
          window.turnstile.ready(() => {
            if (!isMounted) return;
            const el = document.getElementById("cf-turnstile-element");
            if (el) {
              widgetId = window.turnstile.render("#cf-turnstile-element", {
                sitekey: import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
                callback: (token) => {
                  setTurnstileToken(token);
                  setCaptchaError("");
                },
                "error-callback": () => {
                  setCaptchaError("Captcha verification failed.");
                  setTurnstileToken("");
                },
                "expired-callback": () => {
                  setCaptchaError("Captcha expired.");
                  setTurnstileToken("");
                }
              });
            }
          });
        } catch (err) {
          console.error("Turnstile rendering error:", err);
        }
      }
    };

    if (open) {
      document.body.style.overflow = "hidden";
      setFormData({
        name: "",
        email: "",
        company: "",
        note: "",
      });
      setFormErrors({});
      setSubmitSuccess(false);
      setTurnstileToken("");
      setCaptchaError("");

      if (window.turnstile) {
        renderWidget();
      } else {
        const interval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(interval);
            renderWidget();
          }
        }, 100);
        return () => {
          clearInterval(interval);
          isMounted = false;
          document.body.style.overflow = "";
          if (widgetId && window.turnstile) {
            try { window.turnstile.remove(widgetId); } catch (e) {}
          }
        };
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      isMounted = false;
      document.body.style.overflow = "";
      if (widgetId && window.turnstile) {
        try { window.turnstile.remove(widgetId); } catch (e) {}
      }
    };
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};
    
    if (formData.name.trim() && !isValidName(formData.name)) {
      errors.name = "Name must only contain letters, spaces, hyphens, dots, and apostrophes.";
    }

    const emailValidation = validateEmail(formData.email, false);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    if (formData.company.trim() && !isValidCompany(formData.company)) {
      errors.company = "Company name must only contain letters, numbers, spaces, and basic punctuation.";
    }

    if (!formData.note.trim()) {
      errors.note = "Note is required.";
    }

    if (!turnstileToken) {
      setCaptchaError("Please verify that you are not a robot.");
      errors.captcha = true;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addContactMessage({
        ...formData,
        turnstileToken
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setCaptchaError("Failed to submit message. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-overlay" onClick={onClose}>
      <div
        className="contact-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="contact-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitSuccess ? (
          <div className="contact-success-container">
            <div className="success-icon-wrapper">
              <svg viewBox="0 0 24 24" className="success-checkmark-svg">
                <circle cx="12" cy="12" r="10" fill="#7c3aed" />
                <path d="M9 12l2 2 4-4" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="success-title">Message Sent!</h2>
            <p className="success-text">
              Thank you for reaching out. The organizer has received your message and will get back to you shortly.
            </p>
            <button className="success-close-btn" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 className="contact-title">Contact the Organizer</h2>

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="contact-form-group">
                <label className="contact-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className={`contact-input ${formErrors.name ? "input-error" : ""}`}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.name && (
                  <span className="contact-error-msg">{formErrors.name}</span>
                )}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">
                  Email <span className="red-asterisk">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`contact-input ${formErrors.email ? "input-error" : ""}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.email && (
                  <span className="contact-error-msg">{formErrors.email}</span>
                )}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">Company</label>
                <input
                  type="text"
                  name="company"
                  className={`contact-input ${formErrors.company ? "input-error" : ""}`}
                  placeholder="Enter your company"
                  value={formData.company}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {formErrors.company && (
                  <span className="contact-error-msg">{formErrors.company}</span>
                )}
              </div>

              <div className="contact-form-group">
                <label className="contact-label">
                  Note <span className="red-asterisk">*</span>
                </label>
                <textarea
                  name="note"
                  className={`contact-textarea ${formErrors.note ? "input-error" : ""}`}
                  placeholder="Type your message here..."
                  value={formData.note}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows={4}
                />
                {formErrors.note && (
                  <span className="contact-error-msg">{formErrors.note}</span>
                )}
              </div>
              <div className="recaptcha-outer-container">
                <div style={{ display: "flex", justifyContent: "center", minHeight: "65px", marginBottom: "10px" }}>
                  <div id="cf-turnstile-element"></div>
                </div>
                {captchaError && (
                  <span className="contact-error-msg captcha-error">{captchaError}</span>
                )}
              </div>

              <div className="contact-submit-container">
                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;
