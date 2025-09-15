const { sequelize } = require('../config/database');
const Internship = require('../models/Internship');
const CourseCategory = require('../models/CourseCategory');

async function checkInternships() {
  try {
    console.log('🔍 Checking internships...\n');
    
    const internships = await Internship.findAll({
      include: [{
        model: CourseCategory,
        as: 'courseCategory'
      }],
      order: [['created_at', 'DESC']]
    });
    
    console.log(`📊 Found ${internships.length} internships:\n`);
    
    if (internships.length === 0) {
      console.log('❌ No internships found in database!');
      console.log('💡 You need to create internships first.');
      console.log('\n🔧 Let me create some sample internships...\n');
      
      // Get categories
      const categories = await CourseCategory.findAll();
      console.log(`Found ${categories.length} categories available`);
      
      if (categories.length > 0) {
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
          }
        ];
        
        for (const internshipData of sampleInternships) {
          const internship = await Internship.create(internshipData);
          console.log(`✅ Created internship: ${internship.title}`);
        }
        
        console.log('\n🎉 Sample internships created successfully!');
        console.log('Now you can view them in the admin panel.');
        
      } else {
        console.log('❌ No categories found. Please create categories first.');
      }
      
    } else {
      internships.forEach((internship, index) => {
        console.log(`${index + 1}. ${internship.title}`);
        console.log(`   Company: ${internship.company}`);
        console.log(`   Location: ${internship.location}`);
        console.log(`   Type: ${internship.type}`);
        console.log(`   Duration: ${internship.duration} ${internship.duration_unit}`);
        console.log(`   Price: ₹${internship.price}`);
        console.log(`   Status: ${internship.status}`);
        console.log(`   Category: ${internship.courseCategory ? internship.courseCategory.name : 'No category'}`);
        console.log('   ' + '─'.repeat(50));
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkInternships();
