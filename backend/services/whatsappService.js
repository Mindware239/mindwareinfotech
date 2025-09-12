const axios = require('axios');

class WhatsAppService {
  constructor() {
    // Green API credentials (you'll get these from https://green-api.com)
    this.instanceId = process.env.WHATSAPP_INSTANCE_ID || 'your_instance_id';
    this.token = process.env.WHATSAPP_TOKEN || 'your_token';
    this.baseUrl = `https://api.green-api.com/waInstance${this.instanceId}`;
  }

  // Send text message
  async sendMessage(phoneNumber, message) {
    try {
      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      
      // Add country code if not present
      const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
      
      const response = await axios.post(
        `${this.baseUrl}/sendMessage/${this.token}`,
        {
          chatId: `${formattedPhone}@c.us`,
          message: message
        }
      );

      console.log('WhatsApp message sent successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Send enrollment confirmation to student
  async sendEnrollmentConfirmation(studentData) {
    const message = `🎉 *Thank you for enrolling!*

*Course:* ${studentData.courseName || 'Selected Course'}
*Name:* ${studentData.name}
*Email:* ${studentData.email}
*Phone:* ${studentData.phone}

Your enrollment has been successfully submitted! Our team will contact you soon with further details.

*Mindware Infotech*
📧 info@mindwareinfotech.com
🌐 www.mindwareinfotech.com

Thank you for choosing us! 🚀`;

    return await this.sendMessage(studentData.phone, message);
  }

  // Send notification to admin about new enrollment
  async sendAdminNotification(enrollmentData) {
    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '+919876543210';
    
    const message = `🔔 *New Enrollment Received!*

*Student Details:*
• Name: ${enrollmentData.name}
• Email: ${enrollmentData.email}
• Phone: ${enrollmentData.phone}
• Course: ${enrollmentData.courseName || 'Selected Course'}

*Enrollment Details:*
• Date: ${new Date().toLocaleDateString()}
• Time: ${new Date().toLocaleTimeString()}
• Status: Pending Review

Please check the admin panel for complete details.

*Mindware Admin Panel*`;

    return await this.sendMessage(adminPhone, message);
  }

  // Send course completion certificate notification
  async sendCertificateNotification(studentData, certificateUrl) {
    const message = `🎓 *Congratulations!*

Dear ${studentData.name},

Your course has been completed successfully! 

*Course:* ${studentData.courseName}
*Completion Date:* ${new Date().toLocaleDateString()}

Your certificate is ready for download:
${certificateUrl}

*Mindware Infotech*
Keep learning, keep growing! 🌟`;

    return await this.sendMessage(studentData.phone, message);
  }

  // Send payment confirmation
  async sendPaymentConfirmation(studentData, paymentData) {
    const message = `💳 *Payment Confirmed!*

Dear ${studentData.name},

Your payment has been successfully processed.

*Payment Details:*
• Amount: ₹${paymentData.amount}
• Transaction ID: ${paymentData.transactionId}
• Course: ${studentData.courseName}
• Date: ${new Date().toLocaleDateString()}

Thank you for your payment! Your enrollment is now active.

*Mindware Infotech*`;

    return await this.sendMessage(studentData.phone, message);
  }

  // Send reminder notification
  async sendReminder(studentData, reminderType) {
    let message = '';
    
    switch (reminderType) {
      case 'class_reminder':
        message = `📚 *Class Reminder*

Dear ${studentData.name},

This is a reminder that your class is scheduled for tomorrow.

*Course:* ${studentData.courseName}
*Time:* Please check your schedule

See you in class! 🎓

*Mindware Infotech*`;
        break;
        
      case 'assignment_reminder':
        message = `📝 *Assignment Reminder*

Dear ${studentData.name},

Don't forget to submit your assignment before the deadline.

*Course:* ${studentData.courseName}
*Due Date:* Please check your course portal

*Mindware Infotech*`;
        break;
        
      default:
        message = `📢 *Reminder*

Dear ${studentData.name},

This is a friendly reminder from Mindware Infotech.

*Mindware Infotech*`;
    }

    return await this.sendMessage(studentData.phone, message);
  }
}

module.exports = new WhatsAppService();
