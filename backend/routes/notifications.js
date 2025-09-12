const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const notificationService = require('../services/notificationService');

// @desc    Test WhatsApp notification
// @route   POST /api/notifications/test-whatsapp
// @access  Public (for testing)
router.post('/test-whatsapp', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      });
    }

    const result = await whatsappService.sendMessage(phone, message);

    res.status(200).json({
      success: result.success,
      message: result.success ? 'WhatsApp message sent successfully' : 'Failed to send WhatsApp message',
      data: result
    });
  } catch (error) {
    console.error('Test WhatsApp error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @desc    Test enrollment notification
// @route   POST /api/notifications/test-enrollment
// @access  Public (for testing)
router.post('/test-enrollment', async (req, res) => {
  try {
    const { name, email, phone, courseName } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required'
      });
    }

    const studentData = {
      name,
      email,
      phone,
      courseName: courseName || 'Test Course'
    };

    const result = await notificationService.sendEnrollmentConfirmation(
      studentData,
      ['whatsapp', 'email']
    );

    res.status(200).json({
      success: true,
      message: 'Test notifications sent',
      data: result
    });
  } catch (error) {
    console.error('Test enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @desc    Send custom notification
// @route   POST /api/notifications/send
// @access  Public (for testing)
router.post('/send', async (req, res) => {
  try {
    const { type, data } = req.body;

    let result;

    switch (type) {
      case 'enrollment':
        result = await notificationService.sendEnrollmentConfirmation(data, ['whatsapp', 'email']);
        break;
      case 'certificate':
        result = await notificationService.sendCertificateNotification(data.studentData, data.certificateUrl);
        break;
      case 'payment':
        result = await whatsappService.sendPaymentConfirmation(data.studentData, data.paymentData);
        break;
      case 'reminder':
        result = await whatsappService.sendReminder(data.studentData, data.reminderType);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid notification type'
        });
    }

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// @desc    Get notification status
// @route   GET /api/notifications/status
// @access  Public
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification service is running',
    services: {
      whatsapp: {
        enabled: !!process.env.WHATSAPP_INSTANCE_ID,
        instanceId: process.env.WHATSAPP_INSTANCE_ID ? 'Configured' : 'Not configured'
      },
      email: {
        enabled: !!process.env.SMTP_USER,
        smtp: process.env.SMTP_USER ? 'Configured' : 'Not configured'
      }
    }
  });
});

module.exports = router;
