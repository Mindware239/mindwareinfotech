import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import videoService from '../../services/videoService';
import paymentService from '../../services/paymentService';
import { useNotification } from '../../context/NotificationContext';
import './VideoPlayer.css';

const VideoPlayer = ({ 
  video, 
  onVideoEnd, 
  onProgress, 
  autoPlay = false, 
  showControls = true,
  className = '' 
}) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [userAccess, setUserAccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);

  // Check user access when video changes
  useEffect(() => {
    if (video && user) {
      checkVideoAccess();
    }
  }, [video, user]);

  // Update progress in backend
  useEffect(() => {
    if (userAccess && userAccess.has_access && currentTime > 0) {
      updateVideoProgress();
    }
  }, [currentTime, userAccess]);

  // Handle click outside settings panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  const checkVideoAccess = async () => {
    try {
      setIsLoading(true);
      const response = await videoService.checkVideoAccess(video.id);
      setUserAccess(response.data);
      
      // Check enrollment status if video has course_id
      if (video.course_id && user) {
        try {
          const enrollmentResponse = await videoService.checkEnrollment(video.course_id);
          setEnrollmentStatus(enrollmentResponse.data);
        } catch (error) {
          console.error('Error checking enrollment:', error);
        }
      }
    } catch (error) {
      console.error('Error checking video access:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateVideoProgress = async () => {
    try {
      await videoService.updateVideoProgress(video.id, {
        current_time: currentTime,
        total_time: duration
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      showError('Please login to purchase this video');
      return;
    }

    try {
      setIsProcessingPayment(true);
      console.log('Starting purchase process for video:', video.id);
      
      // Create payment order
      console.log('Creating payment order...');
      const paymentResponse = await videoService.purchaseVideoAccess(video.id);
      console.log('Payment response:', paymentResponse);
      const paymentData = paymentResponse.data;
      
      // Process payment (mock implementation)
      console.log('Processing payment...');
      const paymentResult = await paymentService.processRazorpayPayment({
        order_id: paymentData.order_id,
        amount: paymentData.amount,
        currency: paymentData.currency
      });
      console.log('Payment result:', paymentResult);
      
      if (paymentResult.success) {
        // Grant access after successful payment
        console.log('Granting video access...');
        await videoService.grantVideoAccess(video.id, {
          payment_id: paymentData.payment_id,
          access_type: 'premium'
        });
        
        showSuccess('Payment successful! You now have access to this video.');
        setShowPurchaseModal(false);
        checkVideoAccess(); // Refresh access status
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error purchasing video:', error);
      console.error('Error details:', error.message, error.response?.data);
      showError(`Failed to purchase video: ${error.message || 'Please try again.'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const canPlayVideo = () => {
    if (!video) return false;
    if (video.access_level === 'free') return true;
    if (!user) return false;
    if (userAccess && userAccess.has_access) return true;
    if (enrollmentStatus && enrollmentStatus.isEnrolled) return true;
    return false;
  };

  const getPreviewDuration = () => {
    if (video.access_level === 'free') return duration;
    if (userAccess && userAccess.has_access) return duration;
    return video.preview_duration || 30; // 30 seconds preview by default
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      const current = videoElement.currentTime;
      const total = videoElement.duration;
      const previewDuration = getPreviewDuration();
      
      setCurrentTime(current);
      setProgress((current / total) * 100);
      
      // Stop video if user reaches preview limit
      if (video.access_level !== 'free' && !canPlayVideo() && current >= previewDuration) {
        videoElement.pause();
        setShowPurchaseModal(true);
      }
      
      if (onProgress) {
        onProgress({
          currentTime: current,
          duration: total,
          progress: (current / total) * 100
        });
      }
    };

    const handlePlay = () => {
      if (!canPlayVideo() && video.access_level !== 'free') {
        videoElement.pause();
        setShowPurchaseModal(true);
        return;
      }
      setIsPlaying(true);
    };
    
    const handlePause = () => setIsPlaying(false);
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onVideoEnd) onVideoEnd();
    };

    const handleVolumeChange = () => {
      setVolume(videoElement.volume);
      setIsMuted(videoElement.muted);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('volumechange', handleVolumeChange);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onProgress, onVideoEnd, userAccess, video]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const handleSeek = (e) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    videoElement.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newVolume = parseFloat(e.target.value);
    videoElement.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    setIsMuted(videoElement.muted);
  };

  const changePlaybackRate = (rate) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!isFullscreen) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
      } else if (videoElement.webkitRequestFullscreen) {
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        videoElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!video) {
    return (
      <div className={`video-player ${className}`}>
        <div className="video-placeholder">
          <i className="fas fa-video"></i>
          <p>No video selected</p>
        </div>
      </div>
    );
  }

  const isPremiumVideo = video.access_level === 'premium';
  const hasAccess = canPlayVideo();
  const previewDuration = getPreviewDuration();

  // Debug video URL
  console.log('Video URL:', video.video_url);
  console.log('Video object:', video);

  return (
    <div className={`video-player ${className}`}>
      <div className="video-container">
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.thumbnail?.url}
          className="video-element"
          autoPlay={autoPlay && hasAccess}
          preload="metadata"
          onError={(e) => {
            console.error('Video error:', e);
            showError('Failed to load video. Please check if the video file exists.');
          }}
          onLoadStart={() => {
            console.log('Video loading started');
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
        />
        
        {/* Premium Video Overlay */}
        {isPremiumVideo && !hasAccess && (
          <div className="premium-overlay">
            <div className="premium-content">
              <div className="premium-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3>Premium Content</h3>
              {enrollmentStatus && !enrollmentStatus.isEnrolled && video.course_id ? (
                <div>
                  <p>This video is part of a course. You need to enroll in the course to access this content.</p>
                  <div className="enrollment-info">
                    <i className="fas fa-graduation-cap"></i>
                    <span>Course enrollment required</span>
                  </div>
                  <div className="enrollment-actions">
                    <a 
                      href={`/enroll/${video.course_id}`}
                      className="btn btn-enroll"
                    >
                      <i className="fas fa-graduation-cap"></i>
                      Enroll in Course
                    </a>
                  </div>
                </div>
              ) : (
                <p>This video requires purchase to access</p>
              )}
              <div className="premium-price">
                <span className="price">₹{video.price}</span>
                <span className="currency">{video.currency}</span>
              </div>
              <button 
                className="purchase-btn"
                onClick={() => setShowPurchaseModal(true)}
                disabled={!user}
              >
                {user ? 'Purchase Now' : 'Login to Purchase'}
              </button>
            </div>
          </div>
        )}

        {/* Preview Overlay */}
        {isPremiumVideo && !hasAccess && currentTime >= previewDuration && (
          <div className="preview-overlay">
            <div className="preview-content">
              <h3>Preview Ended</h3>
              <p>You've watched {formatTime(previewDuration)} of preview</p>
              <button 
                className="purchase-btn"
                onClick={() => setShowPurchaseModal(true)}
              >
                Purchase Full Video
              </button>
            </div>
          </div>
        )}
        
        {showControls && (
          <div className="video-controls">
            {/* Progress Bar */}
            <div className="progress-container" onClick={handleSeek}>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
                <div 
                  className="progress-handle" 
                  style={{ left: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="controls-row">
              <div className="controls-left">
                <button 
                  className="control-btn play-btn"
                  onClick={togglePlay}
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>

                <div className="time-display">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="volume-control">
                  <button 
                    className="control-btn volume-btn"
                    onClick={toggleMute}
                  >
                    <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'}`}></i>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              </div>

              <div className="controls-right">
                <div className="settings-dropdown" ref={settingsRef}>
                  <button 
                    className="control-btn settings-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSettings(!showSettings);
                    }}
                  >
                    <i className="fas fa-cog"></i>
                  </button>
                  
                  {showSettings && (
                    <div 
                      className="settings-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="settings-item">
                        <label>Playback Speed</label>
                        <select 
                          value={playbackRate} 
                          onChange={(e) => {
                            e.stopPropagation();
                            changePlaybackRate(parseFloat(e.target.value));
                          }}
                        >
                          <option value={0.5}>0.5x</option>
                          <option value={0.75}>0.75x</option>
                          <option value={1}>1x</option>
                          <option value={1.25}>1.25x</option>
                          <option value={1.5}>1.5x</option>
                          <option value={2}>2x</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  className="control-btn fullscreen-btn"
                  onClick={toggleFullscreen}
                >
                  <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
        
        <div className="video-meta">
          <span className="meta-item">
            <i className="fas fa-clock"></i>
            {formatTime(duration)}
          </span>
          <span className="meta-item">
            <i className="fas fa-eye"></i>
            {video.views || 0} views
          </span>
          {video.chapter && (
            <span className="meta-item">
              <i className="fas fa-book"></i>
              {video.chapter}
            </span>
          )}
          {video.is_free && (
            <span className="meta-badge free">Free</span>
          )}
          {video.is_preview && (
            <span className="meta-badge preview">Preview</span>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && (
        <div className="purchase-modal-overlay">
          <div className="purchase-modal">
            <div className="modal-header">
              <h3>Purchase Video Access</h3>
              <button 
                className="close-btn"
                onClick={() => setShowPurchaseModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="video-preview">
                <img 
                  src={video.thumbnail?.url} 
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <p className="video-description">{video.description}</p>
                  <div className="video-duration">
                    <i className="fas fa-clock"></i>
                    {formatTime(duration)}
                  </div>
                </div>
              </div>
              
              <div className="pricing-section">
                <div className="price-display">
                  <span className="price">₹{video.price}</span>
                  <span className="currency">{video.currency}</span>
                </div>
                <p className="price-description">
                  One-time payment for lifetime access
                </p>
              </div>
              
              <div className="features-list">
                <h4>What you'll get:</h4>
                <ul>
                  <li><i className="fas fa-check"></i> Full video access</li>
                  <li><i className="fas fa-check"></i> Download resources</li>
                  <li><i className="fas fa-check"></i> Progress tracking</li>
                  <li><i className="fas fa-check"></i> Certificate of completion</li>
                </ul>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPurchaseModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary purchase-btn"
                onClick={handlePurchase}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Processing...' : `Pay ₹${video.price}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;