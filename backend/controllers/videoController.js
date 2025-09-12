const VideoLecture = require('../models/VideoLecture');
const VideoAccess = require('../models/VideoAccess');
const Payment = require('../models/Payment');
const Enrollment = require('../models/Enrollment');
const { Op } = require('sequelize');

// @desc    Get all video lectures
// @route   GET /api/videos
// @access  Public
const getVideos = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    const { count, rows: videos } = await VideoLecture.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Ensure JSON fields are properly parsed
    const processedVideos = videos.map(video => {
      const videoData = video.toJSON();
      // Parse JSON fields if they are strings
      ['tags', 'resources', 'subtitles', 'thumbnail', 'metadata'].forEach(field => {
        if (typeof videoData[field] === 'string') {
          try {
            videoData[field] = JSON.parse(videoData[field]);
          } catch (e) {
            videoData[field] = field === 'metadata' ? {} : [];
          }
        }
      });
      return videoData;
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: processedVideos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video lecture
// @route   GET /api/videos/:id
// @access  Public
const getVideo = async (req, res, next) => {
  try {
    const video = await VideoLecture.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    // Check user access if authenticated
    let userAccess = null;
    let isEnrolled = false;
    
    if (req.user) {
      // Check if user has purchased individual video access
      userAccess = await VideoAccess.findOne({
        where: {
          user_id: req.user.id,
          video_id: video.id,
          is_active: true
        }
      });

      // Check if user is enrolled in the course
      if (video.course_id) {
        const enrollment = await Enrollment.findOne({
          where: {
            userId: req.user.id,
            courseId: video.course_id,
            status: 'approved'
          }
        });
        isEnrolled = !!enrollment;
      }
    }

    // Ensure JSON fields are properly parsed
    const videoData = video.toJSON();
    ['tags', 'resources', 'subtitles', 'thumbnail', 'metadata'].forEach(field => {
      if (typeof videoData[field] === 'string') {
        try {
          videoData[field] = JSON.parse(videoData[field]);
        } catch (e) {
          videoData[field] = field === 'metadata' ? {} : [];
        }
      }
    });

    // Determine access level for response
    const hasVideoAccess = userAccess || video.access_level === 'free' || isEnrolled;
    
    const response = {
      success: true,
      data: {
        ...videoData,
        user_access: userAccess ? {
          access_type: userAccess.access_type,
          has_access: true,
          progress: userAccess.progress,
          watch_count: userAccess.watch_count,
          completed: userAccess.completed
        } : {
          access_type: video.access_level,
          has_access: hasVideoAccess,
          progress: null,
          watch_count: 0,
          completed: false
        },
        enrollment: {
          is_enrolled: isEnrolled,
          course_id: video.course_id
        }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new video lecture
// @route   POST /api/videos
// @access  Private/Admin/Instructor
const createVideo = async (req, res, next) => {
  try {
    const {
      title,
      description,
      video_url,
      video_file,
      thumbnail,
      duration,
      course_id,
      chapter,
      order,
      is_free = false,
      is_preview = false,
      status = 'draft',
      tags = [],
      resources = [],
      transcript,
      subtitles = []
    } = req.body;

    // Validation
    if (!title || !course_id || !chapter || !order) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, course_id, chapter, and order are required'
      });
    }

    // Check if course exists
    const Course = require('../models/Course');
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Determine video URL (from upload or external URL)
    let finalVideoUrl = video_url;
    if (video_file && !video_url) {
      // Handle uploaded file - this would be processed by multer
      finalVideoUrl = `/uploads/videos/${video_file}`;
    }

    if (!finalVideoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Either video_url or video_file is required'
      });
    }

    const videoData = {
      title,
      description,
      video_url: finalVideoUrl,
      thumbnail: thumbnail || {},
      duration: duration || 0,
      course_id: parseInt(course_id),
      chapter,
      order: parseInt(order),
      is_free,
      is_preview,
      status,
      tags,
      resources,
      transcript,
      subtitles,
      created_by: req.user.id
    };

    const video = await VideoLecture.create(videoData);

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error creating video:', error);
    next(error);
  }
};

// @desc    Update video lecture
// @route   PUT /api/videos/:id
// @access  Private/Admin/Instructor
const updateVideo = async (req, res, next) => {
  try {
    const video = await VideoLecture.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    await video.update(req.body);

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video lecture
// @route   DELETE /api/videos/:id
// @access  Private/Admin
const deleteVideo = async (req, res, next) => {
  try {
    const video = await VideoLecture.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    await video.destroy();

    res.status(200).json({
      success: true,
      message: 'Video lecture deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get videos by category
// @route   GET /api/videos/category/:category
// @access  Public
const getVideosByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: videos } = await VideoLecture.findAndCountAll({
      where: { category },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get videos by course
// @route   GET /api/videos/course/:courseId
// @access  Public
const getVideosByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: videos } = await VideoLecture.findAndCountAll({
      where: { course_id: courseId },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload video file
// @route   POST /api/videos/upload
// @access  Private/Admin/Instructor
const uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file uploaded'
      });
    }

    const { filename, path, size, mimetype } = req.file;
    
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!allowedTypes.includes(mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only MP4, AVI, MOV, WMV, and WebM files are allowed'
      });
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 500MB'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        filename,
        path,
        size,
        mimetype,
        url: `/uploads/videos/${filename}`
      }
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    next(error);
  }
};


// @desc    Check video access
// @route   GET /api/videos/:id/access
// @access  Private
const checkVideoAccess = async (req, res, next) => {
  try {
    const video = await VideoLecture.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    const userAccess = await VideoAccess.findOne({
      where: {
        user_id: req.user.id,
        video_id: video.id,
        is_active: true
      }
    });

    const hasAccess = userAccess || video.access_level === 'free';
    const accessType = userAccess ? userAccess.access_type : video.access_level;

    res.status(200).json({
      success: true,
      data: {
        has_access: hasAccess,
        access_type: accessType,
        video_price: video.price,
        currency: video.currency,
        preview_duration: video.preview_duration,
        user_progress: userAccess ? userAccess.progress : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Grant video access after payment
// @route   POST /api/videos/:id/grant-access
// @access  Private
const grantVideoAccess = async (req, res, next) => {
  try {
    const { payment_id, access_type = 'premium' } = req.body;
    const videoId = req.params.id;

    const video = await VideoLecture.findByPk(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    // Check if payment exists and is completed
    if (payment_id) {
      const payment = await Payment.findByPk(payment_id);
      if (!payment || payment.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or incomplete payment'
        });
      }
    }

    // Create or update video access
    const [videoAccess, created] = await VideoAccess.findOrCreate({
      where: {
        user_id: req.user.id,
        video_id: videoId
      },
      defaults: {
        access_type,
        payment_id,
        access_granted_at: new Date(),
        is_active: true
      }
    });

    if (!created) {
      await videoAccess.grantAccess(access_type, payment_id);
    }

    res.status(200).json({
      success: true,
      message: 'Video access granted successfully',
      data: videoAccess
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video progress
// @route   POST /api/videos/:id/progress
// @access  Private
const updateVideoProgress = async (req, res, next) => {
  try {
    const { current_time, total_time } = req.body;
    const videoId = req.params.id;

    const videoAccess = await VideoAccess.findOne({
      where: {
        user_id: req.user.id,
        video_id: videoId,
        is_active: true
      }
    });

    if (!videoAccess) {
      return res.status(403).json({
        success: false,
        message: 'No access to this video'
      });
    }

    await videoAccess.updateProgress(current_time, total_time);

    res.status(200).json({
      success: true,
      data: videoAccess.progress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's video progress
// @route   GET /api/videos/:id/progress
// @access  Private
const getVideoProgress = async (req, res, next) => {
  try {
    const videoAccess = await VideoAccess.findOne({
      where: {
        user_id: req.user.id,
        video_id: req.params.id,
        is_active: true
      }
    });

    if (!videoAccess) {
      return res.status(404).json({
        success: false,
        message: 'No access to this video'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        progress: videoAccess.progress,
        watch_count: videoAccess.watch_count,
        completed: videoAccess.completed,
        last_watched_at: videoAccess.last_watched_at
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create payment for video access
// @route   POST /api/videos/:id/purchase
// @access  Private
const purchaseVideoAccess = async (req, res, next) => {
  try {
    const video = await VideoLecture.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video lecture not found'
      });
    }

    if (video.access_level === 'free') {
      return res.status(400).json({
        success: false,
        message: 'This video is free to access'
      });
    }

    // Check if user already has access
    const existingAccess = await VideoAccess.findOne({
      where: {
        user_id: req.user.id,
        video_id: video.id,
        is_active: true
      }
    });

    if (existingAccess) {
      return res.status(400).json({
        success: false,
        message: 'You already have access to this video'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      user_id: req.user.id,
      amount: video.price,
      currency: video.currency,
      status: 'pending',
      items: [{
        type: 'video',
        id: video.id,
        title: video.title,
        price: video.price
      }],
      metadata: {
        video_id: video.id,
        video_title: video.title
      }
    });

    res.status(201).json({
      success: true,
      data: {
        payment_id: payment.id,
        order_id: payment.order_id,
        amount: payment.amount,
        currency: payment.currency,
        video: {
          id: video.id,
          title: video.title,
          price: video.price
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideosByCategory,
  getVideosByCourse,
  uploadVideo,
  getVideoProgress,
  checkVideoAccess,
  grantVideoAccess,
  updateVideoProgress,
  purchaseVideoAccess
};
