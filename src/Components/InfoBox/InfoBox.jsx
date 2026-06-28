import "./InfoBox.css";

const InfoBox = () => {
    return (
        <section className="why-attend" id="why-attend">
            <div className="why-attend-heading">
                <span>WHY ATTEND?</span>
            </div>

            <div className="why-attend-container">
                <div className="attend-card">
                    <img
                        src="https://cached-services.splashthat.com/service/image-transform?src=//d3m889aznlr23d.cloudfront.net/img/events/id/459/459371964/assets/e98265b6a7da43f657f3786080221c77.icon-protect-and-secure-56x56.svg"
                        alt="Cyber Resilience"
                    />

                    <h3>Strengthen Cyber Resilience</h3>

                    <p>
                        Discover how to protect and recover your critical data against
                        increasingly sophisticated cyber threats.
                    </p>
                </div>

                <div className="attend-card">
                    <img
                        src="https://cached-services.splashthat.com/service/image-transform?src=//d3m889aznlr23d.cloudfront.net/img/events/id/459/459371964/assets/ee5011b4436e4e092187d3b16529b267.icon-unlock-56x56.svg"
                        alt="Secure Enterprise"
                    />

                    <h3>Secure Your Modern Enterprise</h3>

                    <p>
                        Learn best practices for protecting data, identities, and
                        workloads across hybrid and multi-cloud environments.
                    </p>
                </div>

                <div className="attend-card">
                    <img
                        src="https://cached-services.splashthat.com/service/image-transform?src=//d3m889aznlr23d.cloudfront.net/img/events/id/459/459371964/assets/3d7c1539201b30c48f01baf6f033f414.icon-ai-powered-56x56.svg"
                        alt="AI Ready Data"
                    />

                    <h3>Unlock the Power of AI-Ready Data</h3>

                    <p>
                        Explore how intelligent insights and automation can accelerate
                        response times and support smarter decision-making.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default InfoBox;