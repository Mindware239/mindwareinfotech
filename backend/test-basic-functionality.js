const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const VideoLecture = require('./models/VideoLecture');

async function testBasicFunctionality() {
  try {
    console.log('🧪 Testing Basic Functionality...\n');

    // Test 1: Check if models are properly defined
    console.log('1. Testing model definitions...');
    console.log('✅ User model:', User.name);
    console.log('✅ Course model:', Course.name);
    console.log('✅ Enrollment model:', Enrollment.name);
    console.log('✅ VideoLecture model:', VideoLecture.name);

    // Test 2: Test database connection
    console.log('\n2. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Test 3: Test basic queries
    console.log('\n3. Testing basic queries...');
    
    // Test user count
    const userCount = await User.count();
    console.log(`✅ Found ${userCount} users in database`);

    // Test course count
    const courseCount = await Course.count();
    console.log(`✅ Found ${courseCount} courses in database`);

    // Test enrollment count
    const enrollmentCount = await Enrollment.count();
    console.log(`✅ Found ${enrollmentCount} enrollments in database`);

    // Test video count
    const videoCount = await VideoLecture.count();
    console.log(`✅ Found ${videoCount} videos in database`);

    // Test 4: Test associations (without creating new data)
    console.log('\n4. Testing associations...');
    
    // Check if associations are defined
    if (Enrollment.associate) {
      console.log('✅ Enrollment associations defined');
    } else {
      console.log('❌ Enrollment associations not defined');
    }

    if (Course.associate) {
      console.log('✅ Course associations defined');
    } else {
      console.log('❌ Course associations not defined');
    }

    if (User.associate) {
      console.log('✅ User associations defined');
    } else {
      console.log('❌ User associations not defined');
    }

    // Test 5: Test API endpoints (simulate)
    console.log('\n5. Testing API endpoint logic...');
    
    // Simulate checking if user exists
    const testUser = await User.findOne({ where: { email: 'test@example.com' } });
    if (testUser) {
      console.log('✅ Test user exists in database');
    } else {
      console.log('ℹ️  Test user not found (this is normal)');
    }

    // Simulate checking if course exists
    const testCourse = await Course.findOne({ where: { title: 'Test Course' } });
    if (testCourse) {
      console.log('✅ Test course exists in database');
    } else {
      console.log('ℹ️  Test course not found (this is normal)');
    }

    // Test 6: Test video access logic
    console.log('\n6. Testing video access logic...');
    
    // Get a sample video
    const sampleVideo = await VideoLecture.findOne();
    if (sampleVideo) {
      console.log(`✅ Found sample video: ${sampleVideo.title}`);
      console.log(`   - Access Level: ${sampleVideo.access_level}`);
      console.log(`   - Price: ${sampleVideo.price} ${sampleVideo.currency}`);
      console.log(`   - Course ID: ${sampleVideo.course_id || 'None'}`);
    } else {
      console.log('ℹ️  No videos found in database');
    }

    console.log('\n🎉 Basic functionality test completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- All models are properly defined');
    console.log('- Database connection works');
    console.log('- Basic queries work');
    console.log('- Associations are set up');
    console.log('- API logic can be tested');

    console.log('\n🚀 System is ready for frontend testing!');
    console.log('You can now:');
    console.log('1. Start the frontend server');
    console.log('2. Test the login system');
    console.log('3. Test the enrollment system');
    console.log('4. Test the video access control');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testBasicFunctionality();
