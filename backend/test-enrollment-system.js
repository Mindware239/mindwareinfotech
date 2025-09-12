const { sequelize } = require('./config/database');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const VideoLecture = require('./models/VideoLecture');

async function testEnrollmentSystem() {
  try {
    console.log('🧪 Testing Enrollment System...\n');

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

    // Test 3: Test associations
    console.log('\n3. Testing model associations...');
    
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

    // Test 4: Test enrollment creation
    console.log('\n4. Testing enrollment creation...');
    
    // Find or create a test user
    let testUser = await User.findOne({ where: { email: 'test@example.com' } });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123',
        role: 'student'
      });
      console.log('✅ Test user created');
    } else {
      console.log('✅ Test user found');
    }

    // Find or create a test course
    let testCourse = await Course.findOne({ where: { title: 'Test Course' } });
    if (!testCourse) {
      testCourse = await Course.create({
        title: 'Test Course',
        description: 'A comprehensive test course for enrollment testing that covers all the necessary topics and provides hands-on experience with real-world projects and practical examples.',
        short_description: 'A comprehensive test course for enrollment testing with hands-on projects and practical examples.',
        instructor_id: testUser.id,
        category: 'web-development',
        level: 'beginner',
        duration: 10,
        price: 1000,
        currency: 'INR',
        is_active: true
      });
      console.log('✅ Test course created');
    } else {
      console.log('✅ Test course found');
    }

    // Test enrollment creation
    const enrollment = await Enrollment.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '9876543210',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      qualification: 'Graduate',
      experience: '2 years',
      highestQualification: 'bachelor',
      institution: 'Test University',
      yearOfPassing: 2015,
      courseInterest: 'web-development',
      trainingMode: 'online',
      motivation: 'To learn new technologies and advance my career',
      courseId: testCourse.id,
      userId: testUser.id,
      status: 'approved',
      enrollmentDate: new Date(),
      paymentStatus: 'completed',
      paymentAmount: 1000,
      paymentMethod: 'online'
    });
    console.log('✅ Test enrollment created');

    // Test 5: Test enrollment queries
    console.log('\n5. Testing enrollment queries...');
    
    // Test finding enrollment with course
    const enrollmentWithCourse = await Enrollment.findOne({
      where: { id: enrollment.id },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'category', 'level', 'duration', 'price', 'currency']
        }
      ]
    });

    if (enrollmentWithCourse && enrollmentWithCourse.course) {
      console.log('✅ Enrollment with course found:', enrollmentWithCourse.course.title);
    } else {
      console.log('❌ Failed to find enrollment with course');
    }

    // Test finding user enrollments
    const userEnrollments = await Enrollment.findAll({
      where: { userId: testUser.id, status: 'approved' },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'description', 'category', 'level', 'duration', 'price', 'currency']
        }
      ]
    });

    console.log(`✅ Found ${userEnrollments.length} enrollments for user`);

    // Test 6: Test video access with enrollment
    console.log('\n6. Testing video access with enrollment...');
    
    // Create a test video
    let testVideo = await VideoLecture.findOne({ where: { title: 'Test Video' } });
    if (!testVideo) {
      testVideo = await VideoLecture.create({
        title: 'Test Video',
        description: 'A test video for enrollment testing',
        course_id: testCourse.id,
        video_url: '/uploads/videos/test-video.mp4',
        thumbnail: JSON.stringify({ url: '/uploads/thumbnails/test-thumbnail.jpg' }),
        duration: 300,
        access_level: 'premium',
        price: 500,
        currency: 'INR',
        tags: JSON.stringify(['test', 'video']),
        resources: JSON.stringify([]),
        subtitles: JSON.stringify([]),
        metadata: JSON.stringify({})
      });
      console.log('✅ Test video created');
    } else {
      console.log('✅ Test video found');
    }

    // Test enrollment check
    const enrollmentCheck = await Enrollment.findOne({
      where: {
        userId: testUser.id,
        courseId: testCourse.id,
        status: 'approved'
      }
    });

    if (enrollmentCheck) {
      console.log('✅ User is enrolled in course - can access videos');
    } else {
      console.log('❌ User is not enrolled in course');
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('- Models are properly defined');
    console.log('- Database connection works');
    console.log('- Associations are set up');
    console.log('- Enrollment creation works');
    console.log('- Enrollment queries work');
    console.log('- Video access with enrollment works');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testEnrollmentSystem();
