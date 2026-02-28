// app.js - Main Application State and Routing

const AppState = {
    currentScreen: 'login', // login, otp, welcome, level_select, quiz, calculating, results, details
    isAuthenticated: false,
    authMethod: 'email', // email or mobile
    authType: 'signup', // signin or signup
    authValue: '',
    authError: false,
    userName: '',
    userGender: null, // male, female, other, prefer_not_to_say (optional)
    selectedLevel: null,
    selectedInterest: null, // courses, exams, both
    answers: [],
    language: 'en' // default language
};

const DOM = {
    mainArea: document.getElementById('main-content'),
    langSelect: document.getElementById('language-select'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    themeIconSun: document.getElementById('theme-icon-sun'),
    profileWrapper: document.getElementById('profile-menu-wrapper'),
    notifWrapper: document.getElementById('notification-wrapper'),
    profileBtn: document.getElementById('profile-btn'),
    profileDropdown: document.getElementById('profile-dropdown')
};

function initApp() {
    console.log('App initialized');

    // Initialize Theme
    initTheme();

    // Setup language listener
    DOM.langSelect.addEventListener('change', (e) => {
        AppState.language = e.target.value;
        updateTranslations();
        renderScreen(AppState.currentScreen); // Re-render current screen with new language
    });

    // Setup Theme listener
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);

    // Profile menu listeners
    if (DOM.profileBtn) {
        DOM.profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.profileDropdown.classList.toggle('hidden');
        });
    }

    // Initialize Notifications
    if (typeof NotificationManager !== 'undefined') {
        NotificationManager.init();
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!DOM.profileWrapper.contains(e.target) && !DOM.profileDropdown.classList.contains('hidden')) {
            DOM.profileDropdown.classList.add('hidden');
        }

        const notifWrapper = document.getElementById('notification-wrapper');
        const notifDropdown = document.getElementById('notification-dropdown');
        if (notifWrapper && notifDropdown && !notifWrapper.contains(e.target) && !notifDropdown.classList.contains('hidden')) {
            notifDropdown.classList.add('hidden');
        }
    });

    // Profile Dropdown Actions
    document.getElementById('menu-logout')?.addEventListener('click', () => {
        AppState.isAuthenticated = false;
        AppState.authValue = '';
        AppState.userName = '';
        AppState.answers = [];
        AppState.selectedLevel = null;
        AppState.selectedInterest = null; // Reset selected interest on logout
        DOM.profileDropdown.classList.add('hidden');
        renderScreen('login');
    });

    document.getElementById('menu-theme-toggle')?.addEventListener('click', () => {
        toggleTheme();
    });

    document.getElementById('menu-retake')?.addEventListener('click', () => {
        if (AppState.isAuthenticated) {
            DOM.profileDropdown.classList.add('hidden');
            renderScreen('level_select');
        }
    });

    document.getElementById('menu-reset')?.addEventListener('click', () => {
        if (AppState.isAuthenticated) {
            AppState.answers = [];
            AppState.selectedLevel = null;
            AppState.selectedInterest = null; // Reset selected interest on reset
            DOM.profileDropdown.classList.add('hidden');
            renderScreen('welcome');
        }
    });

    document.getElementById('menu-exam-updates')?.addEventListener('click', () => {
        if (AppState.isAuthenticated) {
            DOM.profileDropdown.classList.add('hidden');
            renderScreen('exam_updates');
        }
    });

    document.getElementById('menu-admin-panel')?.addEventListener('click', () => {
        if (AppState.isAuthenticated) {
            DOM.profileDropdown.classList.add('hidden');
            renderScreen('admin_panel');
        }
    });

    document.getElementById('menu-language')?.addEventListener('click', () => {
        DOM.profileDropdown.classList.add('hidden');
        DOM.langSelect.focus();
        // Since it's a native select, we can't easily force it to open programmatically without hacky ways, 
        // so focusing it is the best approach for accessibility.
    });

    // Set initial localization then render
    updateTranslations();

    // Small delay to hide loader and show first screen smoothly
    setTimeout(() => {
        if (AppState.isAuthenticated) {
            renderScreen('welcome');
        } else {
            renderScreen('login');
        }
    }, 500);
}

