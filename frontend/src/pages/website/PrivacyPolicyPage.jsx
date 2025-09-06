import React from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <div className="privacy-policy-page">
      {/* Social Media Sidebar */}
      <div className="social-sidebar">
        <a href="#" className="social-icon facebook">f</a>
        <a href="#" className="social-icon twitter">X</a>
        <a href="#" className="social-icon linkedin">in</a>
        <a href="#" className="social-icon instagram">📷</a>
        <a href="#" className="social-icon youtube">▶</a>
        <a href="#" className="social-icon share">></a>
      </div>

      {/* Last Updated Bar */}
      <div className="last-updated-bar">
        <div className="container">
          <div className="last-updated-content">
            <i className="fas fa-calendar-alt"></i>
            <span>Last Updated: September 05, 2025</span>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="page-hero">
        <div className="container">
          <h1>Privacy Policy & Terms</h1>
          <p>Mindware India Training + Internship Program</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="content-grid">
            {/* Privacy Policy Card */}
            <div className="policy-card">
              <div className="card-header">
                <div className="card-icon privacy">🔒</div>
                <h2>Privacy Policy</h2>
              </div>
              <div className="card-content">
                <p className="intro">
                  At Mindware, we respect and protect the personal information of all participants in our Training + Internship Program. This policy outlines how we collect, use, and safeguard your data.
                </p>

                <div className="policy-section">
                  <h3>1. Information We Collect</h3>
                  <ul>
                    <li>Name, email address, phone number, and college/university details</li>
                    <li>Payment information (processed securely through third-party gateways)</li>
                    <li>Technical data such as website usage, cookies (if applicable)</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>2. How We Use Your Information</h3>
                  <ul>
                    <li>To register for the program and manage participation</li>
                    <li>To communicate updates, schedules, and important announcements</li>
                    <li>To issue certificates, internship letters, and completion documents</li>
                    <li>For internal record-keeping and service improvements</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>3. Data Protection & Security</h3>
                  <ul>
                    <li>All personal data is stored securely and only accessed by authorized staff</li>
                    <li>Payment transactions are handled through secure and verified gateways</li>
                    <li>Personal information is never sold, rented, or traded with third parties</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>4. Sharing of Information</h3>
                  <ul>
                    <li>Information is only shared with authorized trainers/mentors for program purposes</li>
                    <li>Shared with legal authorities, if required by law</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>5. Student Rights</h3>
                  <ul>
                    <li>Students may request correction or deletion of their personal data at any time</li>
                    <li>Students may opt out of promotional messages without affecting their enrollment</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Terms & Conditions Card */}
            <div className="policy-card">
              <div className="card-header">
                <div className="card-icon terms">📋</div>
                <h2>Terms & Conditions</h2>
              </div>
              <div className="card-content">
                <p className="intro">
                  By enrolling in the Mindware training + internship program, you agree to the following terms and conditions.
                </p>

                <div className="policy-section">
                  <h3>1. Program Participation</h3>
                  <ul>
                    <li>Students must attend scheduled sessions and complete assignments to qualify for certificates and internship letters</li>
                    <li>Completion certificates and internship letters are issued only after successful program completion</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>2. Payment & Refunds</h3>
                  <ul>
                    <li>Program fees are non-refundable once paid, except if the program is canceled by Mindware</li>
                    <li>Students must confirm their eligibility before enrolling</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>3. Conduct & Discipline</h3>
                  <ul>
                    <li>Students must maintain professional behavior and respect towards instructors and fellow participants</li>
                    <li>Any form of harassment, plagiarism, or misconduct will result in immediate program termination</li>
                    <li>Students are expected to follow all program guidelines and deadlines</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>4. Intellectual Property</h3>
                  <ul>
                    <li>All course materials, resources, and content remain the intellectual property of Mindware</li>
                    <li>Students may not distribute, copy, or share course materials without written permission</li>
                  </ul>
                </div>

                <div className="policy-section">
                  <h3>5. Program Modifications</h3>
                  <ul>
                    <li>Mindware reserves the right to modify program content, schedule, or requirements</li>
                    <li>Students will be notified of any significant changes in advance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer Section */}
      <div className="legal-disclaimer">
        <div className="container">
          <div className="disclaimer-card">
            <div className="disclaimer-header">
              <div className="disclaimer-icon">⚖️</div>
              <h2>Legal Disclaimer</h2>
            </div>
            <div className="disclaimer-content">
              <div className="disclaimer-section">
                <h3>1. Purpose of the Program</h3>
                <p>The Mindware Training + Internship Program is designed exclusively for skill development, training, and industry exposure. Its goal is to help students understand real-world industry practices, gain practical experience, and improve their professional skills.</p>
              </div>

              <div className="disclaimer-section">
                <h3>2. No Job Guarantee</h3>
                <ul>
                  <li>This program does not guarantee job placement or direct employment</li>
                  <li>Mindware provides career guidance, mentorship, and training to improve employability, but final employment depends on individual performance and external opportunities</li>
                </ul>
              </div>

              <div className="disclaimer-section">
                <h3>3. Compliance with Indian Laws</h3>
                <ul>
                  <li>Mindware operates strictly under Indian legal, educational, and industry guidelines</li>
                  <li>Students are responsible for ensuring participation aligns with their college/university rules</li>
                </ul>
              </div>

              <div className="disclaimer-section">
                <h3>4. Limited Liability</h3>
                <ul>
                  <li>Participation does not create an employer-employee relationship with Mindware</li>
                  <li>Mindware is not liable for job disputes, employment claims, or third-party promises</li>
                </ul>
              </div>

              <div className="disclaimer-section">
                <h3>5. Official Communication</h3>
                <p>All official information is shared only via:</p>
                <ul>
                  <li><strong>Website:</strong> www.mindwareindia.com</li>
                  <li><strong>Phone:</strong> +91 9717122688 | +91 8527522688</li>
                  <li><strong>Email:</strong> info@mindwareindia.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="need-help-section">
        <div className="container">
          <div className="help-card">
            <div className="help-header">
              <i className="fas fa-headphones"></i>
              <h2>Need Help?</h2>
            </div>
            <p>If you have any questions about our Privacy Policy or Terms & Conditions, please contact us:</p>
            <div className="help-contacts">
              <div className="contact-item">
                <strong>Phone:</strong> +91 9717122688 | +91 8527522688
              </div>
              <div className="contact-item">
                <strong>Email:</strong> info@mindwareindia.com
              </div>
              <div className="contact-item">
                <strong>Website:</strong> www.mindwareindia.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <div className="chat-widget">
        <i className="fas fa-comments"></i>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
