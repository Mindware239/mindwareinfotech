const VideoLecture = require('../models/VideoLecture');
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

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new video lecture
// @route   POST /api/videos
// @access  Private/Admin/Instructor
const createVideo = async (req, res, next) => {
  try {
    const videoData = {
      ...req.body,
      created_by: req.user.id
    };

    const video = await VideoLecture.create(videoData);

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
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

// @desc    Upload video
// @route   POST /api/videos/upload
// @access  Private/Admin/Instructor
const uploadVideo = async (req, res, next) => {
  try {
    // This would typically handle file upload
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      message: 'Video upload functionality not implemented yet'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get video progress
// @route   GET /api/videos/:id/progress
// @access  Private/Student
const getVideoProgress = async (req, res, next) => {
  try {
    // This would typically track student progress
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        video_id: req.params.id,
        progress: 0,
        completed: false
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
  getVideoProgress
};
