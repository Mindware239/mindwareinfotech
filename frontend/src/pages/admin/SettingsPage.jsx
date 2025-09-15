import React, { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Mindware India',
      siteDescription: 'Professional IT Training Institute',
      siteUrl: 'https://mindwareindia.com',
      adminEmail: 'admin@mindwareindia.com',
      timezone: 'Asia/Kolkata',
      language: 'en'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'noreply@mindwareindia.com',
      smtpPassword: '••••••••',
      fromName: 'Mindware India',
      fromEmail: 'noreply@mindwareindia.com'
    },
    payment: {
      stripePublicKey: 'pk_test_••••••••',
      stripeSecretKey: 'sk_test_••••••••',
      paypalClientId: '••••••••',
      currency: 'INR',
      paymentMethod: 'stripe'
    },
    system: {
      maintenanceMode: false,
      userRegistration: true,
      emailVerification: true,
      maxFileSize: '10',
      sessionTimeout: '30',
      backupFrequency: 'daily'
    }
  });

  const [saving, setSaving] = useState(false);

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = async (category) => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert(`${category.charAt(0).toUpperCase() + category.slice(1)} settings saved successfully!`);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'fas fa-cog' },
    { id: 'email', label: 'Email', icon: 'fas fa-envelope' },
    { id: 'payment', label: 'Payment', icon: 'fas fa-credit-card' },
    { id: 'system', label: 'System', icon: 'fas fa-server' }
  ];

  const renderGeneralSettings = () => (
    <div className="settings-section">
      <div className="form-group">
        <label className="form-label">Site Name</label>
        <input
          type="text"
          className="form-control"
          value={settings.general.siteName}
          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Site Description</label>
        <textarea
          className="form-control"
          rows="3"
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Site URL</label>
        <input
          type="url"
          className="form-control"
          value={settings.general.siteUrl}
          onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Admin Email</label>
        <input
          type="email"
          className="form-control"
          value={settings.general.adminEmail}
          onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select
            className="form-control"
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Language</label>
          <select
            className="form-control"
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="settings-section">
      <div className="form-group">
        <label className="form-label">SMTP Host</label>
        <input
          type="text"
          className="form-control"
          value={settings.email.smtpHost}
          onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">SMTP Port</label>
          <input
            type="number"
            className="form-control"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">SMTP Username</label>
          <input
            type="text"
            className="form-control"
            value={settings.email.smtpUsername}
            onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">SMTP Password</label>
        <input
          type="password"
          className="form-control"
          value={settings.email.smtpPassword}
          onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">From Name</label>
          <input
            type="text"
            className="form-control"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">From Email</label>
          <input
            type="email"
            className="form-control"
            value={settings.email.fromEmail}
            onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="settings-section">
      <div className="form-group">
        <label className="form-label">Payment Method</label>
        <select
          className="form-control"
          value={settings.payment.paymentMethod}
          onChange={(e) => handleInputChange('payment', 'paymentMethod', e.target.value)}
        >
          <option value="stripe">Stripe</option>
          <option value="paypal">PayPal</option>
          <option value="razorpay">Razorpay</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Stripe Public Key</label>
        <input
          type="text"
          className="form-control"
          value={settings.payment.stripePublicKey}
          onChange={(e) => handleInputChange('payment', 'stripePublicKey', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Stripe Secret Key</label>
        <input
          type="password"
          className="form-control"
          value={settings.payment.stripeSecretKey}
          onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label">PayPal Client ID</label>
        <input
          type="text"
          className="form-control"
          value={settings.payment.paypalClientId}
          onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Currency</label>
          <select
            className="form-control"
            value={settings.payment.currency}
            onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-section">
      <div className="form-group">
        <label className="form-label">Maintenance Mode</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.system.maintenanceMode}
            onChange={(e) => handleInputChange('system', 'maintenanceMode', e.target.checked)}
          />
          <label htmlFor="maintenanceMode" className="toggle-label">
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">User Registration</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="userRegistration"
            checked={settings.system.userRegistration}
            onChange={(e) => handleInputChange('system', 'userRegistration', e.target.checked)}
          />
          <label htmlFor="userRegistration" className="toggle-label">
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Email Verification</label>
        <div className="toggle-switch">
          <input
            type="checkbox"
            id="emailVerification"
            checked={settings.system.emailVerification}
            onChange={(e) => handleInputChange('system', 'emailVerification', e.target.checked)}
          />
          <label htmlFor="emailVerification" className="toggle-label">
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Max File Size (MB)</label>
          <input
            type="number"
            className="form-control"
            value={settings.system.maxFileSize}
            onChange={(e) => handleInputChange('system', 'maxFileSize', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Session Timeout (minutes)</label>
          <input
            type="number"
            className="form-control"
            value={settings.system.sessionTimeout}
            onChange={(e) => handleInputChange('system', 'sessionTimeout', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Backup Frequency</label>
        <select
          className="form-control"
          value={settings.system.backupFrequency}
          onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'payment':
        return renderPaymentSettings();
      case 'system':
        return renderSystemSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Configure system settings and preferences</p>
        </div>
      </div>

      <div className="page-content">
        <div className="settings-container">
          <div className="settings-sidebar">
            <div className="settings-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="settings-main">
            <div className="settings-card">
              <div className="settings-header">
                <h2>{tabs.find(tab => tab.id === activeTab)?.label} Settings</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSave(activeTab)}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save"></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>

              <div className="settings-body">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
