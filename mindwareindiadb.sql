-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 06, 2025 at 08:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mindwareindiadb`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `banner_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) NOT NULL,
  `button_text` varchar(100) DEFAULT NULL,
  `button_url` varchar(500) DEFAULT NULL,
  `banner_type` enum('hero','about','service','testimonial','contact') NOT NULL DEFAULT 'hero',
  `banner_position` int(11) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` varchar(500) NOT NULL,
  `content` text NOT NULL,
  `author_id` int(11) NOT NULL,
  `category` enum('technology','programming','career','internship','tutorial','news','company-updates','student-success','industry-insights') NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `featured_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`featured_image`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `is_published` tinyint(1) DEFAULT 0,
  `published_at` datetime DEFAULT NULL,
  `reading_time` int(11) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `comments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`comments`)),
  `seo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`seo`)),
  `social_shares` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`social_shares`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `author_id`, `category`, `tags`, `featured_image`, `images`, `status`, `is_featured`, `is_published`, `published_at`, `reading_time`, `views`, `likes`, `comments`, `seo`, `social_shares`, `created_at`, `updated_at`) VALUES
(1, 'Getting Started with React Development', 'getting-started-with-react-development', 'Learn the fundamentals of React and build your first application', 'React is a powerful JavaScript library for building user interfaces...', 1, 'programming', '[\"react\",\"javascript\",\"frontend\",\"tutorial\"]', '{}', '[]', 'published', 1, 0, '2025-09-05 11:33:50', 5, 150, 25, '[]', '{}', '{}', '2025-09-05 11:33:50', '2025-09-05 11:33:50'),
(2, 'Career Tips for Computer Science Students', 'career-tips-for-computer-science-students', 'Essential advice for CS students to build a successful career', 'As a computer science student, you have numerous opportunities...', 1, 'career', '[\"career\",\"computer-science\",\"advice\",\"students\"]', '{}', '[]', 'published', 0, 0, '2025-09-05 11:33:50', 8, 89, 12, '[]', '{}', '{}', '2025-09-05 11:33:50', '2025-09-05 11:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `certificate_id` varchar(50) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `course_name` varchar(200) NOT NULL,
  `completion_date` datetime NOT NULL,
  `grade` enum('A+','A','B+','B','C+','C','D','F') NOT NULL,
  `score` int(11) DEFAULT NULL,
  `certificate_url` varchar(500) NOT NULL,
  `verification_code` varchar(50) NOT NULL,
  `status` enum('generated','issued','verified','revoked') DEFAULT 'generated',
  `issued_by` int(11) NOT NULL,
  `issued_at` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `short_description` varchar(300) NOT NULL,
  `instructor_id` int(11) NOT NULL,
  `category` enum('web-development','mobile-development','data-science','ai-ml','design','programming','database','devops','cybersecurity','other') NOT NULL,
  `level` enum('beginner','intermediate','advanced','expert') NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'Duration in hours',
  `price` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `is_free` tinyint(1) DEFAULT 0,
  `thumbnail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`thumbnail`)),
  `banner` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`banner`)),
  `videos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`videos`)),
  `chapters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`chapters`)),
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `learning_outcomes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`learning_outcomes`)),
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `language` varchar(50) DEFAULT 'English',
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `rating` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rating`)),
  `students` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`students`)),
  `views` int(11) DEFAULT 0,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `certificate` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certificate`)),
  `seo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`seo`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `category` enum('events','training','workshops','team-building','awards','office','students','projects','conferences','other') NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `event_date` datetime DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `status` enum('draft','active','archived') DEFAULT 'active',
  `is_featured` tinyint(1) DEFAULT 0,
  `is_public` tinyint(1) DEFAULT 1,
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `title`, `description`, `images`, `category`, `subcategory`, `tags`, `event_date`, `location`, `status`, `is_featured`, `is_public`, `views`, `likes`, `created_by`, `metadata`, `created_at`, `updated_at`) VALUES
(1, 'Web Development Workshop', 'Students learning React and Node.js in our workshop', '[{\"url\":\"/images/gallery/workshop-1.jpg\",\"alt\":\"Workshop session\",\"isPrimary\":true}]', 'workshops', NULL, '[]', '2025-09-05 11:33:50', 'Mindware India Office', 'active', 1, 1, 0, 0, 1, '{}', '2025-09-05 11:33:50', '2025-09-05 11:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `internships`
--

CREATE TABLE `internships` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `short_description` varchar(300) NOT NULL,
  `company` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `type` enum('remote','onsite','hybrid') NOT NULL,
  `duration` int(11) NOT NULL,
  `duration_unit` enum('weeks','months') DEFAULT 'months',
  `stipend_amount` decimal(10,2) DEFAULT 0.00,
  `stipend_currency` varchar(3) DEFAULT 'INR',
  `stipend_type` enum('fixed','performance-based','unpaid') DEFAULT 'fixed',
  `requirements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`requirements`)),
  `responsibilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`responsibilities`)),
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  `application_deadline` datetime NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `max_applications` int(11) DEFAULT 50,
  `current_applications` int(11) DEFAULT 0,
  `status` enum('draft','active','paused','closed','completed') DEFAULT 'draft',
  `is_featured` tinyint(1) DEFAULT 0,
  `category` enum('web-development','mobile-development','data-science','ai-ml','design','marketing','business','other') NOT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `contact_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contact_info`)),
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `internships`
--

INSERT INTO `internships` (`id`, `title`, `description`, `short_description`, `company`, `location`, `type`, `duration`, `duration_unit`, `stipend_amount`, `stipend_currency`, `stipend_type`, `requirements`, `responsibilities`, `benefits`, `application_deadline`, `start_date`, `end_date`, `max_applications`, `current_applications`, `status`, `is_featured`, `category`, `tags`, `images`, `contact_info`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Web Development Internship', 'Learn full-stack web development with React and Node.js', 'Hands-on experience in modern web technologies', 'Mindware India', 'Remote', 'remote', 3, 'months', 5000.00, 'INR', 'fixed', '{\"skills\":[\"HTML\",\"CSS\",\"JavaScript\",\"React\"],\"education\":\"B.Tech/B.E\",\"experience\":\"0-1 years\"}', '[\"Develop responsive web applications\",\"Work with React and Node.js\",\"Collaborate with team members\"]', '[\"Certificate of completion\",\"Letter of recommendation\",\"Stipend\"]', '2025-10-05 11:33:50', '2025-09-12 11:33:50', '2025-12-14 11:33:50', 20, 0, 'active', 0, 'web-development', '[\"react\",\"nodejs\",\"javascript\",\"web-development\"]', '[]', '{}', 1, '2025-09-05 11:33:50', '2025-09-05 11:33:50'),
(2, 'Data Science Internship', 'Work on real-world data science projects using Python and ML', 'Gain practical experience in data analysis and machine learning', 'Mindware India', 'Hybrid', 'hybrid', 6, 'months', 8000.00, 'INR', 'performance-based', '{\"skills\":[\"Python\",\"Pandas\",\"NumPy\",\"Scikit-learn\"],\"education\":\"B.Tech/B.E/MCA\",\"experience\":\"0-2 years\"}', '[\"Analyze large datasets\",\"Build machine learning models\",\"Create data visualizations\"]', '[\"Certificate of completion\",\"Industry exposure\",\"Performance-based stipend\"]', '2025-10-20 11:33:50', '2025-09-19 11:33:50', '2026-03-24 11:33:50', 15, 0, 'active', 0, 'data-science', '[\"python\",\"machine-learning\",\"data-analysis\",\"pandas\"]', '[]', '{}', 1, '2025-09-05 11:33:50', '2025-09-05 11:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `razorpay_order_id` varchar(100) DEFAULT NULL,
  `razorpay_payment_id` varchar(100) DEFAULT NULL,
  `razorpay_signature` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `status` enum('pending','completed','failed','cancelled','refunded') DEFAULT 'pending',
  `payment_method` enum('razorpay','card','netbanking','upi','wallet') DEFAULT 'razorpay',
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`items`)),
  `billing_address` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`billing_address`)),
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_details`)),
  `refund` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`refund`)),
  `notes` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `applications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applications`)),
  `enrolled_courses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`enrolled_courses`)),
  `profile_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profile_data`)),
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `is_active` tinyint(1) DEFAULT 1,
  `last_activity` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `user_id`, `student_id`, `applications`, `enrolled_courses`, `profile_data`, `achievements`, `is_active`, `last_activity`, `created_at`, `updated_at`) VALUES
(1, 2, 'STU000002', '[]', '[]', '{\"college\":\"Sample College\",\"year\":\"3rd Year\",\"branch\":\"Computer Science\"}', '[]', 1, NULL, '2025-09-05 11:33:50', '2025-09-05 11:33:50'),
(2, 3, 'STU000003', '[]', '[]', '{\"college\":\"Sample College\",\"year\":\"3rd Year\",\"branch\":\"Computer Science\"}', '[]', 1, NULL, '2025-09-05 11:33:50', '2025-09-05 11:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `testimonials`
--

CREATE TABLE `testimonials` (
  `testimonial_id` int(11) NOT NULL,
  `client_name` varchar(255) NOT NULL,
  `client_designation` varchar(255) DEFAULT NULL,
  `client_company` varchar(255) DEFAULT NULL,
  `course` varchar(100) DEFAULT NULL,
  `testimonial_text` text NOT NULL,
  `client_image` varchar(255) DEFAULT NULL,
  `success_metrics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'JSON object containing projects, duration, outcome' CHECK (json_valid(`success_metrics`)),
  `testimonial_rating` int(11) DEFAULT 5,
  `testimonial_status` enum('0','1') DEFAULT '1' COMMENT '0 = inactive, 1 = active',
  `testimonial_order` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `role` enum('student','admin','instructor') DEFAULT 'student',
  `avatar` varchar(500) DEFAULT '',
  `is_active` tinyint(1) DEFAULT 1,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `profile_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profile_data`)),
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `role`, `avatar`, `is_active`, `is_email_verified`, `email_verification_token`, `password_reset_token`, `password_reset_expires`, `last_login`, `profile_data`, `preferences`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@mindwareindia.com', '$2a$12$TMZo6CcbkILfhfbRXAYqm.NKzp3anWakIe84xQ6dX.JdJOcLFSbbG', '9876543210', 'admin', '', 1, 1, NULL, NULL, NULL, '2025-09-06 06:12:01', '{}', '{}', '2025-09-05 11:33:50', '2025-09-06 06:12:01'),
(2, 'John Doe', 'john@example.com', 'password123', '9876543211', 'student', '', 1, 1, NULL, NULL, NULL, NULL, '{}', '{}', '2025-09-05 11:33:50', '2025-09-05 11:33:50'),
(3, 'Jane Smith', 'jane@example.com', 'password123', '9876543212', 'student', '', 1, 1, NULL, NULL, NULL, NULL, '{}', '{}', '2025-09-05 11:33:50', '2025-09-05 11:33:50');

