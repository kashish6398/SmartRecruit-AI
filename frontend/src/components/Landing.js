import React from 'react';
import { UploadCloud, Cpu, Users, Briefcase, UserCircle } from 'lucide-react';
import './Landing.css';

function Landing({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <h2>Smart Recruit</h2>
        </div>
        <div className="nav-actions">
          <button className="nav-btn login" onClick={() => onNavigate('auth', 'login')}>Login</button>
          <button className="nav-btn signup" onClick={() => onNavigate('auth', 'signup')}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Hire Smarter, <span>Get Hired Faster</span></h1>
          <p className="hero-subtitle">
            The intelligent AI-powered recruitment platform streamlining connections between top candidates and leading HR professionals.
          </p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={() => onNavigate('auth', 'signup')}>Get Started</button>
            <button className="hero-btn secondary" onClick={() => onNavigate('auth', 'login')}>Login</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="separator"></div>
        <h2 className="section-title">Why Smart Recruit?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <UploadCloud size={28} />
            </div>
            <h3>Resume Upload</h3>
            <p>Seamlessly upload and manage your professional portfolio in seconds with automatic data extraction.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Cpu size={28} />
            </div>
            <h3>AI Resume Review</h3>
            <p>Leverage cutting-edge AI to scan, rank, and validate applicant qualifications with unmatched precision.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Users size={28} />
            </div>
            <h3>Smart Candidate Matching</h3>
            <p>Connect perfectly formatted job requirements directly to candidate skills, saving hours of manual screening.</p>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="role-section">
        <div className="separator"></div>
        <h2 className="section-title" style={{ marginBottom: '1rem', fontSize: '1.75rem' }}>Choose Your Role</h2>
        <p style={{ color: '#64748b' }}>A custom dashboard tailored exactly to what you need.</p>
        <div className="role-container">
          <div className="role-pill">
            <UserCircle className="role-icon" size={24} />
            Candidate
          </div>
          <div className="role-pill">
            <Briefcase className="role-icon" size={24} />
            HR / Recruiter
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">Smart Recruit &copy; {new Date().getFullYear()}</div>
          <div className="footer-links">
            <button type="button" onClick={() => alert("About page coming soon")}> About </button>

            <button type="button" onClick={() => alert("Contact page coming soon")}> Contact </button>

            <button type="button" onClick={() => alert("Privacy Policy coming soon")}> Privacy Policy </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
