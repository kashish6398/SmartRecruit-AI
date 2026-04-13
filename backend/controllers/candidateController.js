const Resume = require('../models/Resume');
const mongoose = require('mongoose');
const { extractText } = require('../utils/extractText');
const fs = require('fs').promises;

/**
 * Upload resume
 * @route POST /api/candidate/upload-resume
 * @access Private (Candidate only)
 */
exports.uploadResume = async (req, res) => {
  try {
    const allUsers = await mongoose.model('User').find({}, {email: 1});
    console.log('--- USERS IN THIS DB:', allUsers);

    // 1. Check req.file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file'
      });
    }

    // Extract text from uploaded file
    const resumeText = await extractText(req.file.path, req.file.mimetype);

    if (!resumeText || resumeText.trim().length === 0) {
      // Delete uploaded file if text extraction fails
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from the uploaded file'
      });
    }

    // Check if candidate already has a resume
    const existingResume = await Resume.findOne({ candidateId: req.user._id });
    
    if (existingResume) {
      // Delete old file
      try {
        await fs.unlink(existingResume.filePath);
      } catch (err) {
        console.log('Old file not found or already deleted');
      }

      // Update existing resume
      existingResume.resumeText = resumeText;
      existingResume.fileName = req.file.filename;
      existingResume.filePath = req.file.path;
      existingResume.uploadedAt = Date.now();
      existingResume.matchScore = 0; // Reset match score
      existingResume.missingSkills = []; // Reset missing skills
      existingResume.jobId = null; // Reset job reference

      const savedExistingResume = await existingResume.save();

      return res.status(200).json({
        success: true,
        message: 'Resume updated successfully',
        data: savedExistingResume
      });
    }

    // 2. Explicit Save logic
    const newResume = new Resume({
      candidateId: req.user._id,
      candidateName: req.user.name,
      candidateEmail: req.user.email,
      resumeText: resumeText,
      fileName: req.file.filename,
      filePath: req.file.path
    });

    const savedResume = await newResume.save();

    // 4. Return Data
    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: savedResume
    });
  } catch (error) {
    // 3. Try-Catch Logging
    console.error('DATABASE SAVE ERROR:', error.message);
    
    // Delete uploaded file in case of error
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (err) {
        console.log('Error deleting file:', err);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error during resume upload',
      error: error.message
    });
  }
};

/**
 * Get candidate's resume
 * @route GET /api/candidate/my-resume
 * @access Private (Candidate only)
 */
exports.getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ candidateId: req.user._id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found. Please upload your resume.'
      });
    }

    res.status(200).json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete candidate's resume
 * @route DELETE /api/candidate/my-resume
 * @access Private (Candidate only)
 */
exports.deleteMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ candidateId: req.user._id });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found'
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.filePath);
    } catch (err) {
      console.log('File not found or already deleted');
    }

    // Delete from database
    await Resume.deleteOne({ _id: resume._id });

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
