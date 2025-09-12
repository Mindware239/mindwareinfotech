const { sequelize } = require('../config/database');

async function addSeoFields() {
  try {
    console.log('Adding SEO fields to all tables...');

    // Add SEO fields to blogs table
    await sequelize.query(`
      ALTER TABLE blogs 
      ADD COLUMN meta_title VARCHAR(60) NULL,
      ADD COLUMN meta_description VARCHAR(160) NULL,
      ADD COLUMN meta_keywords VARCHAR(500) NULL,
      ADD COLUMN og_title VARCHAR(100) NULL,
      ADD COLUMN og_description VARCHAR(200) NULL,
      ADD COLUMN og_image JSON NULL,
      ADD COLUMN twitter_title VARCHAR(70) NULL,
      ADD COLUMN twitter_description VARCHAR(200) NULL,
      ADD COLUMN twitter_image JSON NULL,
      ADD COLUMN canonical_url VARCHAR(500) NULL,
      ADD COLUMN robots_meta VARCHAR(100) NULL DEFAULT 'index, follow',
      ADD COLUMN focus_keyword VARCHAR(100) NULL,
      ADD COLUMN seo_score INT NULL DEFAULT 0
    `);
    console.log('✅ Added SEO fields to blogs table');

    // Add SEO fields to gallery table
    await sequelize.query(`
      ALTER TABLE gallery 
      ADD COLUMN meta_title VARCHAR(60) NULL,
      ADD COLUMN meta_description VARCHAR(160) NULL,
      ADD COLUMN meta_keywords VARCHAR(500) NULL,
      ADD COLUMN og_title VARCHAR(100) NULL,
      ADD COLUMN og_description VARCHAR(200) NULL,
      ADD COLUMN og_image JSON NULL,
      ADD COLUMN twitter_title VARCHAR(70) NULL,
      ADD COLUMN twitter_description VARCHAR(200) NULL,
      ADD COLUMN twitter_image JSON NULL,
      ADD COLUMN canonical_url VARCHAR(500) NULL,
      ADD COLUMN robots_meta VARCHAR(100) NULL DEFAULT 'index, follow',
      ADD COLUMN focus_keyword VARCHAR(100) NULL,
      ADD COLUMN seo_score INT NULL DEFAULT 0
    `);
    console.log('✅ Added SEO fields to gallery table');

    // Add SEO fields to video_lectures table
    await sequelize.query(`
      ALTER TABLE video_lectures 
      ADD COLUMN meta_title VARCHAR(60) NULL,
      ADD COLUMN meta_description VARCHAR(160) NULL,
      ADD COLUMN meta_keywords VARCHAR(500) NULL,
      ADD COLUMN og_title VARCHAR(100) NULL,
      ADD COLUMN og_description VARCHAR(200) NULL,
      ADD COLUMN og_image JSON NULL,
      ADD COLUMN twitter_title VARCHAR(70) NULL,
      ADD COLUMN twitter_description VARCHAR(200) NULL,
      ADD COLUMN twitter_image JSON NULL,
      ADD COLUMN canonical_url VARCHAR(500) NULL,
      ADD COLUMN robots_meta VARCHAR(100) NULL DEFAULT 'index, follow',
      ADD COLUMN focus_keyword VARCHAR(100) NULL,
      ADD COLUMN seo_score INT NULL DEFAULT 0
    `);
    console.log('✅ Added SEO fields to video_lectures table');

    // Add SEO fields to courses table
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN meta_title VARCHAR(60) NULL,
      ADD COLUMN meta_description VARCHAR(160) NULL,
      ADD COLUMN meta_keywords VARCHAR(500) NULL,
      ADD COLUMN og_title VARCHAR(100) NULL,
      ADD COLUMN og_description VARCHAR(200) NULL,
      ADD COLUMN og_image JSON NULL,
      ADD COLUMN twitter_title VARCHAR(70) NULL,
      ADD COLUMN twitter_description VARCHAR(200) NULL,
      ADD COLUMN twitter_image JSON NULL,
      ADD COLUMN canonical_url VARCHAR(500) NULL,
      ADD COLUMN robots_meta VARCHAR(100) NULL DEFAULT 'index, follow',
      ADD COLUMN focus_keyword VARCHAR(100) NULL,
      ADD COLUMN seo_score INT NULL DEFAULT 0
    `);
    console.log('✅ Added SEO fields to courses table');

    // Add SEO fields to jobs table
    await sequelize.query(`
      ALTER TABLE jobs 
      ADD COLUMN meta_title VARCHAR(60) NULL,
      ADD COLUMN meta_description VARCHAR(160) NULL,
      ADD COLUMN meta_keywords VARCHAR(500) NULL,
      ADD COLUMN og_title VARCHAR(100) NULL,
      ADD COLUMN og_description VARCHAR(200) NULL,
      ADD COLUMN og_image JSON NULL,
      ADD COLUMN twitter_title VARCHAR(70) NULL,
      ADD COLUMN twitter_description VARCHAR(200) NULL,
      ADD COLUMN twitter_image JSON NULL,
      ADD COLUMN canonical_url VARCHAR(500) NULL,
      ADD COLUMN robots_meta VARCHAR(100) NULL DEFAULT 'index, follow',
      ADD COLUMN focus_keyword VARCHAR(100) NULL,
      ADD COLUMN seo_score INT NULL DEFAULT 0
    `);
    console.log('✅ Added SEO fields to jobs table');

    console.log('\n🎉 All SEO fields have been successfully added to all tables!');
    console.log('\nNext steps:');
    console.log('1. Update your admin forms to include SEO input fields');
    console.log('2. Update frontend components to display SEO metadata in head tags');
    console.log('3. Update API endpoints to handle SEO data');

  } catch (error) {
    console.error('❌ Error adding SEO fields:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the migration
addSeoFields();
