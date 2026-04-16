import React, { useState, useEffect } from 'react';
import { candidateAPI } from '../services/api';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

function CandidateDashboard({ onLogout }) {
  const [resume, setResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isResumeExpanded, setIsResumeExpanded] = useState(false);

  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail') || 'Not specified';

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await candidateAPI.getMyResume();
      setResume(response.data.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Error fetching resume:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setMessage({ text: 'Please upload only PDF or TXT files', type: 'error' });
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        return;
      }
      setSelectedFile(file);
      setMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ text: 'Please select a file first', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await candidateAPI.uploadResume(formData);
      setResume(response.data.data);
      setSelectedFile(null);
      setMessage({ text: 'Resume uploaded successfully!', type: 'success' });
      
      // Clear file input
      document.getElementById('fileInput').value = '';
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to upload resume', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    try {
      await candidateAPI.deleteMyResume();
      setResume(null);
      setMessage({ text: 'Resume deleted successfully', type: 'success' });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to delete resume', 
        type: 'error' 
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Candidate Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {userName}!</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="upload-section">
          <h2>Upload Your Resume</h2>
          <p>Upload your resume in PDF or TXT format (Max 5MB)</p>

          <div className="file-upload">
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput" className="file-label">
              {selectedFile ? selectedFile.name : 'Choose File'}
            </label>
            
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="btn-primary"
            >
              {uploading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </div>
        </div>

        {resume && (
          <div className="resume-info">
            <h2>Your Resume Details</h2>
            <div className="info-card">
              <div className="info-header">
                <FileText size={20} className="info-icon" />
                <h3>{resume.fileName}</h3>
                <span className="upload-date">
                  {new Date(resume.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              
              {resume.matchScore > 0 && (
                <div className="match-stats">
                  <div className="stat-box">
                    <span className="stat-label">Match Score</span>
                    <span className="score">{resume.matchScore}%</span>
                  </div>
                  {resume.missingSkills && resume.missingSkills.length > 0 && (
                    <div className="stat-box full-width">
                      <span className="stat-label">Missing Skills</span>
                      <span className="missing-skills">{resume.missingSkills.join(', ')}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="resume-preview-section">
                <div className="preview-header">
                  <h4>Structured Summary</h4>
                  <button 
                    onClick={() => setIsResumeExpanded(!isResumeExpanded)} 
                    className="btn-expand"
                  >
                    {isResumeExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isResumeExpanded ? 'Collapse' : 'View Full Resume'}
                  </button>
                </div>
                
                <div className={`resume-structured-content ${isResumeExpanded ? 'expanded' : 'collapsed'}`}>
                  <ul className="structured-list">
                    <li><strong>Name:</strong> <span>{resume.candidateName || userName}</span></li>
                    <li><strong>Email:</strong> <span>{resume.candidateEmail || userEmail}</span></li>
                    <li><strong>Summary:</strong> <span>{resume.resumeText.substring(0, 200)}...</span></li>
                  </ul>

                  {isResumeExpanded && (
                     <div className="full-text">
                       <h5>Full Extracted Content</h5>
                       <p>{resume.resumeText}</p>
                     </div>
                  )}
                </div>
              </div>

              <div className="card-actions">
                <button onClick={handleDelete} className="btn-danger">
                  Delete Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateDashboard;
