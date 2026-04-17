import React, { useEffect, useState } from 'react';
import { 
  UploadCloud, Cpu, Users, Briefcase, UserCircle, 
  ChevronRight, Star, ShieldCheck, Zap, BarChart3, 
  ArrowRight, Globe, CheckCircle2 
} from 'lucide-react';
import './Landing.css';
import dashboardPreview from '../assets/dashboard-preview.png';

function Landing({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-sq">SR</div>
            <h2>SmartRecruit</h2>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <a href="#roles">Roles</a>
          </div>
          <div className="nav-actions">
            <button className="nav-btn login" onClick={() => onNavigate('auth', 'login')}>Log in</button>
            <button className="nav-btn signup" onClick={() => onNavigate('auth', 'signup')}>
              Sign up <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Star size={14} className="badge-icon" />
            <span>AI-Powered Recruitment 2025</span>
          </div>
          <h1 className="hero-title">
            Hire Smarter, <br />
            <span>Get Hired Faster</span>
          </h1>
          <p className="hero-subtitle">
            The intelligent talent acquisition platform that uses advanced AI to screen resumes, rank candidates, and automate your hiring workflow.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => onNavigate('auth', 'signup')}>
              Start Hiring Now <ArrowRight size={18} />
            </button>
            <button className="hero-btn secondary" onClick={() => onNavigate('auth', 'login')}>
              Watch Demo
            </button>
          </div>

          <div className="hero-preview-container">
            <div className="preview-card">
              <img src={dashboardPreview} alt="Dashboard Preview" className="preview-img" />
              <div className="preview-overlay"></div>
            </div>
            
            {/* Stat Pills */}
            <div className="stat-pill sp-1">
              <ShieldCheck size={16} />
              <span>99.9% Accuracy</span>
            </div>
            <div className="stat-pill sp-2">
              <Zap size={16} />
              <span>Instant Screening</span>
            </div>
            <div className="stat-pill sp-3">
              <Users size={16} />
              <span>5M+ Candidates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="social-proof">
        <p>TRUSTED BY INNOVATIVE TEAMS WORLDWIDE</p>
        <div className="logo-cloud">
          <div className="cloud-item">STARK</div>
          <div className="cloud-item">WAYNE</div>
          <div className="cloud-item">OSCORP</div>
          <div className="cloud-item">PYM</div>
          <div className="cloud-item">LEXCORP</div>
        </div>
      </div>

      {/* Features Section - Bento Grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <div className="section-tag">Features</div>
          <h2 className="section-title">Everything you need to scale</h2>
          <p className="section-desc">Streamline your hiring process with tools designed for the modern age of recruitment.</p>
        </div>

        <div className="bento-grid">
          <div className="bento-card large">
            <div className="bento-icon-box bg-purple">
              <Cpu size={28} />
            </div>
            <h3>AI Resume Ranking</h3>
            <p>Our proprietary AI engine analyzes resumes against job descriptions, assigning scores based on technical skills, experience, and cultural fit.</p>
            <div className="bento-visual">
              <div className="ranking-mock">
                {[1, 2, 3].map(i => (
                  <div key={i} className="mock-row">
                    <div className="mock-avatar"></div>
                    <div className="mock-lines">
                      <div className="m-line l1"></div>
                      <div className="m-line l2"></div>
                    </div>
                    <div className="mock-score">9{5-i}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bento-card tall">
            <div className="bento-icon-box bg-teal">
              <UploadCloud size={28} />
            </div>
            <h3>Bulk Processing</h3>
            <p>Upload hundreds of resumes in seconds. Our system extracts data automatically, saving you hours of manual entry.</p>
            <div className="bento-mini-stats">
              <div className="m-stat">
                <span className="m-val">2s</span>
                <span className="m-lbl">Avg. Process Time</span>
              </div>
              <div className="m-stat">
                <span className="m-val">10k+</span>
                <span className="m-lbl">Monthly Resumes</span>
              </div>
            </div>
          </div>

          <div className="bento-card">
            <div className="bento-icon-box bg-blue">
              <BarChart3 size={28} />
            </div>
            <h3>Deep Insights</h3>
            <p>Understand why candidates were ranked the way they were with detailed talent mapping.</p>
          </div>

          <div className="bento-card">
            <div className="bento-icon-box bg-orange">
              <Globe size={28} />
            </div>
            <h3>Global Talent</h3>
            <p>Access pools from across the globe with multi-language resume support.</p>
          </div>

          <div className="bento-card wide">
            <div className="bento-icon-box bg-green">
              <CheckCircle2 size={28} />
            </div>
            <div className="bento-content-side">
              <h3>Smart Candidate Invitations</h3>
              <p>Automatically send personalized interview invites to the highest-ranking candidates, reducing time-to-hire by 60%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="roles" className="role-section">
        <div className="section-header">
          <h2 className="section-title">A dashboard for everyone</h2>
        </div>
        
        <div className="role-grid">
          <div className="role-card candidate" onClick={() => onNavigate('auth', 'signup')}>
            <div className="role-card-bg"></div>
            <div className="role-card-content">
              <UserCircle className="role-icon" size={48} />
              <h3>For Candidates</h3>
              <p>Upload your resume, get instant feedback on your profile, and find jobs that actually match your skills.</p>
              <ul className="role-list">
                <li><CheckCircle2 size={16} /> AI Resume Optimization</li>
                <li><CheckCircle2 size={16} /> Skill Gap Analysis</li>
                <li><CheckCircle2 size={16} /> Direct HR Connections</li>
              </ul>
              <button className="role-card-btn">Get Started</button>
            </div>
          </div>

          <div className="role-card hr" onClick={() => onNavigate('auth', 'signup')}>
            <div className="role-card-bg"></div>
            <div className="role-card-content">
              <Briefcase className="role-icon" size={48} />
              <h3>For Recruiters</h3>
              <p>Screen thousands of resumes effortlessly and focus your energy on the top 1% of talent.</p>
              <ul className="role-list">
                <li><CheckCircle2 size={16} /> Automated Ranking</li>
                <li><CheckCircle2 size={16} /> Recruitment Analytics</li>
                <li><CheckCircle2 size={16} /> Bulk Invitations</li>
              </ul>
              <button className="role-card-btn">Try Smart Recruiting</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="cta-footer">
        <div className="cta-content">
          <h2>Ready to revolutionize your hiring?</h2>
          <p>Join over 5,000 companies using SmartRecruit to find their best team members.</p>
          <button className="nav-btn signup" onClick={() => onNavigate('auth', 'signup')}>
            Join for Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="nav-logo">
              <div className="logo-sq">SR</div>
              <h2>SmartRecruit</h2>
            </div>
            <p>Intelligence-driven recruitment platform.</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#about">About</a>
              <a href="#roles">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#about">Blog</a>
              <a href="#about">Contact</a>
              <a href="#about">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SmartRecruit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
