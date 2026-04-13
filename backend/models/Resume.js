const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidateName: {
    type: String,
    required: true
  },
  candidateEmail: {
    type: String,
    required: true
  },
  resumeText: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  // Fields populated after AI ranking
  matchScore: {
    type: Number,
    default: 0
  },
  missingSkills: {
    type: [String],
    default: []
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription'
  }
});

module.exports = mongoose.model('Resume', resumeSchema, 'resumes');
