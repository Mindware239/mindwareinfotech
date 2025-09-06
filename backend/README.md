# Mindware India Backend API

A comprehensive backend API for the Mindware India React application built with Node.js, Express.js, and MySQL.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Database**: MySQL with Sequelize ORM
- **Security**: Helmet, CORS, rate limiting, input validation
- **File Upload**: Cloudinary integration for images and videos
- **Payment Processing**: Razorpay integration for payments
- **Email Service**: Nodemailer for email notifications
- **API Documentation**: Comprehensive API endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mindwareindia-react/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=mindwareindia
   DB_USER=root
   DB_PASSWORD=your_password
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```

4. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE mindwareindia;
   EXIT;
   
   # Initialize database with sample data
   npm run init-db
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📊 Database Schema

### Tables
- **users**: User accounts and profiles
- **students**: Student-specific information
- **internships**: Internship postings and details
- **blogs**: Blog posts and articles
- **gallery**: Image gallery and media
- **courses**: Course information and content
- **video_lectures**: Video content for courses
- **payments**: Payment transactions
- **certificates**: Student certificates

### Relationships
- Users → Students (1:1)
- Users → Blogs (1:Many)
- Users → Internships (1:Many)
- Courses → Video Lectures (1:Many)
- Students → Certificates (1:Many)

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)

### Internships
- `GET /api/internships` - Get all internships
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create internship (Admin)
- `PUT /api/internships/:id` - Update internship (Admin)
- `DELETE /api/internships/:id` - Delete internship (Admin)
- `POST /api/internships/:id/apply` - Apply for internship

### Gallery
- `GET /api/gallery` - Get gallery items
- `GET /api/gallery/:id` - Get gallery item by ID
- `POST /api/gallery` - Create gallery item (Admin)
- `PUT /api/gallery/:id` - Update gallery item (Admin)
- `DELETE /api/gallery/:id` - Delete gallery item (Admin)

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Get payment history
- `POST /api/payments/refund` - Process refund (Admin)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get analytics data

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive input validation
- **CORS Protection**: Configured CORS policies
- **Helmet**: Security headers
- **SQL Injection Protection**: Sequelize ORM protection

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── blogController.js    # Blog management
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Error handling
├── models/
│   ├── User.js             # User model
│   ├── Blog.js             # Blog model
│   └── ...                 # Other models
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── blogs.js            # Blog routes
│   └── ...                 # Other routes
├── scripts/
│   └── init-db.js          # Database initialization
├── server.js               # Main server file
└── package.json            # Dependencies
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server
npm run init-db    # Initialize database
npm test           # Run tests
```

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | MySQL host | localhost |
| `DB_PORT` | MySQL port | 3306 |
| `DB_NAME` | Database name | mindwareindia |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration | 7d |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |
| `RAZORPAY_KEY_ID` | Razorpay key ID | - |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mindwareindia.com or create an issue in the repository.