import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/website/Header';
import Footer from '../components/website/Footer';

const WebsiteLayout = memo(() => {
  return (
    <div className="website-layout">
      <div className="main-content">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
});

WebsiteLayout.displayName = 'WebsiteLayout';

export default WebsiteLayout;
