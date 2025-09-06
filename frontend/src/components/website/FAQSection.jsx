import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'What is the duration of the internship programs?',
      answer: 'Our internship programs typically range from 3 to 6 months, depending on the specific track you choose. We offer flexible schedules to accommodate both students and working professionals.'
    },
    {
      id: 2,
      question: 'Do I need prior programming experience to join?',
      answer: 'No prior programming experience is required! We offer programs for complete beginners as well as advanced courses for those with some experience. Our curriculum is designed to take you from zero to job-ready.'
    },
    {
      id: 3,
      question: 'What kind of projects will I work on?',
      answer: 'You\'ll work on real-world projects that mirror industry standards. This includes building web applications, mobile apps, data analysis projects, and more. All projects are designed to build your portfolio and demonstrate your skills to potential employers.'
    },
    {
      id: 4,
      question: 'Is there a placement guarantee?',
      answer: 'While we don\'t guarantee placement, we have a 95% success rate with our students finding relevant positions. We provide extensive career support including resume building, interview preparation, and direct connections with our partner companies.'
    },
    {
      id: 5,
      question: 'What technologies will I learn?',
      answer: 'Our curriculum covers modern technologies including React, Node.js, Python, JavaScript, HTML/CSS, databases, cloud platforms, and more. The specific technologies depend on your chosen track (Web Development, Data Science, Mobile Development, etc.).'
    },
    {
      id: 6,
      question: 'Are the programs online or offline?',
      answer: 'We offer both online and offline options. Our online programs provide the same quality education with live sessions, recorded lectures, and 1-on-1 mentorship. Offline programs are available at our training centers in major cities.'
    },
    {
      id: 7,
      question: 'What is the fee structure?',
      answer: 'Our fees are competitive and vary by program. We offer flexible payment options including monthly installments. We also provide scholarships for deserving students and have tie-ups with banks for education loans.'
    },
    {
      id: 8,
      question: 'Will I get a certificate upon completion?',
      answer: 'Yes! Upon successful completion of the program, you\'ll receive a certificate that is recognized by industry partners. The certificate includes your project portfolio and performance metrics.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Got questions? We've got answers. Find everything you need to know about our programs.</p>
        </div>

        <div className="faq-container">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-icon">
                    <i className={`fas fa-chevron-${activeIndex === index ? 'up' : 'down'}`}></i>
                  </span>
                </button>
                
                <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="faq-cta">
            <div className="faq-cta-content">
              <h3>Still have questions?</h3>
              <p>Our team is here to help you get started on your tech journey.</p>
              <div className="faq-cta-buttons">
                <a href="/contact" className="btn btn-primary">
                  Contact Us
                </a>
                <a href="/apply-internship" className="btn btn-outline">
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
