import React, { useState, useEffect, useRef } from 'react';
import { 
  companyInfo, 
  internshipPrograms, 
  trainingPrograms, 
  courses, 
  services, 
  enrollmentProcess, 
  faqs, 
  contactInfo, 
  responseTemplates 
} from '../../data/chatbotKnowledge';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: responseTemplates.greeting[Math.floor(Math.random() * responseTemplates.greeting.length)],
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Analyze user query and generate contextual response
  const analyzeQuery = (query) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for specific program types
    if (lowerQuery.includes('internship') || lowerQuery.includes('intern')) {
      return generateInternshipResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('course') || lowerQuery.includes('training') || lowerQuery.includes('learn')) {
      return generateCourseResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('fee') || lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('₹')) {
      return generateFeeResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('service') || lowerQuery.includes('what do you do') || lowerQuery.includes('specializ')) {
      return generateServiceResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('enroll') || lowerQuery.includes('join') || lowerQuery.includes('apply') || lowerQuery.includes('register')) {
      return generateEnrollmentResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
      return generateContactResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('duration') || lowerQuery.includes('how long') || lowerQuery.includes('time')) {
      return generateDurationResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('certificate') || lowerQuery.includes('certification')) {
      return generateCertificateResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('placement') || lowerQuery.includes('job') || lowerQuery.includes('career')) {
      return generatePlacementResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('web') || lowerQuery.includes('website') || lowerQuery.includes('frontend') || lowerQuery.includes('backend')) {
      return generateWebDevResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('mobile') || lowerQuery.includes('app') || lowerQuery.includes('android') || lowerQuery.includes('ios')) {
      return generateMobileResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('erp') || lowerQuery.includes('enterprise')) {
      return generateERPResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('pos') || lowerQuery.includes('point of sale')) {
      return generatePOSResponse(lowerQuery);
    }
    
    if (lowerQuery.includes('hrm') || lowerQuery.includes('human resource') || lowerQuery.includes('hr')) {
      return generateHRMResponse(lowerQuery);
    }
    
    // Default response for unclear queries
    return generateDefaultResponse(lowerQuery);
  };

  const generateInternshipResponse = (query) => {
    let response = responseTemplates.internship[Math.floor(Math.random() * responseTemplates.internship.length)] + "\n\n";
    
    if (query.includes('web')) {
      response += `🌐 **Web Development Internship**\n`;
      response += `• Duration: ${internshipPrograms.webDevelopment.duration}\n`;
      response += `• Fee: ${internshipPrograms.webDevelopment.fee}\n`;
      response += `• Skills: ${internshipPrograms.webDevelopment.skills.join(', ')}\n\n`;
    }
    
    if (query.includes('mobile') || query.includes('app')) {
      response += `📱 **Mobile App Development Internship**\n`;
      response += `• Duration: ${internshipPrograms.mobileApp.duration}\n`;
      response += `• Fee: ${internshipPrograms.mobileApp.fee}\n`;
      response += `• Skills: ${internshipPrograms.mobileApp.skills.join(', ')}\n\n`;
    }
    
    if (query.includes('erp')) {
      response += `🏢 **ERP Development Internship**\n`;
      response += `• Duration: ${internshipPrograms.erp.duration}\n`;
      response += `• Fee: ${internshipPrograms.erp.fee}\n`;
      response += `• Skills: ${internshipPrograms.erp.skills.join(', ')}\n\n`;
    }
    
    if (query.includes('pos')) {
      response += `💳 **POS System Development**\n`;
      response += `• Duration: ${internshipPrograms.pos.duration}\n`;
      response += `• Fee: ${internshipPrograms.pos.fee}\n`;
      response += `• Skills: ${internshipPrograms.pos.skills.join(', ')}\n\n`;
    }
    
    if (query.includes('hrm') || query.includes('hr')) {
      response += `👥 **HRM System Development**\n`;
      response += `• Duration: ${internshipPrograms.hrm.duration}\n`;
      response += `• Fee: ${internshipPrograms.hrm.fee}\n`;
      response += `• Skills: ${internshipPrograms.hrm.skills.join(', ')}\n\n`;
    }
    
    if (!query.includes('web') && !query.includes('mobile') && !query.includes('erp') && !query.includes('pos') && !query.includes('hrm')) {
      response += `**Available Internship Programs:**\n`;
      response += `• Web Development: ${internshipPrograms.webDevelopment.duration} - ${internshipPrograms.webDevelopment.fee}\n`;
      response += `• Mobile App Development: ${internshipPrograms.mobileApp.duration} - ${internshipPrograms.mobileApp.fee}\n`;
      response += `• ERP Development: ${internshipPrograms.erp.duration} - ${internshipPrograms.erp.fee}\n`;
      response += `• POS System Development: ${internshipPrograms.pos.duration} - ${internshipPrograms.pos.fee}\n`;
      response += `• HRM System Development: ${internshipPrograms.hrm.duration} - ${internshipPrograms.hrm.fee}\n\n`;
    }
    
    response += `📞 **Contact us for more details:**\n`;
    response += `Phone: ${contactInfo.phone}\n`;
    response += `Email: ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateCourseResponse = (query) => {
    let response = responseTemplates.courses[Math.floor(Math.random() * responseTemplates.courses.length)] + "\n\n";
    
    response += `**Available Courses:**\n`;
    response += `• Complete Web Development: ${courses.webDevelopment.duration} - ${courses.webDevelopment.fee}\n`;
    response += `• Mobile App Development: ${courses.mobileApp.duration} - ${courses.mobileApp.fee}\n`;
    response += `• Full Stack Development: ${courses.fullStack.duration} - ${courses.fullStack.fee}\n`;
    response += `• ERP Development: ${courses.erp.duration} - ${courses.erp.fee}\n\n`;
    
    response += `**Training Levels:**\n`;
    response += `• Beginner: ${trainingPrograms.beginner.duration} - ${trainingPrograms.beginner.fee}\n`;
    response += `• Intermediate: ${trainingPrograms.intermediate.duration} - ${trainingPrograms.intermediate.fee}\n`;
    response += `• Advanced: ${trainingPrograms.advanced.duration} - ${trainingPrograms.advanced.fee}\n`;
    response += `• Corporate Training: ${trainingPrograms.corporate.duration} - ${trainingPrograms.corporate.fee}\n\n`;
    
    response += `📞 **Contact us for detailed course information:**\n`;
    response += `Phone: ${contactInfo.phone}\n`;
    response += `Email: ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateFeeResponse = (query) => {
    let response = responseTemplates.fees[Math.floor(Math.random() * responseTemplates.fees.length)] + "\n\n";
    
    response += `**Fee Structure Overview:**\n\n`;
    response += `**Internships:**\n`;
    response += `• Web Development: ${internshipPrograms.webDevelopment.fee}\n`;
    response += `• Mobile App Development: ${internshipPrograms.mobileApp.fee}\n`;
    response += `• ERP Development: ${internshipPrograms.erp.fee}\n`;
    response += `• POS System Development: ${internshipPrograms.pos.fee}\n`;
    response += `• HRM System Development: ${internshipPrograms.hrm.fee}\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• Beginner Level: ${trainingPrograms.beginner.fee}\n`;
    response += `• Intermediate Level: ${trainingPrograms.intermediate.fee}\n`;
    response += `• Advanced Level: ${trainingPrograms.advanced.fee}\n`;
    response += `• Corporate Training: ${trainingPrograms.corporate.fee}\n\n`;
    
    response += `**Full Courses:**\n`;
    response += `• Web Development Course: ${courses.webDevelopment.fee}\n`;
    response += `• Mobile App Course: ${courses.mobileApp.fee}\n`;
    response += `• Full Stack Course: ${courses.fullStack.fee}\n`;
    response += `• ERP Course: ${courses.erp.fee}\n\n`;
    
    response += `💡 **Note:** All fees include course materials, practical training, and certification.\n\n`;
    response += `📞 **For detailed pricing and payment options:**\n`;
    response += `Phone: ${contactInfo.phone}\n`;
    response += `Email: ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateServiceResponse = (query) => {
    let response = responseTemplates.services[Math.floor(Math.random() * responseTemplates.services.length)] + "\n\n";
    
    response += `**Our Specializations:**\n`;
    response += `• ${services.webDevelopment}\n`;
    response += `• ${services.mobileApp}\n`;
    response += `• ${services.erp}\n`;
    response += `• ${services.pos}\n`;
    response += `• ${services.hrm}\n`;
    response += `• ${services.custom}\n`;
    response += `• ${services.consulting}\n`;
    response += `• ${services.maintenance}\n\n`;
    
    response += `**Why Choose Mindware Infotech?**\n`;
    response += `• ${companyInfo.established} in the industry\n`;
    response += `• Expert team of developers and consultants\n`;
    response += `• Proven track record of successful projects\n`;
    response += `• 24/7 support and maintenance\n`;
    response += `• Industry-recognized certifications\n\n`;
    
    response += `📞 **Ready to discuss your project?**\n`;
    response += `Phone: ${contactInfo.phone}\n`;
    response += `Email: ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateEnrollmentResponse = (query) => {
    let response = responseTemplates.enrollment[Math.floor(Math.random() * responseTemplates.enrollment.length)] + "\n\n";
    
    response += `**Enrollment Process:**\n`;
    enrollmentProcess.forEach(step => {
      response += `${step}\n`;
    });
    response += `\n`;
    
    response += `**Quick Start Options:**\n`;
    response += `• Call us directly: ${contactInfo.phone}\n`;
    response += `• Email us: ${contactInfo.email}\n`;
    response += `• Visit our website for online registration\n\n`;
    
    response += `**What You'll Need:**\n`;
    response += `• Basic computer knowledge\n`;
    response += `• Valid ID proof\n`;
    response += `• Payment method (we accept various options)\n\n`;
    
    response += `🚀 **Ready to start your learning journey?**\n`;
    response += `Contact us today and we'll help you choose the perfect program!\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateContactResponse = (query) => {
    let response = responseTemplates.contact[Math.floor(Math.random() * responseTemplates.contact.length)] + "\n\n";
    
    response += `**Contact Information:**\n`;
    response += `📞 Phone: ${contactInfo.phone}\n`;
    response += `📧 Email: ${contactInfo.email}\n`;
    response += `🌐 Website: ${companyInfo.website}\n`;
    response += `📍 Location: ${contactInfo.address}\n`;
    response += `⏰ Working Hours: ${contactInfo.workingHours}\n`;
    response += `🚨 Emergency: ${contactInfo.emergencyContact}\n\n`;
    
    response += `**Best Ways to Reach Us:**\n`;
    response += `• For immediate assistance: Call ${contactInfo.phone}\n`;
    response += `• For detailed queries: Email ${contactInfo.email}\n`;
    response += `• For course information: Visit our website\n`;
    response += `• For urgent matters: Available 24/7\n\n`;
    
    response += `We're here to help with all your IT training and service needs!\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateDurationResponse = (query) => {
    let response = `**Program Durations at Mindware Infotech:**\n\n`;
    
    response += `**Internship Programs:**\n`;
    response += `• Web Development: ${internshipPrograms.webDevelopment.duration}\n`;
    response += `• Mobile App Development: ${internshipPrograms.mobileApp.duration}\n`;
    response += `• ERP Development: ${internshipPrograms.erp.duration}\n`;
    response += `• POS System Development: ${internshipPrograms.pos.duration}\n`;
    response += `• HRM System Development: ${internshipPrograms.hrm.duration}\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• Beginner Level: ${trainingPrograms.beginner.duration}\n`;
    response += `• Intermediate Level: ${trainingPrograms.intermediate.duration}\n`;
    response += `• Advanced Level: ${trainingPrograms.advanced.duration}\n`;
    response += `• Corporate Training: ${trainingPrograms.corporate.duration}\n\n`;
    
    response += `**Full Courses:**\n`;
    response += `• Web Development Course: ${courses.webDevelopment.duration}\n`;
    response += `• Mobile App Course: ${courses.mobileApp.duration}\n`;
    response += `• Full Stack Course: ${courses.fullStack.duration}\n`;
    response += `• ERP Course: ${courses.erp.duration}\n\n`;
    
    response += `💡 **Flexible Options:** We also offer part-time and weekend batches for working professionals.\n\n`;
    response += `📞 **Need help choosing the right duration?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateCertificateResponse = (query) => {
    let response = `**Certification at Mindware Infotech:**\n\n`;
    
    response += `✅ **Yes, we provide industry-recognized certificates!**\n\n`;
    
    response += `**What You Get:**\n`;
    response += `• Industry-recognized completion certificate\n`;
    response += `• Digital certificate for easy sharing\n`;
    response += `• Certificate verification system\n`;
    response += `• Portfolio project certificates\n`;
    response += `• Skill-specific micro-certificates\n\n`;
    
    response += `**Certificate Requirements:**\n`;
    response += `• Complete all course modules\n`;
    response += `• Submit final project\n`;
    response += `• Pass the assessment (if applicable)\n`;
    response += `• Maintain 80% attendance\n\n`;
    
    response += `**Benefits of Our Certificates:**\n`;
    response += `• Recognized by IT industry\n`;
    response += `• Enhances your resume\n`;
    response += `• Validates your skills\n`;
    response += `• Helps in job placement\n\n`;
    
    response += `📞 **Questions about certification?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generatePlacementResponse = (query) => {
    let response = `**Placement Assistance at Mindware Infotech:**\n\n`;
    
    response += `✅ **Yes, we provide comprehensive placement support!**\n\n`;
    
    response += `**Our Placement Services:**\n`;
    response += `• Resume building and optimization\n`;
    response += `• Interview preparation and mock interviews\n`;
    response += `• Job placement assistance\n`;
    response += `• Industry connections and networking\n`;
    response += `• Career counseling and guidance\n`;
    response += `• Portfolio development support\n\n`;
    
    response += `**Our Industry Partners:**\n`;
    response += `• IT companies and startups\n`;
    response += `• Software development firms\n`;
    response += `• E-commerce companies\n`;
    response += `• Banking and finance sector\n`;
    response += `• Government organizations\n\n`;
    
    response += `**Success Stories:**\n`;
    response += `• 85% placement rate for our students\n`;
    response += `• Average salary increase of 40-60%\n`;
    response += `• Students placed in top IT companies\n`;
    response += `• Career growth support even after placement\n\n`;
    
    response += `📞 **Ready to start your career journey?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateWebDevResponse = (query) => {
    let response = `**Web Development at Mindware Infotech:**\n\n`;
    
    response += `🌐 **Complete Web Development Solutions**\n\n`;
    
    response += `**What We Offer:**\n`;
    response += `• ${services.webDevelopment}\n`;
    response += `• Frontend and backend development\n`;
    response += `• E-commerce solutions\n`;
    response += `• Responsive web design\n`;
    response += `• API development and integration\n\n`;
    
    response += `**Technologies We Use:**\n`;
    response += `• Frontend: HTML, CSS, JavaScript, React, Vue.js\n`;
    response += `• Backend: Node.js, Python, PHP, Java\n`;
    response += `• Databases: MySQL, MongoDB, PostgreSQL\n`;
    response += `• Cloud: AWS, Azure, Google Cloud\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• Web Development Internship: ${internshipPrograms.webDevelopment.duration} - ${internshipPrograms.webDevelopment.fee}\n`;
    response += `• Complete Web Development Course: ${courses.webDevelopment.duration} - ${courses.webDevelopment.fee}\n`;
    response += `• Full Stack Development: ${courses.fullStack.duration} - ${courses.fullStack.fee}\n\n`;
    
    response += `📞 **Interested in web development?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateMobileResponse = (query) => {
    let response = `**Mobile App Development at Mindware Infotech:**\n\n`;
    
    response += `📱 **Complete Mobile App Solutions**\n\n`;
    
    response += `**What We Offer:**\n`;
    response += `• ${services.mobileApp}\n`;
    response += `• Native iOS and Android apps\n`;
    response += `• Cross-platform development\n`;
    response += `• App store deployment\n`;
    response += `• App maintenance and updates\n\n`;
    
    response += `**Technologies We Use:**\n`;
    response += `• React Native for cross-platform\n`;
    response += `• Flutter for hybrid development\n`;
    response += `• Native iOS (Swift, Objective-C)\n`;
    response += `• Native Android (Java, Kotlin)\n`;
    response += `• Backend integration and APIs\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• Mobile App Internship: ${internshipPrograms.mobileApp.duration} - ${internshipPrograms.mobileApp.fee}\n`;
    response += `• Mobile App Course: ${courses.mobileApp.duration} - ${courses.mobileApp.fee}\n`;
    response += `• Full Stack with Mobile: ${courses.fullStack.duration} - ${courses.fullStack.fee}\n\n`;
    
    response += `📞 **Ready to build mobile apps?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateERPResponse = (query) => {
    let response = `**ERP Development at Mindware Infotech:**\n\n`;
    
    response += `🏢 **Enterprise Resource Planning Solutions**\n\n`;
    
    response += `**What We Offer:**\n`;
    response += `• ${services.erp}\n`;
    response += `• Custom ERP system development\n`;
    response += `• ERP customization and integration\n`;
    response += `• Business process automation\n`;
    response += `• Data migration and management\n\n`;
    
    response += `**ERP Modules We Develop:**\n`;
    response += `• Financial Management\n`;
    response += `• Inventory Management\n`;
    response += `• Human Resource Management\n`;
    response += `• Customer Relationship Management\n`;
    response += `• Supply Chain Management\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• ERP Development Internship: ${internshipPrograms.erp.duration} - ${internshipPrograms.erp.fee}\n`;
    response += `• ERP Development Course: ${courses.erp.duration} - ${courses.erp.fee}\n`;
    response += `• Corporate ERP Training: ${trainingPrograms.corporate.duration} - ${trainingPrograms.corporate.fee}\n\n`;
    
    response += `📞 **Need ERP solutions for your business?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generatePOSResponse = (query) => {
    let response = `**POS System Development at Mindware Infotech:**\n\n`;
    
    response += `💳 **Point of Sale Solutions**\n\n`;
    
    response += `**What We Offer:**\n`;
    response += `• ${services.pos}\n`;
    response += `• Custom POS system development\n`;
    response += `• Payment gateway integration\n`;
    response += `• Inventory management integration\n`;
    response += `• Multi-location support\n\n`;
    
    response += `**POS Features:**\n`;
    response += `• Sales transaction processing\n`;
    response += `• Payment processing (cards, digital)\n`;
    response += `• Receipt generation\n`;
    response += `• Inventory tracking\n`;
    response += `• Sales reporting and analytics\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• POS Development Internship: ${internshipPrograms.pos.duration} - ${internshipPrograms.pos.fee}\n`;
    response += `• Custom POS Training: ${trainingPrograms.corporate.duration} - ${trainingPrograms.corporate.fee}\n\n`;
    
    response += `📞 **Need a POS system for your business?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateHRMResponse = (query) => {
    let response = `**HRM System Development at Mindware Infotech:**\n\n`;
    
    response += `👥 **Human Resource Management Solutions**\n\n`;
    
    response += `**What We Offer:**\n`;
    response += `• ${services.hrm}\n`;
    response += `• Employee management systems\n`;
    response += `• Payroll processing\n`;
    response += `• Attendance tracking\n`;
    response += `• Performance management\n\n`;
    
    response += `**HRM Features:**\n`;
    response += `• Employee database management\n`;
    response += `• Leave management system\n`;
    response += `• Payroll and benefits administration\n`;
    response += `• Performance appraisal system\n`;
    response += `• Recruitment and onboarding\n\n`;
    
    response += `**Training Programs:**\n`;
    response += `• HRM Development Internship: ${internshipPrograms.hrm.duration} - ${internshipPrograms.hrm.fee}\n`;
    response += `• HRM System Training: ${trainingPrograms.corporate.duration} - ${trainingPrograms.corporate.fee}\n\n`;
    
    response += `📞 **Need HRM solutions for your organization?**\n`;
    response += `Contact us: ${contactInfo.phone} or ${contactInfo.email}\n\n`;
    response += responseTemplates.closing[Math.floor(Math.random() * responseTemplates.closing.length)];
    
    return response;
  };

  const generateDefaultResponse = (query) => {
    // Check if query is unrelated to our services
    const unrelatedKeywords = ['weather', 'news', 'sports', 'politics', 'entertainment', 'food', 'travel'];
    const isUnrelated = unrelatedKeywords.some(keyword => query.includes(keyword));
    
    if (isUnrelated) {
      return `I can help you with information about Mindware Infotech's internship programs, training courses, fee structures, and company services. Could you please ask something related to our IT training and development services?\n\n📞 For any IT-related queries, contact us at ${contactInfo.phone} or ${contactInfo.email}`;
    }
    
    // Default helpful response
    let response = `I'd be happy to help you with information about Mindware Infotech! We specialize in **${companyInfo.specialization}**.\n\n`;
    
    response += `**What I can help you with:**\n`;
    response += `• Internship programs and training courses\n`;
    response += `• Fee structures and pricing\n`;
    response += `• Course details and duration\n`;
    response += `• Company services and specializations\n`;
    response += `• Enrollment process\n`;
    response += `• Contact information and support\n\n`;
    
    response += `**Popular Questions:**\n`;
    response += `• "What internship programs do you offer?"\n`;
    response += `• "What are the fees for web development training?"\n`;
    response += `• "How long is the mobile app development course?"\n`;
    response += `• "What services does Mindware Infotech provide?"\n\n`;
    
    response += `📞 **Quick Contact:**\n`;
    response += `Phone: ${contactInfo.phone}\n`;
    response += `Email: ${contactInfo.email}\n\n`;
    response += `Please ask me anything about our programs or services!`;
    
    return response;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = analyzeQuery(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('•') || line.startsWith('-')) {
        return <div key={index} className="message-bullet">{line}</div>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={index} className="message-bold">{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('📞') || line.startsWith('📧') || line.startsWith('🌐') || line.startsWith('📍') || line.startsWith('⏰') || line.startsWith('🚨') || line.startsWith('✅') || line.startsWith('💡') || line.startsWith('🚀') || line.startsWith('🌐') || line.startsWith('📱') || line.startsWith('🏢') || line.startsWith('💳') || line.startsWith('👥')) {
        return <div key={index} className="message-icon">{line}</div>;
      }
      return <div key={index} className="message-line">{line}</div>;
    });
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {/* Chat Button */}
      <button 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Mindware Infotech"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <div className="chatbot-window">
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <div className="avatar-icon">M</div>
          </div>
          <div className="chatbot-info">
            <h3>Mindware Infotech</h3>
            <p>AI Assistant</p>
          </div>
          <button 
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {formatMessage(message.text)}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about our programs, courses, or services..."
            className="chatbot-input-field"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="chatbot-send-btn"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
