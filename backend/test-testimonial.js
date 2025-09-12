const { sequelize } = require('./config/database');
const Testimonial = require('./models/Testimonial');

async function testTestimonial() {
  try {
    console.log('🔗 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    console.log('📝 Creating test testimonial...');
    
    const testData = {
      client_name: 'Test Client',
      client_designation: 'Software Developer',
      client_company: 'Test Company',
      course: 'Web Development',
      testimonial_text: 'This is a test testimonial to verify the system is working properly.',
      client_image: null,
      success_metrics: JSON.stringify({
        projects: "3",
        duration: "6 months",
        outcome: "Got job"
      }),
      testimonial_rating: 5,
      testimonial_status: '1',
      testimonial_order: 1
    };

    const testimonial = await Testimonial.create(testData);
    console.log('✅ Testimonial created successfully:', testimonial.toJSON());

    console.log('📊 Fetching all testimonials...');
    const allTestimonials = await Testimonial.findAll();
    console.log('📋 Total testimonials:', allTestimonials.length);
    
    allTestimonials.forEach((t, index) => {
      console.log(`${index + 1}. ${t.client_name} - ${t.testimonial_text.substring(0, 50)}...`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('📋 Full error:', error);
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

testTestimonial();
