document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addSkillBtn = document.getElementById('add-skill');
    const skillsContainer = document.getElementById('skills-container');
    const newSkillInput = document.getElementById('new-skill');
    
    const addExperienceBtn = document.getElementById('add-experience');
    const experienceContainer = document.getElementById('experience-container');
    
    const addEducationBtn = document.getElementById('add-education');
    const educationContainer = document.getElementById('education-container');
    
    const addProjectBtn = document.getElementById('add-project');
    const projectsContainer = document.getElementById('projects-container');
    
    const addAchievementBtn = document.getElementById('add-achievement');
    const achievementsContainer = document.getElementById('achievements-container');
    
    const addLanguageBtn = document.getElementById('add-language');
    const languagesContainer = document.getElementById('languages-container');
    const newLanguageInput = document.getElementById('new-language');
    
    const addTrainingBtn = document.getElementById('add-training');
    const trainingContainer = document.getElementById('training-container');
    
    const analyzeBtn = document.getElementById('analyze-btn');
    const jobDescriptionTextarea = document.getElementById('job-description');
    const aiSuggestionsDiv = document.getElementById('ai-suggestions');
    
    const generateResumeBtn = document.getElementById('generate-resume');
    const previewResumeBtn = document.getElementById('preview-resume');

    // Add Skill
    addSkillBtn.addEventListener('click', function() {
        const skill = newSkillInput.value.trim();
        if (skill) {
            addTag(skillsContainer, skill);
            newSkillInput.value = '';
        }
    });

    newSkillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addSkillBtn.click();
        }
    });

    // Add Experience
    addExperienceBtn.addEventListener('click', function() {
        const experienceEntry = createEntry(
            'experience',
            ['Job Title', 'Company', 'Location'],
            'Description of your responsibilities and achievements'
        );
        experienceContainer.appendChild(experienceEntry);
    });

    // Add Education
    addEducationBtn.addEventListener('click', function() {
        const educationEntry = createEntry(
            'education',
            ['Degree', 'Institution', 'Field of Study'],
            'Notable achievements or coursework'
        );
        educationContainer.appendChild(educationEntry);
    });

    // Add Project
    addProjectBtn.addEventListener('click', function() {
        const projectEntry = createEntry(
            'project',
            ['Project Name', 'Technologies Used'],
            'Project description and your contributions'
        );
        projectsContainer.appendChild(projectEntry);
    });

    // Add Achievement
    addAchievementBtn.addEventListener('click', function() {
        const achievementEntry = createEntry(
            'achievement',
            ['Achievement Title'],
            'Details about your achievement'
        );
        achievementsContainer.appendChild(achievementEntry);
    });

    // Add Language
    addLanguageBtn.addEventListener('click', function() {
        const language = newLanguageInput.value.trim();
        if (language) {
            addTag(languagesContainer, language);
            newLanguageInput.value = '';
        }
    });

    newLanguageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addLanguageBtn.click();
        }
    });

    // Add Training/Certification
    addTrainingBtn.addEventListener('click', function() {
        const trainingEntry = createEntry(
            'training',
            ['Course/Certification Name', 'Issuing Organization'],
            'Skills gained or notable information'
        );
        trainingContainer.appendChild(trainingEntry);
    });

    // Helper function to create entry sections
    function createEntry(type, fields, descriptionPlaceholder) {
        const entry = document.createElement('div');
        entry.className = 'entry';
        
        let html = `<div class="entry-fields">`;
        
        fields.forEach(field => {
            html += `<input type="text" placeholder="${field}" class="entry-field">`;
        });
        
        html += `
            <input type="text" placeholder="Date/Duration (e.g., 2020-2022)" class="entry-dates">
            <textarea placeholder="${descriptionPlaceholder}" class="entry-description"></textarea>
        </div>
        <button class="remove-btn">×</button>
        `;
        
        entry.innerHTML = html;
        
        // Add remove functionality
        entry.querySelector('.remove-btn').addEventListener('click', function() {
            entry.parentNode.removeChild(entry);
        });
        
        return entry;
    }

    // Helper function to add tags (for skills and languages)
    function addTag(container, text) {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${text}
            <button class="remove-tag">×</button>
        `;
        
        tag.querySelector('.remove-tag').addEventListener('click', function() {
            container.removeChild(tag);
        });
        
        container.appendChild(tag);
    }

    // AI Analysis feature
    analyzeBtn.addEventListener('click', async function() {
        const jobDescription = jobDescriptionTextarea.value.trim();
        if (!jobDescription) {
            alert('Please paste a job description first');
            return;
        }

        aiSuggestionsDiv.innerHTML = '<p>Analyzing with AI...<p>';
        
        try {
            const response = await fetch('http://localhost:3000/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobDescription })
            });
            
            const data = await response.json();
            
            if (data.suggestions) {
                let suggestionsHTML = '<h3>AI Suggestions:</h3><ul>';
                data.suggestions.forEach(suggestion => {
                    suggestionsHTML += `<li>${suggestion}</li>`;
                });
                suggestionsHTML += '</ul>';
                aiSuggestionsDiv.innerHTML = suggestionsHTML;
            }
        } catch (error) {
            aiSuggestionsDiv.innerHTML = '<p class="error">Failed to get AI suggestions. Please try again.</p>';
            console.error('Error:', error);
        }
    });

    // Generate Resume
    generateResumeBtn.addEventListener('click', function() {
        alert('Resume PDF generation would be implemented here. In a full app, this would create a PDF using a library like jsPDF or html2pdf.');
    });

    // Preview Resume
    previewResumeBtn.addEventListener('click', function() {
        alert('Resume preview would be implemented here. In a full app, this would show a formatted version of the resume.');
    });
});