const { Blog } = require('../models');

async function fixBlogStatus() {
  try {
    console.log('Connecting to database...');
    
    // Update all blogs to published status
    const result = await Blog.update(
      { status: 'published' },
      { where: {} }
    );
    
    console.log(`Updated ${result[0]} blogs to published status`);
    
    // Get all blogs to verify
    const blogs = await Blog.findAll({
      attributes: ['id', 'title', 'status', 'is_featured', 'featured_image']
    });
    
    console.log(`\nFound ${blogs.length} blogs:`);
    blogs.forEach(blog => {
      console.log(`- ${blog.title} (ID: ${blog.id}) - Status: ${blog.status} - Featured: ${blog.is_featured} - Image: ${blog.featured_image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixBlogStatus();