function renderScreen(screenName) {
    AppState.currentScreen = screenName;
    DOM.mainArea.innerHTML = ''; // Clear container

    // Update Profile Menu visibility based on Auth state
    if (AppState.isAuthenticated) {
        DOM.profileWrapper.classList.remove('hidden');
        if (DOM.notifWrapper) DOM.notifWrapper.classList.remove('hidden');
    } else {
        DOM.profileWrapper.classList.add('hidden');
        if (DOM.notifWrapper) DOM.notifWrapper.classList.add('hidden');
    }

    let template = '';

    switch (screenName) {
        case 'login':
            template = renderLoginScreen();
            break;
        case 'otp':
            template = renderOtpScreen();
            break;
        case 'welcome':
            template = renderWelcomeScreen();
            break;
        case 'level_select':
            template = renderLevelSelectScreen();
            break;
        case 'interest_select':
            template = renderInterestSelectScreen();
            break;
        case 'quiz':
            template = renderQuizScreen(); // Handled by engine mostly, but stubbing here
            break;
        case 'calculating':
            template = renderCalculatingScreen();
            break;
        case 'results':
            template = renderResultsScreen();
            break;
        case 'exam_updates':
            template = renderExamUpdatesScreen();
            break;
        case 'admin_panel':
            template = renderAdminScreen();
            break;
        default:
            template = `<h2>Error: Screen not found</h2>`;
    }

    DOM.mainArea.innerHTML = template;

    // Trigger animations
    const newScreen = DOM.mainArea.firstElementChild;
    if (newScreen) {
        newScreen.classList.add('screen-slide-up');
    }

    // Initialize specific screen JS
    attachScreenListeners(screenName);

    // Make sure dynamically injected content is translated
    updateTranslations();
}

// ---------------------------------------------------------
// Theme Management
// ---------------------------------------------------------

