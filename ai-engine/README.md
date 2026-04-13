# SmartRecruit AI Ranking Engine

## Overview
This Python script uses Natural Language Processing (NLP) to rank resumes based on their similarity to job descriptions.

## Technology Stack
- **TF-IDF (Term Frequency-Inverse Document Frequency)**: Converts text documents into numerical vectors
- **Cosine Similarity**: Measures similarity between job description and resume vectors
- **Scikit-learn**: Machine learning library for NLP operations

## How It Works

### 1. Text Preprocessing
- Converts all text to lowercase
- Removes special characters
- Normalizes whitespace
- Removes English stop words

### 2. TF-IDF Vectorization
- Creates numerical representation of text documents
- Uses unigrams (single words) and bigrams (two-word phrases)
- Calculates importance of each term across all documents

### 3. Cosine Similarity Calculation
- Measures angle between job description vector and each resume vector
- Score ranges from 0 (no similarity) to 1 (identical)
- Higher score = better match

### 4. Skills Gap Analysis
- Identifies required skills missing from each resume
- Uses regex pattern matching for skill detection
- Returns list of missing skills for each candidate

## Input Format
```json
{
  "job_description": "We are looking for a Full Stack Developer...",
  "required_skills": ["React", "Node.js", "MongoDB"],
  "resumes": [
    {
      "_id": "resume_id_1",
      "text": "Experienced developer with React and Node.js..."
    }
  ]
}
```

## Output Format
```json
{
  "success": true,
  "ranked_resumes": [
    {
      "resume_id": "resume_id_1",
      "match_score": 0.85,
      "missing_skills": ["MongoDB"]
    }
  ]
}
```

## Installation
```bash
pip install -r requirements.txt
```

## Usage
The script is called by the Node.js backend via child process:
```bash
python3 ranking_engine.py < input.json
```

## Algorithm Complexity
- Time Complexity: O(n * m) where n = number of resumes, m = vocabulary size
- Space Complexity: O(n * m) for TF-IDF matrix storage
