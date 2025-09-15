const { sequelize } = require('../config/database');
const CourseCategory = require('../models/CourseCategory');
const Course = require('../models/Course');

async function addCourseCategories() {
  try {
    console.log('🔄 Adding course categories...');
    
    // Create course_categories table
    await CourseCategory.sync({ force: false });
    
    // Add default categories
    const categories = [
      {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn modern web development technologies including HTML, CSS, JavaScript, React, Node.js and more.',
        icon: 'fas fa-laptop-code',
        color: '#3B82F6',
        sort_order: 1,
        meta_title: 'Web Development Courses - Learn Frontend & Backend',
        meta_description: 'Master web development with our comprehensive courses covering HTML, CSS, JavaScript, React, Node.js and more.',
        meta_keywords: 'web development, html, css, javascript, react, nodejs, frontend, backend'
      },
      {
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Build mobile applications for iOS and Android using React Native, Flutter, and native development.',
        icon: 'fas fa-mobile-alt',
        color: '#10B981',
        sort_order: 2,
        meta_title: 'Mobile App Development Courses - iOS & Android',
        meta_description: 'Learn mobile app development with React Native, Flutter, Swift, and Kotlin.',
        meta_keywords: 'mobile development, react native, flutter, ios, android, app development'
      },
      {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Master data analysis, machine learning, and AI with Python, R, and advanced analytics tools.',
        icon: 'fas fa-chart-line',
        color: '#F59E0B',
        sort_order: 3,
        meta_title: 'Data Science Courses - Python, ML, AI',
        meta_description: 'Learn data science, machine learning, and artificial intelligence with hands-on projects.',
        meta_keywords: 'data science, machine learning, python, r, ai, analytics, statistics'
      },
      {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Learn ethical hacking, network security, and cybersecurity best practices.',
        icon: 'fas fa-shield-alt',
        color: '#EF4444',
        sort_order: 4,
        meta_title: 'Cybersecurity Courses - Ethical Hacking & Security',
        meta_description: 'Master cybersecurity with ethical hacking, network security, and penetration testing courses.',
        meta_keywords: 'cybersecurity, ethical hacking, network security, penetration testing, security'
      },
      {
        name: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'Create beautiful and user-friendly interfaces with modern design tools and principles.',
        icon: 'fas fa-palette',
        color: '#8B5CF6',
        sort_order: 5,
        meta_title: 'UI/UX Design Courses - Figma, Adobe XD',
        meta_description: 'Learn UI/UX design with Figma, Adobe XD, and design thinking principles.',
        meta_keywords: 'ui design, ux design, figma, adobe xd, design thinking, user experience'
      },
      {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Master cloud platforms like AWS, Azure, and Google Cloud with hands-on projects.',
        icon: 'fas fa-cloud',
        color: '#06B6D4',
        sort_order: 6,
        meta_title: 'Cloud Computing Courses - AWS, Azure, GCP',
        meta_description: 'Learn cloud computing with AWS, Microsoft Azure, and Google Cloud Platform.',
        meta_keywords: 'cloud computing, aws, azure, google cloud, devops, infrastructure'
      },
      {
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Learn SEO, social media marketing, PPC, and digital advertising strategies.',
        icon: 'fas fa-bullhorn',
        color: '#EC4899',
        sort_order: 7,
        meta_title: 'Digital Marketing Courses - SEO, Social Media, PPC',
        meta_description: 'Master digital marketing with SEO, social media, PPC, and content marketing strategies.',
        meta_keywords: 'digital marketing, seo, social media marketing, ppc, content marketing'
      },
      {
        name: 'Programming Fundamentals',
        slug: 'programming-fundamentals',
        description: 'Learn programming basics with Python, Java, C++, and problem-solving skills.',
        icon: 'fas fa-code',
        color: '#84CC16',
        sort_order: 8,
        meta_title: 'Programming Fundamentals - Python, Java, C++',
        meta_description: 'Start your programming journey with fundamental concepts and multiple languages.',
        meta_keywords: 'programming, python, java, c++, fundamentals, coding basics'
      }
    ];

    for (const categoryData of categories) {
      const [category, created] = await CourseCategory.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData
      });
      
      if (created) {
        console.log(`✅ Created category: ${category.name}`);
      } else {
        console.log(`ℹ️  Category already exists: ${category.name}`);
      }
    }

    console.log('✅ Course categories added successfully!');
    
    // Update existing courses to use new category system
    console.log('🔄 Updating existing courses...');
    
    const webDevCategory = await CourseCategory.findOne({ where: { slug: 'web-development' } });
    const mobileDevCategory = await CourseCategory.findOne({ where: { slug: 'mobile-development' } });
    const dataScienceCategory = await CourseCategory.findOne({ where: { slug: 'data-science' } });
    const programmingCategory = await CourseCategory.findOne({ where: { slug: 'programming-fundamentals' } });
    
    if (webDevCategory) {
      await Course.update(
        { category_id: webDevCategory.id },
        { where: { category: 'web-development' } }
      );
      console.log('✅ Updated web development courses');
    }
    
    if (mobileDevCategory) {
      await Course.update(
        { category_id: mobileDevCategory.id },
        { where: { category: 'mobile-development' } }
      );
      console.log('✅ Updated mobile development courses');
    }
    
    if (dataScienceCategory) {
      await Course.update(
        { category_id: dataScienceCategory.id },
        { where: { category: 'data-science' } }
      );
      console.log('✅ Updated data science courses');
    }
    
    if (programmingCategory) {
      await Course.update(
        { category_id: programmingCategory.id },
        { where: { category: 'programming' } }
      );
      console.log('✅ Updated programming courses');
    }

    console.log('🎉 Course category system setup complete!');
    
  } catch (error) {
    console.error('❌ Error adding course categories:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  addCourseCategories()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = addCourseCategories;
