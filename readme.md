# 🎯 Prasikshan - Elite SSB Preparation Platform

**The ultimate digital training ground for Indian Armed Forces aspirants - master every SSB test with AI-powered analytics and community-driven excellence.**

Transform your SSB preparation journey with comprehensive test modules, real-time performance tracking, and competitive rankings that mirror the actual selection process.

## Features

### Complete SSB Test Suite

| Test Module | Purpose | Skills Tested | Format |
|-------------|---------|---------------|---------|
| **OIR** | Officer Intelligence Rating | Logical reasoning, analytical thinking | Multiple choice questions |
| **PPDT** | Picture Perception & Discussion | Visual perception, storytelling, leadership | Image analysis + group discussion |
| **TAT** | Thematic Apperception Test | Psychological assessment, creativity | Story writing from images |
| **WAT** | Word Association Test | Subconscious thinking patterns | Quick word responses |
| **SRT** | Situation Reaction Test | Decision-making, problem-solving | Scenario-based responses |
| **Lecturette** | Public Speaking | Communication, confidence, knowledge | Timed presentations |
| **PI** | Personal Interview | Personality assessment, leadership | Comprehensive Q&A preparation |

### 🎯 Core Platform Features

<div align="center">

| **Authentication** | **Analytics** | **Community** | **Admin Panel** |
|:---:|:---:|:---:|:---:|
| JWT Dual-Token (Access + Refresh) | Performance Charts | Real-time Rankings | Content Management |
| HTTP-Only Secure Cookies | Progress Tracking | Tier System (🥉🥈🥇) | User Analytics |
| Axios Automatic Token Retries | Score Trends | Streak Counters | Question Upload |
| Server-side API Protection | Percentile Analysis | Leaderboards | Result Monitoring |
| Redis Dual-Layer Rate Limiting | Time Management | Activity Patterns | Activity Audit |

</div>

## 🚀 Tech Stack

