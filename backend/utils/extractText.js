const pdf = require('pdf-parse');
const fs = require('fs').promises;

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from TXT file
 * @param {string} filePath - Path to TXT file
 * @returns {Promise<string>} - File content
 */
const extractTextFromTXT = async (filePath) => {
  try {
    const text = await fs.readFile(filePath, 'utf-8');
    return text;
  } catch (error) {
    console.error('Error reading text file:', error);
    throw new Error('Failed to read text file');
  }
};

/**
 * Extract text based on file type
 * @param {string} filePath - Path to file
 * @param {string} mimetype - File MIME type
 * @returns {Promise<string>} - Extracted text
 */
const extractText = async (filePath, mimetype) => {
  if (mimetype === 'application/pdf') {
    return await extractTextFromPDF(filePath);
  } else if (mimetype === 'text/plain') {
    return await extractTextFromTXT(filePath);
  } else {
    throw new Error('Unsupported file type. Please upload PDF or TXT files.');
  }
};

module.exports = {
  extractText,
  extractTextFromPDF,
  extractTextFromTXT
};
