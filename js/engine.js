// engine.js - Recommendation Logic and Quiz State

let currentQuestionIndex = 0;

// Initialize the quiz flow
function initQuiz() {
    currentQuestionIndex = 0;
    AppState.answers = []; // Reset answers

    // Dynamically load the correct question set based on selected level
    // Fallback to after_10th if somehow not found
    const levelData = AppData.questionSets[AppState.selectedLevel] || AppData.questionSets['after_10th'];
    AppData.questions = [];

    if (AppState.selectedInterest === 'courses' || AppState.selectedInterest === 'both') {
        const courseQs = (levelData.courses || []).map(q => ({ ...q, section: 'courses' }));
        AppData.questions = AppData.questions.concat(courseQs);
    }
    if (AppState.selectedInterest === 'exams' || AppState.selectedInterest === 'both') {
        const examQs = (levelData.exams || []).map(q => ({ ...q, section: 'exams' }));
        AppData.questions = AppData.questions.concat(examQs);
    }

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

    let sectionLabelHtml = '';
    if (q.section === 'courses') {
        sectionLabelHtml = `<div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--primary-color); text-align: center; margin-bottom: 1rem;"><span data-i18n="interest_courses">Academic Courses / Degrees</span></div>`;
    } else if (q.section === 'exams') {
        sectionLabelHtml = `<div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--secondary-color); text-align: center; margin-bottom: 1rem;"><span data-i18n="interest_exams">Government / Competitive Exams</span></div>`;
    }

    let html = `
        <div class="glass-card screen-fade-enter" style="max-width: 800px; margin: 2rem auto;">
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progressPercent}%"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-size: 0.875rem; color: var(--primary-color); font-weight: 600; display: block;">
                    Question ${currentQuestionIndex + 1} of ${AppData.questions.length}
                </span>
                ${currentQuestionIndex > 0 ? `
                <button onclick="goBackQuestion()" class="back-btn" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; gap: 0.25rem; font-size: 0.875rem; font-family: inherit; padding: 0.25rem; border-radius: var(--radius-sm); transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    <span data-i18n="btn_back">Back</span>
                </button>
                ` : ''}
            </div>
            ${sectionLabelHtml}
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
    updateTranslations();

}

// Global function to attach to onClick
window.goBackQuestion = function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        // Remove the last stored answer
        AppState.answers.pop();

        // Animate and go back
        const qContainer = document.getElementById('quiz-container');
        if (qContainer && qContainer.firstElementChild) {
            qContainer.firstElementChild.style.opacity = '0';
            qContainer.firstElementChild.style.transform = 'translateY(10px)'; // Reverse animation
        }

        setTimeout(() => {
            renderNextQuestion();
        }, 200);
    }
};

window.selectAnswer = function (optIdx) {
    const q = AppData.questions[currentQuestionIndex];
    const selectedOption = q.options[optIdx];

    // Save the selection
    AppState.answers.push({
        qId: q.id,
        section: q.section,
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
    // 1. Calculate isolated profiles based on answers
    const userProfileCourses = {
        math_sci: 0, commerce: 0, arts: 0,
        govt: 0, private: 0,
        physical: 0, practical: 0, theory: 0
    };

    const userProfileExams = {
        math_sci: 0, commerce: 0, arts: 0,
        govt: 0, private: 0,
        physical: 0, practical: 0, theory: 0
    };

    AppState.answers.forEach((ans, index) => {
        const profileToUpdate = ans.section === 'courses' ? userProfileCourses : userProfileExams;

        for (const [key, val] of Object.entries(ans.weights)) {
            if (profileToUpdate[key] !== undefined) {
                profileToUpdate[key] += val;
            }
        }
    });

    console.log("Calculated Course Profile:", userProfileCourses);
    console.log("Calculated Exam Profile:", userProfileExams);

    // 2. Score Courses based on User Profile and Selected Level
    const scoredCourses = AppData.courses
        .filter(c => c.category === AppState.selectedLevel || c.category === 'all')
        .map(c => {
            let score = 0;
            for (const [key, val] of Object.entries(c.weights)) {
                score += (userProfileCourses[key] || 0) * val;
            }
            return { ...c, matchScore: score };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    // 3. Score Exams
    const scoredExams = AppData.exams
        .filter(e => e.allow_all || e.category === AppState.selectedLevel || e.category === 'all' || (e.category === 'puc_science' && AppState.selectedLevel.startsWith('puc_science')))
        .filter(e => {
            if (e.id === 'e_neet') {
                return AppState.selectedLevel === 'puc_science_pcmb';
            }
            if (e.id === 'e_kcet') {
                return AppState.selectedLevel === 'puc_science_pcmb' || AppState.selectedLevel === 'puc_science_pcmc';
            }
            return true;
        })
        .map(e => {
            let score = 0;
            for (const [key, val] of Object.entries(e.weights)) {
                score += (userProfileExams[key] || 0) * val;
            }

            let dynamicLabel = null;
            if (e.id === 'e_neet') {
                dynamicLabel = { en: "Recommended because you selected PCMB", hi: "अनुशंसित क्योंकि आपने पीसीएमबी चुना था", kn: "ನೀವು PCMB ಆಯ್ಕೆ ಮಾಡಿದ್ದರಿಂದ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
            } else if (e.id === 'e_kcet') {
                if (AppState.selectedLevel === 'puc_science_pcmb') {
                    dynamicLabel = { en: "Recommended for medical, dental, and allied health courses", hi: "मेडिकल, डेंटल और संबद्ध स्वास्थ्य पाठ्यक्रमों के लिए अनुशंसित", kn: "ವೈದ್ಯಕೀಯ, ದಂತ ಮತ್ತು ಕೆಲವು ಆರೋಗ್ಯ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
                } else if (AppState.selectedLevel === 'puc_science_pcmc') {
                    dynamicLabel = { en: "Recommended for engineering and technology courses", hi: "इंजीनियरिंग और प्रौद्योगिकी पाठ्यक्रमों के लिए अनुशंसित", kn: "ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
                }
            }

            return { ...e, matchScore: score, dynamicLabel };
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

    const showCourses = AppState.selectedInterest === 'courses' || AppState.selectedInterest === 'both';
    const showExams = AppState.selectedInterest === 'exams' || AppState.selectedInterest === 'both';
    const gridCols = (showCourses && showExams) ? '1fr 1fr' : '1fr';

    let html = `
        <div class="results-grid" style="display: grid; grid-template-columns: ${gridCols}; gap: 2rem;">
    `;

    if (showCourses) {
        html += `
            <!-- Courses Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_courses">Courses</h3>
        `;
        AppState.topCourses.forEach((c, idx) => {
            html += createResultCard(c, lang, idx + 'c');
        });
        html += `</div>`;
    }

    if (showExams) {
        html += `
            <!-- Exams Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--secondary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_exams">Govt Exams</h3>
        `;
        AppState.topExams.forEach((e, idx) => {
            html += createResultCard(e, lang, idx + 'e');
        });
        html += `</div>`;
    }

    html += `
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
            
            ${item.dynamicLabel ? `
            <div style="background: rgba(255, 152, 0, 0.1); border-left: 4px solid #ff9800; padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
                <p style="font-size: 0.875rem; font-weight: 600; color: var(--text-main); margin: 0;">${item.dynamicLabel[lang] || item.dynamicLabel.en}</p>
            </div>
            ` : ''}

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
