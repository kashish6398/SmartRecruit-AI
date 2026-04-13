#!/usr/bin/env python3
"""
SmartRecruit AI Ranking Engine
Uses TF-IDF and Cosine Similarity to rank resumes against job descriptions
"""

import sys
import json
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def preprocess_text(text):
    """
    Clean and preprocess text
    - Convert to lowercase
    - Remove special characters
    - Remove extra whitespace
    """
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s+#]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_skills(text, skill_keywords):
    """
    Extract skills from text based on keyword matching
    Returns list of found skills
    """
    text_lower = text.lower()
    found_skills = []
    
    for skill in skill_keywords:
        skill_lower = skill.lower()
        # Check if skill exists as whole word
        if re.search(r'\b' + re.escape(skill_lower) + r'\b', text_lower):
            found_skills.append(skill)
    
    return found_skills

def find_missing_skills(resume_text, required_skills):
    """
    Find skills that are in required_skills but not in resume
    """
    resume_lower = resume_text.lower()
    missing_skills = []
    
    for skill in required_skills:
        skill_lower = skill.lower()
        if not re.search(r'\b' + re.escape(skill_lower) + r'\b', resume_lower):
            missing_skills.append(skill)
    
    return missing_skills

def calculate_similarity(job_description, resumes):
    """
    Calculate TF-IDF cosine similarity between job description and resumes
    Returns similarity scores
    """
    # Preprocess all texts
    job_desc_processed = preprocess_text(job_description)
    resumes_processed = [preprocess_text(resume['text']) for resume in resumes]
    
    # Combine all documents
    documents = [job_desc_processed] + resumes_processed
    
    # Create TF-IDF vectorizer
    # Use word-level TF-IDF with unigrams and bigrams
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),  # unigrams and bigrams
        min_df=1,
        stop_words='english',
        max_features=1000
    )
    
    # Fit and transform documents
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    # Calculate cosine similarity between job description (index 0) and all resumes
    job_vector = tfidf_matrix[0:1]
    resume_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(job_vector, resume_vectors)[0]
    
    return similarities

def rank_resumes(job_description, required_skills, resumes):
    """
    Main function to rank resumes
    Returns ranked list of resumes with scores and missing skills
    """
    # Calculate similarity scores
    similarity_scores = calculate_similarity(job_description, resumes)
    
    # Prepare ranked results
    ranked_resumes = []
    
    for idx, resume in enumerate(resumes):
        resume_text = resume['text']
        resume_id = resume['_id']
        
        # Get similarity score
        match_score = float(similarity_scores[idx])
        
        # Find missing skills
        missing_skills = find_missing_skills(resume_text, required_skills)
        
        ranked_resumes.append({
            'resume_id': resume_id,
            'match_score': match_score,
            'missing_skills': missing_skills
        })
    
    # Sort by match score (descending)
    ranked_resumes.sort(key=lambda x: x['match_score'], reverse=True)
    
    return ranked_resumes

def main():
    """
    Main function - reads JSON from stdin, processes, and outputs JSON to stdout
    """
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        job_description = data['job_description']
        required_skills = data.get('required_skills', [])
        resumes = data['resumes']
        
        # Rank resumes
        ranked_resumes = rank_resumes(job_description, required_skills, resumes)
        
        # Output results as JSON
        output = {
            'success': True,
            'ranked_resumes': ranked_resumes
        }
        
        print(json.dumps(output))
        sys.exit(0)
        
    except Exception as e:
        error_output = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_output), file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
