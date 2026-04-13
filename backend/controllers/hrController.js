const JobDescription = require('../models/JobDescription');
const Resume = require('../models/Resume');
const { extractText } = require('../utils/extractText');
const { sendBulkInterviewInvitations } = require('../utils/emailService');
const fs = require('fs').promises;
const path = require('path');
const extract = require('extract-zip');
const { spawn } = require('child_process');

/**
 * Create job description and process resumes
 * @route POST /api/hr/create-job
 * @access Private (HR only)
 */
exports.createJobAndProcessResumes = async (req, res) => {
  let uploadedFiles = [];
  
  try {
    const { title, description, requiredSkills } = req.body;

    // Validate inputs
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title and description'
      });
    }

    // Parse required skills (if sent as JSON string)
    let skillsArray = [];
    if (requiredSkills) {
      try {
        skillsArray = typeof requiredSkills === 'string' 
          ? JSON.parse(requiredSkills) 
          : requiredSkills;
      } catch (err) {
        skillsArray = requiredSkills.split(',').map(s => s.trim());
      }
    }

    // Create job description
    const jobDescription = await JobDescription.create({
      hrId: req.user._id,
      title,
      description,
      requiredSkills: skillsArray
    });

    // Process uploaded resume files (ZIP or individual files)
    let resumeFiles = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        uploadedFiles.push(file.path);
        
        if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
          // Extract ZIP file
          const extractPath = path.join(path.dirname(file.path), `extracted_${Date.now()}`);
          await fs.mkdir(extractPath, { recursive: true });
          await extract(file.path, { dir: extractPath });

          // Get all PDF/TXT files from extracted folder
          const files = await fs.readdir(extractPath);
          for (const fileName of files) {
            const filePath = path.join(extractPath, fileName);
            const stats = await fs.stat(filePath);
            
            if (stats.isFile() && (fileName.endsWith('.pdf') || fileName.endsWith('.txt'))) {
              resumeFiles.push({
                path: filePath,
                name: fileName,
                mimetype: fileName.endsWith('.pdf') ? 'application/pdf' : 'text/plain'
              });
            }
          }
        } else {
          resumeFiles.push({
            path: file.path,
            name: file.originalname,
            mimetype: file.mimetype
          });
        }
      }
    }

    // Process each resume and store in database
    const processedResumes = [];
    for (const file of resumeFiles) {
      try {
        const resumeText = await extractText(file.path, file.mimetype);
        
        if (resumeText && resumeText.trim().length > 0) {
          // Extract candidate name and email from resume text (basic extraction)
          const emailMatch = resumeText.match(/[\w\.-]+@[\w\.-]+\.\w+/);
          const candidateEmail = emailMatch ? emailMatch[0] : 'no-email@example.com';
          
          // Try to extract name (first line or first few words)
          const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
          const candidateName = lines[0] ? lines[0].substring(0, 50).trim() : 'Unknown Candidate';

          const resume = await Resume.create({
            candidateId: req.user._id, // Temporary - using HR ID
            candidateName,
            candidateEmail,
            resumeText,
            fileName: file.name,
            filePath: file.path,
            jobId: jobDescription._id
          });

          processedResumes.push(resume);
        }
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
    }

    // Run AI ranking if resumes were processed
    if (processedResumes.length > 0) {
      await runAIRanking(jobDescription, processedResumes);
    }

    res.status(201).json({
      success: true,
      message: 'Job created and resumes processed successfully',
      data: {
        job: jobDescription,
        processedResumes: processedResumes.length
      }
    });
  } catch (error) {
    console.error('Create job error:', error);
    
    // Clean up uploaded files
    for (const filePath of uploadedFiles) {
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.log('Error deleting file:', err);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error during job creation',
      error: error.message
    });
  }
};

/**
 * Run AI ranking using Python script
 * @param {Object} jobDescription - Job description document
 * @param {Array} resumes - Array of resume documents
 */
const runAIRanking = async (jobDescription, resumes) => {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '../../ai-engine/ranking_engine.py');
    
    // Prepare data for Python script
    const inputData = {
      job_description: jobDescription.description,
      required_skills: jobDescription.requiredSkills,
      resumes: resumes.map(resume => ({
        _id: resume._id.toString(),
        text: resume.resumeText
      }))
    };

    const pythonProcess = spawn('python3', [pythonScriptPath]);
    
    let dataString = '';
    let errorString = '';

    // Send input data to Python script
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorString);
        return reject(new Error('AI ranking failed'));
      }

      try {
        const results = JSON.parse(dataString);
        
        // Update resumes with match scores and missing skills
        for (const result of results.ranked_resumes) {
          await Resume.findByIdAndUpdate(result.resume_id, {
            matchScore: Math.round(result.match_score * 100),
            missingSkills: result.missing_skills
          });
        }

        resolve(results);
      } catch (err) {
        console.error('Error parsing AI results:', err);
        reject(err);
      }
    });
  });
};

/**
 * Get all jobs created by HR
 * @route GET /api/hr/my-jobs
 * @access Private (HR only)
 */
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await JobDescription.find({ hrId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get ranked candidates for a specific job
 * @route GET /api/hr/job/:jobId/candidates
 * @access Private (HR only)
 */
exports.getRankedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Verify job belongs to this HR
    const job = await JobDescription.findOne({ _id: jobId, hrId: req.user._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Get all resumes for this job, sorted by match score
    const resumes = await Resume.find({ jobId })
      .sort({ matchScore: -1 })
      .select('candidateName candidateEmail matchScore missingSkills fileName uploadedAt');

    res.status(200).json({
      success: true,
      job: {
        title: job.title,
        description: job.description,
        requiredSkills: job.requiredSkills
      },
      count: resumes.length,
      data: resumes
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Send interview invitations to top candidates
 * @route POST /api/hr/job/:jobId/send-invitations
 * @access Private (HR only)
 */
exports.sendInterviewInvitations = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { topN = 5 } = req.body; // Default: top 5 candidates

    // Verify job belongs to this HR
    const job = await JobDescription.findOne({ _id: jobId, hrId: req.user._id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Get top N candidates
    const topCandidates = await Resume.find({ jobId })
      .sort({ matchScore: -1 })
      .limit(topN)
      .select('candidateName candidateEmail matchScore');

    if (topCandidates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No candidates found for this job'
      });
    }

    // Send emails
    const results = await sendBulkInterviewInvitations(topCandidates, job.title);

    res.status(200).json({
      success: true,
      message: `Interview invitations sent to ${topCandidates.length} candidates`,
      data: results
    });
  } catch (error) {
    console.error('Send invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during sending invitations',
      error: error.message
    });
  }
};
