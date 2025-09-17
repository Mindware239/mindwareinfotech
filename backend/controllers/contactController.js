const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Send brochure download request email
const sendBrochureRequest = async (req, res) => {
  try {
    const { name, whatsapp, state, degree, graduationYear, jobStatus } = req.body;

    // Validate required fields
    if (!name || !whatsapp || !state || !degree || !graduationYear || !jobStatus) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const transporter = createTransporter();

    // Email content
    const emailContent = `
      <h2>New Brochure Download Request</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #333; margin-bottom: 15px;">Contact Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>State:</strong> ${state}</p>
        <p><strong>Degree:</strong> ${degree}</p>
        <p><strong>Graduation Year:</strong> ${graduationYear}</p>
        <p><strong>Job Status:</strong> ${jobStatus}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      </div>
      <p style="color: #666; font-size: 14px;">
        This request was submitted through the Mindware Infotech website brochure download form.
      </p>
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: ['gm@mindwareinfotech.com', 'gm@indianbarcode.com'],
      subject: 'New Brochure Download Request - Mindware Infotech',
      html: emailContent
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Brochure request submitted successfully! We will contact you soon.'
    });

  } catch (error) {
    console.error('Error sending brochure request email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit brochure request. Please try again later.'
    });
  }
};

module.exports = {
  sendBrochureRequest
};
