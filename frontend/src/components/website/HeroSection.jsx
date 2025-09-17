import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background-pattern"></div>
      <div className="hero-content-wrapper">
        <div className="hero-left">
          <div className="hero-social-proof">
            <div className="profile-avatars">
              <img src="/profile1.png" alt="Student 1" className="avatar" />
              <img src="/profile2.png" alt="Student 2" className="avatar" />
              <img src="/profile3.png" alt="Student 3" className="avatar" />
              <img src="/profile4.png" alt="Student 4" className="avatar" />
            </div>
            <p className="social-proof-text">
              <span className="highlight-number">35k+</span> Happy Students
            </p>
          </div>

          <h1 className="hero-main-headline">
            <span className="training-placement-text">The <span className="gradient-text">Training</span> and Placement</span> platform for your <span className="gradient-text">career</span>
          </h1>
          <p className="hero-description">
            Get job-ready with expert-led courses or participate in our free hiring drives.
          </p>

          <div className="hero-endorsements">
            <div className="endorsement-item">
              <img src="/linkedin-logo.png" alt="LinkedIn" className="endorsement-logo" />
              <span>Linked TOP COMPANIES India</span>
            </div>
            <div className="endorsement-item">
              <img src="/ycombinator-logo.png" alt="Y Combinator" className="endorsement-logo" />
              <span>Backed By Y Combinator</span>
            </div>
            <div className="endorsement-item">
              <img src="/iit-delhi-logo.png" alt="IIT Delhi" className="endorsement-logo" />
              <span>By IIT Delhi Alumni</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card courses-card">
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">COURSES</h3>
                <p className="card-description">
                  Industry Ready Training to get you placed!
                </p>
              </div>
              <div className="card-footer">
                <Link to="/training-programs" className="card-button">
                  View Courses <span className="button-arrow">↗</span>
                </Link>
              </div>
            </div>
            <div className="card-visual">
              <img src="/course-person.png" alt="Course Person" className="person-image" />
            </div>
            <div className="floating-elements">
              <div className="floating-icon icon-1">💻</div>
              <div className="floating-icon icon-2">📚</div>
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
            </div>
          </div>

          <div className="hero-card jobs-card">
            <div className="card-content">
              <div className="card-header">
                <h3 className="card-title">JOBS</h3>
                <p className="card-description">
                  If you're skilled, get hired directly with our FREE verified hiring drives!
                </p>
              </div>
              <div className="card-footer">
                <Link to="/jobs" className="card-button">
                  View Hiring Drives <span className="button-arrow">↗</span>
                </Link>
              </div>
            </div>
            <div className="card-visual">
              <img src="/job-person.png" alt="Job Person" className="person-image" />
            </div>
            <div className="floating-elements">
              <div className="floating-icon icon-1">💼</div>
              <div className="floating-icon icon-2">🎯</div>
              <div className="floating-circle circle-1"></div>
              <div className="floating-circle circle-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;