-- --------------------------------------------------------

--
-- Table structure for table `video_lectures`
--

CREATE TABLE `video_lectures` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `video_url` varchar(500) NOT NULL,
  `thumbnail` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`thumbnail`)),
  `duration` int(11) NOT NULL COMMENT 'Duration in seconds',
  `course_id` int(11) NOT NULL,
  `chapter` varchar(100) NOT NULL,
  `order` int(11) NOT NULL,
  `is_free` tinyint(1) DEFAULT 0,
  `is_preview` tinyint(1) DEFAULT 0,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `resources` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`resources`)),
  `transcript` text DEFAULT NULL,
  `subtitles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`subtitles`)),
  `views` int(11) DEFAULT 0,
  `likes` int(11) DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`banner_id`),
  ADD KEY `banners_banner_type` (`banner_type`),
  ADD KEY `banners_is_active` (`is_active`),
  ADD KEY `banners_banner_position` (`banner_position`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `slug_2` (`slug`),
  ADD UNIQUE KEY `slug_3` (`slug`),
  ADD UNIQUE KEY `slug_4` (`slug`),
  ADD UNIQUE KEY `slug_5` (`slug`),
  ADD UNIQUE KEY `slug_6` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_id` (`certificate_id`),
  ADD UNIQUE KEY `verification_code` (`verification_code`),
  ADD UNIQUE KEY `certificate_id_2` (`certificate_id`),
  ADD UNIQUE KEY `verification_code_2` (`verification_code`),
  ADD UNIQUE KEY `certificate_id_3` (`certificate_id`),
  ADD UNIQUE KEY `verification_code_3` (`verification_code`),
  ADD UNIQUE KEY `certificate_id_4` (`certificate_id`),
  ADD UNIQUE KEY `verification_code_4` (`verification_code`),
  ADD UNIQUE KEY `certificate_id_5` (`certificate_id`),
  ADD UNIQUE KEY `verification_code_5` (`verification_code`),
  ADD UNIQUE KEY `certificate_id_6` (`certificate_id`),
  ADD UNIQUE KEY `verification_code_6` (`verification_code`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `issued_by` (`issued_by`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instructor_id` (`instructor_id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `internships`
--
ALTER TABLE `internships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD UNIQUE KEY `order_id_2` (`order_id`),
  ADD UNIQUE KEY `order_id_3` (`order_id`),
  ADD UNIQUE KEY `order_id_4` (`order_id`),
  ADD UNIQUE KEY `order_id_5` (`order_id`),
  ADD UNIQUE KEY `order_id_6` (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `student_id` (`student_id`),
  ADD UNIQUE KEY `student_id_2` (`student_id`),
  ADD UNIQUE KEY `student_id_3` (`student_id`),
  ADD UNIQUE KEY `student_id_4` (`student_id`),
  ADD UNIQUE KEY `student_id_5` (`student_id`),
  ADD UNIQUE KEY `student_id_6` (`student_id`);

--
-- Indexes for table `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`testimonial_id`),
  ADD KEY `testimonials_testimonial_status` (`testimonial_status`),
  ADD KEY `testimonials_testimonial_order` (`testimonial_order`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`);

--
-- Indexes for table `video_lectures`
--
ALTER TABLE `video_lectures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `created_by` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `banner_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `certificates`
--
ALTER TABLE `certificates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `internships`
--
ALTER TABLE `internships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `testimonial_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `video_lectures`
--
ALTER TABLE `video_lectures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `banners`
--
ALTER TABLE `banners`
  ADD CONSTRAINT `banners_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `certificates`
--
ALTER TABLE `certificates`
  ADD CONSTRAINT `certificates_ibfk_16` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `certificates_ibfk_17` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `certificates_ibfk_18` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `gallery`
--
ALTER TABLE `gallery`
  ADD CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `internships`
--
ALTER TABLE `internships`
  ADD CONSTRAINT `internships_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `video_lectures`
--
ALTER TABLE `video_lectures`
  ADD CONSTRAINT `video_lectures_ibfk_11` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `video_lectures_ibfk_12` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
