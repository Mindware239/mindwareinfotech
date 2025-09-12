import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Preloader from '../components/common/Preloader';
import Header from '../components/website/Header';
import Footer from '../components/website/Footer';
import Chatbot from '../components/website/Chatbot';

const WebsiteLayout = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="website-layout">
      {isLoading && <Preloader />}
      
      <div className={`main-content ${isLoading ? 'loading' : 'loaded'}`}>
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  );
};

export default WebsiteLayout;
