const { sequelize } = require('./config/database');
const VideoLecture = require('./models/VideoLecture');
const VideoAccess = require('./models/VideoAccess');
const Payment = require('./models/Payment');
const User = require('./models/User');

async function testVideoSystem() {
  try {
    console.log('🧪 Testing Video System...\n');

    // Test 1: Find or create a test user
    console.log('1. Finding test user...');
    let testUser = await User.findOne({ where: { email: 'test@example.com' } });
    
    if (!testUser) {
      console.log('Creating new test user...');
      testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
        phone: '9876543210'
      });
      console.log('✅ Test user created:', testUser.email);
    } else {
      console.log('✅ Using existing test user:', testUser.email);
    }

    // Test 2: Create a free video
    console.log('\n2. Creating free video...');
    const freeVideo = await VideoLecture.create({
      title: 'Free React Tutorial',
      description: 'Learn React basics for free',
      video_url: 'https://example.com/free-video.mp4',
      duration: 1800, // 30 minutes
      course_id: 1,
      chapter: 'Introduction',
      order: 1,
      access_level: 'free',
      price: 0,
      currency: 'INR',
      status: 'published',
      created_by: 1
    });
    console.log('✅ Free video created:', freeVideo.title);

    // Test 3: Create a premium video
    console.log('\n3. Creating premium video...');
    const premiumVideo = await VideoLecture.create({
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and techniques',
      video_url: 'https://example.com/premium-video.mp4',
      duration: 3600, // 1 hour
      course_id: 1,
      chapter: 'Advanced Topics',
      order: 2,
      access_level: 'premium',
      price: 999,
      currency: 'INR',
      preview_duration: 60, // 1 minute preview
      status: 'published',
      created_by: 1
    });
    console.log('✅ Premium video created:', premiumVideo.title);

    // Test 4: Create a preview video
    console.log('\n4. Creating preview video...');
    const previewVideo = await VideoLecture.create({
      title: 'Node.js Backend Development',
      description: 'Learn Node.js backend development',
      video_url: 'https://example.com/preview-video.mp4',
      duration: 2700, // 45 minutes
      course_id: 1,
      chapter: 'Backend Development',
      order: 3,
      access_level: 'preview',
      price: 499,
      currency: 'INR',
      preview_duration: 120, // 2 minutes preview
      status: 'published',
      created_by: 1
    });
    console.log('✅ Preview video created:', previewVideo.title);

    // Test 5: Create a payment for premium video
    console.log('\n5. Creating payment for premium video...');
    const payment = await Payment.create({
      user_id: testUser.id,
      order_id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      amount: premiumVideo.price,
      currency: premiumVideo.currency,
      status: 'completed',
      items: [{
        type: 'video',
        id: premiumVideo.id,
        title: premiumVideo.title,
        price: premiumVideo.price
      }],
      metadata: {
        video_id: premiumVideo.id,
        video_title: premiumVideo.title
      }
    });
    console.log('✅ Payment created:', payment.order_id);

    // Test 6: Grant access to premium video
    console.log('\n6. Granting access to premium video...');
    const videoAccess = await VideoAccess.create({
      user_id: testUser.id,
      video_id: premiumVideo.id,
      access_type: 'premium',
      payment_id: payment.id,
      access_granted_at: new Date(),
      is_active: true
    });
    console.log('✅ Video access granted:', videoAccess.id);

    // Test 7: Test video access queries
    console.log('\n7. Testing video access queries...');
    
    // Check free video access
    const freeAccess = await VideoAccess.findOne({
      where: { user_id: testUser.id, video_id: freeVideo.id }
    });
    console.log('Free video access:', freeAccess ? 'Has access' : 'No access record (expected for free videos)');

    // Check premium video access
    const premiumAccess = await VideoAccess.findOne({
      where: { user_id: testUser.id, video_id: premiumVideo.id }
    });
    console.log('Premium video access:', premiumAccess ? 'Has access' : 'No access');

    // Check preview video access
    const previewAccess = await VideoAccess.findOne({
      where: { user_id: testUser.id, video_id: previewVideo.id }
    });
    console.log('Preview video access:', previewAccess ? 'Has access' : 'No access record (expected for preview videos)');

    // Test 8: Update video progress
    console.log('\n8. Testing video progress update...');
    if (premiumAccess) {
      await premiumAccess.updateProgress(300, 3600); // 5 minutes of 1 hour
      console.log('✅ Video progress updated:', premiumAccess.progress);
    }

    // Test 9: List all videos with access info
    console.log('\n9. Listing all videos...');
    const allVideos = await VideoLecture.findAll({
      where: { status: 'published' },
      order: [['order', 'ASC']]
    });

    for (const video of allVideos) {
      const access = await VideoAccess.findOne({
        where: { user_id: testUser.id, video_id: video.id }
      });
      
      console.log(`- ${video.title} (${video.access_level}) - ${video.price} ${video.currency}`);
      console.log(`  Access: ${access ? access.access_type : 'No access record'}`);
      console.log(`  Progress: ${access?.progress ? `${Math.round(access.progress.percentage)}%` : 'N/A'}`);
    }

    console.log('\n🎉 Video system test completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`- Created ${allVideos.length} videos`);
    console.log(`- Created 1 payment`);
    console.log(`- Created 1 video access record`);
    console.log(`- Tested progress tracking`);
    console.log(`- Tested access control`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

// Run test if called directly
if (require.main === module) {
  testVideoSystem()
    .then(() => {
      console.log('\n✅ All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Tests failed:', error);
      process.exit(1);
    });
}

module.exports = testVideoSystem;