function initTheme() {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('app-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);

    // Toggle Icons
    if (theme === 'dark') {
        DOM.themeIconMoon.classList.add('hidden');
        DOM.themeIconSun.classList.remove('hidden');
    } else {
        DOM.themeIconMoon.classList.remove('hidden');
        DOM.themeIconSun.classList.add('hidden');
    }
}

// ---------------------------------------------------------
// Screen Templates
// ---------------------------------------------------------

function renderLoginScreen() {
    const isEmail = AppState.authMethod === 'email';
    const isSignUp = AppState.authType === 'signup';

    const titleKey = isSignUp ? 'auth_signup_title' : 'auth_signin_title';
    const subKey = isSignUp ? 'auth_signup_sub' : 'auth_signin_sub';
    const switchKey = isSignUp ? 'auth_switch_to_signin' : 'auth_switch_to_signup';
    const nextAuthType = isSignUp ? 'signin' : 'signup';

    let nameInputHtml = '';
    if (isSignUp) {
        nameInputHtml = `
            <div class="form-group" style="margin-bottom: 0.5rem;">
                <input type="text" 
                       id="login-name-input" 
                       class="form-input" 
                       placeholder="..."
                       data-i18n-placeholder="auth_name_placeholder"
                       value="${AppState.userName || ''}">
                <div id="login-name-error" class="error-text" data-i18n="auth_name_error">Please enter your full name.</div>
            </div>
            <div class="form-group" style="margin-bottom: 1.5rem; text-align: left;">
                <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;" data-i18n="auth_gender_label">Gender (Optional)</div>
                <div class="gender-selector">
                    <div class="gender-btn ${AppState.userGender === 'male' ? 'active' : ''}" data-gender="male" data-i18n="gender_male">Male</div>
                    <div class="gender-btn ${AppState.userGender === 'female' ? 'active' : ''}" data-gender="female" data-i18n="gender_female">Female</div>
                    <div class="gender-btn ${AppState.userGender === 'prefer_not_to_say' ? 'active' : ''}" data-gender="prefer_not_to_say" data-i18n="gender_prefer_not_to_say">Prefer not to say</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="glass-card text-center" style="max-width: 500px; margin: 4rem auto;">
            <div style="margin-bottom: 2rem;">
                <div style="width: 64px; height: 64px; background: rgba(79, 70, 229, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 class="screen-title" data-i18n="${titleKey}">Welcome Student</h2>
                <p class="screen-sub" style="font-size: 1rem; margin-bottom: 1rem;" data-i18n="${subKey}">Please enter your email or mobile number to continue.</p>
            </div>

            <div class="auth-tabs">
                <div class="auth-tab ${isEmail ? 'active' : ''}" data-method="email" data-i18n="login_tab_email">Email</div>
                <div class="auth-tab ${!isEmail ? 'active' : ''}" data-method="mobile" data-i18n="login_tab_mobile">Mobile Number</div>
            </div>

            ${nameInputHtml}
            
            <div class="form-group">
                <input type="${isEmail ? 'email' : 'tel'}" 
                       id="login-input" 
                       class="form-input ${AppState.authError ? 'error-input' : ''}" 
                       placeholder="..."
                       data-i18n-placeholder="${isEmail ? 'login_input_email' : 'login_input_mobile'}"
                       value="${AppState.authValue}">
                <div id="login-error" class="error-text ${AppState.authError ? 'show' : ''}" data-i18n="${isEmail ? 'login_error_email' : 'login_error_mobile'}">
                    ${isEmail ? 'Please enter a valid email address.' : 'Please enter a valid 10-digit mobile number.'}
                </div>
            </div>

            <div id="recaptcha-wrapper"></div>
            
            <button id="btn-send-otp" class="btn btn-primary" style="width: 100%; font-size: 1.125rem;">
                <span id="btn-send-text" data-i18n="login_btn">Send OTP</span>
            </button>
            
            <button id="btn-switch-auth" class="btn btn-secondary" data-target="${nextAuthType}" style="width: 100%; padding: 0.5rem; font-size: 0.875rem; border: none; background: transparent; color: var(--text-muted); margin-top: 1rem;">
                <span data-i18n="${switchKey}">Don't have an account? Sign Up</span>
            </button>
        </div>
    `;
}

function renderOtpScreen() {
    return `
        <div class="glass-card text-center" style="max-width: 500px; margin: 4rem auto;">
            <div style="margin-bottom: 2rem;">
                <div style="width: 64px; height: 64px; background: rgba(79, 70, 229, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 class="screen-title" data-i18n="otp_title">Verify Secure OTP</h2>
                <p class="screen-sub" style="font-size: 1rem; margin-bottom: 0.5rem;" data-i18n="otp_sub">Please enter the 4-digit verification code sent to you.</p>
                <p style="font-size: 0.875rem; color: var(--primary-color); font-weight: 500; margin-bottom: 1.5rem;">Sent to: ${AppState.authValue}</p>
            </div>

            <div class="form-group">
                <input type="text" 
                       id="otp-input" 
                       class="form-input" 
                       style="text-align: center; font-size: 1.5rem; letter-spacing: 0.5em;"
                       maxlength="4"
                       placeholder="••••">
                <div id="otp-error" class="error-text" data-i18n="otp_error_invalid">Invalid OTP. Please try '1234'.</div>
            </div>

            <button id="btn-verify-otp" class="btn btn-primary" style="width: 100%; font-size: 1.125rem; margin-bottom: 1rem;">
                <span data-i18n="otp_btn">Verify & Login</span>
            </button>
            
            <button id="btn-resend-otp" class="btn btn-secondary" style="width: 100%; padding: 0.5rem; font-size: 0.875rem; border: none; background: transparent; color: var(--text-muted);">
                <span data-i18n="otp_resend">Didn't receive the code? Resend</span>
            </button>
        </div>
    `;
}

function renderWelcomeScreen() {
    const name = AppState.userName ? AppState.userName : 'Student';
    const hour = new Date().getHours();
    let greetingKey = 'greeting_morning';
    let defaultGreeting = 'Good morning';

    if (hour >= 12 && hour < 17) {
        greetingKey = 'greeting_afternoon';
        defaultGreeting = 'Good afternoon';
    } else if (hour >= 17) {
        greetingKey = 'greeting_evening';
        defaultGreeting = 'Good evening';
    }

    return `
        <div class="glass-card text-center" style="max-width: 600px; margin: 4rem auto; text-align: center;">
            <h2 class="screen-title" style="margin-bottom: 0.5rem;" data-i18n="welcome_user">Welcome ${name}</h2>
            <h3 class="screen-sub" style="font-size: 1.25rem; font-weight: 500; color: var(--primary-color); margin-bottom: 1.5rem;" data-i18n="${greetingKey}">${defaultGreeting}</h3>
            <h2 class="screen-title" data-i18n="welcome_title">Discover Your True Path</h2>
            <p class="screen-sub" data-i18n="welcome_subtitle">We guide you to the correct courses and government exams based on your unique interests and abilities. No confusion, just clarity.</p>
            
            <button id="btn-start" class="btn btn-primary" style="margin-top: 1.5rem; font-size: 1.125rem;">
                <span data-i18n="btn_get_started">Get Started</span>
            </button>
            <button id="btn-view-updates" class="btn btn-secondary" style="margin-top: 1rem; width: 100%; font-size: 1rem;">
                <span data-i18n="btn_view_exam_updates">View Exam Updates</span>
            </button>
        </div>
    `;
}

function renderExamUpdatesScreen() {
    const lang = AppState.language;
    let html = `
        <div class="glass-card" style="max-width: 800px; margin: 2rem auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 class="screen-title" style="margin-bottom: 0.5rem;" data-i18n="exam_updates_title">Government Exam Updates</h2>
                    <p class="screen-sub" data-i18n="exam_updates_sub">Stay updated with the latest notifications and deadlines for major exams.</p>
                </div>
                <button id="btn-back-updates" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
                    <span data-i18n="btn_back">Back</span>
                </button>
            </div>
            
            <div style="background: rgba(255, 152, 0, 0.1); border-left: 4px solid #ff9800; padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 2rem;">
                <p style="font-size: 0.875rem; color: var(--text-main); margin: 0;" data-i18n="disclaimer_text">
                    <strong>Disclaimer:</strong> Dates and details are subject to change by the respective authorities. Please verify all information on the official websites before applying.
                </p>
            </div>

            <div class="updates-grid" style="display: grid; gap: 1.5rem;">
    `;

    AppData.examUpdates.forEach(update => {
        html += `
                <div class="update-card" style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.5rem; transition: transform 0.2s; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--primary-color); margin: 0;">${update.name}</h3>
                        <span style="font-size: 0.75rem; background: var(--bg-secondary); padding: 0.25rem 0.5rem; border-radius: 1rem; color: var(--text-muted);" data-i18n="last_updated_on">Last Updated: ${update.lastUpdated}</span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
                        <div>
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;" data-i18n="notification_date">Notification Date</span>
                            <div style="font-weight: 500; font-size: 0.95rem;">${update.notificationDate}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;" data-i18n="app_dates">Application Dates</span>
                            <div style="font-weight: 500; font-size: 0.95rem;">${update.appStartDate} to ${update.appEndDate}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;" data-i18n="exam_date">Exam Date</span>
                            <div style="font-weight: 500; font-size: 0.95rem; color: var(--secondary-color);">${update.examDate}</div>
                        </div>
                        <div>
                            <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;" data-i18n="result_date">Result Date</span>
                            <div style="font-weight: 500; font-size: 0.95rem;">${update.resultDate}</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600;" data-i18n="eligibility_criteria">Eligibility Criteria</span>
                        <p style="margin-top: 0.25rem; font-size: 0.875rem;">${update.eligibility[lang]}</p>
                    </div>
                    
                    <div>
                        <a href="https://${update.officialWebsite}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem; text-decoration: none;">
                            <span data-i18n="official_website">Visit Official Website</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                    </div>
                </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    return html;
}

function renderLevelSelectScreen() {
    return `
        <div class="glass-card" style="max-width: 700px; margin: 2rem auto;">
            <h2 class="screen-title" data-i18n="level_select_title">What is your current education level?</h2>
            <p class="screen-sub" data-i18n="level_select_sub">Select the stage you are currently studying or have just completed.</p>
            
            <div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div class="option-card" data-level="after_10th">
                    <span data-i18n="level_10th">Class 10th</span>
                </div>
                <div class="option-card" data-level="puc_science_pcmb">
                    <span data-i18n="level_science_pcmb">PUC Science (PCMB)</span>
                </div>
                <div class="option-card" data-level="puc_science_pcmc">
                    <span data-i18n="level_science_pcmc">PUC Science (PCMC)</span>
                </div>
                <div class="option-card" data-level="puc_commerce">
                    <span data-i18n="level_commerce">PUC (Commerce)</span>
                </div>
                <div class="option-card" data-level="puc_arts">
                    <span data-i18n="level_arts">PUC (Arts)</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
                <button id="btn-back" class="btn btn-secondary">
                    <span data-i18n="btn_back">Back</span>
                </button>
                <button id="btn-next-level" class="btn btn-primary" disabled>
                    <span data-i18n="btn_continue">Continue</span>
                </button>
            </div>
        </div>
    `;
}

function renderInterestSelectScreen() {
    return `
        <div class="glass-card" style="max-width: 700px; margin: 2rem auto;">
            <h2 class="screen-title" data-i18n="interest_select_title">What are you most interested in?</h2>
            <p class="screen-sub" data-i18n="interest_select_sub">Choose the path you want us to assess you for. We will tailor the questions accordingly.</p>
            
            <div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div class="option-card" data-interest="courses">
                    <span data-i18n="interest_courses">Academic Courses / Degrees</span>
                </div>
                <div class="option-card" data-interest="exams">
                    <span data-i18n="interest_exams">Government / Competitive Exams</span>
                </div>
                <div class="option-card" data-interest="both">
                    <span data-i18n="interest_both">Both (Comprehensive Assessment)</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
                <button id="btn-back-interest" class="btn btn-secondary">
                    <span data-i18n="btn_back">Back</span>
                </button>
                <button id="btn-start-quiz" class="btn btn-primary" disabled>
                    <span data-i18n="btn_start_assessment">Start Assessment</span>
                </button>
            </div>
        </div>
    `;
}

function renderQuizScreen() {
    // Note: Actual rendering happens via engine.js as we loop questions
    return `<div id="quiz-container"></div>`;
}

function renderCalculatingScreen() {
    return `
        <div class="glass-card text-center" style="max-width: 500px; margin: 4rem auto; text-align: center; padding: 4rem 2rem;">
            <div class="spinner" style="margin: 0 auto 2rem auto;"></div>
            <h2 class="screen-title" data-i18n="calc_title">Analyzing your profile...</h2>
            <p class="screen-sub" data-i18n="calc_sub">Finding the perfect matches for courses and government exams.</p>
        </div>
    `;
}

function renderResultsScreen() {
    // Note: Actual content injected by engine.js based on results
    return `
        <div id="results-container">
            <div class="glass-card" style="margin-bottom: 2rem;">
                <h2 class="screen-title" data-i18n="results_title">Your Personalized Recommendations</h2>
                <p class="screen-sub" data-i18n="results_sub">Based on your answers, these options suit you best.</p>
            </div>
            <div id="results-lists">
                <!-- Injected via engine.js -->
            </div>
            <div style="margin-top: 2rem; text-align: center;">
                 <button id="btn-restart" class="btn btn-secondary">
                    <span data-i18n="btn_restart">Start Over</span>
                </button>
            </div>
        </div>
    `;
}

// ---------------------------------------------------------
// Admin Panel Screen
// ---------------------------------------------------------

function renderAdminScreen() {
    const lang = AppState.language;
    let html = `
        <div class="onboarding-container" style="max-width: 800px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-main);" data-i18n="prof_item_admin">Admin Panel</h2>
                <button class="btn btn-outline" id="admin-back-btn" style="padding: 0.5rem 1rem;">Back</button>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Edit dynamic fields. Changes will be saved locally and reflect globally immediately.</p>
            
            <div class="glass-card" style="padding: 1.5rem; margin-bottom: 2rem;">
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1.5rem;">Exam Updates</h3>
                <div id="admin-exams-form">
    `;

    if (AppData && AppData.examUpdates) {
        AppData.examUpdates.forEach(exam => {
            html += `
                <div class="exam-edit-block" data-exam-id="${exam.id}" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem; background: rgba(255,255,255,0.05);">
                    <h4 style="font-size: 1rem; font-weight: 600; margin-bottom: 1rem; color: var(--primary-color);">${exam.name}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="input-group">
                            <label style="font-size: 0.8rem; color: var(--text-muted);">Notification Date</label>
                            <input type="text" class="input-field exam-notif-date" value="${exam.notificationDate}">
                        </div>
                        <div class="input-group">
                            <label style="font-size: 0.8rem; color: var(--text-muted);">Exam Date</label>
                            <input type="text" class="input-field exam-exam-date" value="${exam.examDate}">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="input-group">
                            <label style="font-size: 0.8rem; color: var(--text-muted);">App Start Date</label>
                            <input type="text" class="input-field exam-start-date" value="${exam.appStartDate}">
                        </div>
                        <div class="input-group">
                            <label style="font-size: 0.8rem; color: var(--text-muted);">App End Date</label>
                            <input type="text" class="input-field exam-end-date" value="${exam.appEndDate}">
                        </div>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>
                <button class="btn btn-primary" id="admin-save-exams" style="width: 100%; margin-top: 1rem;">Save Exam Overrides</button>
            </div>
        </div>
    `;

    return html;
}

// ---------------------------------------------------------
// Screen Listeners
// ---------------------------------------------------------

function attachScreenListeners(screenName) {
    if (screenName === 'login') {
        const tabs = document.querySelectorAll('.segment-btn');
        const sendBtn = document.getElementById('btn-send-otp');
        const input = document.getElementById('login-input');
        const errorText = document.getElementById('login-error');
        const switchBtn = document.getElementById('btn-switch-auth');

        const nameInput = document.getElementById('login-name-input');
        const nameErrorText = document.getElementById('login-name-error');
        const genderBtns = document.querySelectorAll('.gender-card-new');
        const isSignUp = AppState.authType === 'signup';

        // Translate placeholders dynamically
        const placeholderKey = input.getAttribute('data-i18n-placeholder');
        if (placeholderKey && Translations[AppState.language] && Translations[AppState.language][placeholderKey]) {
            input.placeholder = Translations[AppState.language][placeholderKey];
        }

        if (nameInput) {
            const namePlaceholderKey = nameInput.getAttribute('data-i18n-placeholder');
            if (namePlaceholderKey && Translations[AppState.language] && Translations[AppState.language][namePlaceholderKey]) {
                nameInput.placeholder = Translations[AppState.language][namePlaceholderKey];
            }
        }

        const checkFormValidity = () => {
            const val = input.value.trim();
            let isValid = true;

            if (AppState.authMethod === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) isValid = false;
            } else {
                if (!/^\d{10}$/.test(val)) isValid = false;
            }

            if (isSignUp) {
                if (!AppState.userName || AppState.userName.trim().length === 0) isValid = false;
                if (!AppState.userGender) isValid = false;
            }

            if (isValid) {
                sendBtn.removeAttribute('disabled');
            } else {
                sendBtn.setAttribute('disabled', 'true');
            }
        };

        if (input) {
            input.addEventListener('input', (e) => {
                AppState.authValue = e.target.value;
                AppState.authError = false;
                input.classList.remove('error-input');
                errorText?.classList.remove('show');
                checkFormValidity();
            });
        }

        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                AppState.userName = e.target.value;
                nameErrorText?.classList.remove('show');
                checkFormValidity();
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (nameInput) AppState.userName = nameInput.value;
                AppState.authMethod = e.target.dataset.method;
                AppState.authValue = input.value;
                AppState.authError = false;
                renderScreen('login');
            });
        });

        genderBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Determine gender card appropriately since the target might be an SVG child
                const card = e.target.closest('.gender-card-new');
                if (!card) return;

                const selectedGender = card.dataset.gender;
                AppState.userGender = selectedGender;

                genderBtns.forEach(b => b.classList.remove('active'));
                card.classList.add('active');
                checkFormValidity();
            });
        });

        if (switchBtn) {
            switchBtn.addEventListener('click', (e) => {
                AppState.authType = switchBtn.getAttribute('data-target');
                AppState.authError = false;
                renderScreen('login');
            });
        }

        // Initialize Firebase Recaptcha on load of this screen
        if (typeof setupRecaptcha === 'function') {
            setupRecaptcha();
        }

        // Initial validity check
        checkFormValidity();

        sendBtn.addEventListener('click', () => {
            // Because button is disabled until valid, we can safely proceed.
            AppState.authValue = input.value.trim();
            if (nameInput) AppState.userName = nameInput.value.trim();

            if (AppState.authMethod === 'mobile') {
                console.log("Mocking OTP for mobile.");
            }
            renderScreen('otp');
        });
    }

    if (screenName === 'otp') {
        const verifyBtn = document.getElementById('btn-verify-otp');
        const resendBtn = document.getElementById('btn-resend-otp');
        const input = document.getElementById('otp-input');
        const errorText = document.getElementById('otp-error');

        verifyBtn.addEventListener('click', () => {
            const val = input.value.trim();

            // Mock verify with code 1234
            if (val === '1234') {
                AppState.isAuthenticated = true;
                errorText.classList.remove('show');
                renderScreen('welcome');
            } else {
                errorText.classList.add('show');
                input.value = ''; // clear on fail
                input.focus();
            }
        });

        resendBtn.addEventListener('click', () => {
            alert('A new simulated OTP has been sent! (Use 1234)');
        });
    }

    if (screenName === 'welcome') {
        const startBtn = document.getElementById('btn-start');
        startBtn.addEventListener('click', () => {
            renderScreen('level_select');
        });

        const updatesBtn = document.getElementById('btn-view-updates');
        if (updatesBtn) {
            updatesBtn.addEventListener('click', () => {
                renderScreen('exam_updates');
            });
        }
    }

    if (screenName === 'exam_updates') {
        const backBtn = document.getElementById('btn-back-updates');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                renderScreen('welcome');
            });
        }
    }

    if (screenName === 'level_select') {
        const optionCards = document.querySelectorAll('.option-card');
        const nextBtn = document.getElementById('btn-next-level');
        const backBtn = document.getElementById('btn-back');

        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Remove selected from all
                optionCards.forEach(c => c.classList.remove('selected'));
                // Add to clicked
                card.classList.add('selected');
                AppState.selectedLevel = card.dataset.level;
                // Enable next button
                nextBtn.removeAttribute('disabled');
            });
        });

        backBtn.addEventListener('click', () => {
            renderScreen('welcome');
        });

        nextBtn.addEventListener('click', () => {
            if (AppState.selectedLevel) {
                // Go to Interest Select
                renderScreen('interest_select');
            }
        });
    }

    if (screenName === 'interest_select') {
        const optionCards = document.querySelectorAll('.option-card');
        const startBtn = document.getElementById('btn-start-quiz');
        const backBtn = document.getElementById('btn-back-interest');

        optionCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Remove selected from all
                optionCards.forEach(c => c.classList.remove('selected'));
                // Add to clicked
                card.classList.add('selected');
                AppState.selectedInterest = card.dataset.interest;
                // Enable next button
                startBtn.removeAttribute('disabled');
            });
        });

        backBtn.addEventListener('click', () => {
            renderScreen('level_select');
        });

        startBtn.addEventListener('click', () => {
            if (AppState.selectedInterest) {
                // Begin Quiz
                renderScreen('quiz');
                initQuiz(); // Located in engine.js
            }
        });
    }

    if (screenName === 'results') {
        const restartBtn = document.getElementById('btn-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                AppState.selectedLevel = null;
                AppState.answers = [];
                renderScreen('welcome');
            });
        }
    }

    if (screenName === 'admin_panel') {
        const backBtn = document.getElementById('admin-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => renderScreen('welcome'));
        }

        const saveBtn = document.getElementById('admin-save-exams');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const blocks = document.querySelectorAll('.exam-edit-block');
                const newUpdates = JSON.parse(JSON.stringify(AppData.examUpdates));

                blocks.forEach(block => {
                    const id = block.getAttribute('data-exam-id');
                    const notifDate = block.querySelector('.exam-notif-date').value;
                    const examDate = block.querySelector('.exam-exam-date').value;
                    const startDate = block.querySelector('.exam-start-date').value;
                    const endDate = block.querySelector('.exam-end-date').value;

                    const target = newUpdates.find(e => e.id === id);
                    if (target) {
                        target.notificationDate = notifDate;
                        target.examDate = examDate;
                        target.appStartDate = startDate;
                        target.appEndDate = endDate;
                        target.lastUpdated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    }
                });

                if (typeof AdminStore !== 'undefined') {
                    AdminStore.saveExamUpdates(newUpdates);
                    alert("Exam overrides saved successfully! A new notification was broadcast.");
                }
            });
        }
    }
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
