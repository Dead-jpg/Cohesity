import React, { useState } from "react";
import Banner1 from "../../assets/banner1.png";
import ContactModal from "../ContactModal/ContactModal";
import "./Footer.css";

const Footer = () => {
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  const toggleCalendar = () => {
    setShowCalendarOptions(!showCalendarOptions);
  };

  // Calendar Links Data
  const startTime = "20260703T033000Z";
  const endTime = "20260703T083000Z";
  const title = "Catalyst On Tour: Mumbai";
  const eventLocation = "Sofitel Mumbai BKC C 57 Mumbai MH 400051";
  const description = "See you there!";

  const icsData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${eventLocation}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");

  const appleCalendarHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsData)}`;
  const googleUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(eventLocation)}`;
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=2026-07-03T09:00:00&enddt=2026-07-03T14:00:00&body=${encodeURIComponent(description)}&location=${encodeURIComponent(eventLocation)}`;
  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(title)}&st=20260703T090000&et=20260703T140000&desc=${encodeURIComponent(description)}&in_loc=${encodeURIComponent(eventLocation)}`;

  return (
    <>
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

      {/* Grey footer bar below */}
      <div className="footer-grey-bar">
        <div className="footer-grey-container">
          <div className="footer-grey-right">
            <div className={`calendar-wrapper ${showCalendarOptions ? "expanded" : ""}`}>
              <div className="calendar-options">
                <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="calendar-opt-link">
                  Google
                </a>
                <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="calendar-opt-link">
                  Outlook
                </a>
                <a href={appleCalendarHref} download="catalyst-tour-mumbai.ics" className="calendar-opt-link">
                  iCal
                </a>
                <a href={yahooUrl} target="_blank" rel="noopener noreferrer" className="calendar-opt-link">
                  Yahoo
                </a>
              </div>

              <button 
                className="calendar-trigger-btn" 
                onClick={toggleCalendar} 
                aria-label="Toggle calendar options"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Binder rings */}
                  <rect x="7" y="1" width="2" height="5" rx="1" fill="white"/>
                  <rect x="15" y="1" width="2" height="5" rx="1" fill="white"/>
                  {/* Main card */}
                  <rect x="4" y="4" width="16" height="17" rx="2" fill="white" />
                  {/* Horizontal line separator */}
                  <line x1="4" y1="9" x2="20" y2="9" stroke="#161616" strokeWidth="1.5" />
                  {/* Text 1 */}
                  <text x="12" y="17" fill="#161616" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="'Inter', 'Arial', sans-serif">1</text>
                </svg>
              </button>
            </div>

            <button className="contact-organizer-btn" onClick={() => setOpenContact(true)}>
              CONTACT THE ORGANIZER
            </button>
          </div>
        </div>
      </div>

      <ContactModal open={openContact} onClose={() => setOpenContact(false)} />
    </>
  );
};

export default Footer;