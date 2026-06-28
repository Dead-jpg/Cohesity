import React, { useState, useEffect } from "react";
import "./Register.css";
import { addRegistration } from "../../utils/db";

const Register = ({ open, onClose }) => {
  const [formerror, setformerrors] = useState({});
  const [SuccessMessage, setSuccessMessage] = useState("");

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
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

    try {
      await addRegistration(formData);

      setSuccessMessage(
        `Thank you for registering, ${formData.firstName}! Your registration is now pending review.`
      );

      setTimeout(() => {
        setSuccessMessage("");

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

        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to register:", error);

      setSuccessMessage(
        "Registration failed. Please make sure the API server is running."
      );
    }
  };

  return (
    <div className="register-overlay" onClick={onClose}>
      <div
        className="register-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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
              There were some errors submitting the form. Please make sure all questions are correctly answered.
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
