const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Compression middleware for better performance
const compressionMiddleware = compression({
  level: 6, // Compression level (1-9, 6 is good balance)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Rate limiting to prevent abuse
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests',
      message: message || 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 auth requests per windowMs
  'Too many authentication attempts, please try again later.'
);

const apiRateLimit = createRateLimit(
  1 * 60 * 1000, // 1 minute
  60, // limit each IP to 60 API requests per minute
  'API rate limit exceeded, please slow down your requests.'
);

// Database query optimization middleware
const optimizeQueries = (req, res, next) => {
  // Add query optimization headers
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Cache-Control': 'public, max-age=300', // 5 minutes cache for static content
  });
  
  next();
};

// Memory usage monitoring
const memoryMonitor = (req, res, next) => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };
  
  // Log memory usage if it's getting high
  if (memUsageMB.heapUsed > 200) { // More than 200MB
    console.warn(`⚠️ High memory usage: ${memUsageMB.heapUsed}MB heap used`);
  }
  
  res.set('X-Memory-Usage', `${memUsageMB.heapUsed}MB`);
  next();
};

module.exports = {
  compressionMiddleware,
  generalRateLimit,
  authRateLimit,
  apiRateLimit,
  optimizeQueries,
  memoryMonitor
};

