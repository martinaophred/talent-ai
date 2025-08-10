# API Integration Guide

## Overview

The Recruiter page has been updated to use the actual Flask API instead of demo data. The system now connects to the TalentAI backend API running on `localhost:5000`.

## Features

### 1. Real API Integration
- **API Endpoint**: `http://localhost:5000/match`
- **Method**: POST
- **Content-Type**: application/json

### 2. Enhanced UI Features
- **API Health Check**: Automatically checks if the API server is running
- **Error Handling**: Displays helpful error messages when API calls fail
- **Loading States**: Shows loading indicators during API requests
- **Improved Candidate Display**: 
  - Color-coded match scores (green/yellow/red)
  - Truncated skills with "more" indicators
  - Career objective display
  - Better formatting for all candidate information

### 3. Data Processing
- **Skills Parsing**: Handles both comma-separated and JSON array formats
- **Array Normalization**: Ensures all array fields are properly handled
- **Fallback Values**: Provides default text for missing data

## API Request Format

```json
{
  "title": "Job Title",
  "description": "Job Description",
  "skills": ["skill1", "skill2", "skill3"],
  "top_k": 10,
  "filters": {
    "major_field_of_studies": ["Computer Science", "Engineering"]
  }
}
```

## API Response Format

```json
{
  "status": "success",
  "job_title": "Job Title",
  "candidates_found": 5,
  "candidates": [
    {
      "candidate_id": 123,
      "score": 0.85,
      "explanation": "Semantic match, skill overlap: 3",
      "career_objective": "Experienced ML engineer...",
      "skills": "Python, TensorFlow, Machine Learning",
      "educational_institution_name": ["MIT"],
      "degree_names": ["Master of Science"],
      "passing_years": ["2020"],
      "major_field_of_studies": ["Computer Science"],
      "professional_company_names": ["Google"]
    }
  ]
}
```

## Setup Instructions

### 1. Start the Flask API
```bash
cd Algorithm/talentai_api
python app.py
```

The API will start on `http://localhost:5000`

### 2. Start the Frontend
```bash
cd talent-ai
npm run dev
```

The frontend will start on `http://localhost:8080`

### 3. Access the Recruiter Page
Navigate to `http://localhost:8080/recruiter` in your browser.

## Usage

1. **Enter Job Details**:
   - Job Title
   - Job Description
   - Required Skills (comma-separated)
   - Number of candidates to return (Top K)
   - Optional: Major field filter

2. **Click "Run Match"** to find candidates

3. **View Results**:
   - Match scores with color coding
   - Candidate explanations
   - Skills, education, and experience
   - Career objectives

## Error Handling

The system provides several types of feedback:

- **🔄 Checking API connection...**: Initial health check
- **✅ API server is connected and ready**: API is available
- **⚠️ API server is not available**: API is down or unreachable
- **Error messages**: Specific API errors with details

## Troubleshooting

### API Not Available
- Ensure the Flask API is running on port 5000
- Check if the API files are in the correct location
- Verify all dependencies are installed

### CORS Issues
If you encounter CORS errors, the Flask API may need CORS headers. Add to `app.py`:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
```

### Data Format Issues
- Skills are automatically parsed from various formats
- Empty or missing data is handled gracefully
- Array fields are normalized to prevent errors

## Customization

### Changing API URL
Edit `talent-ai/src/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://your-api-url:port';
```

### Adding New Fields
1. Update the `MatchResponse` type in `api.ts`
2. Update the data transformation in `postMatch`
3. Update the UI components in `Recruiter.tsx`

## Performance Notes

- API responses are cached in the component state
- Health checks are performed on component mount
- Loading states prevent multiple simultaneous requests
- Error states are cleared on new requests
