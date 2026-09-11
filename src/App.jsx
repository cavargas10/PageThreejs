import Header from './Header';
import ParticleModel from './ParticleModel';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <ParticleModel />

      <main className="content">
        {/* HERO SECTION */}
        <section id="hero" className="hero-section">
          <div className="hero-badge">
            <span className="badge-glow"></span>
            <span className="badge-text">NEXT-GEN DIGITAL AGENCY</span>
          </div>

          <h1 className="hero-title">
            EVOLVE<br />
            YOUR<br />
            <span className="gradient-text">DIMENSION</span>
          </h1>

          <p className="hero-description">
            We craft <strong>hyper-immersive digital experiences</strong> at the boundary between <strong>creative design</strong>, <strong>3D technology</strong>, and <strong>interactive art</strong>.
          </p>

          <div className="hero-cta-group">
            <a href="#services" className="primary-btn">
              Explore Our Work
            </a>
            <a href="#about" className="secondary-btn">
              Learn More
            </a>
          </div>

          <div className="scroll-indicator">
            <span className="mouse-wheel"></span>
            <span className="scroll-text">Scroll to morph dimensions</span>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="services-section">
          <div className="section-header">
            <span className="section-subtitle">WHAT WE DO</span>
            <h2 className="section-title">Engineered for Extraordinary Impact</h2>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="card-number">01</div>
              <h3>3D & WebGL Experiences</h3>
              <p>Custom WebGL particle engines, real-time shaders, and GPU-driven 3D web applications built for unmatched engagement.</p>
              <div className="card-tags">
                <span>Three.js</span>
                <span>GLSL Shaders</span>
                <span>React</span>
              </div>
            </div>

            <div className="service-card">
              <div className="card-number">02</div>
              <h3>Interactive Brand Systems</h3>
              <p>Evolving visual identities that respond seamlessly to user gestures, physics, and dynamic narrative environments.</p>
              <div className="card-tags">
                <span>Motion Design</span>
                <span>GSAP</span>
                <span>Creative Tech</span>
              </div>
            </div>

            <div className="service-card">
              <div className="card-number">03</div>
              <h3>Digital Product Engineering</h3>
              <p>Ultra-performant, responsive web interfaces engineered with cutting-edge front-end architecture and fluid UX transitions.</p>
              <div className="card-tags">
                <span>Vite</span>
                <span>Performance</span>
                <span>UI/UX</span>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & STATS SECTION */}
        <section id="stats" className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">120+</div>
              <div className="stat-label">Global Awards & Features</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">60fps</div>
              <div className="stat-label">Smooth GPU Performance</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">10M+</div>
              <div className="stat-label">Interactive Impressions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Client Satisfaction Rate</div>
            </div>
          </div>
        </section>

        {/* ABOUT / MISSION SECTION */}
        <section id="about" className="about-section">
          <div className="about-content">
            <span className="section-subtitle">OUR PHILOSOPHY</span>
            <h2 className="about-heading">
              Where high technology meets pure artistic imagination.
            </h2>
            <p className="about-text">
              At USTA, we reject static design. We believe that modern digital experiences must live, breathe, and adapt. By pushing particle math, custom WebGL shaders, and physics-driven interaction to their limits, we turn ordinary websites into memorable brand journeys.
            </p>
          </div>
        </section>

        {/* CALL TO ACTION SECTION */}
        <section id="contact" className="cta-section">
          <div className="cta-box">
            <h2>Ready to transform your vision?</h2>
            <p>Partner with us to create a digital experience that leaves a lasting impression.</p>
            <a href="mailto:hello@usta-agency.com" className="primary-btn cta-large">
              Start a Project Together
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} USTA Interactive Agency. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
