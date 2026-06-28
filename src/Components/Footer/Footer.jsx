import Banner1 from "../../assets/banner1.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-left">
          <img src={Banner1} alt="Cohesity Logo" className="footer-logo" />
          <p className="copyright">© 2026 Cohesity, Inc. All Rights Reserved.</p>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Legal</a>
          <span className="footer-phone">1-855-9COHESITY</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
