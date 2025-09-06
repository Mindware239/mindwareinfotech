import React from 'react';
import './TermsPage.css';

const TermsPage = () => {
  return (
    <div className="terms-page">
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
          <h1>Terms & Conditions</h1>
          <p>Mindware India Training + Internship Program</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <div className="terms-card">
            <div className="card-header">
              <div className="card-icon">📋</div>
              <h2>Terms & Conditions</h2>
            </div>
            <div className="card-content">
              <p className="intro">
                By enrolling in the Mindware training + internship program, you agree to the following terms and conditions.
              </p>

              <div className="terms-section">
                <h3>1. Program Participation</h3>
                <ul>
                  <li>Students must attend scheduled sessions and complete assignments to qualify for certificates and internship letters</li>
                  <li>Completion certificates and internship letters are issued only after successful program completion</li>
                  <li>Regular attendance and active participation are mandatory for program completion</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>2. Payment & Refunds</h3>
                <ul>
                  <li>Program fees are non-refundable once paid, except if the program is canceled by Mindware</li>
                  <li>Students must confirm their eligibility before enrolling</li>
                  <li>Payment must be completed before the program start date</li>
                  <li>Refunds are only processed in case of program cancellation by Mindware</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>3. Conduct & Discipline</h3>
                <ul>
                  <li>Students must maintain professional behavior and respect towards instructors and fellow participants</li>
                  <li>Any form of harassment, plagiarism, or misconduct will result in immediate program termination</li>
                  <li>Students are expected to follow all program guidelines and deadlines</li>
                  <li>Use of inappropriate language or behavior is strictly prohibited</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>4. Intellectual Property</h3>
                <ul>
                  <li>All course materials, resources, and content remain the intellectual property of Mindware</li>
                  <li>Students may not distribute, copy, or share course materials without written permission</li>
                  <li>Any projects or work created during the program may be used by Mindware for promotional purposes</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>5. Program Modifications</h3>
                <ul>
                  <li>Mindware reserves the right to modify program content, schedule, or requirements</li>
                  <li>Students will be notified of any significant changes in advance</li>
                  <li>Program duration and structure may be adjusted based on industry requirements</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>6. Certification & Completion</h3>
                <ul>
                  <li>Certificates are issued only upon successful completion of all program requirements</li>
                  <li>Internship letters are provided based on performance and attendance</li>
                  <li>Certification is subject to meeting minimum attendance and performance criteria</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>7. Privacy & Data Protection</h3>
                <ul>
                  <li>Student information is collected and used in accordance with our Privacy Policy</li>
                  <li>Personal data is protected and not shared with third parties without consent</li>
                  <li>Students have the right to access and correct their personal information</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>8. Limitation of Liability</h3>
                <ul>
                  <li>Mindware is not responsible for any technical issues or internet connectivity problems</li>
                  <li>Students are responsible for their own equipment and internet connection</li>
                  <li>Mindware's liability is limited to the program fees paid</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>9. Termination</h3>
                <ul>
                  <li>Mindware reserves the right to terminate a student's enrollment for violation of terms</li>
                  <li>Students may withdraw from the program with written notice</li>
                  <li>No refunds are provided for voluntary withdrawal</li>
                </ul>
              </div>

              <div className="terms-section">
                <h3>10. Governing Law</h3>
                <ul>
                  <li>These terms are governed by Indian law</li>
                  <li>Any disputes will be resolved through Indian courts</li>
                  <li>Students must comply with all applicable laws and regulations</li>
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
            <p>If you have any questions about our Terms & Conditions, please contact us:</p>
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

export default TermsPage;
