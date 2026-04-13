const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const {
  createJobAndProcessResumes,
  getMyJobs,
  getRankedCandidates,
  sendInterviewInvitations
} = require('../controllers/hrController');

// Configure multer for multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'hr-upload-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF, TXT, and ZIP files
  const allowedTypes = ['application/pdf', 'text/plain', 'application/zip', 'application/x-zip-compressed'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, and ZIP files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for ZIP files
  }
});

// All routes are protected and require HR role
router.use(protect);
router.use(authorize('hr'));

// HR routes
router.post('/create-job', upload.array('resumes', 100), createJobAndProcessResumes);
router.get('/my-jobs', getMyJobs);
router.get('/job/:jobId/candidates', getRankedCandidates);
router.post('/job/:jobId/send-invitations', sendInterviewInvitations);

module.exports = router;
