// app.js - Main Application State and Routing

const AppState = {
    currentScreen: 'login', // login, otp, welcome, level_select, quiz, calculating, results, details
    isAuthenticated: false,
    authMethod: 'email', // email or mobile
    authType: 'signup', // signin or signup
    authValue: '',
    authError: false,
    userName: '',
    selectedLevel: null,
    answers: [],
    language: 'en'
};

const DOM = {
    mainArea: document.getElementById('main-content'),
    langSelect: document.getElementById('language-select'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeIconMoon: document.getElementById('theme-icon-moon'),
    themeIconSun: document.getElementById('theme-icon-sun')
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
        case 'quiz':
            template = renderQuizScreen(); // Handled by engine mostly, but stubbing here
            break;
        case 'calculating':
            template = renderCalculatingScreen();
            break;
        case 'results':
            template = renderResultsScreen();
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

    let nameInputHtml = `
        <div class="form-group" style="margin-bottom: 1rem;">
            <input type="text" 
                   id="login-name-input" 
                   class="form-input" 
                   placeholder="..."
                   data-i18n-placeholder="auth_name_placeholder">
            <div id="login-name-error" class="error-text" data-i18n="auth_name_error">Please enter your full name.</div>
        </div>
    `;

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

            <button id="btn-send-otp" class="btn btn-primary" style="width: 100%; font-size: 1.125rem;">
                <span data-i18n="login_btn">Send OTP</span>
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
        </div>
    `;
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
                <div class="option-card" data-level="puc_science">
                    <span data-i18n="level_science">PUC (Science)</span>
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
// Screen Listeners
// ---------------------------------------------------------

function attachScreenListeners(screenName) {
    if (screenName === 'login') {
        const tabs = document.querySelectorAll('.auth-tab');
        const sendBtn = document.getElementById('btn-send-otp');
        const input = document.getElementById('login-input');
        const errorText = document.getElementById('login-error');
        const switchBtn = document.getElementById('btn-switch-auth');

        const nameInput = document.getElementById('login-name-input');
        const nameErrorText = document.getElementById('login-name-error');

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

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                AppState.authMethod = e.target.dataset.method;
                AppState.authValue = input.value; // Store transient value
                AppState.authError = false; // Reset error state on tab switch
                renderScreen('login'); // Re-render to swap input types/active classes
            });
        });

        switchBtn.addEventListener('click', (e) => {
            AppState.authType = switchBtn.getAttribute('data-target');
            renderScreen('login');
        });

        sendBtn.addEventListener('click', () => {
            const val = input.value.trim();
            let isMethodValid = false;
            let isNameValid = true; // Assume true for Sign In

            // Validate Contact Method
            if (AppState.authMethod === 'email') {
                isMethodValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            } else {
                isMethodValid = /^\d{10}$/.test(val);
            }

            // Validate Name
            if (nameInput) {
                if (nameInput.value.trim().length === 0) {
                    isNameValid = false;
                    nameErrorText.classList.add('show');
                } else {
                    nameErrorText.classList.remove('show');
                }
            }

            if (isMethodValid && isNameValid) {
                AppState.authValue = val;
                AppState.authError = false; // clear error 

                if (nameInput) {
                    AppState.userName = nameInput.value.trim();
                }

                renderScreen('otp');
            } else if (!isMethodValid) {
                AppState.authError = true; // flag error on state before rendering

                // Ensure error message text matches the selected method
                const errorKey = AppState.authMethod === 'email' ? 'login_error_email' : 'login_error_mobile';
                errorText.setAttribute('data-i18n', errorKey);

                // Immediately translate
                updateTranslations();

                errorText.classList.add('show');
            }
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
            alert('A new OTP has been sent! (Use 1234)');
        });
    }

    if (screenName === 'welcome') {
        const startBtn = document.getElementById('btn-start');
        startBtn.addEventListener('click', () => {
            renderScreen('level_select');
        });
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
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);
