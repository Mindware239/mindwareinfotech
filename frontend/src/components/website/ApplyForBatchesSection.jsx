import React, { useState } from 'react';
import './ApplyForBatchesSection.css';
import CallbackModal from './CallbackModal';

const ApplyForBatchesSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestCallback = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="apply-for-upcoming-batch">
      <h1 className="heading">
        <span className="span-blue">Apply</span> for Upcoming Batches
      </h1>
      
      <div className="booking-container">
        <div className="container-left">
          <div className="steps-container">
            <div className="step">
              <div className="top-container">
                <div className="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="number">1</p>
              </div>
              <h2 className="title">Request Callback</h2>
              <p className="description">Kickstart your learning journey by requesting callback today.</p>
            </div>

            <div className="step">
              <div className="top-container">
                <div className="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22 20.47 21.55 20.92 21 20.92H3C2.45 20.92 2 20.47 2 19.92V16.92C2 16.37 2.45 15.92 3 15.92H21C21.55 15.92 22 16.37 22 16.92Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 15.92V5.92C6 5.37 6.45 4.92 7 4.92H17C17.55 4.92 18 5.37 18 5.92V15.92" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 8.92H14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12.92H14" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="number">2</p>
              </div>
              <h2 className="title">Get on a Call</h2>
              <p className="description">Chat with us to learn more about your options.</p>
            </div>

            <div className="step">
              <div className="top-container">
                <div className="icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="number">3</p>
              </div>
              <h2 className="title">Book your seat</h2>
              <p className="description">Secure your spot and embark on your learning adventure!</p>
            </div>
          </div>
          
          <div className="sliderTrack">
            <div className="slider" style={{width: '50px', left: '0px'}}></div>
          </div>
          
          <button className="book-now-btn" onClick={handleRequestCallback}>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" fontSize="18" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
              <path d="M14.05 6A5 5 0 0 1 18 10"></path>
            </svg>
            Request a Callback
          </button>
        </div>

        <div className="or-seperator">
          <div className="line"></div>
          <p>OR</p>
          <div className="line"></div>
        </div>

        <div className="container-right">
          <div className="demo-book-now">
            <h2 className="demo-heading">Free Offline Demo Class</h2>
            <p className="demo-description">Book a free demo class at our center</p>
            <button className="book-now-btn" onClick={handleRequestCallback}>View All Courses</button>
          </div>
        </div>
      </div>
      
      <CallbackModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default ApplyForBatchesSection;
