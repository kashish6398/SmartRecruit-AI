import React, { useState, useEffect } from 'react';
import { hrAPI } from '../services/api';

function HRDashboard({ onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requiredSkills: ''
  });
  const [resumeFiles, setResumeFiles] = useState([]);

  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await hrAPI.getMyJobs();
      setJobs(response.data.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchCandidates = async (jobId) => {
    setLoading(true);
    try {
      const response = await hrAPI.getCandidates(jobId);
      setCandidates(response.data.data);
      setSelectedJob(response.data.job);
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to fetch candidates', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setResumeFiles(Array.from(e.target.files));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    
    // Convert comma-separated skills to array
    const skillsArray = formData.requiredSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    formDataToSend.append('requiredSkills', JSON.stringify(skillsArray));

    // Append resume files
    resumeFiles.forEach(file => {
      formDataToSend.append('resumes', file);
    });

    try {
      await hrAPI.createJob(formDataToSend);
      setMessage({ text: 'Job created and resumes processed successfully!', type: 'success' });
      setShowCreateForm(false);
      setFormData({ title: '', description: '', requiredSkills: '' });
      setResumeFiles([]);
      fetchJobs();
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to create job', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitations = async (jobId) => {
    if (!window.confirm('Send interview invitations to top 5 candidates?')) {
      return;
    }

    try {
      const response = await hrAPI.sendInvitations(jobId, { topN: 5 });
      setMessage({ 
        text: response.data.message, 
        type: 'success' 
      });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || 'Failed to send invitations', 
        type: 'error' 
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>HR Dashboard</h1>
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

        {!showCreateForm && !selectedJob && (
          <>
            <div className="section-header">
              <h2>My Jobs</h2>
              <button 
                onClick={() => setShowCreateForm(true)} 
                className="btn-primary"
              >
                Create New Job
              </button>
            </div>

            <div className="jobs-list">
              {jobs.length === 0 ? (
                <p>No jobs created yet. Click "Create New Job" to get started.</p>
              ) : (
                jobs.map(job => (
                  <div key={job._id} className="job-card">
                    <h3>{job.title}</h3>
                    <p>{job.description.substring(0, 150)}...</p>
                    <div className="job-meta">
                      <span>Skills: {job.requiredSkills.join(', ')}</span>
                      <span>Created: {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                      onClick={() => fetchCandidates(job._id)} 
                      className="btn-primary"
                    >
                      View Candidates
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {showCreateForm && (
          <div className="create-job-form">
            <div className="section-header">
              <h2>Create New Job</h2>
              <button 
                onClick={() => setShowCreateForm(false)} 
                className="btn-secondary"
              >
                Back to Jobs
              </button>
            </div>

            <form onSubmit={handleCreateJob}>
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                  placeholder="e.g., Full Stack Developer"
                />
              </div>

              <div className="form-group">
                <label>Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows="6"
                  placeholder="Enter detailed job description..."
                />
              </div>

              <div className="form-group">
                <label>Required Skills (comma-separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleFormChange}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>

              <div className="form-group">
                <label>Upload Resumes (PDF/TXT or ZIP)</label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.txt,.zip"
                  onChange={handleFileChange}
                />
                {resumeFiles.length > 0 && (
                  <p className="file-count">{resumeFiles.length} file(s) selected</p>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Job & Process Resumes'}
              </button>
            </form>
          </div>
        )}

        {selectedJob && (
          <div className="candidates-section">
            <div className="section-header">
              <h2>Candidates for: {selectedJob.title}</h2>
              <div>
                <button 
                  onClick={() => handleSendInvitations(candidates[0]?.jobId)} 
                  className="btn-success"
                  disabled={candidates.length === 0}
                >
                  Send Interview Calls (Top 5)
                </button>
                <button 
                  onClick={() => { setSelectedJob(null); setCandidates([]); }} 
                  className="btn-secondary"
                >
                  Back to Jobs
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading candidates...</p>
            ) : candidates.length === 0 ? (
              <p>No candidates found for this job.</p>
            ) : (
              <div className="candidates-table">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Match Score</th>
                      <th>Missing Skills</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.map((candidate, index) => (
                      <tr key={candidate._id}>
                        <td>{index + 1}</td>
                        <td>{candidate.candidateName}</td>
                        <td>{candidate.candidateEmail}</td>
                        <td>
                          <span className={`score-badge ${
                            candidate.matchScore >= 70 ? 'high' : 
                            candidate.matchScore >= 50 ? 'medium' : 'low'
                          }`}>
                            {candidate.matchScore}%
                          </span>
                        </td>
                        <td>
                          {candidate.missingSkills.length > 0 
                            ? candidate.missingSkills.join(', ') 
                            : 'None'}
                        </td>
                        <td>{new Date(candidate.uploadedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default HRDashboard;
