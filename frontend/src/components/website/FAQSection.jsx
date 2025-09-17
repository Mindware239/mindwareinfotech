import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('courses');

  const faqCategories = {
    courses: [
      {
        id: 1,
        question: 'What types of courses are available (Offline, Live Online, Self-Paced)?',
        answer: 'We offer three types of courses: Offline classes at our training centers, Live Online sessions with real-time interaction, and Self-Paced learning with recorded content. Choose the format that best fits your schedule and learning style.'
      },
      {
        id: 2,
        question: 'What is the fee for Mindware Infotech courses?',
        answer: 'Our course fees vary by program and duration. We offer competitive pricing with flexible payment options including monthly installments. Contact us for detailed pricing information for your chosen program.'
      },
      {
        id: 3,
        question: 'How do I choose the right course at Mindware Infotech?',
        answer: 'Our career counselors will help you choose the right course based on your background, interests, and career goals. We offer free consultation sessions to guide you through the selection process.'
      },
      {
        id: 4,
        question: 'Are there any prerequisites or prior experience required to enroll?',
        answer: 'Most of our courses are designed for beginners, but some advanced programs may require basic programming knowledge. We provide foundation courses to prepare you for advanced topics if needed.'
      },
      {
        id: 5,
        question: 'Can I switch between different learning modes after enrollment?',
        answer: 'Yes, we offer flexibility to switch between learning modes based on your schedule and preferences. Our support team will help you transition smoothly between different formats.'
      },
      {
        id: 6,
        question: 'What is the typical duration of Mindware Infotech programs?',
        answer: 'Program durations vary from 3 months for basic courses to 12 months for comprehensive programs. Each course has a structured timeline with clear milestones and project deadlines.'
      },
      {
        id: 7,
        question: 'Are there any trial classes or sample sessions available before enrolling?',
        answer: 'Yes, we offer free trial classes and demo sessions for all our programs. This allows you to experience our teaching methodology and course content before making a commitment.'
      },
      {
        id: 8,
        question: 'Do the courses offer any certifications upon completion?',
        answer: 'Yes, upon successful completion, you receive industry-recognized certificates. Our certifications are valued by employers and include project portfolios showcasing your practical skills.'
      },
      {
        id: 9,
        question: 'What programming languages and technologies are covered?',
        answer: 'We cover modern technologies including React, Node.js, Python, JavaScript, HTML/CSS, databases, cloud platforms, and more. The specific technologies depend on your chosen track (Web Development, Data Science, Mobile Development, etc.).'
      },
      {
        id: 10,
        question: 'Are there any group discounts or corporate training options?',
        answer: 'Yes, we offer special group discounts for multiple enrollments and comprehensive corporate training programs. Contact our sales team for customized pricing and training solutions for your organization.'
      }
    ],
    learning: [
      {
        id: 11,
        question: 'What learning resources are provided?',
        answer: 'We provide comprehensive learning materials including video lectures, coding exercises, project assignments, e-books, and access to our learning management system with 24/7 support.'
      },
      {
        id: 12,
        question: 'Is there mentor support available?',
        answer: 'Yes, each student gets assigned a dedicated mentor who provides 1-on-1 guidance, code reviews, and career advice throughout the program duration.'
      },
      {
        id: 13,
        question: 'How are the classes conducted?',
        answer: 'Classes are conducted through interactive live sessions, hands-on coding labs, and project-based learning. We use modern tools and platforms to ensure effective learning.'
      },
      {
        id: 14,
        question: 'What if I miss a class?',
        answer: 'All live sessions are recorded and available for later viewing. You can catch up on missed content at your convenience and reach out to instructors for clarification.'
      },
      {
        id: 15,
        question: 'Is there a learning management system (LMS) available?',
        answer: 'Yes, we provide access to our comprehensive LMS where you can access course materials, track progress, submit assignments, and communicate with instructors and fellow students.'
      },
      {
        id: 16,
        question: 'What is the student-to-instructor ratio?',
        answer: 'We maintain small class sizes with a maximum student-to-instructor ratio of 15:1 for live sessions, ensuring personalized attention and effective learning.'
      },
      {
        id: 17,
        question: 'Are there any coding challenges or competitions?',
        answer: 'Yes, we regularly organize coding challenges, hackathons, and competitions to enhance your practical skills and provide opportunities to showcase your abilities.'
      },
      {
        id: 18,
        question: 'Can I access course materials after completion?',
        answer: 'Yes, you get lifetime access to all course materials, recordings, and resources even after program completion, allowing you to review and reference content anytime.'
      }
    ],
    placements: [
      {
        id: 19,
        question: 'What is the placement assistance provided?',
        answer: 'We provide comprehensive placement support including resume building, interview preparation, mock interviews, job referrals, and direct connections with our 500+ partner companies.'
      },
      {
        id: 20,
        question: 'What is the success rate of placements?',
        answer: 'We maintain a 95% placement rate with our students securing positions in top companies. Our strong industry connections and practical training ensure high employability.'
      },
      {
        id: 21,
        question: 'Do you guarantee job placement?',
        answer: 'While we don\'t guarantee placement, our extensive support system and industry partnerships significantly increase your chances of landing a job in your desired field.'
      },
      {
        id: 22,
        question: 'What types of companies do you partner with?',
        answer: 'We partner with 500+ companies including startups, mid-size companies, and Fortune 500 companies across various industries like IT, finance, healthcare, and e-commerce.'
      },
      {
        id: 23,
        question: 'What is the average salary package after placement?',
        answer: 'Our students secure packages ranging from 3-15 LPA depending on their skills and the company. We provide salary negotiation guidance and career counseling to help you get the best offers.'
      },
      {
        id: 24,
        question: 'Is there any placement guarantee for specific programs?',
        answer: 'We offer placement guarantee for our premium programs with specific terms and conditions. Contact our placement team for detailed information about guaranteed placement programs.'
      },
      {
        id: 25,
        question: 'What support is provided for interview preparation?',
        answer: 'We provide comprehensive interview preparation including technical mock interviews, HR round preparation, coding practice sessions, and personalized feedback to help you excel in interviews.'
      },
      {
        id: 26,
        question: 'Do you provide internship opportunities during the course?',
        answer: 'Yes, we offer internship opportunities with our partner companies during the course, allowing you to gain real-world experience and build your professional network.'
      }
    ]
  };

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h3 className="section-subtitle">HAVE ANY DOUBTS?</h3>
          <h2 className="section-title">
            <span className="highlight">Frequently Asked Questions</span>
          </h2>
          <p className="section-description">
            Work hard with us, with dedication and commitment, and watch multiple opportunities grab you and transform your future!
          </p>
        </div>

        <div className="faq-container">
          <div className="faq-sidebar">
            <div className="faq-categories">
              <button 
                className={`category-btn ${activeCategory === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveCategory('courses')}
              >
                Courses
              </button>
              <button 
                className={`category-btn ${activeCategory === 'learning' ? 'active' : ''}`}
                onClick={() => setActiveCategory('learning')}
              >
                Learning
              </button>
              <button 
                className={`category-btn ${activeCategory === 'placements' ? 'active' : ''}`}
                onClick={() => setActiveCategory('placements')}
              >
                Placements
              </button>
            </div>
          </div>

          <div className="faq-content">
            <div className="faq-list">
              {faqCategories[activeCategory].map((faq, index) => (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
