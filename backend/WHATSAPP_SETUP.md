# WhatsApp Notification Setup Guide

## Free WhatsApp API Setup

### Option 1: Green API (Recommended - 100 messages/day free)

1. **Register at Green API:**
   - Go to https://green-api.com
   - Create a free account
   - Get your Instance ID and Token

2. **Configure Environment Variables:**
   Create a `.env` file in the backend directory with:
   ```env
   WHATSAPP_INSTANCE_ID=your_instance_id_here
   WHATSAPP_TOKEN=your_token_here
   ADMIN_WHATSAPP_NUMBER=+919876543210
   ```

3. **Test the API:**
   - Use the test endpoint to verify your setup
   - Check the console for success/error messages

### Option 2: Twilio WhatsApp API (Free Trial)

1. **Register at Twilio:**
   - Go to https://www.twilio.com
   - Create a free account
   - Get $15 free credit

2. **Configure Twilio:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

### Option 3: WhatsApp Web API (Completely Free)

1. **Install whatsapp-web.js:**
   ```bash
   npm install whatsapp-web.js
   ```

2. **Setup QR Code Authentication:**
   - Scan QR code with your WhatsApp
   - Use your personal number for notifications

## Email Configuration (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Configure Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   ADMIN_EMAIL=admin@mindwareinfotech.com
   ```

## Testing Notifications

1. **Start the server:**
   ```bash
   cd backend
   node server.js
   ```

2. **Test enrollment:**
   - Submit an enrollment form
   - Check WhatsApp and email for notifications

3. **Check logs:**
   - Look for "Notification results" in console
   - Verify success/error messages

## Message Templates

### Student Confirmation:
- WhatsApp: "🎉 Thank you for enrolling! Course: [Course Name]..."
- Email: Professional HTML template with course details

### Admin Notification:
- WhatsApp: "🔔 New Enrollment Received! Student: [Name]..."
- Email: Admin panel link with student details

## Troubleshooting

### Common Issues:

1. **WhatsApp API not working:**
   - Check Instance ID and Token
   - Verify phone number format (+91XXXXXXXXXX)
   - Check API limits

2. **Email not sending:**
   - Verify SMTP credentials
   - Check Gmail app password
   - Test with different email providers

3. **Notifications not sending:**
   - Check console logs
   - Verify environment variables
   - Test API endpoints manually

### Support:
- Green API: https://green-api.com/docs
- Twilio: https://www.twilio.com/docs/whatsapp
- Gmail SMTP: https://support.google.com/mail/answer/7126229
