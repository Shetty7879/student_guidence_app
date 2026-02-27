// engine.js - Recommendation Logic and Quiz State

let currentQuestionIndex = 0;

// Initialize the quiz flow
function initQuiz() {
    currentQuestionIndex = 0;
    AppState.answers = []; // Reset answers
    renderNextQuestion();
}

function renderNextQuestion() {
    const qContainer = document.getElementById('quiz-container');
    if (!qContainer) return;

    if (currentQuestionIndex >= AppData.questions.length) {
        // Quiz finished
        finishQuiz();
        return;
    }

    const q = AppData.questions[currentQuestionIndex];
    const lang = AppState.language;
    const progressPercent = ((currentQuestionIndex + 1) / AppData.questions.length) * 100;

    let html = `
        <div class="glass-card screen-fade-enter" style="max-width: 800px; margin: 2rem auto;">
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            
            <span style="font-size: 0.875rem; color: var(--primary-color); font-weight: 600; margin-bottom: 0.5rem; display: block;">
                Question ${currentQuestionIndex + 1} of ${AppData.questions.length}
            </span>
            <h2 class="screen-title" style="margin-bottom: 2rem;">${q.text[lang]}</h2>
            
            <div class="options-list">
    `;

    q.options.forEach((opt, idx) => {
        html += `
            <div class="option-card" data-idx="${idx}" onclick="selectAnswer(${idx})">
                <span>${opt.ans[lang]}</span>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    qContainer.innerHTML = html;
}

// Global function to attach to onClick
window.selectAnswer = function (optIdx) {
    const q = AppData.questions[currentQuestionIndex];
    const selectedOption = q.options[optIdx];

    // Save the selection
    AppState.answers.push({
        qId: q.id,
        weights: selectedOption.weights
    });

    // Animate and go to next
    const qContainer = document.getElementById('quiz-container');
    if (qContainer && qContainer.firstElementChild) {
        qContainer.firstElementChild.style.opacity = '0';
        qContainer.firstElementChild.style.transform = 'translateY(-10px)';
    }

    currentQuestionIndex++;

    setTimeout(() => {
        renderNextQuestion();
    }, 200);
};

function finishQuiz() {
    renderScreen('calculating');

    // Simulate processing time for UX
    setTimeout(() => {
        calculateResults();
        renderScreen('results');
        renderRecommendations();
    }, 1500);
}

// Logic Engine Core
function calculateResults() {
    // 1. Calculate User Profile Vector based on answers
    const userProfile = {
        math_sci: 0, commerce: 0, arts: 0,
        govt: 0, private: 0,
        physical: 0, practical: 0, theory: 0
    };

    AppState.answers.forEach((ans, index) => {
        // Boost the weighting of the first question (Subjects preference)
        const weightMultiplier = (index === 0) ? 2 : 1;

        for (const [key, val] of Object.entries(ans.weights)) {
            if (userProfile[key] !== undefined) {
                userProfile[key] += (val * weightMultiplier);
            }
        }
    });

    console.log("Calculated User Profile:", userProfile);

    // 2. Score Courses based on User Profile and Selected Level
    const scoredCourses = AppData.courses
        .filter(c => c.category === AppState.selectedLevel || c.category === 'all')
        .map(c => {
            let score = 0;
            for (const [key, val] of Object.entries(c.weights)) {
                score += (userProfile[key] || 0) * val;
            }
            return { ...c, matchScore: score };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    // 3. Score Exams
    const scoredExams = AppData.exams
        .filter(e => e.allow_all || e.category === AppState.selectedLevel || e.category === 'all')
        .map(e => {
            let score = 0;
            for (const [key, val] of Object.entries(e.weights)) {
                score += (userProfile[key] || 0) * val;
            }
            return { ...e, matchScore: score };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    // Filter top 2-3 matches
    AppState.topCourses = scoredCourses.slice(0, 3);
    AppState.topExams = scoredExams.slice(0, 3);
}

function renderRecommendations() {
    const listContainer = document.getElementById('results-lists');
    if (!listContainer) return;

    const lang = AppState.language;

    let html = `
        <div class="results-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            
            <!-- Courses Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_courses">Courses</h3>
    `;

    AppState.topCourses.forEach((c, idx) => {
        html += createResultCard(c, lang, idx + 'c');
    });

    html += `
            </div>
            
            <!-- Exams Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--secondary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_exams">Govt Exams</h3>
    `;

    AppState.topExams.forEach((e, idx) => {
        html += createResultCard(e, lang, idx + 'e');
    });

    html += `
            </div>
        </div>
    `;

    listContainer.innerHTML = html;
    updateTranslations();

    // Adjust for mobile
    if (window.innerWidth < 768) {
        document.querySelector('.results-grid').style.gridTemplateColumns = '1fr';
    }
}

function createResultCard(item, lang, uniqueId) {
    const whyText = generateWhyText(item.weights, lang);
    // Store item globally so modal can access it easily without complex state
    window[`itemData_${uniqueId}`] = item;

    return `
        <div class="glass-card" style="margin-bottom: 1rem; padding: 1.5rem; animation: slideUp 0.5s ease forwards;">
            <h4 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">${item.title[lang]}</h4>
            <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1rem;">${item.description[lang]}</p>
            
            <div style="background: rgba(255,255,255,0.3); padding: 0.75rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary-color);" data-i18n="why_suits">Why this suits you:</span>
                <p style="font-size: 0.875rem; color: var(--text-main); margin-top: 0.25rem;">${whyText}</p>
            </div>
            
            <button class="btn btn-primary" onclick="openDetailsModal('${uniqueId}')" style="width: 100%; padding: 0.5rem; font-size: 0.875rem;">
                <span data-i18n="view_details">View Details & Roadmap</span>
            </button>
        </div>
    `;
}

function generateWhyText(weights, lang) {
    // Very basic 'why' generation logic based on max weight
    const keys = Object.keys(weights).sort((a, b) => weights[b] - weights[a]);
    const topTrait = keys[0];

    const explanations = {
        en: {
            math_sci: "Aligns with your analytical thinking and interest in science.",
            physical: "Matches your high physical activity level and fitness.",
            govt: "Provides the job security and stability you prefer.",
            practical: "Suits your preference for hands-on, practical learning.",
            commerce: "Fits your interest in business, finance, and organization.",
            arts: "Aligns with your interest in humanities and creativity.",
            private: "Offers the fast-paced growth and corporate structure you prefer."
        },
        hi: {
            math_sci: "आपकी विश्लेषणात्मक सोच और विज्ञान में रुचि के अनुरूप है।",
            physical: "आपकी उच्च शारीरिक गतिविधि स्तर और फिटनेस से मेल खाता है।",
            govt: "आपकी पसंद के अनुसार नौकरी की सुरक्षा और स्थिरता प्रदान करता है।",
            practical: "व्यावहारिक शिक्षा के लिए आपकी प्राथमिकता के अनुकूल है।",
            commerce: "व्यवसाय और वित्त में आपकी रुचि के अनुरूप है।",
            arts: "मानविकी और रचनात्मकता में आपकी रुचि के अनुरूप है।",
            private: "आपके पसंदीदा तेज़ विकास और कॉर्पोरेट संरचना को प्रस्तुत करता है।"
        },
        kn: {
            math_sci: "ನಿಮ್ಮ ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಚಿಂತನೆ ಮತ್ತು ವಿಜ್ಞಾನದಲ್ಲಿನ ಆಸಕ್ತಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.",
            physical: "ನಿಮ್ಮ ಹೆಚ್ಚಿನ ದೈಹಿಕ ಚಟುವಟಿಕೆ ಮತ್ತು ಫಿಟ್ನೆಸ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ.",
            govt: "ನೀವು ಆದ್ಯತೆ ನೀಡುವ ಉದ್ಯೋಗ ಭದ್ರತೆ ಮತ್ತು ಸ್ಥಿರತೆಯನ್ನು ಒದಗಿಸುತ್ತದೆ.",
            practical: "ಪ್ರಾಯೋಗಿಕ ಕಲಿಕೆಗಾಗಿ ನಿಮ್ಮ ಆದ್ಯತೆಗೆ ಸರಿಹೊಂದುತ್ತದೆ.",
            commerce: "ವ್ಯವಹಾರ ಮತ್ತು ಹಣಕಾಸಿನಲ್ಲಿನ ನಿಮ್ಮ ಆಸಕ್ತಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.",
            arts: "ಮಾನವಿಕ ಮತ್ತು ಸೃಜನಶೀಲತೆಯಲ್ಲಿನ ನಿಮ್ಮ ಆಸಕ್ತಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ.",
            private: "ನೀವು ಆದ್ಯತೆ ನೀಡುವ ವೇಗದ ಬೆಳವಣಿಗೆಯನ್ನು ನೀಡುತ್ತದೆ."
        }
    };

    return explanations[lang][topTrait] || "Based on your unique answers.";
}

// Global modal handling
window.openDetailsModal = function (uniqueId) {
    const item = window[`itemData_${uniqueId}`];
    const lang = AppState.language;
    const modalContainer = document.getElementById('modal-container');

    if (!modalContainer || !item) return;

    // Generate details HTML
    let detailsHtml = '';
    for (const [key, val] of Object.entries(item.details)) {
        detailsHtml += `
            <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.25rem;">
                <span style="font-weight: 600; text-transform: capitalize; color: var(--text-muted);">${key.replace('_', ' ')}:</span>
                <span style="text-align: right; margin-left: 1rem;">${val[lang] || val.en}</span>
            </div>
        `;
    }

    // Generate Roadmap HTML
    let roadmapHtml = '<div class="roadmap-timeline" style="margin-top: 1.5rem; position: relative; padding-left: 1rem; border-left: 2px solid var(--primary-light);">';
    item.roadmap.forEach((r, idx) => {
        roadmapHtml += `
            <div style="position: relative; margin-bottom: 1rem;">
                <div style="position: absolute; left: -1.4rem; top: 0.2rem; width: 12px; height: 12px; border-radius: 50%; background: var(--primary-color);"></div>
                <p style="font-size: 0.875rem; font-weight: 500;">${r.step[lang] || r.step.en}</p>
            </div>
        `;
    });
    roadmapHtml += '</div>';

    modalContainer.innerHTML = `
        <div class="modal-overlay" onclick="closeDetailsModal()" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); z-index: 99; display: flex; justify-content: center; align-items: center; padding: 1rem;">
            <div class="glass-card modal-content" onclick="event.stopPropagation()" style="width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; animation: slideUp 0.3s ease forwards; background: var(--surface-solid);">
                <button onclick="closeDetailsModal()" style="position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-main);">&times;</button>
                
                <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; color: var(--primary-color);">${item.title[lang]}</h2>
                <span style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(79, 70, 229, 0.1); border-radius: 999px; font-size: 0.75rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1.5rem;">
                    ${item.type === 'exam' ? 'Government Exam' : 'Course'}
                </span>
                
                <h3 style="font-size: 1.125rem; margin-bottom: 1rem;">Quick Details</h3>
                <div style="background: rgba(0,0,0,0.02); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 2rem;">
                    ${detailsHtml}
                </div>

                <h3 style="font-size: 1.125rem;">Step-by-Step Roadmap</h3>
                ${roadmapHtml}
                
                <div style="margin-top: 2rem; text-align: center;">
                     <button class="btn btn-primary" onclick="closeDetailsModal()">
                         <span data-i18n="close">Close</span>
                     </button>
                </div>
            </div>
        </div>
    `;

    modalContainer.classList.remove('hidden');
    updateTranslations(); // translate internal buttons
};

window.closeDetailsModal = function () {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
        modalContainer.classList.add('hidden');
    }
};
