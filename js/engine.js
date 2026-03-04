// engine.js - Recommendation Logic and Quiz State

let currentQuestionIndex = 0;

// Initialize the quiz flow
function initQuiz() {
    currentQuestionIndex = 0;
    // AppState.answers = []; // Handled in app.js on Start Assessment so we don't lose progress on edit

    // Dynamically load the correct question set based on selected level
    // Fallback to after_10th if currently missing specific configs for Diploma/ITI
    let levelData = AppData.questionSets[AppState.selectedLevel];
    if (!levelData) {
        console.warn('Missing explicit logic config for:', AppState.selectedLevel, 'Falling back to 10th base.');
        levelData = AppData.questionSets['after_10th'];
    }

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
        const isSelected = AppState.answers[currentQuestionIndex] && AppState.answers[currentQuestionIndex].optIdx === idx;
        const selectedClass = isSelected ? 'selected' : '';
        const selectedStyle = isSelected ? 'border-color: var(--primary-color); background: rgba(79, 70, 229, 0.05);' : '';

        html += `
            <div class="option-card ${selectedClass}" style="${selectedStyle}" data-idx="${idx}" onclick="selectAnswer(${idx})">
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

    // Save or update the selection
    const answerData = {
        qId: q.id,
        section: q.section,
        weights: selectedOption.weights,
        qText: q.text,
        ansText: selectedOption.ans,
        optIdx: optIdx
    };

    if (AppState.answers[currentQuestionIndex]) {
        AppState.answers[currentQuestionIndex] = answerData;
    } else {
        AppState.answers.push(answerData);
    }

    // Animate and go to next
    const qContainer = document.getElementById('quiz-container');
    if (qContainer && qContainer.firstElementChild) {
        qContainer.firstElementChild.style.opacity = '0';
        qContainer.firstElementChild.style.transform = 'translateY(-10px)';
    }

    if (AppState.isEditing) {
        AppState.isEditing = false;
        setTimeout(() => {
            finishQuiz();
        }, 200);
    } else {
        currentQuestionIndex++;
        setTimeout(() => {
            renderNextQuestion();
        }, 200);
    }
};

window.editSpecificAnswer = function (index) {
    AppState.isEditing = true;
    currentQuestionIndex = index;
    renderScreen('quiz');
    renderNextQuestion();
};

window.editAllAnswers = function () {
    AppState.isEditing = false;
    currentQuestionIndex = 0;
    renderScreen('quiz');
    renderNextQuestion();
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
        .filter(c => {
            if (c.category === 'all') return true;
            if (c.category === AppState.selectedLevel) return true;
            // Handle edge case where pu science applies broadly or diploma applies generally
            if (c.category === 'puc_science' && AppState.selectedLevel.startsWith('puc_science')) return true;

            return false;
        })
        .map(c => {
            let score = 0;
            for (const [key, val] of Object.entries(c.weights)) {
                score += (userProfileCourses[key] || 0) * val;
            }
            let confidenceScore = Math.min(99, Math.max(60, Math.round(60 + (score * 4.5))));
            return { ...c, matchScore: score, confidenceScore };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    // 3. Score Exams
    const scoredExams = AppData.exams
        .filter(e => {
            if (e.allow_all) return true;
            if (e.category === 'all') return true;
            if (e.category === AppState.selectedLevel) return true;
            if (e.category === 'puc_science' && AppState.selectedLevel.startsWith('puc_science')) return true;

            // Hardcoded restrictions
            if (e.id === 'e_neet' && AppState.selectedLevel !== 'puc_science_pcmb') return false;

            return false;
        })
        .map(e => {
            let score = 0;
            for (const [key, val] of Object.entries(e.weights)) {
                score += (userProfileExams[key] || 0) * val;
            }

            let dynamicLabel = null;
            if (e.id === 'e_neet' && AppState.selectedLevel === 'puc_science_pcmb') {
                dynamicLabel = { en: "Recommended because you selected PCMB", hi: "अनुशंसित क्योंकि आपने पीसीएमबी चुना था", kn: "ನೀವು PCMB ಆಯ್ಕೆ ಮಾಡಿದ್ದರಿಂದ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
            } else if (e.id === 'e_kcet') {
                if (AppState.selectedLevel === 'puc_science_pcmb') {
                    dynamicLabel = { en: "Recommended for medical, dental, and allied health", hi: "मेडिकल, डेंटल और संबद्ध स्वास्थ्य पाठ्यक्रमों के लिए अनुशंसित", kn: "ವೈದ್ಯಕೀಯ, ದಂತ ಮತ್ತು ಕೆಲವು ಆರೋಗ್ಯ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
                } else if (AppState.selectedLevel === 'puc_science_pcmc') {
                    dynamicLabel = { en: "Recommended for engineering and technology", hi: "इंजीनियरिंग और प्रौद्योगिकी पाठ्यक्रमों के लिए अनुशंसित", kn: "ಎಂಜಿನಿಯರಿಂಗ್ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ಕೋರ್ಸ್‌ಗಳಿಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ" };
                }
            }

            let confidenceScore = Math.min(99, Math.max(60, Math.round(60 + (score * 4.5))));
            if (dynamicLabel) confidenceScore = Math.min(99, confidenceScore + 10); // Boost confidence if explicitly labeled

            return { ...e, matchScore: score, dynamicLabel, confidenceScore };
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    // Store full calculated lists (removed 3-item limits)
    AppState.topCourses = scoredCourses;
    AppState.topExams = scoredExams;

    // Clear unmatched arrays as we're rendering all valid tiered hits
    AppState.unmatchedCourses = [];
    AppState.unmatchedExams = [];
}

function renderRecommendations() {
    const listContainer = document.getElementById('results-lists');
    if (!listContainer) return;

    const lang = AppState.language;

    const answersContainer = document.getElementById('answers-review-list');
    if (answersContainer && AppState.answers && AppState.answers.length > 0) {
        let ansHtml = `
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem; border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="your_answers">
                    Your Answers
                </h3>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        `;

        AppState.answers.forEach((ans, idx) => {
            const qText = ans.qText && ans.qText[lang] ? ans.qText[lang] : (ans.qText && ans.qText.en ? ans.qText.en : 'Question');
            const aText = ans.ansText && ans.ansText[lang] ? ans.ansText[lang] : (ans.ansText && ans.ansText.en ? ans.ansText.en : 'Answer');

            ansHtml += `
                <div class="glass-card ans-card">
                    <div class="ans-content">
                        <p class="ans-q-text">${qText}</p>
                        <p class="ans-a-text">${aText}</p>
                    </div>
                    <button class="btn btn-secondary ans-edit-btn" onclick="window.editSpecificAnswer(${idx})">
                        <span data-i18n="btn_edit">Edit</span>
                    </button>
                </div>
            `;
        });

        ansHtml += `
                </div>
            </div>
        `;
        answersContainer.innerHTML = ansHtml;
    }

    const showCourses = AppState.selectedInterest === 'courses' || AppState.selectedInterest === 'both';
    const showExams = AppState.selectedInterest === 'exams' || AppState.selectedInterest === 'both';
    const gridCols = (showCourses && showExams) ? '1fr 1fr' : '1fr';

    let html = `
        <div class="results-grid" style="display: grid; grid-template-columns: ${gridCols}; gap: 2rem;">
    `;

    // Helper to generate the HTML for a categorical section
    function generateSectionHTML(title, items, typePrefix, emptyMsg) {
        if (!items || items.length === 0) return '';

        let sectionHtml = `
            <div style="margin-bottom: 2rem;">
                <h4 style="font-size: 1.125rem; font-weight: 600; color: var(--text-main); margin-bottom: 1rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.5rem;">${title}</h4>
        `;

        items.forEach((item, idx) => {
            sectionHtml += createResultCard(item, lang, typePrefix + '_' + idx);
        });

        sectionHtml += `</div>`;
        return sectionHtml;
    }

    if (showCourses) {
        // Categorize Courses
        const highlyRecommendedCourses = AppState.topCourses.filter(c => c.confidenceScore >= 80);
        const recommendedCourses = AppState.topCourses.filter(c => c.confidenceScore >= 60 && c.confidenceScore < 80);
        const otherCourses = AppState.topCourses.filter(c => c.confidenceScore < 60);

        html += `
            <!-- Courses Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--primary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_courses">Courses & Career Paths</h3>
        `;

        html += generateSectionHTML('Highly Recommended', highlyRecommendedCourses, 'c_high', 'No high matches.');
        html += generateSectionHTML('Recommended', recommendedCourses, 'c_med', 'No medium matches.');
        html += generateSectionHTML('Other Possible Options', otherCourses, 'c_other', 'No other matches.');

        html += `</div>`;
    }

    if (showExams) {
        // Categorize Exams
        const highlyRecommendedExams = AppState.topExams.filter(e => e.confidenceScore >= 80);
        const recommendedExams = AppState.topExams.filter(e => e.confidenceScore >= 60 && e.confidenceScore < 80);
        const otherExams = AppState.topExams.filter(e => e.confidenceScore < 60);

        html += `
            <!-- Exams Column -->
            <div class="results-col">
                <h3 style="margin-bottom: 1.5rem; color: var(--secondary-color); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;" data-i18n="tab_exams">Govt Exams</h3>
        `;

        html += generateSectionHTML('Highly Recommended', highlyRecommendedExams, 'e_high', 'No high matches.');
        html += generateSectionHTML('Recommended', recommendedExams, 'e_med', 'No medium matches.');
        html += generateSectionHTML('Other Possible Options', otherExams, 'e_other', 'No other matches.');

        html += `</div>`;
    }

    html += `
        </div>
    `;

    // Add unmatched / negative explainer
    let unmatchedHtml = '';
    const showCoursesAndHaveUnmatched = showCourses && AppState.unmatchedCourses && AppState.unmatchedCourses.length > 0;
    const showExamsAndHaveUnmatched = showExams && AppState.unmatchedExams && AppState.unmatchedExams.length > 0;

    if (showCoursesAndHaveUnmatched || showExamsAndHaveUnmatched) {
        unmatchedHtml += `
            <details style="margin-top: 3rem; background: var(--surface-light); border-radius: var(--radius-md); border: 1px solid var(--border-color); padding: 1.5rem;">
                <summary style="font-size: 1.15rem; font-weight: 600; color: var(--text-main); cursor: pointer; outline: none; display: flex; align-items: center; justify-content: space-between;" class="unmatched-summary">
                    <span data-i18n="why_not_other">Why not other options?</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400;">Click to expand</span>
                </summary>
                <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        `;

        if (showCoursesAndHaveUnmatched) {
            AppState.unmatchedCourses.forEach(c => {
                const explainer = generateNegativeWhyText(c.weights, lang);
                unmatchedHtml += `
                    <div style="padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--warning-color, #ff9800); background: rgba(255, 152, 0, 0.05);">
                        <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;">${c.title[lang]}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${explainer}</p>
                    </div>
                `;
            });
        }

        if (showExamsAndHaveUnmatched) {
            AppState.unmatchedExams.forEach(e => {
                const explainer = generateNegativeWhyText(e.weights, lang);
                unmatchedHtml += `
                    <div style="padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--warning-color, #ff9800); background: rgba(255, 152, 0, 0.05);">
                        <p style="font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem;">${e.title[lang]}</p>
                        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">${explainer}</p>
                    </div>
                `;
            });
        }

        unmatchedHtml += `
                </div>
            </details>
        `;
    }

    html += unmatchedHtml;

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

    let confLabel = Translations[lang]?.good_match || 'Good Match';
    let confColor = 'var(--success-color, #4caf50)';
    if (item.confidenceScore >= 85) {
        confLabel = Translations[lang]?.strong_match || 'Strong Match';
        confColor = 'var(--primary-color, #4f46e5)';
    } else if (item.confidenceScore < 75) {
        confLabel = Translations[lang]?.fair_match || 'Fair Match';
        confColor = 'var(--warning-color, #ff9800)';
    }

    const confTitle = Translations[lang]?.match_confidence || 'Match Confidence';

    return `
        <div class="glass-card" style="margin-bottom: 1rem; padding: 1.5rem; animation: slideUp 0.5s ease forwards;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1.25rem; font-weight: 600; margin: 0;">${item.title[lang]}</h4>
                <div style="background: ${confColor}15; border: 1px solid ${confColor}30; padding: 0.25rem 0.5rem; border-radius: 20px; text-align: right; min-width: max-content;">
                    <span style="display: block; font-size: 0.7rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">${confTitle}</span>
                    <span style="display: block; font-size: 0.85rem; color: ${confColor}; font-weight: 700;">${item.confidenceScore}% – ${confLabel}</span>
                </div>
            </div>
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

function generateNegativeWhyText(weights, lang) {
    const keys = Object.keys(weights).sort((a, b) => weights[b] - weights[a]);
    const topTrait = keys[0];

    const explanations = {
        en: {
            math_sci: "You showed lower interest in analytical and heavy science subjects.",
            physical: "You requested paths that don't revolve around intense physical fitness.",
            govt: "You preferred faster-paced or private sector opportunities over government roles.",
            practical: "You leaned more towards theoretical or office-based learning styles.",
            commerce: "You favored non-business or non-financial career paths.",
            arts: "Your interests aligned more strictly with technical or quantitative fields.",
            private: "You leaned towards the stability of government or public sector roles."
        },
        hi: {
            math_sci: "आपने विश्लेषणात्मक और भारी विज्ञान विषयों में कम रुचि दिखाई।",
            physical: "आपने उन रास्तों का अनुरोध किया जो शारीरिक फिटनेस के इर्द-गिर्द नहीं घूमते हैं।",
            govt: "आपने सरकारी भूमिकाओं के बजाय निजी क्षेत्र के अवसरों को प्राथमिकता दी।",
            practical: "आपका झुकाव सैद्धांतिक या कार्यालय आधारित सीखने की शैली की ओर अधिक था।",
            commerce: "आपने गैर-व्यावसायिक या गैर-वित्तीय करियर पथ का पक्ष लिया।",
            arts: "आपकी रुचियां तकनीकी या मात्रात्मक क्षेत्रों के साथ अधिक संरेखित हैं।",
            private: "आपका झुकाव सरकारी या सार्वजनिक क्षेत्र की भूमिकाओं की स्थिरता की ओर है।"
        },
        kn: {
            math_sci: "ನೀವು ವಿಶ್ಲೇಷಣಾತ್ಮಕ ಮತ್ತು ವಿಜ್ಞಾನ ವಿಷಯಗಳಲ್ಲಿ ಕಡಿಮೆ ಆಸಕ್ತಿ ತೋರಿದ್ದೀರಿ.",
            physical: "ದೈಹಿಕ ಸಾಮರ್ಥ್ಯದ ಸುತ್ತ ಸುತ್ತದ ಮಾರ್ಗಗಳನ್ನು ನೀವು ವಿನಂತಿಸಿದ್ದೀರಿ.",
            govt: "ನೀವು ಸರ್ಕಾರಿ ಪಾತ್ರಗಳಿಗಿಂತ ಖಾಸಗಿ ವಲಯದ ಅವಕಾಶಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಿದ್ದೀರಿ.",
            practical: "ನೀವು ಸೈದ್ಧಾಂತಿಕ ಅಥವಾ ಕಚೇರಿ ಆಧಾರಿತ ಕಲಿಕಾ ಶೈಲಿಗಳ ಕಡೆಗೆ ಹೆಚ್ಚು ಒಲವು ತೋರಿದ್ದೀರಿ.",
            commerce: "ನೀವು ವ್ಯಾಪಾರೇತರ ಅಥವಾ ಹಣಕಾಸೇತರ ವೃತ್ತಿ ಮಾರ್ಗಗಳಿಗೆ ಒಲವು ತೋರಿದ್ದೀರಿ.",
            arts: "ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು ತಾಂತ್ರಿಕ ಕ್ಷೇತ್ರಗಳಿಗೆ ಹೆಚ್ಚು ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ.",
            private: "ನೀವು ಸರ್ಕಾರಿ ಅಥವಾ ಸಾರ್ವಜನಿಕ ವಲಯದ ಪಾತ್ರಗಳ ಕಡೆಗೆ ಒಲವು ತೋರಿದ್ದೀರಿ."
        }
    };

    return (explanations[lang] && explanations[lang][topTrait]) ? explanations[lang][topTrait] : (explanations.en[topTrait] || "Your interests align better with other areas.");
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
