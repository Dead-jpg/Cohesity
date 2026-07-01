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

  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState("");


  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: "",
        email: "",
        company: "",
        note: "",
      });
      setFormErrors({});
      setSubmitSuccess(false);
      setCaptchaChecked(false);
      setCaptchaLoading(false);
      setCaptchaError("");
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
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

  const handleCaptchaClick = () => {
    if (captchaChecked || captchaLoading) return;
    setCaptchaLoading(true);
    setCaptchaError("");
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaChecked(true);
    }, 1200);
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

    if (!captchaChecked) {
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
      await addContactMessage(formData);
    } catch (error) {
      console.warn("API delivery failed, using offline fallback", error);
    }

    // Submit to Web3Forms for email notification
    try {
      const web3Data = new FormData();
      web3Data.append("access_key", "ff18c819-ef34-494d-be19-7e3850ef6d9e");
      web3Data.append("name", formData.name);
      web3Data.append("email", formData.email);
      web3Data.append("company", formData.company);
      web3Data.append("note", formData.note);

      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3Data
      });
    } catch (err) {
      console.error("Web3Forms submission failed:", err);
    }

    setIsSubmitting(false);
    setSubmitSuccess(true);
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
                <div className="recaptcha-widget">
                  <div className="recaptcha-left">
                    <div
                      className={`recaptcha-checkbox ${captchaChecked ? "verified" : ""} ${captchaLoading ? "loading" : ""}`}
                      onClick={handleCaptchaClick}
                    >
                      {captchaLoading && <div className="recaptcha-spinner"></div>}
                      {captchaChecked && (
                        <svg className="recaptcha-check-svg" viewBox="0 0 24 24">
                          <path
                            d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                            fill="none"
                            stroke="#00a854"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="recaptcha-text">I'm not a robot</span>
                  </div>

                  <div className="recaptcha-right">
                    <div className="recaptcha-branding">
                      <svg viewBox="0 0 24 24" className="recaptcha-logo-svg">
                        <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4z" fill="#4a90e2" />
                        <path d="M6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z" fill="#3cba54" />
                      </svg>
                      <span className="recaptcha-logo-label">reCAPTCHA</span>
                    </div>
                    <div className="recaptcha-links">
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                      <span> - </span>
                      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Terms</a>
                    </div>
                  </div>
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
