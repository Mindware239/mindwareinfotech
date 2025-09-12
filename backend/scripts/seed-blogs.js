const Blog = require('../models/Blog');
const User = require('../models/User');
const { sequelize } = require('../config/database');

const sampleBlogs = [
  {
    title: "Getting Started with React Development",
    slug: "getting-started-with-react-development",
    excerpt: "Learn the fundamentals of React development and build your first application with this comprehensive guide.",
    content: `
      <h2>Introduction to React</h2>
      <p>React is a powerful JavaScript library for building user interfaces, especially for single-page applications. It's maintained by Facebook and a community of individual developers and companies.</p>
      
      <h3>Why Choose React?</h3>
      <ul>
        <li><strong>Component-Based Architecture:</strong> Build encapsulated components that manage their own state, then compose them to make complex UIs.</li>
        <li><strong>Virtual DOM:</strong> React uses a virtual DOM to improve performance by minimizing direct manipulation of the browser's DOM.</li>
        <li><strong>Declarative:</strong> React makes it painless to create interactive UIs. Design simple views for each state in your application.</li>
        <li><strong>Learn Once, Write Anywhere:</strong> You can develop new features in React without rewriting existing code.</li>
      </ul>

      <h3>Setting Up Your Development Environment</h3>
      <p>To get started with React development, you'll need:</p>
      <ol>
        <li>Node.js and npm installed on your machine</li>
        <li>A code editor like VS Code</li>
        <li>Basic knowledge of HTML, CSS, and JavaScript</li>
      </ol>

      <h3>Creating Your First React App</h3>
      <p>You can create a new React application using Create React App:</p>
      <pre><code>npx create-react-app my-app
cd my-app
npm start</code></pre>

      <h3>Understanding Components</h3>
      <p>Components are the building blocks of React applications. They are like JavaScript functions that accept inputs (called props) and return React elements describing what should appear on the screen.</p>

      <h3>State Management</h3>
      <p>State is data that changes over time. In React, you can manage state using the useState hook for functional components or this.state for class components.</p>

      <h3>Conclusion</h3>
      <p>React is an excellent choice for building modern web applications. Its component-based architecture, virtual DOM, and extensive ecosystem make it a powerful tool for developers. Start with the basics, practice building small projects, and gradually work your way up to more complex applications.</p>
    `,
    category: "programming",
    tags: ["react", "javascript", "frontend", "web-development"],
    featured_image: {
      url: "/images/blog/react-intro.jpg",
      alt: "React Development Guide"
    },
    status: "published",
    is_featured: true,
    is_published: true,
    published_at: new Date(),
    reading_time: 8,
    views: 0,
    likes: 0,
    author_id: 1
  },
  {
    title: "The Future of Web Development: Trends to Watch in 2024",
    slug: "future-of-web-development-trends-2024",
    excerpt: "Explore the latest trends and technologies shaping the future of web development in 2024 and beyond.",
    content: `
      <h2>Introduction</h2>
      <p>The web development landscape is constantly evolving, with new technologies and frameworks emerging regularly. As we move through 2024, several key trends are shaping the future of web development.</p>

      <h3>1. Artificial Intelligence Integration</h3>
      <p>AI is becoming increasingly integrated into web development workflows. From code generation tools like GitHub Copilot to AI-powered design systems, developers are leveraging AI to enhance productivity and create more intelligent applications.</p>

      <h3>2. WebAssembly (WASM) Adoption</h3>
      <p>WebAssembly continues to gain traction, allowing developers to run high-performance code written in languages like C, C++, and Rust directly in the browser. This opens up new possibilities for web applications that require intensive computations.</p>

      <h3>3. Progressive Web Apps (PWAs)</h3>
      <p>PWAs are becoming the standard for mobile-first web applications, offering native app-like experiences with offline capabilities, push notifications, and app-like interfaces.</p>

      <h3>4. Edge Computing</h3>
      <p>Edge computing is revolutionizing how we think about web performance, bringing computation closer to users and reducing latency for global applications.</p>

      <h3>5. Micro-Frontends</h3>
      <p>The micro-frontend architecture is gaining popularity as teams look for ways to scale frontend development across multiple teams and technologies.</p>

      <h3>Conclusion</h3>
      <p>Staying current with these trends is essential for web developers who want to remain competitive and build cutting-edge applications. The future of web development is exciting, with new opportunities emerging regularly.</p>
    `,
    category: "technology",
    tags: ["web-development", "trends", "future", "technology"],
    featured_image: {
      url: "/images/blog/web-dev-trends.jpg",
      alt: "Web Development Trends 2024"
    },
    status: "published",
    is_featured: true,
    is_published: true,
    published_at: new Date(),
    reading_time: 6,
    views: 0,
    likes: 0,
    author_id: 1
  },
  {
    title: "Building a Successful Career in Software Development",
    slug: "building-successful-career-software-development",
    excerpt: "Essential tips and strategies for building a successful career in software development, from entry-level to senior positions.",
    content: `
      <h2>Starting Your Journey</h2>
      <p>Building a successful career in software development requires a combination of technical skills, soft skills, and strategic career planning. Here's how to get started and advance in your career.</p>

      <h3>1. Master the Fundamentals</h3>
      <p>Before diving into frameworks and libraries, ensure you have a solid understanding of:</p>
      <ul>
        <li>Programming fundamentals (variables, loops, functions, data structures)</li>
        <li>At least one programming language in depth</li>
        <li>Version control systems (Git)</li>
        <li>Basic database concepts</li>
        <li>Web technologies (HTML, CSS, JavaScript)</li>
      </ul>

      <h3>2. Choose Your Specialization</h3>
      <p>Software development offers various specializations:</p>
      <ul>
        <li><strong>Frontend Development:</strong> Focus on user interfaces and user experience</li>
        <li><strong>Backend Development:</strong> Work with servers, databases, and APIs</li>
        <li><strong>Full-Stack Development:</strong> Handle both frontend and backend</li>
        <li><strong>Mobile Development:</strong> Create applications for iOS and Android</li>
        <li><strong>DevOps:</strong> Focus on deployment, monitoring, and infrastructure</li>
      </ul>

      <h3>3. Build a Strong Portfolio</h3>
      <p>Your portfolio is your calling card. Include:</p>
      <ul>
        <li>Personal projects that demonstrate your skills</li>
        <li>Open source contributions</li>
        <li>Code samples on GitHub</li>
        <li>Technical blog posts or tutorials</li>
      </ul>

      <h3>4. Continuous Learning</h3>
      <p>The tech industry evolves rapidly. Stay current by:</p>
      <ul>
        <li>Following industry blogs and newsletters</li>
        <li>Attending conferences and meetups</li>
        <li>Taking online courses and certifications</li>
        <li>Experimenting with new technologies</li>
      </ul>

      <h3>5. Networking and Mentorship</h3>
      <p>Building professional relationships is crucial:</p>
      <ul>
        <li>Join developer communities and forums</li>
        <li>Attend local meetups and conferences</li>
        <li>Find mentors in your field</li>
        <li>Contribute to open source projects</li>
      </ul>

      <h3>Conclusion</h3>
      <p>A successful career in software development is built on continuous learning, practical experience, and strong professional relationships. Start with the fundamentals, choose your specialization, and never stop learning.</p>
    `,
    category: "career",
    tags: ["career", "software-development", "programming", "professional-development"],
    featured_image: {
      url: "/images/blog/career-guide.jpg",
      alt: "Software Development Career Guide"
    },
    status: "published",
    is_featured: false,
    is_published: true,
    published_at: new Date(),
    reading_time: 10,
    views: 0,
    likes: 0,
    author_id: 1
  }
];

async function seedBlogs() {
  try {
    console.log('🌱 Starting blog seeding...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing blogs
    await Blog.destroy({ where: {} });
    console.log('✅ Existing blogs cleared');
    
    // Create sample blogs
    for (const blogData of sampleBlogs) {
      await Blog.create(blogData);
      console.log(`✅ Created blog: ${blogData.title}`);
    }
    
    console.log('🎉 Blog seeding completed successfully!');
    console.log(`📝 Created ${sampleBlogs.length} blog posts`);
    
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeding function
seedBlogs();
