const { sequelize } = require('../config/database');
const Payment = require('../models/Payment');

const samplePayments = [
  {
    student_id: 1,
    user_id: 1,
    course_id: 1,
    amount: 20000,
    currency: 'INR',
    payment_method: 'razorpay',
    payment_id: 'pay_1234567890',
    order_id: 'order_1234567890',
    status: 'completed',
    transaction_id: 'txn_1234567890',
    payment_gateway: 'razorpay',
    gateway_response: { status: 'success', payment_id: 'pay_1234567890' },
    student_name: 'Rajesh Kumar',
    student_email: 'rajesh@example.com',
    student_phone: '+91-9876543210',
    course_name: 'Full Stack Web Development',
    payment_date: new Date('2024-01-15'),
    refund_amount: 0,
    refund_status: 'none',
    refund_date: null
  },
  {
    student_id: 2,
    user_id: 2,
    course_id: 1,
    amount: 20000,
    currency: 'INR',
    payment_method: 'razorpay',
    payment_id: 'pay_1234567891',
    order_id: 'order_1234567891',
    status: 'completed',
    transaction_id: 'txn_1234567891',
    payment_gateway: 'razorpay',
    gateway_response: { status: 'success', payment_id: 'pay_1234567891' },
    student_name: 'Priya Sharma',
    student_email: 'priya@example.com',
    student_phone: '+91-9876543211',
    course_name: 'Full Stack Web Development',
    payment_date: new Date('2024-01-20'),
    refund_amount: 0,
    refund_status: 'none',
    refund_date: null
  },
  {
    student_id: 3,
    user_id: 3,
    course_id: 1,
    amount: 20000,
    currency: 'INR',
    payment_method: 'razorpay',
    payment_id: 'pay_1234567892',
    order_id: 'order_1234567892',
    status: 'pending',
    transaction_id: 'txn_1234567892',
    payment_gateway: 'razorpay',
    gateway_response: { status: 'pending', payment_id: 'pay_1234567892' },
    student_name: 'Amit Singh',
    student_email: 'amit@example.com',
    student_phone: '+91-9876543212',
    course_name: 'Full Stack Web Development',
    payment_date: new Date('2024-01-25'),
    refund_amount: 0,
    refund_status: 'none',
    refund_date: null
  },
  {
    student_id: 4,
    user_id: 4,
    course_id: 1,
    amount: 20000,
    currency: 'INR',
    payment_method: 'razorpay',
    payment_id: 'pay_1234567893',
    order_id: 'order_1234567893',
    status: 'failed',
    transaction_id: 'txn_1234567893',
    payment_gateway: 'razorpay',
    gateway_response: { status: 'failed', payment_id: 'pay_1234567893' },
    student_name: 'Sneha Patel',
    student_email: 'sneha@example.com',
    student_phone: '+91-9876543213',
    course_name: 'Full Stack Web Development',
    payment_date: new Date('2024-01-30'),
    refund_amount: 0,
    refund_status: 'none',
    refund_date: null
  }
];

async function seedPayments() {
  try {
    console.log('🌱 Seeding payments...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing payments
    await Payment.destroy({ where: {} });
    console.log('🗑️ Cleared existing payments');
    
    // Create sample payments
    for (const payment of samplePayments) {
      await Payment.create(payment);
      console.log(`✅ Created payment: ${payment.student_name} - ${payment.course_name}`);
    }
    
    console.log(`📊 Total payments created: ${samplePayments.length}`);
    console.log('🎉 Payment seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding payments:', error);
  } finally {
    await sequelize.close();
  }
}

seedPayments();
