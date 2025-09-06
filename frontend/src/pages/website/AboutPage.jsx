import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>About Mindware India</h1>
          <p>Empowering students with practical skills and real-world experience</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <div className="about-text">
              <h2>Our Mission</h2>
              <p>
                At Mindware India, we believe in bridging the gap between academic learning 
                and industry requirements. Our mission is to provide students with hands-on 
                experience, practical skills, and real-world projects that prepare them for 
                successful careers in technology.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/about/mission.jpg" alt="Our Mission" />
            </div>
          </div>

          <div className="about-section reverse">
            <div className="about-text">
              <h2>What We Do</h2>
              <p>
                We offer comprehensive internship programs, skill development courses, 
                and practical training in cutting-edge technologies. Our programs are 
                designed by industry experts and delivered by experienced professionals 
                who understand the current market demands.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/about/what-we-do.jpg" alt="What We Do" />
            </div>
          </div>

          <div className="about-section">
            <div className="about-text">
              <h2>Our Impact</h2>
              <p>
                Since our inception, we have successfully trained over 10,000 students 
                and placed them in top companies. Our alumni are now working at leading 
                tech companies like Google, Microsoft, Amazon, and many more.
              </p>
            </div>
            <div className="about-image">
              <img src="/images/about/impact.jpg" alt="Our Impact" />
            </div>
          </div>
        </div>

        <div className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="/images/team/ceo.jpg" alt="CEO" />
              <h3>John Doe</h3>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img src="/images/team/cto.jpg" alt="CTO" />
              <h3>Jane Smith</h3>
              <p>Chief Technology Officer</p>
            </div>
            <div className="team-member">
              <img src="/images/team/head-training.jpg" alt="Head of Training" />
              <h3>Mike Johnson</h3>
              <p>Head of Training</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
