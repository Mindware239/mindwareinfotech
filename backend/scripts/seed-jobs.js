const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const { sequelize } = require('../config/database');

const sampleJobs = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
    short_description: 'Join our team as a Senior Full Stack Developer and work on exciting projects using React, Node.js, and modern web technologies.',
    department: 'engineering',
    location: 'Delhi, India',
    type: 'full-time',
    experience_level: 'senior',
    salary_min: 800000,
    salary_max: 1200000,
    currency: 'INR',
    requirements: [
      '5+ years of experience in full-stack development',
      'Proficiency in React.js and Node.js',
      'Experience with databases (MySQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, Azure)',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance',
      'Flexible working hours',
      'Professional development opportunities',
      'Work from home options'
    ],
    skills: ['React.js', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'AWS'],
    status: 'active',
    is_featured: true,
    is_remote: true,
    created_by: 1
  },
  {
    title: 'UI/UX Designer',
    description: 'We are seeking a creative UI/UX Designer to create amazing user experiences for our digital products. You will work closely with our development team to bring designs to life.',
    short_description: 'Create beautiful and intuitive user interfaces for our web and mobile applications.',
    department: 'design',
    location: 'Mumbai, India',
    type: 'full-time',
    experience_level: 'mid',
    salary_min: 500000,
    salary_max: 800000,
    currency: 'INR',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma, Adobe Creative Suite',
      'Strong portfolio showcasing design skills',
      'Understanding of user-centered design principles',
      'Experience with responsive design'
    ],
    responsibilities: [
      'Create wireframes and prototypes',
      'Design user interfaces for web and mobile',
      'Conduct user research and testing',
      'Collaborate with developers and product managers',
      'Maintain design systems and style guides'
    ],
    benefits: [
      'Creative work environment',
      'Latest design tools and software',
      'Health insurance',
      'Annual design conference attendance',
      'Flexible working arrangements'
    ],
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'User Research'],
    status: 'active',
    is_featured: true,
    created_by: 1
  },
  {
    title: 'Digital Marketing Specialist',
    description: 'Join our marketing team as a Digital Marketing Specialist and help us grow our online presence. You will be responsible for developing and executing digital marketing campaigns.',
    short_description: 'Drive our digital marketing efforts and help grow our online presence through strategic campaigns.',
    department: 'marketing',
    location: 'Bangalore, India',
    type: 'full-time',
    experience_level: 'mid',
    salary_min: 400000,
    salary_max: 600000,
    currency: 'INR',
    requirements: [
      '2+ years of digital marketing experience',
      'Experience with Google Ads and Facebook Ads',
      'Knowledge of SEO and content marketing',
      'Analytics tools experience (Google Analytics)',
      'Strong communication skills'
    ],
    responsibilities: [
      'Develop and execute digital marketing campaigns',
      'Manage social media accounts',
      'Create and optimize ad campaigns',
      'Analyze campaign performance',
      'Collaborate with content creators'
    ],
    benefits: [
      'Performance-based bonuses',
      'Marketing tools and software access',
      'Health insurance',
      'Professional development budget',
      'Flexible working hours'
    ],
    skills: ['Google Ads', 'Facebook Ads', 'SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    status: 'active',
    created_by: 1
  },
  {
    title: 'DevOps Engineer',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. You will work on automation, deployment pipelines, and infrastructure management.',
    short_description: 'Build and maintain our cloud infrastructure with focus on automation and scalability.',
    department: 'engineering',
    location: 'Pune, India',
    type: 'full-time',
    experience_level: 'senior',
    salary_min: 700000,
    salary_max: 1000000,
    currency: 'INR',
    requirements: [
      '4+ years of DevOps experience',
      'Experience with AWS or Azure',
      'Knowledge of Docker and Kubernetes',
      'CI/CD pipeline experience',
      'Infrastructure as Code (Terraform)'
    ],
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure',
      'Automate deployment processes',
      'Monitor system performance',
      'Ensure system security and compliance'
    ],
    benefits: [
      'Competitive salary',
      'Cloud certification support',
      'Health insurance',
      'Remote work options',
      'Learning and development opportunities'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux'],
    status: 'active',
    is_remote: true,
    created_by: 1
  },
  {
    title: 'Business Development Manager',
    description: 'Join our business development team and help us expand our client base. You will be responsible for identifying new business opportunities and building relationships with potential clients.',
    short_description: 'Drive business growth by identifying new opportunities and building client relationships.',
    department: 'sales',
    location: 'Delhi, India',
    type: 'full-time',
    experience_level: 'senior',
    salary_min: 600000,
    salary_max: 900000,
    currency: 'INR',
    requirements: [
      '5+ years of business development experience',
      'Strong sales and negotiation skills',
      'Experience in IT services industry',
      'Excellent communication skills',
      'Proven track record of meeting targets'
    ],
    responsibilities: [
      'Identify new business opportunities',
      'Build and maintain client relationships',
      'Prepare proposals and presentations',
      'Negotiate contracts and deals',
      'Collaborate with technical teams'
    ],
    benefits: [
      'Commission-based incentives',
      'Travel opportunities',
      'Health insurance',
      'Professional development',
      'Flexible working arrangements'
    ],
    skills: ['Sales', 'Business Development', 'Client Relations', 'Negotiation', 'Presentation', 'CRM'],
    status: 'active',
    created_by: 1
  },
  {
    title: 'Frontend Developer Intern',
    description: 'We are offering an exciting internship opportunity for aspiring frontend developers. You will work on real projects and learn from experienced developers.',
    short_description: 'Learn frontend development while working on real projects with our experienced team.',
    department: 'engineering',
    location: 'Remote',
    type: 'internship',
    experience_level: 'entry',
    salary_min: 5000,
    salary_max: 10000,
    currency: 'INR',
    requirements: [
      'Basic knowledge of HTML, CSS, JavaScript',
      'Familiarity with React.js',
      'Strong learning attitude',
      'Good communication skills',
      'Portfolio of personal projects'
    ],
    responsibilities: [
      'Develop user interfaces using React',
      'Collaborate with senior developers',
      'Participate in code reviews',
      'Learn best practices',
      'Work on assigned projects'
    ],
    benefits: [
      'Mentorship from senior developers',
      'Real project experience',
      'Certificate of completion',
      'Potential job offer',
      'Flexible working hours'
    ],
    skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Git', 'Responsive Design'],
    status: 'active',
    is_remote: true,
    created_by: 1
  }
];

async function seedJobs() {
  try {
    console.log('Starting job seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    // Sync models to create tables
    await sequelize.sync({ force: false });
    console.log('Database tables synced');
    
    // Clear existing jobs
    await Job.destroy({ where: {} });
    console.log('Cleared existing jobs');
    
    // Create sample jobs
    for (const jobData of sampleJobs) {
      await Job.create(jobData);
      console.log(`Created job: ${jobData.title}`);
    }
    
    console.log('Job seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding jobs:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedJobs();
