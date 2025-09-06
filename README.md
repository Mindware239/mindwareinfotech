# Mindware India - React Application

A comprehensive web application for Mindware India, featuring a modern React frontend with an admin panel and a Node.js/Express backend with MySQL database integration.

## 🚀 Features

### Frontend (React)
- **Modern UI/UX** with responsive design
- **Admin Dashboard** for content management
- **Blog Management** system
- **Gallery** with image management
- **Internship** application system
- **Video Lectures** platform
- **Student Management** system
- **Payment Integration** ready
- **Certificate Generation** system
- **FAQ Management**
- **Testimonial System**

### Backend (Node.js/Express)
- **RESTful API** with Express.js
- **MySQL Database** with Sequelize ORM
- **JWT Authentication** system
- **Role-based Access Control**
- **File Upload** capabilities
- **Email Integration** ready
- **Payment Processing** endpoints
- **Certificate Generation** API

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **XAMPP** (for local development)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Mindware239/mindwareinfotech.git
cd mindwareinfotech
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Database Setup
1. Start XAMPP and ensure MySQL is running
2. Create a database named `mindwareindiadb`
3. Run the migration script:
```bash
node scripts/migrate.js
```

### 4. Environment Configuration
Create a `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mindwareindiadb
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

### 5. Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Option 1: Using Batch Files (Windows)
```bash
# Start both servers
start-servers.bat

# Or start admin panel only
start-admin.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 Access Points

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Base URL**: http://localhost:5000/api

## 👤 Default Admin Credentials

- **Email**: admin@mindwareindia.com
- **Password**: admin123

## 📁 Project Structure

```
mindwareinfotech/
├── backend/
│   ├── controllers/          # API controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Database configuration
│   ├── scripts/             # Database scripts
│   └── server.js            # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # React context
│   │   └── styles/          # CSS styles
│   └── public/              # Static assets
├── .gitignore
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Gallery
- `GET /api/gallery` - Get all gallery items
- `POST /api/gallery` - Upload image
- `DELETE /api/gallery/:id` - Delete image

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create internship
- `POST /api/internships/:id/apply` - Apply for internship

### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload video
- `GET /api/videos/:id` - Get specific video

## 🎨 Frontend Components

### Website Components
- **Header** - Navigation and branding
- **HeroBanner** - Main landing section
- **AboutSection** - Company information
- **ServiceCards** - Service offerings
- **BlogSection** - Latest blog posts
- **GallerySection** - Image gallery
- **VideoSection** - Video lectures
- **TestimonialSection** - Customer testimonials
- **Footer** - Contact and links

### Admin Components
- **Dashboard** - Overview and statistics
- **DataTable** - Reusable data table
- **FormModal** - Create/edit forms
- **Chart** - Data visualization
- **StatsCard** - Statistics display

## 🗄️ Database Schema

### Main Tables
- **users** - User accounts and authentication
- **blogs** - Blog posts and articles
- **gallery** - Image gallery items
- **internships** - Internship opportunities
- **videos** - Video lecture content
- **testimonials** - Customer testimonials
- **certificates** - Generated certificates
- **payments** - Payment records

## 🔐 Security Features

- **JWT Authentication** for secure API access
- **Password Hashing** using bcrypt
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **Role-based Access Control** for admin functions

## 🚀 Deployment

### Backend Deployment
1. Set up a production MySQL database
2. Update environment variables
3. Install PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "mindware-backend"
```

### Frontend Deployment
1. Build the production version:
```bash
cd frontend
npm run build
```
2. Deploy the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email info@mindwareindia.com or create an issue in this repository.

## 🔄 Version History

- **v1.0.0** - Initial release with complete admin panel and website
- **v1.0.1** - Fixed frontend rendering issues and backend server startup
- **v1.0.2** - Added proper error handling and data validation

---

**Made with ❤️ by Mindware India Team**
