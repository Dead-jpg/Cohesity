import React, { useState, useEffect } from "react";
import "./Register.css";
import { addRegistration } from "../../utils/db";
import Banner1 from "../../assets/banner1.png";

const Register = ({ open, onClose }) => {
  const [formerror, setformerrors] = useState({});
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    phoneNumber: "",
    country: "",
    invitedBy: "",
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setIsSubmitting(false);
      setShowSuccessScreen(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    setIsSubmitting(false);
    setShowSuccessScreen(false);
    onClose();
  };

  if (!open) return null;

  const validate = (values) => {
    const error = {};

    if (!values.firstName.trim()) {
      error.firstName = 'The question "First Name" is required.';
    }

    if (!values.lastName.trim()) {
      error.lastName = 'The question "Last Name" is required.';
    }

    if (!values.email.trim()) {
      error.email = 'The question "Corporate Email" is required.';
    } else {
      const emailVal = values.email.trim();
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailVal)) {
        error.email = "Please enter a valid email address";
      } else {
        const domain = emailVal.substring(emailVal.lastIndexOf("@") + 1).toLowerCase();
        const personalDomains = [
          "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "live.com",
          "aol.com", "icloud.com", "zoho.com", "protonmail.com", "yandex.com",
          "mail.com", "gmx.com", "rediffmail.com", "yahoo.co.in"
        ];
        if (personalDomains.includes(domain)) {
          error.email = "Please enter a valid corporate email address.";
        }
      }
    }

    if (!values.company.trim()) {
      error.company = 'The question "Company" is required.';
    }

    if (!values.jobTitle.trim()) {
      error.jobTitle = 'The question "Job Title" is required.';
    }

    if (!values.phoneNumber.trim()) {
      error.phoneNumber = 'The question "Phone Number" is required.';
    }

    if (!values.country) {
      error.country = 'The question "Country" is required.';
    }

    if (!values.invitedBy.trim()) {
      error.invitedBy = 'The question "Please type the representative and/or company that invited you below" is required.';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setformerrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(formData);

    setformerrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await addRegistration(formData);

      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessScreen(true);

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          jobTitle: "",
          phoneNumber: "",
          country: "",
          invitedBy: "",
        });

        setformerrors({});
      }, 2000);
    } catch (error) {
      console.error("Failed to register:", error);
      setIsSubmitting(false);
      setSuccessMessage(
        "Registration failed. Please make sure the API server is running."
      );
    }
  };

  if (isSubmitting) {
    return (
      <div className="register-overlay" onClick={handleClose}>
        <div
          className="register-modal loading-modal-layout"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Recording your response...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <div className="register-overlay" onClick={handleClose}>
        <div
          className="register-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Close modal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00ca9d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="success-brand-header">
            <img src={Banner1} alt="Cohesity Logo" className="success-cohesity-logo" />
          </div>

          <div className="success-content-wrapper">
            <h2 className="success-received-title">Registration Received!</h2>
            <p className="success-received-subtitle">Your response is recorded successfully!</p>
            
            <div className="success-received-details">
              <p>
                We are currently reviewing your details. If your registration is accepted, a separate email will be sent confirming your participation for attending the session.
              </p>
              <p>
                Please note that entry to the session is subject to receiving the confirmation email and WhatsApp message.
              </p>
            </div>

            <p className="success-received-disclaimer">
              Disclaimer: <em>**The organizer reserves all the right to accept or decline any registration and deny entry to the event at its discretion.</em>
            </p>

            <div className="calendar-section">
              <h3 className="calendar-title">Add to Calendar</h3>
              <div className="calendar-icons-container">
                <a href="#" className="calendar-link">
                  <div className="calendar-icon-wrapper">
                    <svg viewBox="0 0 24 24">
                      <path fill="#00ca9d" d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.24 3.5v2.88h5.08c2.97-2.73 4.67-6.75 4.67-11.53c0-.6-.05-1.2-.15-1.58z"/>
                      <path fill="#00ca9d" d="M12.18 20.25c2.7 0 4.97-.9 6.63-2.42l-5.08-2.88c-.8.53-1.85.86-3.15.86c-2.43 0-4.5-1.63-5.23-3.83H1.03v2.98c2.08 4.14 6.38 6.95 11.15 6.95z"/>
                      <path fill="#00ca9d" d="M6.95 11.98c-.19-.53-.3-1.1-.3-1.68s.11-1.15.3-1.68V5.64H1.03C.37 6.95 0 8.43 0 10.3s.37 3.35 1.03 4.66l5.92-2.98z"/>
                      <path fill="#00ca9d" d="M12.18 5.75c1.47 0 2.78.5 3.82 1.5l2.87-2.87C17.15 2.8 14.88 2 12.18 2C7.41 2 3.11 4.8 1.03 8.94l5.92 2.98c.73-2.2 2.8-3.83 5.23-3.83z"/>
                    </svg>
                  </div>
                  <span>Google</span>
                </a>

                <a href="#" className="calendar-link">
                  <div className="calendar-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="#00ca9d">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5H7v2h5v-2zm4 0h-3v2h3v-2zm-4 4H7v2h5v-2zm4 0h-3v2h3v-2z"/>
                    </svg>
                  </div>
                  <span>Outlook</span>
                </a>

                <a href="#" className="calendar-link">
                  <div className="calendar-icon-wrapper">
                    <svg viewBox="0 0 24 24" fill="#00ca9d">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
                    </svg>
                  </div>
                  <span>Apple</span>
                </a>

                <a href="#" className="calendar-link">
                  <div className="calendar-icon-wrapper">
                    <span className="yahoo-y-text" style={{ color: "#00ca9d" }}>y!</span>
                  </div>
                  <span>Yahoo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-overlay" onClick={handleClose}>
      <div
        className="register-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00ca9d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="register-title">REGISTER NOW</h2>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <div className="form-group">
            <label className={`form-label ${formerror.firstName ? "label-error" : ""}`}>
              First Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className={`form-input ${formerror.firstName ? "input-error" : ""}`}
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {formerror.firstName && (
              <span className="error-message">{formerror.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.lastName ? "label-error" : ""}`}>
              Last Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className={`form-input ${formerror.lastName ? "input-error" : ""}`}
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {formerror.lastName && (
              <span className="error-message">{formerror.lastName}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.email ? "label-error" : ""}`}>
              Corporate Email <span className="required-asterisk">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`form-input ${formerror.email ? "input-error" : ""}`}
              placeholder="you@your.email"
              value={formData.email}
              onChange={handleChange}
            />
            {formerror.email && (
              <span className="error-message">{formerror.email}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.company ? "label-error" : ""}`}>
              Company <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="company"
              className={`form-input ${formerror.company ? "input-error" : ""}`}
              value={formData.company}
              onChange={handleChange}
            />
            {formerror.company && (
              <span className="error-message">{formerror.company}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.jobTitle ? "label-error" : ""}`}>
              Job Title <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              className={`form-input ${formerror.jobTitle ? "input-error" : ""}`}
              value={formData.jobTitle}
              onChange={handleChange}
            />
            {formerror.jobTitle && (
              <span className="error-message">{formerror.jobTitle}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.phoneNumber ? "label-error" : ""}`}>
              Phone Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className={`form-input ${formerror.phoneNumber ? "input-error" : ""}`}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {formerror.phoneNumber && (
              <span className="error-message">{formerror.phoneNumber}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.country ? "label-error" : ""}`}>
              Country <span className="required-asterisk">*</span>
            </label>

            <div className="select-wrapper">
              <select
                name="country"
                className={`form-select ${formerror.country ? "input-error" : ""}`}
                value={formData.country}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Choose your country
                </option>

                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="United Arab Emirates">
                  United Arab Emirates
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formerror.country && (
              <span className="error-message">{formerror.country}</span>
            )}
          </div>

          <div className="form-group">
            <label className={`form-label ${formerror.invitedBy ? "label-error" : ""}`}>
              Please type the representative and/or company that invited you
              below <span className="required-asterisk">*</span>
            </label>

            <input
              type="text"
              name="invitedBy"
              className={`form-input ${formerror.invitedBy ? "input-error" : ""}`}
              value={formData.invitedBy}
              onChange={handleChange}
            />

            {formerror.invitedBy && (
              <span className="error-message">{formerror.invitedBy}</span>
            )}
          </div>

          <div className="disclaimer-container">
            <p className="disclaimer-text">
              By submitting this form, I confirm that I have read and agree to
              the{" "}
              <a href="#" className="pink-link">
                Privacy Statement.
              </a>
            </p>

            <p className="disclaimer-text">
              This event is only available to eligible Cohesity invited guests.
              By registering for this event you are agreeing to our terms and
              conditions which can be found{" "}
              <a href="#" className="pink-link">
                here.
              </a>
            </p>

            <p className="disclaimer-text legal-fine-print">
              The fair market value of this event (inclusive of all items,
              meals and/or entertainment) may exceed $20 per person. Please
              take U.S. federal gifting requirements and other pertinent
              guidelines into consideration when attending our event or
              accepting an item. Government employees should understand any
              restrictions specific to their role and seek agency guidance when
              needed. If you have any questions or would like to cover the cost
              of the value provided, please reach out to the Cohesity event
              organizer.
            </p>
          </div>

          {Object.keys(formerror).length > 0 && (
            <div className="form-error-summary">
              {formerror.email && formerror.email !== 'The question "Corporate Email" is required.' ? (
                "Sorry, you cannot RSVP to this event with this email"
              ) : (
                "There were some errors submitting the form. Please make sure all questions are correctly answered."
              )}
            </div>
          )}

          {SuccessMessage && (
            <div className="success-message">
              {SuccessMessage}
            </div>
          )}

          <div className="submit-container">
            <button type="submit" className="submit-btn">
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
