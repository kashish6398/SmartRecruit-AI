const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const {
  uploadResume,
  getMyResume,
  deleteMyResume
} = require('../controllers/candidateController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF and TXT files only
  if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and TXT files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// All routes are protected and require candidate role
router.use(protect);
router.use(authorize('candidate'));

// Candidate routes
router.post('/upload-resume', upload.single('resume'), uploadResume);
router.get('/my-resume', getMyResume);
router.delete('/my-resume', deleteMyResume);

module.exports = router;
