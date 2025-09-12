const fs = require('fs');
const path = require('path');

console.log('🔔 WhatsApp Notification Setup Script');
console.log('=====================================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '../.env');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Creating .env file from template...\n');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
  } else {
    // Create basic .env file
    const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mindwareindiadb

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# WhatsApp API Configuration (Green API)
WHATSAPP_INSTANCE_ID=your_instance_id_here
WHATSAPP_TOKEN=your_token_here
ADMIN_WHATSAPP_NUMBER=+919876543210

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@mindwareinfotech.com

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created with default values!');
  }
} else {
  console.log('✅ .env file already exists!');
}

console.log('\n📋 Next Steps:');
console.log('==============');
console.log('1. 🔧 Configure WhatsApp API:');
console.log('   - Go to https://green-api.com');
console.log('   - Create a free account');
console.log('   - Get your Instance ID and Token');
console.log('   - Update WHATSAPP_INSTANCE_ID and WHATSAPP_TOKEN in .env');
console.log('   - Set ADMIN_WHATSAPP_NUMBER to your WhatsApp number');

console.log('\n2. 📧 Configure Email (Gmail):');
console.log('   - Enable 2-Factor Authentication on Gmail');
console.log('   - Generate App Password: Google Account → Security → 2-Step Verification → App passwords');
console.log('   - Update SMTP_USER and SMTP_PASS in .env');

console.log('\n3. 🧪 Test Notifications:');
console.log('   - Start the server: npm start');
console.log('   - Go to http://localhost:3000/admin/notifications');
console.log('   - Test WhatsApp and Email notifications');

console.log('\n4. 📱 Free WhatsApp API Options:');
console.log('   - Green API: 100 messages/day free');
console.log('   - Twilio: $15 free credit');
console.log('   - WhatsApp Web: Completely free');

console.log('\n5. 🔍 Troubleshooting:');
console.log('   - Check console logs for errors');
console.log('   - Verify phone number format: +919876543210');
console.log('   - Test API endpoints manually');

console.log('\n✨ Setup complete! Check the .env file and configure your credentials.');
console.log('📖 For detailed instructions, see: backend/WHATSAPP_SETUP.md');
