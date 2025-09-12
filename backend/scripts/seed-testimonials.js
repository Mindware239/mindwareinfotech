const { sequelize } = require('../config/database');
const Testimonial = require('../models/Testimonial');

const sampleTestimonials = [
  {
    client_name: 'Rajesh Kumar',
    client_designation: 'Software Developer',
    client_company: 'TechCorp Solutions',
    course: 'Full Stack Development',
    testimonial_text: 'The training program at Mindware Infotech transformed my career. The instructors are highly knowledgeable and the hands-on approach helped me master both frontend and backend technologies.',
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 1
  },
  {
    client_name: 'Priya Sharma',
    client_designation: 'UI/UX Designer',
    client_company: 'Design Studio',
    course: 'UI/UX Design',
    testimonial_text: 'Excellent course content and practical projects. The mentorship provided was invaluable for my career growth in design.',
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 2
  },
  {
    client_name: 'Amit Singh',
    client_designation: 'Project Manager',
    client_company: 'Global IT Services',
    course: 'Project Management',
    testimonial_text: 'The project management course gave me the skills and confidence to lead complex projects successfully. Highly recommended!',
    testimonial_rating: 4,
    testimonial_status: '1',
    testimonial_order: 3
  },
  {
    client_name: 'Sneha Patel',
    client_designation: 'Data Analyst',
    client_company: 'Analytics Pro',
    course: 'Data Science',
    testimonial_text: 'Outstanding curriculum and expert instructors. The data science program prepared me well for real-world challenges.',
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 4
  },
  {
    client_name: 'Vikram Reddy',
    client_designation: 'DevOps Engineer',
    client_company: 'Cloud Solutions Inc',
    course: 'DevOps & Cloud',
    testimonial_text: 'The DevOps course was comprehensive and up-to-date with industry standards. Great learning experience!',
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 5
  }
];

async function seedTestimonials() {
  try {
    console.log('🌱 Seeding testimonials...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing testimonials
    await Testimonial.destroy({ where: {} });
    console.log('🗑️ Cleared existing testimonials');
    
    // Create sample testimonials
    for (const testimonial of sampleTestimonials) {
      await Testimonial.create(testimonial);
      console.log(`✅ Created testimonial: ${testimonial.client_name}`);
    }
    
    console.log(`📊 Total testimonials created: ${sampleTestimonials.length}`);
    console.log('🎉 Testimonial seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
  } finally {
    await sequelize.close();
  }
}

seedTestimonials();
