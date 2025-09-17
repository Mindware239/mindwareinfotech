const { Blog } = require('../models');
const fs = require('fs');
const path = require('path');

async function assignBlogImages() {
  try {
    console.log('Connecting to database...');
    
    // Get all blogs
    const blogs = await Blog.findAll();
    console.log(`Found ${blogs.length} blogs`);
    
    // Get available blog images
    const blogImagesDir = path.join(__dirname, '../uploads/blogs');
    const imageFiles = fs.readdirSync(blogImagesDir).filter(file => 
      file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    );
    
    console.log(`Found ${imageFiles.length} blog images`);
    
    // Assign images to blogs that don't have them
    let updatedCount = 0;
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const imageIndex = i % imageFiles.length;
      const imageFilename = imageFiles[imageIndex];
      
      // Update blog with image
      await blog.update({
        featured_image: `/uploads/blogs/${imageFilename}`,
        status: 'published',
        is_featured: true
      });
      
      updatedCount++;
      console.log(`Updated blog ${blog.id}: ${blog.title} with image: ${imageFilename}`);
    }
    
    console.log(`\nUpdated ${updatedCount} blogs with images and published status`);
    
    // Verify the results
    const publishedBlogs = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'status', 'is_featured', 'featured_image']
    });
    
    console.log(`\nPublished blogs (${publishedBlogs.length}):`);
    publishedBlogs.forEach(blog => {
      console.log(`- ${blog.title} - Image: ${blog.featured_image}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignBlogImages();
