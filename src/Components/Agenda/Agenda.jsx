import "./Agenda.css";

const Agenda = () => {
  const agendaItems = [
    {
      time: "9:00 AM - 10:00 AM",
      title: "Registrations + Breakfast + Engagement",
    },
    {
      time: "10:00 AM - 10:10 AM",
      title: "Welcome Address",
      speaker: "Speaker: Mayank Mishra, Country Manager- Cohesity India & SAARC",
    },
    {
      time: "10:10 AM - 10:25 AM",
      title: "Keynote Speech",
      speaker: "Speaker: Aditya Vasudevan, GVP, Customer Cyber Resiliency Services - Cohesity",
    },
    {
      time: "10:25 AM - 11:10 AM",
      title: "Modern Data Protection: Strengthening Your Last Line of Defense",
      speaker: "Speaker: Manoj Mittal, Field Technical Director - Cohesity",
    },
    {
      time: "11:10 AM - 11:25 AM",
      title: "Partner Session [Semperis]",
    },
    {
      time: "11:55 AM - 12:15 PM",
      title: "Identity Security Against Today's Threat Landscape",
      speaker: "Speaker: Lalan Prasad - Solution Architect, Cohesity - India & SAARC",
    },
    {
      time: "12:15 AM - 12:30 PM",
      title: "Tea Break",
    },
    {
      time: "12:30 PM - 1:15 PM",
      title: "Cyber Resilience in the Age of AI: A CXO's Playbook for Staying Ahead",
      speaker: "Customers and in conversation with Sunil Moolchandani, Chief Strategy Officer - Cohesity"
    },
    {
      time: "1:15 PM - 2:00 PM",
      title: " Unlocking Intelligence: AI-Powered Insights for Faster Response",
      speaker: "Speaker: Kesavan Palanichamy, Senior Staff Product Management - Cohesity"
    },
    {
      time: "2:00 PM",
      title: " Networking Lunch",
    },
  ];

  return (
    <section className="agenda-section" id="agenda">
      <div className="agenda-heading">
        <span>AGENDA</span>
      </div>

      <div className="agenda-container">
        <div className="agenda-list">
          {agendaItems.map((item, index) => (
            <div key={index} className="agenda-item">
              <div className="agenda-time">{item.time}</div>
              <div className="agenda-details">
                <h3 className="agenda-title">{item.title}</h3>
                {item.speaker && <p className="agenda-speaker">{item.speaker}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agenda;
