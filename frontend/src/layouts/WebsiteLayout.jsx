import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/website/Header';
import Footer from '../components/website/Footer';
import Chatbot from '../components/website/Chatbot';

const WebsiteLayout = () => {
  return (
    <div className="website-layout">
      <div className="main-content">
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
