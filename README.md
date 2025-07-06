# 🎯 Mojnu6 InterviewPrep

> **A comprehensive frontend interview preparation platform with gamified learning, real-time chat, and achievement system**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-blue?style=for-the-badge&logo=vercel)](https://mojnu6.vercel.app/)
[![Tech Stack](https://img.shields.io/badge/Tech%20Stack-MERN%20Stack-green?style=for-the-badge&logo=javascript)](https://github.com/your-username/mojnu6-interviewprep)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

Mojnu6 InterviewPrep is a modern, gamified web application designed to help frontend developers prepare for technical interviews. Built with the MERN stack, it offers an interactive learning experience with real-time features, achievement systems, and community engagement.

### Key Highlights

- **🎮 Gamified Learning**: Level-based progression with points, streaks, and achievements
- **💬 Real-time Chat**: Community chat rooms for collaborative learning
- **🏆 Leaderboards**: Global, weekly, and monthly rankings
- **🎯 Daily Challenges**: Streak-based daily login rewards
- **📊 Analytics**: Detailed progress tracking and performance metrics
- **🔐 Secure Authentication**: JWT-based authentication with password reset
- **📱 Responsive Design**: Mobile-first approach with modern UI/UX

## ✨ Features

### 🎓 Learning System
- **Progressive Levels**: 100+ carefully curated frontend interview questions
- **Multiple Choice & Text Input**: Flexible answer formats
- **Instant Feedback**: Real-time answer validation with explanations
- **Hint System**: Cost-based hint points for challenging questions
- **Skip Protection**: Encourages learning through completion

### 🏆 Achievement & Rewards
- **Point System**: Earn points for correct answers and daily streaks
- **Achievement Badges**: Unlock achievements for milestones
- **Consistency Rewards**: Special rewards for maintaining streaks
- **Daily Login Bonus**: 10 points for daily participation

### 👥 Community Features
- **Real-time Chat**: Socket.io-powered chat rooms
- **Leaderboards**: Global, weekly, and monthly rankings
- **User Profiles**: Detailed progress and achievement tracking
- **Wrong Answer Tracking**: Review and learn from mistakes

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Sound Effects**: Immersive audio feedback
- **Animations**: Smooth transitions and micro-interactions
- **Dark/Light Mode**: Theme customization (planned)

### 🔧 Admin Features
- **Question Management**: Add, edit, and delete questions
- **Transaction Approval**: Manage hint point purchases
- **User Analytics**: Monitor user engagement and progress
- **Survey Management**: Collect and analyze user feedback

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **SendGrid** - Email service integration

### Development Tools
- **ESLint** - Code linting and formatting
- **Git** - Version control
- **Vercel** - Frontend deployment
- **Render** - Backend deployment

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mojnu6-interviewprep.git
   cd mojnu6-interviewprep
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both root and server directories:

   **Root `.env**:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

   **Server `.env**:**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SENDGRID_API_KEY=your_sendgrid_api_key
   PORT=5000
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Deployment

1. **Frontend (Vercel)**
   ```bash
   npm run build
   # Deploy to Vercel
   ```

2. **Backend (Render/Railway)**
   ```bash
   cd server
   npm start
   # Deploy to your preferred platform
   ```

## 📁 Project Structure

```
mojnu6-interviewprep/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── admin/               # Admin dashboard components
│   │   ├── auth/                # Authentication components
│   │   └── ...                  # Other UI components
│   ├── context/                 # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── api/                     # API configuration
│   └── assets/                  # Static assets
├── server/                      # Backend source code
│   ├── controllers/             # Route controllers
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API routes
│   ├── middleware/              # Express middleware
│   ├── config/                  # Configuration files
│   └── server.js               # Main server file
├── public/                      # Public assets
├── html_template/               # HTML templates
└── docs/                        # Documentation
```

### Key Components

- **AnswerForm**: Handles question submission and validation
- **Home**: Main game interface with level progression
- **ChatRoom**: Real-time community chat
- **Leaderboard**: User rankings and statistics
- **Admin Dashboard**: Question and user management

## 🔌 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Levels & Questions
- `GET /api/levels` - Fetch all levels
- `GET /api/levels/:id` - Get specific level

### User Profiles
- `GET /api/profile/:username` - Get user profile
- `PATCH /api/profile/:username` - Update profile
- `POST /api/profile/:username/daily-streak` - Update daily streak

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/weekly` - Weekly rankings
- `GET /api/leaderboard/monthly` - Monthly rankings

### Chat
- `GET /api/chat/:roomId` - Get chat messages
- `POST /api/chat/:roomId` - Send message

### Admin Routes
- `POST /api/levels` - Add new question
- `PUT /api/levels/:id` - Update question
- `DELETE /api/levels/:id` - Delete question

## 🎮 Game Mechanics

### Point System
- **Correct Answer**: +1 point
- **Daily Login**: +10 points
- **Achievements**: Variable points based on milestone
- **Streak Bonus**: Additional points for consecutive days

### Achievement System
- **Consistency Achievements**: Rewards for maintaining streaks
- **Level Completion**: Milestones for completing levels
- **Community Engagement**: Rewards for active participation

### Progression
- **Level-based**: Progressive difficulty
- **Max Level Tracking**: Resume from last completed level
- **Wrong Answer Review**: Learn from mistakes

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Add tests** (if applicable)
5. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Development Guidelines

- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📊 Performance & Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading for better performance
- **Image Optimization**: Compressed assets
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching**: Efficient caching strategies

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Connection Pooling**: Efficient database connections
- **Rate Limiting**: API protection
- **Error Handling**: Comprehensive error management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive data validation
- **CORS Configuration**: Cross-origin request handling
- **Rate Limiting**: API abuse prevention

## 📈 Analytics & Monitoring

- **User Engagement**: Track user activity and retention
- **Performance Metrics**: Monitor application performance
- **Error Tracking**: Comprehensive error logging
- **User Feedback**: Survey and feedback collection

## 🚀 Roadmap

### Phase 1 (Current) ✅
- **Core Game Mechanics**: Level-based progression with points and achievements
- **Real-time Chat**: Socket.io-powered community chat rooms
- **Achievement System**: Unlockable achievements and rewards
- **Admin Dashboard**: Complete content and user management
- **Authentication**: JWT-based secure authentication
- **Leaderboards**: Global, weekly, and monthly rankings

### Phase 2 (Planned) 🔄
- **SSL Commerce Integration**: Secure payment processing for hint points
- **Category-based Quizzes**: Specialized questions by frontend topics
- **Community Marketplace**: User-generated content sharing
- **Advanced Analytics**: Detailed user performance insights
- **Email Notifications**: Automated achievement and progress alerts
- **Mobile Optimization**: Enhanced mobile experience

### Phase 3 (Future) 📋
- **Mobile App Development**: Native iOS and Android applications
- **AI-powered Question Generation**: Dynamic question creation
- **Video Explanations**: Multimedia learning content
- **Interview Simulation**: Mock interview scenarios
- **Advanced Gamification**: More complex achievement systems
- **Social Features**: User profiles and networking

## 📊 Project Analysis

### Architecture Overview
The Mojnu6 InterviewPrep platform follows a modern **MERN stack architecture** with clear separation of concerns:

```
Frontend (React + Vite) ←→ Backend (Node.js + Express) ←→ Database (MongoDB)
```

### Key Strengths
- **🎯 Focused Purpose**: Specialized for frontend interview preparation
- **🎮 Gamification**: Engaging learning through points, streaks, and achievements
- **💬 Real-time Features**: Live chat and instant feedback
- **📱 Responsive Design**: Mobile-first approach with modern UI
- **🔐 Security**: JWT authentication with proper validation
- **📊 Analytics**: Comprehensive user progress tracking

### Technical Highlights
- **Modern React**: Uses React 19 with hooks and context
- **Real-time Communication**: Socket.io for live features
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Performance Optimized**: Code splitting and lazy loading
- **SEO Friendly**: Server-side rendering capabilities
- **Accessibility**: WCAG compliant design patterns

### Scalability Considerations
- **Database Design**: Optimized MongoDB schemas for performance
- **Caching Strategy**: Efficient data caching mechanisms
- **API Design**: RESTful endpoints with proper versioning
- **Deployment**: Containerized deployment with Docker support
- **Monitoring**: Comprehensive logging and error tracking

### Security Implementation
- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control (RBAC)
- **Input Validation**: Comprehensive data sanitization
- **Rate Limiting**: API abuse prevention
- **CORS Configuration**: Proper cross-origin handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License Details

**MIT License** - A permissive license that allows for:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ✅ Patent use

**Limitations:**
- ❌ Liability
- ❌ Warranty

### License Text

```
MIT License

Copyright (c) 2024 Mojnu6 InterviewPrep

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For seamless deployment
- **MongoDB** - For the flexible database solution
- **Socket.io** - For real-time communication

## 📞 Support

- **Live Demo**: [https://mojnu6.vercel.app/](https://mojnu6.vercel.app/)
- **Issues**: [GitHub Issues](https://github.com/your-username/mojnu6-interviewprep/issues)
- **Email**: thisismojnu@gmail.com
- **Documentation**: [Server README](./server/README.md)

## 🔗 Related Documentation

### Frontend & Backend Alignment
This project consists of two main components that work together seamlessly:

| Component | Technology | Purpose | Documentation |
|-----------|------------|---------|---------------|
| **Frontend** | React + Vite | User interface and interactions | This README |
| **Backend** | Node.js + Express | API and business logic | [Server README](./server/README.md) |

### Quick Links
- **[Server API Documentation](./server/README.md#-api-documentation)** - Complete backend API reference
- **[Database Schema](./server/README.md#-database-schema)** - MongoDB models and relationships
- **[Real-time Features](./server/README.md#-real-time-features)** - Socket.io implementation
- **[Deployment Guide](./server/README.md#-deployment)** - Production deployment instructions

## 🏗️ Architecture Comparison

### Frontend vs Backend Responsibilities

| Feature | Frontend Responsibility | Backend Responsibility |
|---------|------------------------|------------------------|
| **Authentication** | Token storage, UI forms | JWT generation, validation |
| **Real-time Chat** | Socket connection, UI | Message handling, broadcasting |
| **Game Logic** | UI state, user interactions | Data persistence, business rules |
| **File Upload** | File selection, preview | Storage, processing |
| **Analytics** | Event tracking | Data aggregation, reporting |

### Technology Stack Alignment

**Frontend Stack:**
- React 19 + Vite for fast development
- Tailwind CSS 4 for styling
- Socket.io client for real-time features
- Axios for HTTP requests

**Backend Stack:**
- Node.js + Express for API
- MongoDB + Mongoose for data
- Socket.io for real-time communication
- JWT + bcrypt for security

## 🎯 Development Workflow

### Local Development
1. **Clone repository** and install dependencies
2. **Start backend** (`cd server && npm run dev`)
3. **Start frontend** (`npm run dev`)
4. **Access application** at http://localhost:5173

### Production Deployment
1. **Backend**: Deploy to Render/Railway/Heroku
2. **Frontend**: Deploy to Vercel/Netlify
3. **Database**: Use MongoDB Atlas
4. **Environment**: Configure production variables

### Testing Strategy
- **Frontend**: Component testing with React Testing Library
- **Backend**: API testing with Postman collection
- **Integration**: End-to-end testing with Cypress
- **Performance**: Load testing with Artillery

---

<div align="center">
  <p>Made with ❤️ by the Mojnu6 Team</p>
  <p>⭐ Star this repository if you found it helpful!</p>
  <p>📚 Check out the <a href="./server/README.md">Server Documentation</a> for backend details</p>
</div>
