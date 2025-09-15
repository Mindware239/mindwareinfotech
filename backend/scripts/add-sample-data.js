// Simple script to add sample training programs via API calls

const API_BASE = 'http://localhost:5000/api';

const samplePrograms = [
  {
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description: 'Master full-stack web development from scratch. Learn HTML5, CSS3, JavaScript, React, Node.js, and MongoDB to build modern web applications.',
    short_description: 'Learn full-stack web development with hands-on projects and real-world applications.',
    category: 'web-development',
    subcategory: 'full-stack',
    level: 'beginner',
    duration: '6 months',
    duration_hours: 480,
    price: 25000,
    original_price: 35000,
    discount_percentage: 29,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    learning_outcomes: [
      'Build responsive websites using HTML5 and CSS3',
      'Create interactive web applications with JavaScript',
      'Develop modern React applications with hooks and context',
      'Build RESTful APIs with Node.js and Express'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Willingness to learn and practice regularly'
    ],
    curriculum: [
      {
        title: 'Frontend Fundamentals',
        duration: '8 weeks',
        topics: ['HTML5 semantic elements', 'CSS3 styling', 'JavaScript ES6+', 'Responsive design']
      }
    ],
    instructor: {
      name: 'Rajesh Kumar',
      title: 'Senior Full-Stack Developer',
      bio: '10+ years of experience in web development',
      rating: 4.9,
      students: 2500,
      courses: 15
    },
    start_date: new Date('2024-02-01'),
    end_date: new Date('2024-08-01'),
    location: 'Online + Delhi',
    max_students: 50,
    enrolled_students: 35,
    rating: 4.8,
    total_reviews: 120,
    tags: ['web-development', 'react', 'nodejs', 'mongodb', 'full-stack'],
    meta_title: 'Complete Web Development Bootcamp - Learn Full-Stack Development',
    meta_description: 'Master full-stack web development with our comprehensive bootcamp.',
    created_by: 1
  },
  {
    title: 'Advanced React & Redux Mastery',
    slug: 'advanced-react-redux-mastery',
    description: 'Deep dive into advanced React concepts, Redux state management, performance optimization, and modern React patterns.',
    short_description: 'Master advanced React concepts and Redux for building scalable applications.',
    category: 'web-development',
    subcategory: 'frontend',
    level: 'intermediate',
    duration: '3 months',
    duration_hours: 180,
    price: 15000,
    original_price: 20000,
    discount_percentage: 25,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['React', 'Redux', 'TypeScript', 'Testing', 'Performance'],
    learning_outcomes: [
      'Master advanced React patterns and hooks',
      'Implement complex state management with Redux',
      'Optimize React application performance',
      'Write comprehensive tests for React apps'
    ],
    prerequisites: [
      'Basic knowledge of JavaScript and React',
      'Understanding of ES6+ features',
      'Experience with HTML and CSS'
    ],
    instructor: {
      name: 'Priya Sharma',
      title: 'React Expert & Tech Lead',
      bio: '8+ years specializing in React ecosystem',
      rating: 4.9,
      students: 1800,
      courses: 12
    },
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-06-01'),
    location: 'Online',
    max_students: 30,
    enrolled_students: 22,
    rating: 4.7,
    total_reviews: 85,
    tags: ['react', 'redux', 'typescript', 'testing'],
    meta_title: 'Advanced React & Redux Mastery Course',
    meta_description: 'Master advanced React concepts and Redux state management.',
    created_by: 1
  },
  {
    title: 'Free HTML & CSS Basics',
    slug: 'free-html-css-basics',
    description: 'Learn the fundamentals of web development with HTML5 and CSS3. Perfect for beginners who want to start their web development journey.',
    short_description: 'Start your web development journey with HTML5 and CSS3 fundamentals.',
    category: 'web-development',
    subcategory: 'frontend',
    level: 'beginner',
    duration: '1 month',
    duration_hours: 40,
    price: 0,
    currency: 'INR',
    is_free: true,
    is_featured: false,
    status: 'published',
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
    learning_outcomes: [
      'Create semantic HTML5 structure',
      'Style websites with CSS3',
      'Build responsive layouts',
      'Use Flexbox and Grid systems'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Access to a text editor'
    ],
    instructor: {
      name: 'Anita Singh',
      title: 'Frontend Development Instructor',
      bio: '5+ years teaching web development fundamentals',
      rating: 4.7,
      students: 5000,
      courses: 8
    },
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-12-31'),
    location: 'Online',
    max_students: 1000,
    enrolled_students: 450,
    rating: 4.5,
    total_reviews: 200,
    tags: ['html', 'css', 'beginner', 'free'],
    meta_title: 'Free HTML & CSS Basics Course',
    meta_description: 'Learn HTML5 and CSS3 fundamentals for free.',
    created_by: 1
  }
];

async function addSampleData() {
  try {
    console.log('🌱 Adding sample training programs...');
    
    for (const program of samplePrograms) {
      try {
        const response = await fetch(`${API_BASE}/training-programs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(program)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Added: ${program.title}`);
        } else {
          const error = await response.text();
          console.log(`❌ Failed to add ${program.title}: ${error}`);
        }
      } catch (error) {
        console.log(`❌ Error adding ${program.title}:`, error.message);
      }
    }
    
    console.log('🎉 Sample data addition completed!');
    
    // Test the API
    console.log('\n📊 Testing API...');
    const response = await fetch(`${API_BASE}/training-programs`);
    const data = await response.json();
    console.log(`Found ${data.count} training programs in database`);
    
  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
  }
}

// Run the function
addSampleData();
