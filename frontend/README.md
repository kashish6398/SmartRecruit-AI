# SmartRecruit - AI-Powered Resume Screening & Ranking System

![SmartRecruit Banner](https://img.shields.io/badge/SmartRecruit-AI%20Powered-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![Python](https://img.shields.io/badge/python-3.8%2B-yellow)

## 🎯 Overview

SmartRecruit is a production-ready, full-stack web application that automates resume screening using AI/ML techniques. It uses TF-IDF (Term Frequency-Inverse Document Frequency) and cosine similarity to rank candidates based on job requirements.

**Target Users:**
- HR teams in service-based companies (handling thousands of resumes)
- HR Tech startups building B2B SaaS products

## 🚀 Key Features

### For Candidates:
- ✅ User registration and authentication
- 📄 Resume upload (PDF/TXT format)
- 📊 View match score and missing skills
- 🔒 Secure JWT-based authentication

### For HR:
- 📝 Create job descriptions
- 📦 Upload multiple resumes (individual files or ZIP)
- 🤖 **AI-powered automatic ranking**
- 📈 View ranked candidates with match scores
- 🎯 Skills gap analysis
- 📧 Automated interview invitation emails (top 5 candidates)

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB |
| **Authentication** | JWT (JSON Web Tokens) |
| **AI Engine** | Python, Scikit-learn, TF-IDF, Cosine Similarity |
| **Email** | Nodemailer |
| **File Processing** | Multer, pdf-parse, extract-zip |

## 📊 AI/ML Algorithm

### How It Works:

1. **Text Preprocessing**
   - Convert text to lowercase
   - Remove special characters
   - Normalize whitespace
   - Remove stop words

2. **TF-IDF Vectorization**
   - Transforms text into numerical vectors
   - Uses unigrams and bigrams (1-2 word phrases)
   - Weights terms by importance across documents

3. **Cosine Similarity**
   - Measures similarity between job description and resume vectors
   - Score: 0 (no match) to 1 (perfect match)
   - Multiplied by 100 for percentage display

4. **Skills Gap Analysis**
   - Identifies missing required skills
   - Uses regex pattern matching
   - Returns list of skills to improve

### Example:
```
Job Description: "Looking for React, Node.js, MongoDB developer"
Resume: "Experienced in React and Node.js"

Result:
- Match Score: 75%
- Missing Skills: [MongoDB]
```

## 📁 Project Structure

```
smartrecruit/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── middleware/
│   │   └── auth.js                  # JWT middleware
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   ├── Resume.js                # Resume schema
│   │   └── JobDescription.js        # Job schema
│   ├── routes/
│   │   ├── auth.js                  # Auth endpoints
│   │   ├── candidate.js             # Candidate endpoints
│   │   └── hr.js                    # HR endpoints
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   └── hrController.js
│   ├── utils/
│   │   ├── extractText.js           # PDF/TXT parser
│   │   └── emailService.js          # Email sender
│   └── server.js                    # Express app
├── ai-engine/
│   ├── ranking_engine.py            # AI ranking script
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── CandidateDashboard.js
│   │   │   └── HRDashboard.js
│   │   ├── services/
│   │   │   └── api.js               # API calls
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── sample-data/
    ├── sample_jd.txt
    └── sample_resume.txt
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js >= 16.x
- Python >= 3.8
- MongoDB >= 4.x (local or MongoDB Atlas)
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd smartrecruit
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations:
# - MongoDB URI
# - JWT secret
# - Email credentials (Gmail recommended)
```

### Step 3: AI Engine Setup
```bash
cd ../ai-engine
pip install -r requirements.txt
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
```

### Step 5: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod --dbpath /path/to/data/directory
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update backend/.env with your connection string

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start

# Or with nodemon for development
npm run dev
```
Backend will run on: http://localhost:5000

### Start AI Engine
The AI engine is automatically called by the backend. No separate startup needed.

### Start Frontend
```bash
cd frontend
npm start
```
Frontend will run on: http://localhost:3000

## 📧 Email Configuration (Gmail)

1. Enable 2-Step Verification on your Gmail account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Update backend/.env:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🧪 Testing the Application

### Test Flow 1: Candidate Journey
1. Open http://localhost:3000
2. Click "Register here"
3. Fill form with role = "Candidate"
4. Login with credentials
5. Upload resume (PDF/TXT)
6. View uploaded resume info

### Test Flow 2: HR Journey
1. Register as HR role
2. Login
3. Click "Create New Job"
4. Fill job details:
   - Title: "Full Stack Developer"
   - Description: Copy from sample-data/sample_jd.txt
   - Skills: "React, Node.js, MongoDB"
   - Upload resumes (or ZIP file)
5. View ranked candidates
6. Click "Send Interview Calls" to email top 5

## 🔒 API Endpoints

### Authentication
```
POST /api/auth/register    - Register user
POST /api/auth/login       - Login user
GET  /api/auth/me          - Get current user
```

### Candidate Routes
```
POST   /api/candidate/upload-resume  - Upload resume
GET    /api/candidate/my-resume      - Get my resume
DELETE /api/candidate/my-resume      - Delete resume
```

### HR Routes
```
POST /api/hr/create-job                   - Create job & upload resumes
GET  /api/hr/my-jobs                      - Get all jobs
GET  /api/hr/job/:jobId/candidates        - Get ranked candidates
POST /api/hr/job/:jobId/send-invitations  - Send emails to top candidates
```

## 🎨 Screenshots

### Login Page
Clean authentication with role-based access control

### Candidate Dashboard
- Resume upload interface
- Match score display
- Missing skills analysis

### HR Dashboard
- Job creation form
- Ranked candidates table
- One-click email invitations

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Role-based authorization (HR/Candidate)
- ✅ Protected routes
- ✅ Input validation
- ✅ File type validation
- ✅ File size limits

## 📈 Performance Considerations

- **TF-IDF Complexity:** O(n * m) where n = resumes, m = vocabulary
- **Scalability:** Can handle 1000+ resumes per job
- **File Upload:** 5MB limit per resume, 50MB for ZIP
- **Database:** Indexed queries for fast retrieval

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongod --version

# Or use MongoDB Atlas connection string
```

### Email Not Sending
```bash
# Verify Gmail app password
# Check EMAIL_USER and EMAIL_PASS in .env
# Ensure 2-Step Verification is enabled
```

### Python Script Error
```bash
# Install dependencies
pip install -r ai-engine/requirements.txt

# Verify Python 3 is installed
python3 --version
```

### Port Already in Use
```bash
# Change PORT in backend/.env
# Or kill process using port
lsof -ti:5000 | xargs kill
```

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build production bundle: `npm run build`
2. Deploy build folder
3. Set REACT_APP_API_URL to production backend URL

### Database (MongoDB Atlas)
Use MongoDB Atlas for production database with proper access controls

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartrecruit
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Add more features (video interviews, skill assessments)
- Improve AI algorithm (use transformers, BERT)
- Add analytics dashboard
- Implement real-time notifications

## 📄 License

MIT License - Free to use for personal and commercial projects

## 👨‍💻 Author

Built for HR tech companies and recruitment platforms

## 🙏 Acknowledgments

- Scikit-learn for ML algorithms
- MongoDB for flexible data storage
- React for modern UI development
- Node.js for scalable backend

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify Python dependencies

---

**Happy Recruiting with AI! 🎉**
