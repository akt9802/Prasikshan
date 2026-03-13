# 🎯 Prasikshan - SSB Preparation Platform

A comprehensive web application for Services Selection Board (SSB) test preparation, designed to help Indian Armed Forces aspirants practice and excel in their selection process.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

## 🌟 Features

### 📚 Complete Test Modules
- **OIR (Officer Intelligence Rating)** - Logical and analytical reasoning
- **PPDT (Picture Perception & Discussion)** - Visual perception and storytelling
- **TAT (Thematic Apperception Test)** - Psychological assessment through images
- **WAT (Word Association Test)** - Subconscious thinking patterns
- **SRT (Situation Reaction Test)** - Decision-making scenarios
- **Lecturette** - Public speaking and presentation skills
- **PI (Personal Interview)** - Comprehensive interview preparation

### 🔐 Authentication & Security
- JWT-based authentication with email verification
- OTP-based password recovery
- Server-side route protection with middleware
- Secure password hashing with bcrypt
- Protected API endpoints

### 📊 Analytics & Progress Tracking
- Detailed performance analytics with interactive charts
- Score trends and improvement tracking
- Test completion statistics
- Percentile rankings and leaderboards
- Monthly activity monitoring

### 👥 Community Features
- Real-time ranking system
- Community leaderboards with tier system (Bronze/Silver/Gold)
- User profiles with achievement tracking
- Streak counters and engagement metrics

### 🛠 Admin Panel
- Content management system for all test types
- Question upload and management
- User analytics and monitoring
- Test result tracking

## 🚀 Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Interactive data visualization
- **React Icons** - Comprehensive icon library

### Backend
- **Next.js API Routes** - Serverless backend
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication tokens
- **Nodemailer** - Email service integration
- **Bcrypt** - Password hashing

### DevOps & Deployment
- **Docker** - Containerized deployment
- **Nginx** - Reverse proxy and load balancing
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

- Node.js 20+ 
- MongoDB Atlas account or local MongoDB instance
- SMTP service (Brevo/SendGrid) for email functionality
- Docker & Docker Compose (for deployment)

## 🛠 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/prasikshan.git
cd prasikshan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Service Configuration (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login_email
SMTP_PASS=your_brevo_smtp_key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Prasikshan Platform

# Optional: Node Environment
NODE_ENV=development
```

### 4. Database Setup
The application will automatically create the required collections and indexes when you first run it. Make sure your MongoDB connection string is correct.

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🐳 Docker Deployment

### Quick Start with Docker
```bash
# Build the image
docker build -t prasikshan .

# Run the container
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  prasikshan
```

### Production Deployment with Nginx

1. **Build and run the Docker container:**
```bash
docker build -t prasikshan .
docker run -d --name prasikshan-app -p 3000:3000 --env-file .env prasikshan
```

2. **Configure Nginx:**
```bash
sudo cp prasikshan.nginx.conf /etc/nginx/sites-available/prasikshan
sudo ln -s /etc/nginx/sites-available/prasikshan /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

3. **Setup SSL with Certbot:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📁 Project Structure

```
prasikshan/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── questions/            # Test question APIs
│   │   └── ranking/              # Leaderboard API
│   ├── alltest/                  # Test selection page
│   ├── admin/                    # Admin panel
│   ├── signin/                   # Authentication pages
│   ├── userdetails/              # User profile & analytics
│   └── layout.tsx                # Root layout
├── components/                   # Reusable React components
│   ├── charts/                   # Analytics charts
│   ├── footer/                   # Footer component
│   └── header/                   # Navigation headers
├── lib/                          # Utility libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── db.ts                     # Database connection
│   └── mailer.ts                 # Email service
├── models/                       # MongoDB schemas
│   └── User.ts                   # User model
├── middleware.ts                 # Route protection
├── Dockerfile                    # Docker configuration
├── prasikshan.nginx.conf         # Nginx configuration
└── package.json                  # Dependencies
```

## 🔧 Configuration

### Email Service Setup
The platform uses SMTP for sending verification emails and password reset OTPs. Configure your preferred email service:

**Brevo (Recommended):**
1. Sign up at [Brevo](https://www.brevo.com/)
2. Get your SMTP credentials from the dashboard
3. Add them to your `.env` file

**Alternative Services:**
- SendGrid
- Gmail SMTP
- AWS SES
- Any SMTP-compatible service

### Database Configuration
**MongoDB Atlas (Recommended):**
1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist your IP address
4. Get the connection string

**Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/prasikshan
```

## 🎮 Usage

### For Students
1. **Sign Up:** Create an account with email verification
2. **Take Tests:** Access all 7 SSB test modules
3. **Track Progress:** Monitor your performance with detailed analytics
4. **Compare Rankings:** See how you rank against other users
5. **Improve:** Use insights to focus on weak areas

### For Administrators
1. **Access Admin Panel:** Navigate to `/admin`
2. **Manage Content:** Upload questions for all test types
3. **Monitor Users:** Track user engagement and performance
4. **Analytics:** View platform-wide statistics

## 🔒 Security Features

- **JWT Authentication:** Secure token-based authentication
- **Password Hashing:** Bcrypt with salt rounds
- **Route Protection:** Server-side middleware protection
- **Input Validation:** Comprehensive data validation
- **Rate Limiting:** API endpoint protection
- **CORS Configuration:** Cross-origin request security
- **Environment Variables:** Sensitive data protection

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Test Endpoints
- `GET /api/questions/fivequestions` - Get 5 random questions
- `GET /api/questions/tenquestions` - Get 10 random questions
- `POST /api/[testtype]questions/result` - Submit test results

### User Endpoints
- `GET /api/auth/userdetails` - Get user profile
- `GET /api/ranking` - Get leaderboard data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Indian Armed Forces for inspiration
- SSB coaching institutes for test format insights
- Open source community for amazing tools and libraries

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/prasikshan/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/prasikshan/discussions)
- **Email:** support@yourdomain.com

## 🗺 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced AI-powered feedback
- [ ] Video interview simulation
- [ ] Group discussion modules
- [ ] Offline test capability
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with coaching institutes

---

<div align="center">

**Built with ❤️ for SSB Aspirants**

[Live Demo](https://yourdomain.com) • [Documentation](./docs) • [Report Bug](https://github.com/yourusername/prasikshan/issues)

</div>