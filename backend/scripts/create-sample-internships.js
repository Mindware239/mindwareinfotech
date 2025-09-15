const { sequelize } = require('../config/database');
const Internship = require('../models/Internship');
const CourseCategory = require('../models/CourseCategory');

async function createSampleInternships() {
  try {
    console.log('🔍 Creating sample internships...\n');
    
    // Get categories
    const categories = await CourseCategory.findAll();
    console.log(`Found ${categories.length} categories available`);
    
    if (categories.length === 0) {
      console.log('❌ No categories found. Please create categories first.');
      return;
    }
    
    // Check existing internships
    const existingInternships = await Internship.count();
    console.log(`Found ${existingInternships} existing internships`);
    
    if (existingInternships > 0) {
      console.log('✅ Internships already exist. No need to create more.');
      return;
    }
    
    // Create sample internships
    const sampleInternships = [
      {
        title: 'Web Development Internship',
        description: 'Learn full-stack web development with React, Node.js, and MongoDB. Build real-world projects and get hands-on experience.',
        short_description: 'Full-stack web development internship with modern technologies',
        company: 'Mindware India',
        location: 'Remote',
        type: 'remote',
        duration: 3,
        duration_unit: 'months',
        price: 15000,
        original_price: 20000,
        discount_percentage: 25,
        currency: 'INR',
        is_free: false,
        enrollment_fee: 2000,
        installment_available: true,
        installment_count: 3,
        category_id: categories[0].id,
        category: categories[0].name, // Legacy field
        requirements: {
          skills: ['HTML', 'CSS', 'JavaScript'],
          education: 'Any',
          experience: 'Beginner'
        },
        responsibilities: [
          'Build responsive websites',
          'Learn React framework',
          'Work on real projects',
          'Collaborate with team'
        ],
        benefits: [
          'Certificate of completion',
          'Job placement assistance',
          'Mentorship program',
          'Portfolio development'
        ],
        application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        end_date: new Date(Date.now() + 97 * 24 * 60 * 60 * 1000), // 97 days from now
        max_applications: 20,
        status: 'active',
        is_featured: true,
        created_by: 1
      },
      {
        title: 'Mobile App Development Internship',
        description: 'Build mobile applications for iOS and Android using React Native. Learn app development from scratch.',
        short_description: 'Mobile app development with React Native',
        company: 'Mindware India',
        location: 'Hybrid',
        type: 'hybrid',
        duration: 2,
        duration_unit: 'months',
        price: 12000,
        original_price: 15000,
        discount_percentage: 20,
        currency: 'INR',
        is_free: false,
        enrollment_fee: 1500,
        installment_available: true,
        installment_count: 2,
        category_id: categories[1] ? categories[1].id : categories[0].id,
        category: categories[1] ? categories[1].name : categories[0].name,
        requirements: {
          skills: ['JavaScript', 'React'],
          education: 'Any',
          experience: 'Beginner'
        },
        responsibilities: [
          'Develop mobile apps',
          'Learn React Native',
          'Test applications',
          'Deploy to app stores'
        ],
        benefits: [
          'App store publishing',
          'Portfolio apps',
          'Industry mentorship',
          'Job referrals'
        ],
        application_deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
        max_applications: 15,
        status: 'active',
        is_featured: true,
        created_by: 1
      },
      {
        title: 'Data Science Internship',
        description: 'Learn data analysis, machine learning, and AI with Python. Work on real data science projects.',
        short_description: 'Data science and machine learning internship',
        company: 'Mindware India',
        location: 'Remote',
        type: 'remote',
        duration: 4,
        duration_unit: 'months',
        price: 18000,
        original_price: 25000,
        discount_percentage: 28,
        currency: 'INR',
        is_free: false,
        enrollment_fee: 2500,
        installment_available: true,
        installment_count: 4,
        category_id: categories[2] ? categories[2].id : categories[0].id,
        category: categories[2] ? categories[2].name : categories[0].name,
        requirements: {
          skills: ['Python', 'Mathematics'],
          education: 'Any',
          experience: 'Beginner'
        },
        responsibilities: [
          'Analyze datasets',
          'Build ML models',
          'Create visualizations',
          'Present findings'
        ],
        benefits: [
          'ML project portfolio',
          'Industry datasets',
          'Expert mentorship',
          'Job placement'
        ],
        application_deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 130 * 24 * 60 * 60 * 1000),
        max_applications: 12,
        status: 'active',
        is_featured: false,
        created_by: 1
      }
    ];
    
    for (const internshipData of sampleInternships) {
      const internship = await Internship.create(internshipData);
      console.log(`✅ Created internship: ${internship.title} (₹${internship.price})`);
    }
    
    console.log('\n🎉 Sample internships created successfully!');
    console.log('Now you can view them in the admin panel at:');
    console.log('http://localhost:3000/admin/internships');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

createSampleInternships();
