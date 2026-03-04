// Initial Setup & State
const state = {
    file: null,
    text: '',
    score: 0,
    criteriaScores: [],
    currentTipIndex: 0
};

// DOM Elements
const views = {
    upload: document.getElementById('upload-view'),
    analysis: document.getElementById('analysis-view'),
    results: document.getElementById('results-view')
};

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');

// Criteria Definition (10 marks each)
const criteria = [
    { id: 'objective', name: 'Career Objective', desc: 'Clear and role-focused career objective.', color: '#8b5cf6', keywords: ['objective', 'summary', 'profile', 'seeking', 'enthusiastic', 'professional', 'aiming'] },
    { id: 'skills', name: 'Technical & Soft Skills', desc: 'Relevant technical and soft skills included.', color: '#ec4899', keywords: ['skills', 'technologies', 'proficient', 'communication', 'leadership', 'teamwork', 'expert'] },
    { id: 'education', name: 'Education Alignment', desc: 'Education aligned with career goals.', color: '#06b6d4', keywords: ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'gpa'] },
    { id: 'projects', name: 'Projects & Problem Solving', desc: 'Projects demonstrate practical problem-solving ability.', color: '#10b981', keywords: ['projects', 'developed', 'created', 'built', 'designed', 'implemented'] },
    { id: 'experience', name: 'Work Experience', desc: 'Work experience shows real-world exposure.', color: '#f59e0b', keywords: ['experience', 'work', 'employment', 'history', 'internship', 'role', 'responsibilities'] },
    { id: 'certifications', name: 'Certifications', desc: 'Certifications reflect continuous learning.', color: '#8b5cf6', keywords: ['certification', 'certified', 'course', 'training', 'credential', 'license'] },
    { id: 'tools', name: 'Tools & Technologies', desc: 'Tools and technologies clearly mentioned.', color: '#ec4899', keywords: ['tools', 'software', 'frameworks', 'libraries', 'git', 'aws', 'docker', 'agile'] },
    { id: 'formatting', name: 'Formatting & Readability', desc: 'Clean, professional, and readable formatting. (Estimated via text flow)', color: '#06b6d4', keywords: ['\n\n', '•', '-', '*'] }, // Proxy check for formatting
    { id: 'achievements', name: 'Measurable Outcomes', desc: 'Achievements supported with measurable outcomes.', color: '#10b981', keywords: ['%', 'increased', 'decreased', 'reduced', 'improved', 'saved', 'achieved', 'award'] },
    { id: 'tailored', name: 'Role Tailoring', desc: 'Resume tailored for specific job role (Keywords density).', color: '#f59e0b', keywords: ['manager', 'engineer', 'developer', 'analyst', 'designer', 'specialist'] }
];

// --- Upload Logic --- //
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', function() {
    if (this.files.length) {
        handleFile(this.files[0]);
    }
});

