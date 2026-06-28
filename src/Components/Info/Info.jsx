import "./Info.css";

const Info = ({ openregister }) => {
  return (
    <section className="info" id="overview">
      <div className="info-container">
        <h2>
          Cohesity, a leader in AI-powered data security and management, invites
          you to Catalyst on Tour—an exclusive gathering of IT leaders and
          innovators.
        </h2>

        <p>
          This event brings together senior decision-makers shaping the future
          of data, security, and AI, designed specifically for IT and security
          leaders navigating today's rapidly evolving threat landscape, this
          event brings together industry experts, partners, and peers to share
          practical strategies for strengthening cyber resilience and unlocking
          the value of your data.
        </p>

        <p>
          As organizations embrace AI and modern cloud architectures, the need
          for a secure and resilient data infrastructure has never been greater.
          Whether you are defending against cyber threats, modernizing data
          protection, or preparing for AI-driven innovation, this session will
          provide the insights and tools you need to stay ahead.
        </p>

        <button className="info-btn" onClick={openregister}>REGISTER NOW</button>
      </div>
    </section>
  );
};

export default Info;
