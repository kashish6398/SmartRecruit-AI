const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send interview invitation email
 * @param {string} candidateEmail - Candidate's email
 * @param {string} candidateName - Candidate's name
 * @param {string} jobTitle - Job title
 * @param {number} matchScore - Match score percentage
 */
const sendInterviewInvitation = async (candidateEmail, candidateName, jobTitle, matchScore) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `SmartRecruit <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: `Interview Invitation - ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .score { font-size: 24px; color: #4CAF50; font-weight: bold; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
          </div>
          <div class="content">
            <h2>Dear ${candidateName},</h2>
            <p>We are pleased to inform you that your profile has been shortlisted for the position of <strong>${jobTitle}</strong>.</p>
            <p>Your profile match score: <span class="score">${matchScore}%</span></p>
            <p>We would like to invite you for an interview to discuss this opportunity further.</p>
            <p>Our HR team will contact you shortly with the interview details.</p>
            <p>Please keep your phone and email accessible.</p>
            <br>
            <p>Best regards,<br>
            <strong>SmartRecruit Team</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email from SmartRecruit AI-Powered Recruitment System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${candidateEmail}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(`Failed to send email to ${candidateEmail}:`, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send bulk interview invitations
 * @param {Array} candidates - Array of candidate objects
 * @param {string} jobTitle - Job title
 */
const sendBulkInterviewInvitations = async (candidates, jobTitle) => {
  const results = [];
  
  for (const candidate of candidates) {
    try {
      await sendInterviewInvitation(
        candidate.candidateEmail,
        candidate.candidateName,
        jobTitle,
        candidate.matchScore
      );
      results.push({ email: candidate.candidateEmail, success: true });
    } catch (error) {
      results.push({ email: candidate.candidateEmail, success: false, error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendInterviewInvitation,
  sendBulkInterviewInvitations
};