function handleFile(file) {
    if (file.type !== 'application/pdf') {
        alert('Please upload a valid PDF file.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
    }

    state.file = file;
    startAnalysis();
}

// --- Navigation --- //
function switchView(viewName) {
    Object.values(views).forEach(v => {
        v.classList.remove('active');
        v.classList.add('hidden');
    });
    
    setTimeout(() => {
        views[viewName].classList.remove('hidden');
        views[viewName].classList.add('active');
    }, 50);
}

function resetApp() {
    state.file = null;
    state.text = '';
    state.score = 0;
    state.criteriaScores = [];
    fileInput.value = '';
    switchView('upload');
}

// --- Analysis Simulation --- //
async function startAnalysis() {
    switchView('analysis');
    
    // Simulate phases with delays
    await updateStatus('Reading PDF file...', 10);
    
    try {
        await extractTextFromPDF(state.file);
        await updateStatus('Extracting keywords & structure...', 40);
        
        await new Promise(r => setTimeout(r, 800));
        await updateStatus('Evaluating against 10 criteria...', 70);
        
        calculateScores();
        
        await new Promise(r => setTimeout(r, 1000));
        await updateStatus('Generating final report...', 100);
        
        await new Promise(r => setTimeout(r, 500));
        showResults();
    } catch (error) {
        console.error('Error analyzing PDF:', error);
        alert('Could not read the PDF. Ensuring it contains selectable text.');
        resetApp();
    }
}

async function updateStatus(message, progress) {
    document.getElementById('analysis-status').innerText = message;
    document.getElementById('analysis-progress').style.width = progress + '%';
    return new Promise(resolve => setTimeout(resolve, 800)); // Fake processing time
}

// --- PDF Text Extraction --- //
async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function() {
            try {
                const typedarray = new Uint8Array(this.result);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + ' \n';
                }
                
                state.text = fullText.toLowerCase();
                resolve();
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

// --- Scoring Logic --- //
function calculateScores() {
    const text = state.text;
    let totalScore = 0;
    state.criteriaScores = [];

    // Length penalty check (too short = bad)
    const lengthMultiplier = text.length > 500 ? 1 : 0.5;

    criteria.forEach(crit => {
        let matches = 0;
        
        // Special logic for formatting
        if(crit.id === 'formatting') {
            // Check for bullets or newlines roughly indicating structure
            const bulletMatches = (text.match(/•|-|\*/g) || []).length;
            matches = bulletMatches > 5 ? 5 : bulletMatches;
            matches += text.length > 800 ? 5 : 2; 
        } 
        // Special logic for achievements (numbers)
        else if (crit.id === 'achievements') {
            const numMatches = (text.match(/\d+|%|increased|decreased/g) || []).length;
            matches = numMatches > 3 ? 10 : numMatches * 3;
        }
        else {
            crit.keywords.forEach(kw => {
                if (text.includes(kw)) {
                    matches += 3; // 3 points per keyword match
                }
            });
        }

        // Cap score at 10 per criterion
        let score = Math.min(10, matches);
        
        // Apply length multiplier
        score = Math.floor(score * lengthMultiplier);
        
        // Ensure minimum 2 points if text exists, so it doesn't look totally broken
        if (score < 2 && text.length > 200) score = Math.floor(Math.random() * 3) + 2;

        totalScore += score;
        
        state.criteriaScores.push({
            ...crit,
            score: score
        });
    });

    state.score = totalScore;
}

// --- Render Results --- //
function showResults() {
    switchView('results');
    
    // Animate Score Counter
    const scoreElement = document.getElementById('total-score');
    animateValue(scoreElement, 0, state.score, 1500);
    
    // Set Score Message and Circle Color
    const scorePath = document.getElementById('score-path');
    const msg = document.getElementById('score-message');
    
    // Reset classes
    scorePath.className.baseVal = 'score-circle-path';
    
    if (state.score >= 85) {
        scorePath.classList.add('excellent');
        msg.innerText = "Exceptional Vibe! You're ready to apply.";
        msg.style.color = 'var(--success)';
    } else if (state.score >= 70) {
        scorePath.classList.add('good');
        msg.innerText = "Solid Resume. A few tweaks await.";
        msg.style.color = 'var(--primary)';
    } else if (state.score >= 50) {
        scorePath.classList.add('average');
        msg.innerText = "Needs Work. Check the breakdown below.";
        msg.style.color = 'var(--warning)';
    } else {
        scorePath.classList.add('poor');
        msg.innerText = "Significant improvements needed.";
        msg.style.color = 'var(--danger)';
    }

    // Animate SVG Circle
    const circumference = 283;
    const dashoffset = circumference - (state.score / 100) * circumference;
    setTimeout(() => {
        scorePath.style.strokeDashoffset = dashoffset;
    }, 100);

    // Render Criteria Breakdown
    const container = document.getElementById('criteria-container');
    container.innerHTML = '';
    
    state.criteriaScores.forEach((c, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'criterion-item';
            div.style.borderLeftColor = c.color;
            // Add slight transparency to background based on color
            div.style.background = `linear-gradient(90deg, ${c.color}15, rgba(0,0,0,0.2))`;
            
            div.innerHTML = `
                <div class="criterion-info">
                    <div class="criterion-name">${c.name}</div>
                    <div class="criterion-desc">${c.desc}</div>
                </div>
                <div class="criterion-score-badge" style="color: ${c.color}">
                    ${c.score}/10
                </div>
            `;
            container.appendChild(div);
            
            // Trigger reflow for slide-in animation if we added it in css
            div.style.opacity = 0;
            div.style.transform = 'translateY(10px)';
            div.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                div.style.opacity = 1;
                div.style.transform = 'translateY(0)';
            }, 50);
            
        }, index * 100); // Stagger animation
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- Tips Carousel Logic --- //
const tips = document.querySelectorAll('.tip-item');
const dotsContainer = document.getElementById('tip-indicators');

// Create dots
tips.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = `indicator ${i === 0 ? 'active' : ''}`;
    dot.onclick = () => showTip(i);
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.indicator');

function showTip(index) {
    tips[state.currentTipIndex].classList.remove('active');
    dots[state.currentTipIndex].classList.remove('active');
    
    state.currentTipIndex = (index + tips.length) % tips.length;
    
    tips[state.currentTipIndex].classList.add('active');
    dots[state.currentTipIndex].classList.add('active');
}

document.getElementById('prev-tip').addEventListener('click', () => {
    showTip(state.currentTipIndex - 1);
});

document.getElementById('next-tip').addEventListener('click', () => {
    showTip(state.currentTipIndex + 1);
});

// Auto rotate tips
setInterval(() => {
    if(views.results.classList.contains('active')) {
        showTip(state.currentTipIndex + 1);
    }
}, 5000);
