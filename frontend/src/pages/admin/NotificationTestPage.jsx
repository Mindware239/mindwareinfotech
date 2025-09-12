import React from 'react';
import NotificationTest from '../../components/admin/NotificationTest';
import './NotificationTestPage.css';

const NotificationTestPage = () => {
  return (
    <div className="notification-test-page">
      <div className="page-header">
        <h1>Notification Test</h1>
        <p>Test WhatsApp and Email notifications for enrollments</p>
      </div>
      
      <NotificationTest />
    </div>
  );
};

export default NotificationTestPage;
