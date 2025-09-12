const whatsappService = require('./whatsappService');
const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    // Email configuration
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });
  }

  // Send enrollment confirmation via multiple channels
  async sendEnrollmentConfirmation(studentData, channels = ['whatsapp', 'email']) {
    const results = {};

    // Send WhatsApp notification
    if (channels.includes('whatsapp')) {
      try {
        results.whatsapp = await whatsappService.sendEnrollmentConfirmation(studentData);
      } catch (error) {
        console.error('WhatsApp notification failed:', error);
        results.whatsapp = { success: false, error: error.message };
      }
    }

    // Send email notification
    if (channels.includes('email')) {
      try {
        results.email = await this.sendEnrollmentEmail(studentData);
      } catch (error) {
        console.error('Email notification failed:', error);
        results.email = { success: false, error: error.message };
      }
    }

    // Send admin notification
    try {
      results.admin = await whatsappService.sendAdminNotification(studentData);
    } catch (error) {
      console.error('Admin notification failed:', error);
      results.admin = { success: false, error: error.message };
    }

    return results;
  }

  // Send email notification
  async sendEnrollmentEmail(studentData) {
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@mindwareinfotech.com',
      to: studentData.email,
      subject: '🎉 Enrollment Confirmation - Mindware Infotech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to Mindware Infotech!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your enrollment has been confirmed</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Enrollment Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${studentData.name}</p>
              <p><strong>Email:</strong> ${studentData.email}</p>
              <p><strong>Phone:</strong> ${studentData.phone}</p>
              <p><strong>Course:</strong> ${studentData.courseName || 'Selected Course'}</p>
              <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-top: 0;">What's Next?</h3>
              <ul style="color: #555;">
                <li>Our team will contact you within 24 hours</li>
                <li>You'll receive course materials and schedule</li>
                <li>Access to our learning management system</li>
                <li>24/7 support for your learning journey</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mindwareinfotech.com" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Visit Our Website</a>
            </div>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">© 2024 Mindware Infotech. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              📧 info@mindwareinfotech.com | 🌐 www.mindwareinfotech.com
            </p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send admin email notification
  async sendAdminEmailNotification(enrollmentData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@mindwareinfotech.com';
    
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@mindwareinfotech.com',
      to: adminEmail,
      subject: '🔔 New Enrollment - Mindware Infotech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">🔔 New Enrollment Received</h1>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333;">Student Information</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${enrollmentData.name}</p>
              <p><strong>Email:</strong> ${enrollmentData.email}</p>
              <p><strong>Phone:</strong> ${enrollmentData.phone}</p>
              <p><strong>Course:</strong> ${enrollmentData.courseName || 'Selected Course'}</p>
              <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://mindwareinfotech.com/admin/enrollments" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View in Admin Panel</a>
            </div>
          </div>
        </div>
      `
    };

    try {
      const result = await this.emailTransporter.sendMail(mailOptions);
      console.log('Admin email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending admin email:', error);
      throw error;
    }
  }

  // Send certificate notification
  async sendCertificateNotification(studentData, certificateUrl) {
    const results = {};

    // WhatsApp notification
    try {
      results.whatsapp = await whatsappService.sendCertificateNotification(studentData, certificateUrl);
    } catch (error) {
      console.error('WhatsApp certificate notification failed:', error);
      results.whatsapp = { success: false, error: error.message };
    }

    // Email notification
    try {
      results.email = await this.sendCertificateEmail(studentData, certificateUrl);
    } catch (error) {
      console.error('Email certificate notification failed:', error);
      results.email = { success: false, error: error.message };
    }

    return results;
  }

  // Send certificate email
  async sendCertificateEmail(studentData, certificateUrl) {
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@mindwareinfotech.com',
      to: studentData.email,
      subject: '🎓 Your Certificate is Ready! - Mindware Infotech',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎓 Congratulations!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your certificate is ready for download</p>
          </div>
          
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-top: 0;">Certificate Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Student Name:</strong> ${studentData.name}</p>
              <p><strong>Course:</strong> ${studentData.courseName}</p>
              <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${certificateUrl}" style="background: #28a745; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px;">📄 Download Certificate</a>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d5a2d; margin-top: 0;">Keep Learning!</h3>
              <p style="color: #555; margin: 0;">Continue your learning journey with more courses and certifications.</p>
            </div>
          </div>
        </div>
      `
    };

    try {
      const result = await this.emailTransporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NotificationService();
