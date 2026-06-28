import Banner1 from "../../assets/banner1.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-left">
          <img
            src={Banner1}
            alt="Cohesity Logo"
            className="footer-logo"
          />

          <p className="copyright">
            © 2026 Cohesity, Inc. All Rights Reserved.
          </p>
        </div>

        <div className="footer-right">
          <a
            href="https://www.cohesity.com/agreements/privacy/"
            className="footer-link"
          >
            Privacy Policy
          </a>

          <a href="#" className="footer-link">
            Legal
          </a>

          <a href="#" className="footer-link">
            1-855-9COHESITY
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;