### Frontend Powerhouse
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/) **App Router** - React framework with server-side rendering  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/) **Type Safety** - Enhanced developer experience  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/) **Utility-First** - Rapid UI development  
[![Recharts](https://img.shields.io/badge/Recharts-2.8-FF6B6B?style=flat-square)](https://recharts.org/) **Data Visualization** - Interactive analytics charts  
[![React Icons](https://img.shields.io/badge/React_Icons-5.0-61DAFB?style=flat-square&logo=react)](https://react-icons.github.io/react-icons/) **Icon Library** - Comprehensive icon set  

### Backend Infrastructure
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/) **Language Engine** - Core logic for the AI Microservice
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/) **Microservice** - High performance async API via Uvicorn
[![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat-square&logo=pydantic)](https://docs.pydantic.dev/) **Validation** - Strict data model enforcement
[![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-008AD7?style=flat-square&logo=microsoft-azure)](https://azure.microsoft.com/) **Grok-3 GenAI** - Contextual evaluation of candidate stories
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/) **NoSQL Database** - Scalable document storage  
[![Mongoose](https://img.shields.io/badge/Mongoose-8.0-880000?style=flat-square)](https://mongoosejs.com/) **ODM** - Elegant MongoDB object modeling  
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=json-web-tokens)](https://jwt.io/) **Authentication** - Secure token-based auth  
[![Nodemailer](https://img.shields.io/badge/Nodemailer-6.9-339933?style=flat-square&logo=node.js)](https://nodemailer.com/) **Email Service** - SMTP integration  
[![Bcrypt](https://img.shields.io/badge/Bcrypt-5.1-FF6B35?style=flat-square)](https://www.npmjs.com/package/bcrypt) **Security** - Password hashing  

### DevOps & Deployment
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker)](https://www.docker.com/) **Containerization** - Consistent deployments  
[![Nginx](https://img.shields.io/badge/Nginx-Proxy-009639?style=flat-square&logo=nginx)](https://nginx.org/) **Reverse Proxy** - Load balancing & SSL  
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/) **Media Management** - Image optimization

## 📋 Quick Start

### Prerequisites
- **Node.js 20+** 
- **MongoDB Atlas** account or local MongoDB instance 
- **SMTP service** (Brevo/SendGrid) for email functionality 
- **Cloudinary** account for image optimization 
- **Docker & Docker Compose** (for deployment) 

### ⚡ Installation

**1. Clone the Repository**
```bash
git clone https://github.com/akt9802/Prasikshan.git
cd Prasikshan/prasikshan
```

**2. Install Dependencies**
```bash
npm install
```

**3. Environment Setup**
Create a `.env` file in the `prasikshan` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/prasikshan?retryWrites=true&w=majority

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters

# Email Service Configuration (Brevo SMTP)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login_email
SMTP_PASS=your_brevo_smtp_key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=Prasikshan Platform

# Cloudinary Configuration (Image Optimization & Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name

# AI Service Endpoint
AI_SERVICE_URL=http://localhost:5001

# Environment
NODE_ENV=development
```

**4. Database Initialization**
The application automatically creates required collections and indexes on first run. Ensure your MongoDB connection is valid.

**5. Launch Development Server**
```bash
npm run dev
```

**6. Launch AI Microservice (Optional)**
If you are explicitly testing the PPDT or TAT AI review features locally, you will need to boot up the Python FastAPI backend located in the `prasikshan-ai-service` folder.
*See [prasikshan-ai-service/DEPLOYMENT.md](./prasikshan-ai-service/DEPLOYMENT.md) for step-by-step local and production deployment instructions.*

🎉 **Success!** Visit `http://localhost:3000` to see Prasikshan in action.

## 🐳 Docker & Production Deployment

### 🚀 Quick Docker Setup
```bash
# Build the optimized production image
docker build -t prasikshan:latest .

# Run with environment variables
docker run -d \
  --name prasikshan-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  prasikshan:latest
```

### 🌐 Production Deployment with Nginx

**1. Deploy the Application**
```bash
# Build and start the container
docker build -t prasikshan:production .
docker run -d \
  --name prasikshan-prod \
  --restart always \
  -p 3000:3000 \
  --env-file .env.production \
  prasikshan:production
```

**2. Configure Nginx Reverse Proxy**
```bash
# Copy the provided Nginx configuration
sudo cp prasikshan.nginx.conf /etc/nginx/sites-available/prasikshan
sudo ln -s /etc/nginx/sites-available/prasikshan /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

**3. SSL Certificate with Certbot**
```bash
# Install SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 📋 Docker Compose (Recommended)
```yaml
version: '3.8'
services:
  prasikshan:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

> 📖 **Detailed deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production setup instructions.



## 🗄️ Database Schema

### 📊 Collections Overview

| Collection | Purpose | Key Relationships | Indexes |
|------------|---------|-------------------|---------|
| **Users** | User accounts & profiles | 1:N → TestResults, Rankings | email, userId |
| **Questions** | Test question bank | N:1 ← TestTypes | testType, difficulty |
| **TestResults** | Individual test attempts | N:1 ← Users, Questions | userId, testType, createdAt |
| **Rankings** | Leaderboard data | N:1 ← Users | userId, testType, score |
| **TestSets** | Question collections | 1:N → Questions | setId, testType |

### 🏗️ Entity Relationship Diagram

```mermaid
erDiagram
    Users ||--o{ TestResults : attempts
    Users ||--o{ Rankings : ranks
    Questions ||--o{ TestResults : contains
    TestSets ||--o{ Questions : includes
    
    Users {
        ObjectId _id PK
        string email UK
        string name
        string hashedPassword
        boolean isVerified
        string role
        Date createdAt
        Date lastLogin
        object profile
        array testHistory
    }
    
    Questions {
        ObjectId _id PK
        string testType
        string questionText
        array options
        string correctAnswer
        string difficulty
        string category
        ObjectId setId FK
        Date createdAt
    }
    
    TestResults {
        ObjectId _id PK
        ObjectId userId FK
        string testType
        array answers
        number score
        number totalQuestions
        number timeSpent
        Date completedAt
        object analytics
    }
    
    Rankings {
        ObjectId _id PK
        ObjectId userId FK
        string testType
        number totalScore
        number testsCompleted
        number rank
        string tier
        Date lastUpdated
    }
    
    TestSets {
        ObjectId _id PK
        string setName
        string testType
        array questionIds
        string difficulty
        boolean isActive
        Date createdAt
    }
```

### 📋 Detailed Schema Definitions

#### 👤 Users Collection
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary key | Auto-generated |
| `email` | String | User email address | Unique, required |
| `name` | String | Full name | Required, min: 2 chars |
| `hashedPassword` | String | Bcrypt hashed password | Required |
| `isVerified` | Boolean | Email verification status | Default: false |
| `role` | String | User role (user/admin) | Default: 'user' |
| `profile` | Object | Extended profile data | Optional |
| `testHistory` | Array | Test completion records | Default: [] |
| `createdAt` | Date | Account creation timestamp | Auto-generated |
| `lastLogin` | Date | Last login timestamp | Updated on signin |

#### ❓ Questions Collection  
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary key | Auto-generated |
| `testType` | String | Test category | Required, enum: [oir, ppdt, tat, wat, srt, lecturette, pi] |
| `questionText` | String | Question content | Required |
| `options` | Array | Multiple choice options | Required for OIR |
| `correctAnswer` | String | Correct response | Required for scored tests |
| `difficulty` | String | Question difficulty | Enum: [easy, medium, hard] |
| `imageUrl` | String | Associated image URL | Required for PPDT, TAT |
| `category` | String | Question subcategory | Optional |
| `setId` | ObjectId | Parent test set reference | Foreign key |

#### 📊 TestResults Collection
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary key | Auto-generated |
| `userId` | ObjectId | User reference | Required, foreign key |
| `testType` | String | Test category | Required |
| `answers` | Array | User responses | Required |
| `score` | Number | Calculated score | Min: 0, Max: 100 |
| `totalQuestions` | Number | Questions attempted | Required |
| `timeSpent` | Number | Duration in seconds | Required |
| `completedAt` | Date | Completion timestamp | Auto-generated |
| `analytics` | Object | Performance metrics | Optional |

#### 🏆 Rankings Collection
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `_id` | ObjectId | Primary key | Auto-generated |
| `userId` | ObjectId | User reference | Required, foreign key |
| `testType` | String | Test category | Required |
| `totalScore` | Number | Cumulative score | Min: 0 |
| `testsCompleted` | Number | Total attempts | Min: 0 |
| `averageScore` | Number | Mean performance | Calculated field |
| `rank` | Number | Current ranking position | Updated periodically |
| `tier` | String | Achievement tier | Enum: [bronze, silver, gold] |
| `lastUpdated` | Date | Last calculation time | Auto-updated |



##  How to Use

### For SSB Aspirants

#### Getting Started
1. **Create Account** - Sign up with your email and verify your account
2. **Explore Dashboard** - Familiarize yourself with the analytics and progress tracking
3. **Choose Test Module** - Select from 7 comprehensive SSB test categories
4. **Take Practice Tests** - Complete timed tests in exam-like conditions
5. **Analyze Performance** - Review detailed analytics and improvement suggestions
6. **Track Rankings** - Monitor your progress against thousands of other aspirants

#### 📈 Maximizing Your Preparation
```mermaid
graph LR
    A[Daily Practice] --> B[Performance Analysis]
    B --> C[Identify Weak Areas]
    C --> D[Focused Improvement]
    D --> E[Retake Tests]
    E --> F[Track Progress]
    F --> A
```

**🎯 Recommended Study Plan:**
- **Week 1-2:** Complete diagnostic tests in all modules
- **Week 3-4:** Focus on weakest 2-3 areas with daily practice
- **Week 5-6:** Mixed practice with time management focus
- **Week 7+:** Full mock tests and final preparation

### 👨‍💼 For Administrators

#### Admin Panel Access
1. **Admin Setup** - Use the setup endpoint with admin key
2. **Dashboard Overview** - Monitor user engagement and platform statistics
3. **Content Management** - Upload and manage questions for all test types
4. **User Management** - Track user progress and manage accounts
5. **Analytics Review** - Analyze platform performance and user trends

#### Content Management Workflow
- **Question Upload:** Bulk upload questions with categorization
- **Image Management:** Cloudinary integration for PPDT/TAT images
- **Quality Control:** Review and approve user-generated content
- **Performance Monitoring:** Track question difficulty and user success rates

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens** - Secure, stateless authentication with configurable expiration
- **Password Hashing** - Bcrypt with salt rounds for maximum security
- **Email Verification** - Mandatory account verification before access
- **OTP Recovery** - Time-limited one-time passwords for password reset
- **Route Protection** - Server-side middleware protecting sensitive endpoints

### Data Protection
- **CORS Configuration** - Controlled cross-origin request handling
- **Input Validation** - Comprehensive request validation and sanitization
- **Dual-Layer Rate Limiting** - Redis-backed IP sliding window & email account lockout defending against distributed brute-force botnets
- **Environment Security** - Sensitive configuration via environment variables
- **Database Security** - MongoDB connection with authentication and encryption

### Infrastructure Security
- **Container Isolation** - Docker containerization for deployment security
- **Nginx Proxy** - Reverse proxy with SSL termination
- **SSL/TLS** - HTTPS enforcement with automatic certificate renewal
- **Security Headers** - Comprehensive HTTP security headers implementation

### Monitoring & Compliance
- **Audit Logging** - Comprehensive user action tracking
- **Error Monitoring** - Secure error handling without data exposure
- **GDPR Compliance** - User data protection and privacy controls
- **Session Management** - Secure session handling with automatic expiration

## 📊 Analytics & Progress Tracking

### 📈 Performance Metrics

| Metric Type | Description | Visualization | Insights Provided |
|-------------|-------------|---------------|-------------------|
| **Score Trends** | Historical performance tracking | Line charts with trend analysis | Improvement patterns, consistency |
| **Accuracy Rates** | Correct answer percentages | Radar charts by test type | Strengths and weaknesses identification |
| **Time Management** | Speed vs accuracy analysis | Scatter plots and heatmaps | Optimal pacing strategies |
| **Ranking Progress** | Position changes over time | Ranking charts with percentiles | Competitive performance tracking |
| **Activity Patterns** | Study consistency tracking | Calendar heatmaps | Habit formation and streaks |

### 🎯 Detailed Analytics Dashboard

```mermaid
graph TB
    A[User Dashboard] --> B[Performance Overview]
    A --> C[Test-Specific Analytics]
    A --> D[Comparative Analysis]
    A --> E[Progress Tracking]
    
    B --> B1[Overall Score Trends]
    B --> B2[Time Management Stats]
    B --> B3[Accuracy Metrics]
    
    C --> C1[OIR Analytics]
    C --> C2[PPDT Performance]
    C --> C3[TAT Insights]
    C --> C4[WAT Patterns]
    C --> C5[SRT Evaluation]
    C --> C6[Lecturette Scores]
    C --> C7[PI Preparation]
    
    D --> D1[Peer Comparison]
    D --> D2[National Rankings]
    D --> D3[Percentile Analysis]
    
    E --> E1[Monthly Progress]
    E --> E2[Goal Tracking]
    E --> E3[Streak Counters]
```

### 📋 Key Performance Indicators (KPIs)

#### 🎯 Individual Metrics
- **Overall Performance Score** - Weighted average across all test types
- **Improvement Rate** - Month-over-month progress percentage
- **Consistency Index** - Standard deviation of recent test scores
- **Speed Efficiency** - Accuracy per minute ratio
- **Weak Area Identification** - Lowest performing test categories

#### 🏆 Competitive Metrics
- **National Rank** - Position among all platform users
- **Percentile Score** - Performance relative to peer group
- **Tier Achievement** - Bronze/Silver/Gold classification
- **Streak Records** - Consecutive days of practice
- **Challenge Completion** - Monthly and weekly goal achievement

### 📊 Interactive Visualizations

#### 📈 Charts & Graphs
- **Performance Timeline** - Interactive line charts with drill-down capability
- **Skill Radar** - Multi-dimensional performance visualization
- **Heatmaps** - Activity patterns and time-based performance
- **Progress Bars** - Goal completion and milestone tracking
- **Comparison Charts** - Peer benchmarking and historical comparison

#### 🎮 Gamification Elements
- **Achievement Badges** - Milestone recognition system
- **Progress Levels** - Skill-based advancement tracking
- **Leaderboards** - Real-time competitive rankings
- **Streak Counters** - Daily practice motivation
- **Challenge System** - Weekly and monthly goals

## 🤝 Contributing

We welcome contributions from the SSB preparation community! Whether you're a developer, educator, or SSB expert, there are many ways to help improve Prasikshan.

### 🚀 Getting Started

1. **🍴 Fork the Repository**
   ```bash
   git clone https://github.com/akt9802/Prasikshan.git
   cd Prasikshan
   ```

2. **🌿 Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

3. **💻 Make Your Changes**
   - Follow our coding standards and best practices
   - Add tests for new functionality
   - Update documentation as needed

4. **✅ Test Your Changes**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

5. **📝 Commit with Meaningful Messages**
   ```bash
   git commit -m "feat: add advanced analytics dashboard"
   ```

6. **🚀 Push and Create Pull Request**
   ```bash
   git push origin feature/amazing-new-feature
   ```### 🎯 Contribution Areas

| Area | Description | Skills Needed | Impact |
|------|-------------|---------------|---------|
| **Question Bank** | Add new test questions and scenarios | SSB knowledge, content creation | High |
| **Analytics** | Enhance performance tracking features | React, Chart.js, data analysis | High |
| **UI/UX** | Improve user interface and experience | Design, Tailwind CSS, accessibility | Medium |
| **Backend** | API improvements and optimizations | Node.js, MongoDB, performance | High |
| **Mobile** | React Native app development | React Native, mobile development | High |
| **Testing** | Add comprehensive test coverage | Jest, testing best practices | Medium |
| **Documentation** | Improve guides and documentation | Technical writing, markdown | Medium |

### 📋 Development Guidelines

#### 🎨 Code Style
- **TypeScript** - Use strict type checking
- **ESLint + Prettier** - Automated code formatting
- **Conventional Commits** - Structured commit messages
- **Component Structure** - Modular, reusable components

#### 🧪 Testing Requirements
- **Unit Tests** - All utility functions and components
- **Integration Tests** - API endpoints and user flows
- **E2E Tests** - Critical user journeys
- **Performance Tests** - Load testing for scalability

#### 📖 Documentation Standards
- **Code Comments** - Clear, concise inline documentation
- **API Documentation** - OpenAPI/Swagger specifications
- **README Updates** - Keep documentation current
- **Change Logs** - Document all significant changes

### 🐛 Bug Reports

Found a bug? Help us fix it:

1. **Check Existing Issues** - Avoid duplicates
2. **Use Bug Template** - Provide detailed information
3. **Include Screenshots** - Visual context helps
4. **Steps to Reproduce** - Clear reproduction steps
5. **Environment Details** - OS, browser, version info

### 💡 Feature Requests

Have an idea? We'd love to hear it:

1. **Describe the Problem** - What challenge does it solve?
2. **Proposed Solution** - How should it work?
3. **Expected Impact** - Who benefits and how?
4. **Mockups/Wireframes** - Visual representation if applicable


### 🤝 Open Source Commitment

Prasikshan is proudly open source because we believe:
- **Education Should Be Accessible** - Quality SSB preparation for everyone
- **Community Drives Innovation** - Collective knowledge improves outcomes
- **Transparency Builds Trust** - Open development process
- **Collaboration Accelerates Progress** - Together we achieve more

---

## 🚧 Roadmap & Future Plans

### 🔄 Current Status
> **Platform Update:** Prasikshan is constantly evolving. In our latest architectural update, we've deployed major performance and security enhancements!

✨ **Recent Upgrades:**
- **Comprehensive AI Evaluation Suite (TAT, SRT, WAT & Lecturette)**: Embedded a real-time, SSB-calibrated AI assessment matrix across all major test modules, delivering instant, actionable feedback to candidates.
  - **TAT (Thematic Apperception Test)**: Context-aware AI reviews for full 12-picture story sets, strictly evaluating Hero identification, Past-Present-Future structuring, situational Realism, and underlying OLQs.
  - **SRT (Situation Reaction Test)**: Mass-evaluates up to 60 rapid reaction responses for brevity, practical action-orientation, and presence of mind.
  - **Lecturette**: Analyzes the candidate's speech text for logical structure, introduction-body-conclusion flow, and mature perspectives on current topics.
  - **WAT (Word Association Test)**: Issues sentence-by-sentence psychological critiques penalizing non-attempts, idiom usage, negative themes, and overuse of the "I" pronoun.
- **Modular AI Service Architecture**: Refactored the Python FastAPI microservice into a cleanly distributed, scalable system with dedicated endpoints (`routers/tat.py`, `routers/srt.py`, `routers/lecturette.py`, etc.). This cleanly decouples complex Azure OpenAI contextual prompt logic from the core Next.js application.
- **Comprehensive Admin Set Builders**: Fully integrated interactive Set Builders for OIR, WAT, SRT, TAT, PPDT, Lecturette, and PI inside a sleek, unified Admin Dashboard featuring tabbed navigation.
- **Advanced TAT & PPDT Handling**: Seamless integration between our testing suites and Cloudinary. Process complete 12-picture thematic sets for TAT natively while allowing admins to embed benchmark reference stories right alongside uploaded pictures!
- **FastAPI AI Microservice Migration**: Transitioned the core AI story review engine from Flask to an asynchronous **FastAPI** architecture powered by Uvicorn. Completely restructured to ingest **Azure OpenAI (Grok-3)** contextual evaluations, fixing critical header size issues (431 Errors) while guaranteeing strict perception-accuracy scoring via rigid prompt system constraints.
- **Enterprise-Grade Authentication**: Implemented a robust dual-token JWT architecture (15-min Access Tokens + Rotating 7-day Refresh Tokens) secured via HTTP-Only cookies.
- **Seamless Session Management**: Added a background Axios interceptor to silently catch `401/403` token expirations and automatically refresh them without disrupting the user flow.
- **Cloudinary Global CDN Migration**: Offloaded high-resolution core assets and test images directly to Cloudinary's Global CDN. This massively unblocks Next.js server threads, reduces bandwidth costs, and turbo-charges initial page load speeds!
- **Advanced Threat Protection**: Implemented a robust dual-layer Redis rate limiting architecture (Sliding Window IP tracking & Account Lockout mechanisms) to neutralize distributed brute-force attacks and protect backend compute resources.

### 🎯 Upcoming Features (Q2 2026)

| Priority | Feature | Description | Timeline |
|----------|---------|-------------|----------|
| 🔥 **High** | **Mobile App** | React Native iOS/Android app | Q2 2026 |
| 🔥 **High** | **AI Feedback** | ML-powered personalized insights | Q2 2026 |
| 🔥 **High** | **Video Interviews** | Mock interview simulation platform | Q3 2026 |
| 🟡 **Medium** | **Group Discussions** | Virtual GD practice rooms | Q3 2026 |
| 🟡 **Medium** | **Offline Mode** | Download tests for offline practice | Q4 2026 |
| 🟢 **Low** | **Multi-language** | Hindi and regional language support | Q4 2026 |

### 🚀 Long-term Vision (2027+)

```mermaid
graph LR
    A[Current Platform] --> B[AI-Powered Coaching]
    B --> C[VR Training Simulations]
    C --> D[Institute Partnerships]
    D --> E[Certification Programs]
    E --> F[Career Guidance Platform]
```

---

## ❤️ Acknowledgments & Credits

### 🙏 Special Thanks

**🎖️ Indian Armed Forces**
- For their service and inspiration that drives this platform
- SSB selection process insights and methodology

**👨‍🏫 SSB Coaching Community**
- Experienced instructors who provided test format guidance
- Subject matter experts who validated question quality

**💻 Open Source Heroes**
- **Next.js Team** - For the incredible React framework
- **MongoDB** - For reliable, scalable database solutions
- **Tailwind CSS** - For beautiful, responsive design system
- **Recharts** - For powerful data visualization capabilities

### 🏆 Contributors Hall of Fame

| Contributor | Role | Contribution | Impact |
|-------------|------|--------------|---------|
| **[@akt9802](https://github.com/akt9802)** | 👑 **Creator & Lead** | Full-stack development, architecture | 🌟 Foundational |
| **Community Contributors** | 🤝 **Collaborators** | Questions, feedback, testing | 🚀 Growing |

*Want to see your name here? [Contribute to Prasikshan!](#-contributing)*

### 🎯 Inspiration & Motivation

> *"The best way to find yourself is to lose yourself in the service of others."* - Mahatma Gandhi

This platform is dedicated to every young Indian who dreams of serving the nation through the Armed Forces. Your dedication, sacrifice, and commitment inspire us to build better tools for your success.

---

<div align="center">

### 🚀 Ready to Begin Your SSB Journey?

[![Get Started](https://img.shields.io/badge/Get_Started-Now-brightgreen?style=for-the-badge&logo=rocket)](https://prasikshan.vercel.app)
[![Join Community](https://img.shields.io/badge/Join-Community-blue?style=for-the-badge&logo=discord)](https://discord.gg/prasikshan)
[![Contribute](https://img.shields.io/badge/Contribute-Code-orange?style=for-the-badge&logo=github)](https://github.com/akt9802/Prasikshan/contribute)

---

**🎯 Built with ❤️ for SSB Aspirants | 🇮🇳 Proudly Made in India**

[Live Platform](https://prasikshan.vercel.app) • [Documentation](./docs) • [Report Issues](https://github.com/akt9802/Prasikshan/issues) • [Feature Requests](https://github.com/akt9802/Prasikshan/discussions)

*Empowering the next generation of Indian Armed Forces officers through technology and community.*

</div>