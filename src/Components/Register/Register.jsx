import React, { useState, useEffect } from "react";
import "./Register.css";
import { addRegistration } from "../../utils/db";

const Register = ({ open, onClose }) => {

  const [SuccessMessage, setSuccessMessage] = useState("")
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
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);

    try {
      // Save to json-server database via POST API
      await addRegistration(formData);


      // Success handling - show success message and close modal after 3 seconds
      setSuccessMessage(`Thank you for registering, ${formData.firstName}!. Your registration is now pending review`);

      setTimeout(() => {
        setSuccessMessage("");
        onClose();
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
      }, 3000);

    } catch (error) {
      console.error("Failed to register:", error);
      alert("Registration failed. Please make sure the API server is running and try again.");
    }
  };

  return (
    <div className="register-overlay" onClick={onClose}>
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
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

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label className="form-label">
              First Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="form-input"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Last Name <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className="form-input"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Corporate Email <span className="required-asterisk">*</span>
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@your.email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Company <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="company"
              className="form-input"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Job Title <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              className="form-input"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Phone Number <span className="required-asterisk">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-input"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Country <span className="required-asterisk">*</span>
            </label>
            <div className="select-wrapper">
              <select
                name="country"
                className="form-select"
                value={formData.country}
                onChange={handleChange}
                required
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
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Please type the representative and/or company that invited you below
            </label>
            <input
              type="text"
              name="invitedBy"
              className="form-input"
              value={formData.invitedBy}
              onChange={handleChange}

            />
          </div>

          <div className="disclaimer-container">
            <p className="disclaimer-text">
              By submitting this form, I confirm that I have read and agree to the{" "}
              <a href="#" className="pink-link">
                Privacy Statement.
              </a>
            </p>
            <p className="disclaimer-text">
              This event is only available to eligible Cohesity invited guests. By registering for
              this event you are agreeing to our terms and conditions which can be found{" "}
              <a href="#" className="pink-link">
                here.
              </a>
            </p>
            <p className="disclaimer-text legal-fine-print">
              The fair market value of this event (inclusive of all items, meals and/or
              entertainment) may exceed $20 per person. Please take U.S. federal gifting
              requirements and other pertinent guidelines into consideration when attending
              our event or accepting an item. Government employees should understand any
              restrictions specific to their role and seek agency guidance when needed. If you
              have any questions or would like to cover the cost of the value provided, please
              reach out to the Cohesity event organizer.
            </p>
          </div>
          {SuccessMessage ? (
            <div className="success-message">
              {SuccessMessage}
            </div>
          )
            : (<div className="submit-container">
              <button type="submit" className="submit-btn">
                SUBMIT
              </button>
            </div>)}



        </form>
      </div>
    </div>
  );
};

export default Register;
