require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend (for deployment)
app.use(express.static('../frontend'));

// Mock database for resume data (in a real app, use a proper database)
let resumeDataStore = {};

// API endpoint to save resume data
app.post('/api/save-resume', (req, res) => {
    const { userId, resumeData } = req.body;
    
    if (!userId || !resumeData) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    resumeDataStore[userId] = resumeData;
    res.json({ success: true, message: 'Resume saved successfully' });
});

// API endpoint to get resume data
app.get('/api/get-resume/:userId', (req, res) => {
    const { userId } = req.params;
    
    if (!resumeDataStore[userId]) {
        return res.status(404).json({ success: false, error: 'Resume not found' });
    }

    res.json({ success: true, resumeData: resumeDataStore[userId] });
});

// Enhanced AI Analysis endpoint
app.post('/api/analyze', async (req, res) => {
    const { jobDescription, currentResume } = req.body;
    
    if (!jobDescription) {
        return res.status(400).json({ success: false, error: 'Job description is required' });
    }

    try {
        // In a real implementation, you would call an actual AI API here
        // This is an enhanced mock implementation that provides more detailed suggestions
        
        // 1. Extract keywords from job description
        const keywords = extractKeywords(jobDescription);
        
        // 2. Analyze skills match
        const currentSkills = currentResume?.skills || [];
        const missingSkills = findMissingSkills(keywords, currentSkills);
        
        // 3. Generate tailored suggestions
        const suggestions = [
            `Include these keywords: ${keywords.slice(0, 5).join(', ')}`,
            ...(missingSkills.length > 0 
                ? [`Consider adding these skills: ${missingSkills.slice(0, 3).join(', ')}`] 
                : []),
            "Use action verbs like 'developed', 'managed', 'implemented'",
            "Quantify achievements with numbers where possible",
            "Highlight relevant projects that match the job requirements",
            "Tailor your professional summary to emphasize relevant experience"
        ];
        
        // 4. Formatting suggestions
        if (currentResume) {
            if (!currentResume.summary || currentResume.summary.length < 50) {
                suggestions.push("Consider expanding your professional summary to 3-4 sentences");
            }
            
            if (currentResume.experience && currentResume.experience.length === 0) {
                suggestions.push("Add at least one work experience entry");
            }
        }
        
        res.json({ 
            success: true, 
            suggestions,
            keywords: keywords.slice(0, 10),
            missingSkills: missingSkills.slice(0, 5)
        });
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({ success: false, error: 'AI analysis failed' });
    }
});

// Helper function to extract keywords
function extractKeywords(text) {
    // Remove special characters and convert to lowercase
    const cleanedText = text.replace(/[^\w\s]/gi, '').toLowerCase();
    
    // Common words to exclude
    const stopWords = new Set(['the', 'and', 'of', 'in', 'to', 'a', 'with', 'for', 'on', 'at', 'by', 'this', 'that']);
    
    // Extract words
    const words = cleanedText.split(/\s+/);
    
    // Filter and count words
    const wordCount = {};
    words.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
            wordCount[word] = (wordCount[word] || 0) + 1;
        }
    });
    
    // Sort by frequency
    const sortedKeywords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);
    
    return sortedKeywords;
}

// Helper function to find missing skills
function findMissingSkills(keywords, currentSkills) {
    const currentSkillsLower = currentSkills.map(skill => skill.toLowerCase());
    return keywords.filter(keyword => 
        !currentSkillsLower.includes(keyword.toLowerCase())
    );
}

// Generate PDF endpoint (mock implementation)
app.post('/api/generate-pdf', (req, res) => {
    const { resumeData } = req.body;
    
    if (!resumeData) {
        return res.status(400).json({ success: false, error: 'Resume data is required' });
    }

    // In a real implementation, you would use a PDF generation library
    // like pdfkit, puppeteer, or a service like DocRaptor
    
    // Mock response
    res.json({ 
        success: true, 
        message: 'PDF generated successfully',
        pdfUrl: 'https://example.com/generated-resume.pdf' // Mock URL
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API endpoints:`);
    console.log(`- POST http://localhost:${PORT}/api/save-resume`);
    console.log(`- GET  http://localhost:${PORT}/api/get-resume/:userId`);
    console.log(`- POST http://localhost:${PORT}/api/analyze`);
    console.log(`- POST http://localhost:${PORT}/api/generate-pdf`);
});