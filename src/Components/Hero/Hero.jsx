import "./Hero.css";

const Hero = ({ openregister }) => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <img
            src="//d3m889aznlr23d.cloudfront.net/img/events/id/459/459371964/assets/ab7e4d41eea10ca3d9aac99a2a4f3f2d.logo.png"
            alt="Catalyst"
            className="hero-logo"
          />

          <h2>MUMBAI</h2>

          <p>Friday, July 03, 9:00AM</p>
          <p>Sofitel Mumbai BKC</p>

          <button className="hero-btn" onClick={openregister}>REGISTER NOW</button>
        </div>

        <div className="hero-image-wrapper">
          <img
            src="//d3m889aznlr23d.cloudfront.net/img/events/id/459/459410233/assets/1557d54f8b9b42f52930c3893e5b4dac.Untitled-June-10-2026-at-10.17.53-5.png"
            alt="Mumbai"
            className="hero-image"
          />

          <div className="pink-box"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
