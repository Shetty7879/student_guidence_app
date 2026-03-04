// app.js - Main Application State and Routing

const AppState = {
    currentScreen: 'signup', // login, otp, welcome, level_select, quiz, calculating, results, details
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
    language: 'en', // default language
    dateJoined: null, // added for profile
    profilePicture: null // Base64 encoded image
};

// ---------------------------------------------------------
// User Profile Storage
// ---------------------------------------------------------

function saveUserProfile() {
    if (!AppState.isAuthenticated) return;

    // Create joined date if it doesn't exist
    if (!AppState.dateJoined) {
        AppState.dateJoined = new Date().toISOString();
    }

    const profileData = {
        userName: AppState.userName,
        userGender: AppState.userGender,
        authValue: AppState.authValue,
        authMethod: AppState.authMethod,
        selectedLevel: AppState.selectedLevel,
        selectedInterest: AppState.selectedInterest,
        dateJoined: AppState.dateJoined,
        language: AppState.language,
        profilePicture: AppState.profilePicture
    };

    localStorage.setItem('sg_user_profile', JSON.stringify(profileData));
}

function loadUserProfile() {
    const saved = localStorage.getItem('sg_user_profile');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            AppState.userName = data.userName || '';
            AppState.userGender = data.userGender || null;
            AppState.authValue = data.authValue || '';
            AppState.authMethod = data.authMethod || 'email';
            AppState.selectedLevel = data.selectedLevel || null;
            AppState.selectedInterest = data.selectedInterest || null;
            AppState.dateJoined = data.dateJoined || null;
            if (data.language) {
                AppState.language = data.language;
                if (DOM.langSelect) DOM.langSelect.value = data.language;
            }
            AppState.profilePicture = data.profilePicture || null;
            if (typeof window.updateNavbarAvatar === 'function') {
                window.updateNavbarAvatar();
            }
        } catch (e) {
            console.error('Failed to load user profile from storage', e);
        }
    }
}

window.updateNavbarAvatar = function () {
    const defaultAvatarSvg = document.getElementById('navbar-default-avatar');
    const userAvatarImg = document.getElementById('navbar-user-avatar');

    if (defaultAvatarSvg && userAvatarImg) {
        if (AppState.profilePicture) {
            userAvatarImg.src = AppState.profilePicture;
            userAvatarImg.classList.remove('hidden');
            defaultAvatarSvg.classList.add('hidden');
        } else {
            userAvatarImg.src = '';
            userAvatarImg.classList.add('hidden');
            defaultAvatarSvg.classList.remove('hidden');
        }
    }
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
    DOM.langSelect?.addEventListener('change', (e) => {
        AppState.language = e.target.value;
        updateTranslations();

        // Custom DOM updates to avoid full re-rendering and erasing user progress
        if (AppState.currentScreen === 'quiz' && typeof renderNextQuestion === 'function') {
            // Re-render just the quiz active question text and options
            renderNextQuestion();
        } else if (AppState.currentScreen === 'results' && typeof renderRecommendations === 'function') {
            // Re-render just the injected results lists
            renderRecommendations();
        } else {
            // For other static screens, a re-render is safe
            renderScreen(AppState.currentScreen);
        }
    });

    // Setup Theme listener
    DOM.themeToggleBtn?.addEventListener('click', toggleTheme);

    // Profile menu listeners
    if (DOM.profileBtn) {
        DOM.profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            DOM.profileDropdown?.classList.toggle('hidden');
        });
    }

    // Initialize Notifications
    if (typeof NotificationManager !== 'undefined') {
        try {
            NotificationManager.init();
        } catch (e) {
            console.error('Error in NotificationManager.init:', e);
        }
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
        AppState.userRole = 'student';
        AppState.answers = [];
        AppState.selectedLevel = null;
        AppState.selectedInterest = null; // Reset selected interest on logout
        AppState.dateJoined = null;
        localStorage.removeItem('sg_user_profile'); // Clear saved profile

        DOM.profileDropdown.classList.add('hidden');
        renderScreen('login');

        // Clear activity thresholds
        if (window.adminInactivityTimer) clearTimeout(window.adminInactivityTimer);
        if (window.adminActivityListenersBound) {
            ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
                document.removeEventListener(evt, resetAdminInactivityTimer);
            });
            window.adminActivityListenersBound = false;
        }
    });

    // Profile Menu Click Delegation
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('.dropdown-item');
        if (!target) return;

        const id = target.id;

        switch (id) {
            case 'menu-theme-toggle':
                toggleTheme();
                break;
            case 'menu-retake':
                if (AppState.isAuthenticated) {
                    DOM.profileDropdown.classList.add('hidden');
                    renderScreen('level_select');
                }
                break;
            case 'menu-reset':
                if (AppState.isAuthenticated) {
                    AppState.answers = [];
                    AppState.selectedLevel = null;
                    AppState.selectedInterest = null;
                    DOM.profileDropdown.classList.add('hidden');
                    renderScreen('welcome');
                }
                break;
            case 'menu-exam-updates':
                if (AppState.isAuthenticated) {
                    DOM.profileDropdown.classList.add('hidden');
                    renderScreen('exam_updates');
                }
                break;
            case 'menu-admin-panel':
                if (AppState.isAuthenticated) {
                    DOM.profileDropdown.classList.add('hidden');
                    if (AppState.userRole === 'admin' || AppState.userRole === 'super_admin') {
                        renderScreen('admin_panel');
                    } else {
                        alert("Unauthorized Access. You do not have permission to view the Admin Panel.");
                        renderScreen('welcome');
                    }
                }
                break;
            case 'menu-language':
                DOM.profileDropdown.classList.add('hidden');
                DOM.langSelect.focus();
                break;
            case 'menu-view-profile':
                if (AppState.isAuthenticated) {
                    DOM.profileDropdown.classList.add('hidden');
                    navigate('/profile');
                }
                break;
            case 'menu-edit-profile':
                if (AppState.isAuthenticated) {
                    DOM.profileDropdown.classList.add('hidden');
                    navigate('/edit-profile');
                }
                break;
            case 'menu-help':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/help'); }
                break;
            case 'menu-contact':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/contact'); }
                break;
            case 'menu-report':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/report'); }
                break;
            case 'menu-feedback':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/feedback'); }
                break;
            case 'menu-about':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/about'); }
                break;
            case 'menu-privacy':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/privacy'); }
                break;
            case 'menu-terms':
                if (AppState.isAuthenticated) { DOM.profileDropdown.classList.add('hidden'); navigate('/terms'); }
                break;
        }
    });

    // Handle Admin Menu visibility 
    if (AppState.isAuthenticated && (AppState.userRole === 'admin' || AppState.userRole === 'super_admin')) {
        const adminMenuBtn = document.getElementById('menu-admin-panel');
        if (adminMenuBtn) { adminMenuBtn.style.display = 'block'; }
        startAdminInactivityTimer();
    } else {
        const adminMenuBtn = document.getElementById('menu-admin-panel');
        if (adminMenuBtn) { adminMenuBtn.style.display = 'none'; }
    }

    // Set initial localization then render
    updateTranslations();

    // Small delay to hide loader and show first screen smoothly
    console.log('Before setTimeout in initApp');
    setTimeout(() => {
        console.log('Inside setTimeout, isAuthenticated:', AppState.isAuthenticated);
        try {
            // Attempt to load saved profile
            loadUserProfile();

            // Check Hash for initial routing if unauthenticated
            const hash = window.location.hash;

            // Auto-login if we have a saved profile (simple for now)
            if (AppState.userName && AppState.authValue && !AppState.isAuthenticated) {
                AppState.isAuthenticated = true;

                // Re-load profile if it exists, otherwise save new one
                if (!AppState.dateJoined) {
                    saveUserProfile();
                }

                renderScreen('welcome');
            } else if (hash === '#/login') {
                renderScreen('login');
            } else {
                // Default to signup and sync hash
                if (hash !== '#/create-account') window.location.hash = '#/create-account';
                renderScreen('signup');
            }

            // Listen for hash changes for back/forward navigation or manual entry
            window.addEventListener('hashchange', () => {
                const newHash = window.location.hash;
                if (AppState.isAuthenticated) {
                    if (newHash === '#/profile') renderScreen('profile');
                    else if (newHash === '#/edit-profile') renderScreen('edit_profile');
                    else if (newHash === '#/welcome') renderScreen('welcome');
                    else if (newHash === '#/help') renderScreen('help');
                    else if (newHash === '#/contact') renderScreen('contact');
                    else if (newHash === '#/report') renderScreen('report');
                    else if (newHash === '#/feedback') renderScreen('feedback');
                    else if (newHash === '#/about') renderScreen('about');
                    else if (newHash === '#/privacy') renderScreen('privacy');
                    else if (newHash === '#/terms') renderScreen('terms');
                    return;
                }

                if (newHash === '#/login') {
                    renderScreen('login');
                } else if (newHash === '#/create-account') {
                    renderScreen('signup');
                }
            });
        } catch (e) {
            console.error('Error in initApp setTimeout:', e);
        }
    }, 500);
}

function renderScreen(screenName) {
    try {
        AppState.currentScreen = screenName;
        DOM.mainArea.innerHTML = ''; // Clear container

        // Strictly enforce auth background
        if (screenName === 'signup' || screenName === 'login' || screenName === 'otp') {
            document.body.classList.add('auth-minimal-bg');
        } else {
            document.body.classList.remove('auth-minimal-bg');
        }

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
            case 'signup':
                template = renderSignupScreen();
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
            case 'profile':
                template = renderProfileScreen();
                break;
            case 'edit_profile':
                template = renderEditProfileScreen();
                break;
            case 'admin_panel':
                template = renderAdminScreen();
                break;
            case 'help':
                template = renderHelpScreen();
                break;
            case 'contact':
                template = renderContactScreen();
                break;
            case 'report':
                template = renderReportIssueScreen();
                break;
            case 'feedback':
                template = renderFeedbackScreen();
                break;
            case 'about':
                template = renderAboutScreen();
                break;
            case 'privacy':
                template = renderPrivacyPolicyScreen();
                break;
            case 'terms':
                template = renderTermsScreen();
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
        console.log('Attaching translations...');
        updateTranslations();
        console.log('renderScreen completed without errors.');
    } catch (err) {
        console.error('Error in renderScreen:', err);
    }
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

function renderSignupScreen() {
    const isEmail = AppState.authMethod === 'email';

    return `
        <div class="auth-card" style="width: 100%; max-width: 360px; margin: 0 auto; background: var(--card-bg); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 1.25rem !important;">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(99, 102, 241, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem !important;">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--text-main); margin: 0 0 0.5rem 0 !important;" data-i18n="auth_signup_title">Create Your Account</h2>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0 !important;" data-i18n="auth_signup_sub">Let's personalize your guidance journey</p>
            </div>

            <!-- Full Name Input -->
            <div style="margin-bottom: 0.25rem !important; position: relative;">
                <div style="position: absolute; left: 1rem; top: 1.5rem; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <input type="text" 
                       id="signup-name-input" 
                       class="auth-minimal-input" 
                       placeholder="Enter full name"
                       data-i18n-placeholder="auth_name_placeholder"
                       value="${AppState.userName || ''}"
                       style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--surface-solid); color: var(--text-main); font-size: 0.875rem; font-family: var(--font-family); outline: none; transition: border-color 0.2s;">
                <div id="signup-name-success-icon" style="position: absolute; right: 1rem; top: 1.5rem; transform: translateY(-50%); width: 18px; height: 18px; color: #10b981; display: none; align-items: center; justify-content: center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            </div>
            <div id="signup-name-error" class="error-text" data-i18n="auth_name_error" style="display: block; color: #ef4444; font-size: 0.75rem; margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; visibility: hidden; line-height: 1.25rem !important;">Please enter your full name.</div>
            <div id="signup-name-success" class="success-text" data-i18n="auth_name_success" style="margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; line-height: 1.25rem !important;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Looks good
            </div>

            <!-- Gender Selection -->
            <div style="margin-bottom: 0.25rem !important;">
                <p style="font-size: 0.875rem; font-weight: 500; color: #e2e8f0; margin: 0 0 0.25rem 0.25rem !important;" data-i18n="auth_gender_label">Select Your Gender</p>
                <div style="display: flex; flex-direction: column; gap: 0.375rem !important;">
                    <div style="display: flex; gap: 0.375rem !important;">
                        <button class="gender-pill ${AppState.userGender === 'Male' ? 'active' : ''}" data-gender="Male" style="flex: 1; min-height: 50px; padding: 0.5rem 0.5rem; justify-content: center; flex-direction: row; align-items: center;">
                            <svg class="gender-icon" style="color: #3b82f6; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="5"></circle><line x1="14" y1="10" x2="21" y2="3"></line><line x1="16" y1="3" x2="21" y2="3"></line><line x1="21" y1="3" x2="21" y2="8"></line></svg>
                            <span data-i18n="gender_male">Male</span>
                        </button>
                        <button class="gender-pill ${AppState.userGender === 'Female' ? 'active' : ''}" data-gender="Female" style="flex: 1; min-height: 50px; padding: 0.5rem 0.5rem; justify-content: center; flex-direction: row; align-items: center;">
                            <svg class="gender-icon" style="color: #a855f7; width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="5"></circle><line x1="12" y1="15" x2="12" y2="22"></line><line x1="9" y1="19" x2="15" y2="19"></line></svg>
                            <span data-i18n="gender_female">Female</span>
                        </button>
                    </div>
                    <div style="display: flex; justify-content: center;">
                        <button class="gender-pill ${AppState.userGender === 'Other' ? 'active' : ''}" data-gender="Other" style="width: auto; min-height: 50px; padding: 0.5rem 1.5rem; justify-content: center; flex-direction: row; align-items: center;">
                            <svg class="gender-icon" style="color: var(--text-muted); width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span data-i18n="gender_prefer_not_to_say">Prefer not to say</span>
                        </button>
                    </div>
                </div> <!-- Closing the column flex gap -->
            </div> <!-- Closing the entire Gender block -->
            <div id="signup-gender-error" class="error-text" data-i18n="auth_gender_error" style="display: block; color: #ef4444; font-size: 0.75rem; margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; visibility: hidden; line-height: 1.25rem !important;">Please select a gender to continue.</div>
            <div id="signup-gender-success" class="success-text" data-i18n="auth_gender_success" style="margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; line-height: 1.25rem !important;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Looks good
            </div>

            <!-- Login Method Toggle (Strictly between Gender and Input) -->
            <div style="margin-bottom: 0.75rem !important;" id="signup-method-toggle-container">
                <div style="display: flex; background: var(--surface-solid); border-radius: 12px; padding: 0.25rem;">
                    <div class="segment-btn ${isEmail ? 'active' : ''}" data-method="email" data-i18n="login_tab_email" style="flex: 1; text-align: center; padding: 0.75rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border-radius: 10px; color: ${isEmail ? 'var(--primary-color)' : 'var(--text-muted)'}; background: ${isEmail ? 'var(--card-bg)' : 'transparent'}; box-shadow: ${isEmail ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}; transition: all 0.2s;">Email</div>
                    <div class="segment-btn ${!isEmail ? 'active' : ''}" data-method="mobile" data-i18n="login_tab_mobile" style="flex: 1; text-align: center; padding: 0.75rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border-radius: 10px; color: ${!isEmail ? 'var(--primary-color)' : 'var(--text-muted)'}; background: ${!isEmail ? 'var(--card-bg)' : 'transparent'}; box-shadow: ${!isEmail ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}; transition: all 0.2s;">Mobile Number</div>
                </div>
            </div>

            <!-- Email/Mobile Input -->
            <div style="margin-bottom: 0.25rem !important; position: relative;">
                <div style="position: absolute; left: 1rem; top: 1.5rem; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
                    ${isEmail ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>'}
                </div>
                <!-- Dynamic type and placeholder based on Auth Method -->
                <input type="${isEmail ? 'email' : 'tel'}" 
                       id="signup-input" 
                       class="auth-minimal-input" 
                       placeholder="Enter your ${isEmail ? 'email address' : 'mobile number'}"
                       data-i18n-placeholder="${isEmail ? 'login_input_email' : 'login_input_mobile'}"
                       value="${AppState.authValue}"
                       style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--surface-solid); color: var(--text-main); font-size: 0.875rem; font-family: var(--font-family); outline: none; transition: border-color 0.2s;">
                <div id="signup-contact-success-icon" style="position: absolute; right: 1rem; top: 1.5rem; transform: translateY(-50%); width: 18px; height: 18px; color: #10b981; display: none; align-items: center; justify-content: center;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
            </div>
            <div id="signup-error" class="error-text" data-i18n="${isEmail ? 'login_error_email' : 'login_error_mobile'}" style="display: block; color: #ef4444; font-size: 0.75rem; margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; visibility: hidden; line-height: 1.25rem !important;">
                ${isEmail ? 'Enter a valid email address.' : 'Enter a valid mobile number.'}
            </div>
            <div id="signup-success" class="success-text" data-i18n="auth_contact_success" style="margin-top: 0 !important; margin-bottom: 0 !important; min-height: 1.25rem !important; line-height: 1.25rem !important;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Looks good
            </div>

            <div id="recaptcha-wrapper"></div>
            
            <div id="signup-btn-wrapper" style="cursor: pointer; width: 100%;">
                <button id="btn-signup" disabled 
                        style="width: 100%; padding: 0.875rem; border-radius: 12px; border: none; background: var(--primary-light); color: white; font-size: 1rem; font-weight: 500; cursor: not-allowed; opacity: 0.5; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2); font-family: var(--font-family); pointer-events: none;"
                        data-i18n="signup_btn">
                    Create Account & Send OTP
                </button>
            </div>
            
            <div style="text-align: center; margin-top: 1.5rem !important;">
                <button id="btn-switch-to-login" data-target="login" style="background: transparent; border: none; font-size: 0.875rem; cursor: pointer; padding: 0;">
                    <span style="color: var(--text-muted);" data-i18n="auth_switch_prompt_signin">Already have an account? </span>
                    <span style="color: var(--primary-light); font-weight: 500;" data-i18n="auth_switch_action_signin">Sign In</span>
                </button>
            </div>
        </div>
    `;
}

function renderLoginScreen() {
    const isEmail = AppState.authMethod === 'email';

    return `
        <div style="width: 100%; max-width: 360px; margin: 0 auto; background: var(--card-bg); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 1.25rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 1rem; display: block;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin: 0 0 0.25rem 0;" data-i18n="auth_signin_title">Welcome Back</h2>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;" data-i18n="auth_signin_sub">Welcome back! Sign in to continue your journey.</p>
            </div>

            <div style="margin-bottom: 0.75rem;">
                <div style="display: flex; background: var(--surface-solid); border-radius: 12px; padding: 0.25rem;">
                    <div class="segment-btn ${isEmail ? 'active' : ''}" data-method="email" data-i18n="login_tab_email" style="flex: 1; text-align: center; padding: 0.75rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border-radius: 10px; color: ${isEmail ? 'var(--primary-color)' : 'var(--text-muted)'}; background: ${isEmail ? 'var(--card-bg)' : 'transparent'}; box-shadow: ${isEmail ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}; transition: all 0.2s;">Email</div>
                    <div class="segment-btn ${!isEmail ? 'active' : ''}" data-method="mobile" data-i18n="login_tab_mobile" style="flex: 1; text-align: center; padding: 0.75rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; border-radius: 10px; color: ${!isEmail ? 'var(--primary-color)' : 'var(--text-muted)'}; background: ${!isEmail ? 'var(--card-bg)' : 'transparent'}; box-shadow: ${!isEmail ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'}; transition: all 0.2s;">Mobile Number</div>
                </div>
            </div>

            <div style="margin-bottom: 0.5rem; position: relative;">
                <div style="position: absolute; left: 1rem; top: 1.5rem; transform: translateY(-50%); width: 18px; height: 18px; color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
                    ${isEmail ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>'}
                </div>
                <input type="${isEmail ? 'email' : 'tel'}" 
                       id="login-input" 
                       class="auth-minimal-input ${AppState.authError ? 'error-input' : ''}" 
                       placeholder="Enter your ${isEmail ? 'email address' : 'mobile number'}"
                       data-i18n-placeholder="${isEmail ? 'login_input_email' : 'login_input_mobile'}"
                       value="${AppState.authValue}"
                       style="width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem; border-radius: 12px; border: 1px solid ${AppState.authError ? '#ef4444' : 'var(--border-color)'}; background: var(--surface-solid); color: var(--text-main); font-size: 0.875rem; font-family: var(--font-family); outline: none; transition: border-color 0.2s;">
                <div id="login-error" class="error-text ${AppState.authError ? 'show' : ''}" data-i18n="${isEmail ? 'login_error_email' : 'login_error_mobile'}" style="color: #ef4444; font-size: 0.75rem; margin-top: 0; min-height: 1.25rem; display: ${AppState.authError ? 'block' : 'none'};">
                    ${isEmail ? 'Please enter a valid email address.' : 'Please enter a valid 10-digit mobile number.'}
                </div>
            </div>

            <div id="recaptcha-wrapper"></div>
            
            <button id="btn-login" style="width: 100%; padding: 0.875rem; background: var(--primary-light); color: var(--btn-text); border: none; border-radius: 12px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2); font-family: var(--font-family);">
                <span id="btn-login-text" data-i18n="login_btn">Send OTP</span>
            </button>
            <p id="login-disabled-hint" style="font-size: 0.7rem; color: var(--text-muted); margin: 0.5rem 0 0 0; text-align: center;">Enter your details to continue.</p>

            <div style="text-align: center; margin-top: 1.5rem;">
                <button id="btn-switch-to-signup" data-target="signup" style="background: transparent; border: none; font-size: 0.875rem; cursor: pointer; padding: 0;">
                    <span style="color: var(--text-muted);" data-i18n="auth_switch_prompt_signup">New here? </span>
                    <span style="color: var(--primary-color); font-weight: 500;" data-i18n="auth_switch_action_signup">Create Account</span>
                </button>
            </div>
        </div>
    `;
}

function renderOtpScreen() {
    return `
        <div style="width: 100%; max-width: 360px; margin: 0 auto; background: var(--card-bg); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 1.25rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 0.75rem; display: block;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                <h2 style="font-size: 1.25rem; font-weight: 600; color: var(--text-main); margin: 0 0 0.25rem 0;" data-i18n="otp_title">Verify Secure OTP</h2>
                <p style="font-size: 0.875rem; color: var(--text-muted); margin: 0;" data-i18n="otp_sub">Please enter the 4-digit verification code</p>
            </div>

            <div style="margin-bottom: 1rem;">
                <input type="text" 
                       id="otp-input" 
                       style="width: 100%; text-align: center; font-size: 1.25rem; letter-spacing: 0.5em; padding: 0.75rem; border-radius: 6px; border: 1px solid #374151; background: var(--surface-solid); color: var(--text-main); outline: none;"
                       maxlength="4"
                       placeholder="••••">
                <div id="otp-error" class="error-text" data-i18n="otp_error_invalid" style="color: #ef4444; font-size: 0.75rem; margin-top: 0.5rem; display: none; text-align: center;">Invalid OTP. Please try '1234'.</div>
            </div>

            <button id="btn-verify-otp" style="width: 100%; padding: 0.75rem; background: var(--primary-color); color: var(--btn-text); border: none; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; margin-bottom: 1.5rem;">
                <span data-i18n="otp_btn">Verify OTP</span>
            </button>
            
            <div style="text-align: center;">
                <button id="btn-resend-otp" style="background: transparent; border: none; color: var(--text-muted); font-size: 0.875rem; cursor: pointer; padding: 0;">
                    <span data-i18n="otp_resend">Resend OTP</span>
                </button>
            </div>
        </div>
    `;
}

function renderWelcomeScreen() {
    const name = AppState.userName ? AppState.userName : 'Student';
    const hour = new Date().getHours();
    let defaultGreeting = 'Good Morning';

    if (hour >= 12 && hour < 17) {
        defaultGreeting = 'Good Afternoon';
    } else if (hour >= 17 && hour < 22) {
        defaultGreeting = 'Good Evening';
    } else if (hour >= 22 || hour < 5) {
        defaultGreeting = 'Welcome';
    }

    const greetingText = `${defaultGreeting}, ${name} 👋`;

    return `
        <div class="glass-card text-center" style="max-width: 600px; margin: 4rem auto; text-align: center; padding: 3rem 2rem;">
            <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem auto; border-radius: 50%; background: rgba(16, 185, 129, 0.1); display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            
            <h2 class="screen-title" style="margin-bottom: 1rem; font-size: 2rem; color: var(--text-main);">${greetingText}</h2>
            <p class="screen-sub" style="font-size: 1.125rem; color: var(--text-muted); margin-bottom: 2.5rem;">We’re glad to have you here. Let’s plan your future.</p>
            
            <button id="btn-start" class="btn btn-primary" style="font-size: 1.125rem; padding: 1rem 2rem; width: 100%; max-width: 300px; margin: 0 auto; display: flex; justify-content: center;">
                <span>Start My Guidance</span>
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

function navigate(route) {
    window.location.hash = '#' + route;
    if (route === '/profile') renderScreen('profile');
    else if (route === '/edit-profile') renderScreen('edit_profile');
    else if (route === '/welcome') renderScreen('welcome');
}

function renderProfileScreen() {
    // If profile data is undefined, fetch from stored session
    if (!AppState.userName && AppState.isAuthenticated) {
        loadUserProfile();
    }

    // Generate human-readable labels for enums
    const levelLabels = {
        'after_10th': 'Class 10th',
        'puc_science_pcmb': 'PUC Science (PCMB)',
        'puc_science_pcmc': 'PUC Science (PCMC)',
        'puc_commerce': 'PUC (Commerce)',
        'puc_arts': 'PUC (Arts)',
        'diploma_polytechnic': 'Polytechnic / Diploma',
        'iti': 'ITI (Industrial Training)',
        null: 'Not selected yet'
    };

    const interestLabels = {
        'courses': 'Academic Courses',
        'exams': 'Government Exams',
        'both': 'Both (Courses & Exams)',
        null: 'Not selected yet'
    };

    const joinedDateStr = AppState.dateJoined ? new Date(AppState.dateJoined).toLocaleDateString() : 'N/A';

    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h2 class="screen-title" style="margin: 0; font-size: 1.5rem;">Your Profile</h2>
                <button class="btn btn-secondary" onclick="navigate('/welcome')" style="padding: 0.5rem 1rem; font-size: 0.875rem; white-space: nowrap;">Back to Home</button>
            </div>
            
            <div class="avatar-upload-wrapper">
                <label for="direct-profile-upload" style="cursor: pointer; display: block;" title="Change Profile Picture">
                    <img id="profile-main-avatar" src="${AppState.profilePicture || 'data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%23ffffff\\\' stroke-width=\\\'1.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><circle cx=\\\'12\\\' cy=\\\'8\\\' r=\\\'5\\\'></circle><path d=\\\'M20 21a8 8 0 0 0-16 0\\\'></path></svg>'}" alt="" class="avatar-large" />
                </label>
                <input type="file" id="direct-profile-upload" class="avatar-hidden-input" accept="image/jpeg, image/png, image/webp" onchange="window.handleDirectAvatarUpload(this)">
            </div>

            <div class="profile-grid">
                <div class="profile-card-item">
                    <div class="profile-card-label">Full Name</div>
                    <div class="profile-card-value">${AppState.userName || 'N/A'}</div>
                </div>
                
                <div class="profile-card-item">
                    <div class="profile-card-label">Gender</div>
                    <div class="profile-card-value">${AppState.userGender || 'N/A'}</div>
                </div>

                <div class="profile-card-item">
                    <div class="profile-card-label">${AppState.authMethod === 'email' ? 'Email Address' : 'Mobile Number'}</div>
                    <div class="profile-card-value">${AppState.authValue || 'N/A'}</div>
                </div>
                
                <div class="profile-card-item">
                    <div class="profile-card-label">Education Level</div>
                    <div class="profile-card-value" style="color: var(--primary-light);">${levelLabels[AppState.selectedLevel] || levelLabels[null]}</div>
                </div>
                
                <div class="profile-card-item">
                    <div class="profile-card-label">Selected Interests</div>
                    <div class="profile-card-value" style="color: var(--secondary-color);">${interestLabels[AppState.selectedInterest] || interestLabels[null]}</div>
                </div>
                
                <div class="profile-card-item">
                    <div class="profile-card-label">Date Joined</div>
                    <div class="profile-card-value">${joinedDateStr}</div>
                </div>
            </div>

            <div class="edit-profile-btn-wrapper">
                <button class="btn btn-primary edit-profile-btn" onclick="navigate('/edit-profile')">
                    Edit Profile
                </button>
            </div>
        </div>
    `;
}

function renderEditProfileScreen() {
    // If profile data is undefined, fetch from stored session
    if (!AppState.userName && AppState.isAuthenticated) {
        loadUserProfile();
    }

    const isEmail = AppState.authMethod === 'email';

    return `
        <div class="glass-card" style="max-width: 600px; margin: 2rem auto; padding: 2rem;">
            <div style="margin-bottom: 2rem;">
                <h2 class="screen-title" style="margin: 0; font-size: 1.5rem;">Edit Profile</h2>
                <p class="screen-sub" style="margin-top: 0.5rem; margin-bottom: 0; font-size: 0.9rem;">Update your personal details below.</p>
            </div>
            
            <div class="avatar-upload-wrapper">
                <img id="edit-profile-preview" src="${AppState.profilePicture || 'data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%23ffffff\\\' stroke-width=\\\'1.5\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'><circle cx=\\\'12\\\' cy=\\\'8\\\' r=\\\'5\\\'></circle><path d=\\\'M20 21a8 8 0 0 0-16 0\\\'></path></svg>'}" alt="" class="avatar-large" />
                <label for="profile-img-upload" class="avatar-upload-btn" title="Change Profile Picture">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </label>
                <input type="file" id="profile-img-upload" class="avatar-hidden-input" accept="image/jpeg, image/png, image/webp" onchange="window.handleAvatarUpload(this)">
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Full Name</label>
                <input type="text" id="edit-profile-name" class="form-input" value="${AppState.userName || ''}" placeholder="Enter your full name">
                <div id="edit-name-error" class="error-text" style="color: #ef4444; font-size: 0.75rem; margin-top: 0.5rem; display: none;">Name cannot be empty.</div>
            </div>
            
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Gender</label>
                <select id="edit-profile-gender" class="form-input" style="appearance: auto;">
                    <option value="" disabled ${!AppState.userGender ? 'selected' : ''}>Select Gender</option>
                    <option value="Male" ${AppState.userGender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${AppState.userGender === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Other" ${AppState.userGender === 'Other' ? 'selected' : ''}>Prefer not to say</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">${isEmail ? 'Email Address' : 'Mobile Number'}</label>
                <input type="${isEmail ? 'email' : 'text'}" id="edit-profile-contact" class="form-input" value="${AppState.authValue || ''}" placeholder="${isEmail ? 'Enter email' : 'Enter mobile'}">
                <div id="edit-contact-error" class="error-text" style="color: #ef4444; font-size: 0.75rem; margin-top: 0.5rem; display: none;">${isEmail ? 'Invalid email format.' : 'Invalid mobile format (10 digits).'}</div>
            </div>
            
            <div class="form-group" style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Education Level</label>
                <select id="edit-profile-level" class="form-input" style="appearance: auto;">
                    <option value="" ${!AppState.selectedLevel ? 'selected' : ''}>Not Selected</option>
                    <option value="after_10th" ${AppState.selectedLevel === 'after_10th' ? 'selected' : ''}>Class 10th</option>
                    <option value="puc_science_pcmb" ${AppState.selectedLevel === 'puc_science_pcmb' ? 'selected' : ''}>PUC Science (PCMB)</option>
                    <option value="puc_science_pcmc" ${AppState.selectedLevel === 'puc_science_pcmc' ? 'selected' : ''}>PUC Science (PCMC)</option>
                    <option value="puc_commerce" ${AppState.selectedLevel === 'puc_commerce' ? 'selected' : ''}>PUC (Commerce)</option>
                    <option value="puc_arts" ${AppState.selectedLevel === 'puc_arts' ? 'selected' : ''}>PUC (Arts)</option>
                    <option value="diploma_polytechnic" ${AppState.selectedLevel === 'diploma_polytechnic' ? 'selected' : ''}>Polytechnic / Diploma</option>
                    <option value="iti" ${AppState.selectedLevel === 'iti' ? 'selected' : ''}>ITI</option>
                </select>
            </div>

            <div class="form-group" style="margin-bottom: 2.5rem;">
                <label style="display: block; font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 500;">Interests</label>
                <select id="edit-profile-interest" class="form-input" style="appearance: auto;">
                    <option value="" ${!AppState.selectedInterest ? 'selected' : ''}>Not Selected</option>
                    <option value="courses" ${AppState.selectedInterest === 'courses' ? 'selected' : ''}>Courses</option>
                    <option value="exams" ${AppState.selectedInterest === 'exams' ? 'selected' : ''}>Exams</option>
                    <option value="both" ${AppState.selectedInterest === 'both' ? 'selected' : ''}>Both</option>
                </select>
            </div>

            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-secondary" onclick="navigate('/profile')" style="flex: 1;">Cancel</button>
                <button class="btn btn-primary" onclick="window.saveEditedProfile()" style="flex: 1;">Save Changes</button>
            </div>
        </div>
    `;
}

// Temporary hold for a potential new avatar before saving
window._tempProfileAvatar = null;

window.handleAvatarUpload = function (input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    // Size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.show('File too large. Maximum size is 5MB.', 'error');
        } else {
            alert('File too large. Maximum size is 5MB.');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            // Resize canvas
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            // Draw and compress to jpeg
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            window._tempProfileAvatar = dataUrl;
            document.getElementById('edit-profile-preview').src = dataUrl;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.handleDirectAvatarUpload = function (input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];

    if (file.size > 5 * 1024 * 1024) {
        if (typeof NotificationManager !== 'undefined') {
            NotificationManager.show('File too large. Maximum size is 5MB.', 'error');
        } else {
            alert('File too large. Maximum size is 5MB.');
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            // Update state and instantly save
            AppState.profilePicture = dataUrl;
            saveUserProfile();
            window.updateNavbarAvatar();

            const profileAvatarImg = document.getElementById('profile-main-avatar');
            if (profileAvatarImg) {
                profileAvatarImg.src = dataUrl;
            }

            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.show('Profile picture updated.', 'success');
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.saveEditedProfile = function () {
    const nameInput = document.getElementById('edit-profile-name').value.trim();
    const genderInput = document.getElementById('edit-profile-gender').value;
    const contactInput = document.getElementById('edit-profile-contact').value.trim();
    const levelInput = document.getElementById('edit-profile-level').value;
    const interestInput = document.getElementById('edit-profile-interest').value;

    // Quick validation
    if (!nameInput) {
        document.getElementById('edit-name-error').style.display = 'block';
        return;
    } else {
        document.getElementById('edit-name-error').style.display = 'none';
    }

    const isEmail = AppState.authMethod === 'email';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (isEmail && !emailRegex.test(contactInput)) {
        document.getElementById('edit-contact-error').style.display = 'block';
        return;
    } else if (!isEmail && !phoneRegex.test(contactInput)) {
        document.getElementById('edit-contact-error').style.display = 'block';
        return;
    } else {
        document.getElementById('edit-contact-error').style.display = 'none';
    }

    // Assign to state
    AppState.userName = nameInput;
    AppState.userGender = genderInput || null;
    AppState.authValue = contactInput;
    AppState.selectedLevel = levelInput || null;
    AppState.selectedInterest = interestInput || null;

    if (window._tempProfileAvatar) {
        AppState.profilePicture = window._tempProfileAvatar;
        window._tempProfileAvatar = null; // reset
    }

    // Persist and navigate
    saveUserProfile();
    window.updateNavbarAvatar();

    if (typeof NotificationManager !== 'undefined') {
        NotificationManager.show('Profile updated securely.', 'success');
    }

    navigate('/profile');
};

function renderLevelSelectScreen() {
    return `
        <div class="glass-card" style="max-width: 700px; margin: 2rem auto;">
            <h2 class="screen-title" data-i18n="level_select_title">What is your current education level?</h2>
            <p class="screen-sub" data-i18n="level_select_sub">Select the stage you are currently studying or have just completed.</p>
            
            <div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="after_10th">
                    <span data-i18n="level_10th">Class 10th</span>
                </div>
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="puc_science_pcmb">
                    <span data-i18n="level_science_pcmb">PUC Science (PCMB)</span>
                </div>
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="puc_science_pcmc">
                    <span data-i18n="level_science_pcmc">PUC Science (PCMC)</span>
                </div>
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="puc_commerce">
                    <span data-i18n="level_commerce">PUC (Commerce)</span>
                </div>
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="puc_arts">
                    <span data-i18n="level_arts">PUC (Arts)</span>
                </div>
                <!-- Added Diploma & ITI -->
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="diploma_polytechnic">
                    <span data-i18n="level_diploma">Polytechnic / Diploma</span>
                </div>
                <div class="option-card" onclick="window.handleLevelOptionClick(this)" data-level="iti">
                    <span data-i18n="level_iti">ITI (Industrial Training)</span>
                </div>
            </div>
            
            <div style="margin-top: 2rem; display: flex; justify-content: space-between;">
                <button id="btn-back" class="btn btn-secondary" onclick="renderScreen('welcome')">
                    <span data-i18n="btn_back">Back</span>
                </button>
                <button id="btn-next-level" class="btn btn-primary" onclick="window.handleNextLevelClick(this)" disabled>
                    <span data-i18n="btn_continue">Continue</span>
                </button>
            </div>
        </div>
    `;
}

// Temporary Global handler for Level Selection Options since typical event listener binding is skipping execution correctly for this target layout currently.
window.handleLevelOptionClick = (element) => {
    const options = document.querySelectorAll('.option-card');
    options.forEach(o => o.classList.remove('selected'));
    element.classList.add('selected');
    AppState.selectedLevel = element.dataset.level;
    const nextBtn = document.getElementById('btn-next-level');
    if (nextBtn) nextBtn.disabled = false;
};

window.handleNextLevelClick = (element) => {
    if (!AppState.selectedLevel) return;
    renderScreen('interest_select');
};


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
    const userName = AppState.userName ? AppState.userName.split(' ')[0] : (AppState.user && AppState.user.name ? AppState.user.name.split(' ')[0] : 'Student');

    return `
        <div id="results-container" style="max-width: 1000px; margin: 0 auto; padding: 1rem;">
            <!-- New Header Section -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <h3 style="font-size: 1.25rem; font-weight: 500; color: var(--text-main); margin: 0;">Hello, ${userName} 👋</h3>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <button onclick="window.handleSaveResults()" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        <span data-i18n="save_my_recommendations">Save My Recommendations</span>
                    </button>
                    <button onclick="window.handleShareResults()" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        <span data-i18n="share">Share</span>
                    </button>
                    <button onclick="window.editAllAnswers()" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">
                        <span data-i18n="btn_edit_answers">Edit Answers</span>
                    </button>
                </div>
            </div>

            <div class="glass-card" style="margin-bottom: 2rem; border-top: 4px solid var(--primary-color);">
                <h2 class="screen-title" data-i18n="results_title" style="margin-bottom: 0.5rem;">Your Personalized Recommendations</h2>
                <p class="screen-sub" data-i18n="results_sub" style="margin-bottom: 0;">Based on your answers, these options suit you best.</p>
            </div>

            <div id="answers-review-list" style="margin-bottom: 2rem;">
                <!-- Answers injected via engine.js -->
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

window.handleSaveResults = function () {
    if (!AppState.topCourses || AppState.topCourses.length === 0) return;

    const saveData = {
        date: new Date().toISOString(),
        answers: AppState.answers,
        level: AppState.selectedLevel,
        interest: AppState.selectedInterest,
        topCourses: AppState.topCourses,
        topExams: AppState.topExams
    };
    localStorage.setItem('saved_recommendation', JSON.stringify(saveData));

    if (typeof NotificationManager !== 'undefined') {
        NotificationManager.show('Recommendations saved successfully!', 'success');
    } else {
        alert('Recommendations saved successfully!');
    }
};

window.handleShareResults = function () {
    if (!AppState.topCourses || AppState.topCourses.length === 0) return;

    const lang = AppState.language || 'en';
    const userName = AppState.userName ? AppState.userName.split(' ')[0] : 'Student';
    const dateStr = new Date().toLocaleDateString();

    let text = `🎯 Career Recommendations for ${userName} (${dateStr})\n\n`;
    text += `Based on your profile, here are your top matches:\n\n`;

    if (AppState.topCourses && AppState.topCourses.length > 0) {
        text += `📚 COURSES:\n`;
        AppState.topCourses.forEach(c => {
            text += `- ${c.title[lang]} (${c.confidenceScore}% Match)\n`;
        });
        text += `\n`;
    }

    if (AppState.topExams && AppState.topExams.length > 0) {
        text += `🏛️ GOVT EXAMS:\n`;
        AppState.topExams.forEach(e => {
            text += `- ${e.title[lang]} (${e.confidenceScore}% Match)\n`;
        });
        text += `\n`;
    }

    text += `Disclaimer: These are guidance-only recommendations based on your inputs.`;

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            if (typeof NotificationManager !== 'undefined') {
                NotificationManager.show('Share text copied to clipboard!', 'success');
            } else {
                alert('Share text copied to clipboard!');
            }
        }).catch(err => {
            console.error('Failed to copy', err);
            alert('Failed to copy to clipboard. Try again later.\n\n' + text);
        });
    } else {
        alert(text);
    }
};

// ---------------------------------------------------------
// Admin Panel Screen
// ---------------------------------------------------------

function renderAdminScreen() {
    if (AppState.userRole !== 'admin' && AppState.userRole !== 'super_admin') {
        return `
            <div class="onboarding-container" style="max-width: 800px; text-align: center;">
                <h2 style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">Access Denied</h2>
                <p style="color: var(--text-muted); margin-top: 1rem;">You do not have permission to access the Administrator Panel.</p>
                <button class="btn btn-primary" onclick="window.renderScreen('welcome')" style="margin-top: 2rem;">Return to Dashboard</button>
            </div>
        `;
    }

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
    if (screenName === 'signup' || screenName === 'login') {
        const isSignup = screenName === 'signup';
        const prefix = isSignup ? 'signup' : 'login';

        const tabs = document.querySelectorAll('.segment-btn');
        const sendBtn = document.getElementById(`btn-${prefix}`);
        const input = document.getElementById(`${prefix}-input`);
        const errorText = document.getElementById(`${prefix}-error`);
        const switchBtn = document.getElementById(`btn-switch-to-${isSignup ? 'login' : 'signup'}`);

        const nameInput = isSignup ? document.getElementById('signup-name-input') : null;
        const genderBtns = isSignup ? document.querySelectorAll('.gender-pill') : [];

        // Translate placeholders dynamically
        if (input) {
            const placeholderKey = input.getAttribute('data-i18n-placeholder');
            if (placeholderKey && Translations[AppState.language] && Translations[AppState.language][placeholderKey]) {
                input.placeholder = Translations[AppState.language][placeholderKey];
            }
        }

        if (nameInput) {
            const namePlaceholderKey = nameInput.getAttribute('data-i18n-placeholder');
            if (namePlaceholderKey && Translations[AppState.language] && Translations[AppState.language][namePlaceholderKey]) {
                nameInput.placeholder = Translations[AppState.language][namePlaceholderKey];
            }
        }

        if (!AppState.touched) {
            AppState.touched = { name: false, gender: false, contact: false };
        }

        const checkFormValidity = () => {
            let isValid = true;

            // Inline error targets
            const nameErr = document.getElementById('signup-name-error');
            const genderErr = document.getElementById('signup-gender-error');
            const emailErr = document.getElementById(isSignup ? 'signup-error' : 'login-error');

            // Success targets
            let nameSuccessIcon, nameSuccess, genderSuccess, contactSuccessIcon, contactSuccess;
            if (isSignup) {
                nameSuccessIcon = document.getElementById('signup-name-success-icon');
                nameSuccess = document.getElementById('signup-name-success');
                genderSuccess = document.getElementById('signup-gender-success');
                contactSuccessIcon = document.getElementById('signup-contact-success-icon');
                contactSuccess = document.getElementById('signup-success');
            }

            if (isSignup) {
                // Name Check
                let nameValid = false;
                if (nameInput) {
                    nameValid = AppState.userName && AppState.userName.trim().length > 0;
                    if (nameValid) {
                        nameInput.classList.add('valid-input');
                        if (nameErr) { nameErr.style.display = 'none'; nameErr.style.visibility = 'hidden'; }
                        if (nameSuccess) nameSuccess.classList.add('show');
                        if (nameSuccessIcon) nameSuccessIcon.style.display = 'flex';
                    } else if (AppState.touched.name) {
                        nameInput.classList.remove('valid-input');
                        nameInput.style.borderColor = 'var(--border-color)'; // Keep neutral
                        if (nameErr) { nameErr.style.display = 'block'; nameErr.style.visibility = 'visible'; }
                        if (nameSuccess) nameSuccess.classList.remove('show');
                        if (nameSuccessIcon) nameSuccessIcon.style.display = 'none';
                    } else {
                        // Keep neutral if not touched
                        nameInput.classList.remove('valid-input');
                        nameInput.style.borderColor = 'var(--border-color)';
                        if (nameErr) { nameErr.style.display = 'block'; nameErr.style.visibility = 'hidden'; }
                        if (nameSuccess) nameSuccess.classList.remove('show');
                        if (nameSuccessIcon) nameSuccessIcon.style.display = 'none';
                    }
                    if (!nameValid) isValid = false;
                }

                // Gender Check
                if (genderBtns.length > 0) {
                    let genderValid = !!AppState.userGender;
                    if (genderValid) {
                        if (genderErr) { genderErr.style.display = 'none'; genderErr.style.visibility = 'hidden'; }
                        if (genderSuccess) genderSuccess.classList.add('show');
                    } else if (AppState.touched.gender) {
                        if (genderErr) { genderErr.style.display = 'block'; genderErr.style.visibility = 'visible'; }
                        if (genderSuccess) genderSuccess.classList.remove('show');
                    } else {
                        if (genderErr) { genderErr.style.display = 'block'; genderErr.style.visibility = 'hidden'; }
                        if (genderSuccess) genderSuccess.classList.remove('show');
                    }
                    if (!genderValid) isValid = false;
                }
            }

            // Email/Mobile Check
            if (input) {
                const val = (input.value || '').trim();
                let fieldValid = false;

                if (AppState.authMethod === 'mobile') {
                    fieldValid = /^\d{10}$/.test(val);
                } else {
                    fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                }

                if (!fieldValid) isValid = false;

                if (fieldValid) {
                    input.classList.remove('error-input');
                    input.classList.add('valid-input');
                    if (isSignup) {
                        if (emailErr) { emailErr.style.display = 'none'; emailErr.style.visibility = 'hidden'; }
                        if (contactSuccess) contactSuccess.classList.add('show');
                        if (contactSuccessIcon) contactSuccessIcon.style.display = 'flex';
                    } else {
                        input.style.borderColor = 'var(--border-color)';
                        if (emailErr) emailErr.style.display = 'none';
                    }
                } else {
                    input.classList.remove('valid-input');
                    if (isSignup) {
                        if (contactSuccess) contactSuccess.classList.remove('show');
                        if (contactSuccessIcon) contactSuccessIcon.style.display = 'none';

                        if (AppState.touched.contact) {
                            input.classList.remove('error-input');
                            input.style.borderColor = 'var(--border-color)'; // Keep neutral
                            if (emailErr) { emailErr.style.display = 'block'; emailErr.style.visibility = 'visible'; }
                        } else {
                            input.classList.remove('error-input');
                            input.style.borderColor = 'var(--border-color)';
                            if (emailErr) { emailErr.style.display = 'block'; emailErr.style.visibility = 'hidden'; }
                        }
                    } else {
                        // Original Login logic
                        if (val.length > 0) {
                            input.classList.add('error-input');
                            input.style.borderColor = '#ef4444';
                            if (emailErr) emailErr.style.display = 'block';
                        } else {
                            input.classList.remove('error-input');
                            input.style.borderColor = 'var(--border-color)';
                            if (emailErr) emailErr.style.display = 'none';
                        }
                    }
                }
            }

            if (sendBtn) {
                if (isValid) {
                    sendBtn.removeAttribute('disabled');
                    sendBtn.style.opacity = '1';
                    sendBtn.style.cursor = 'pointer';
                    if (isSignup) {
                        sendBtn.style.pointerEvents = 'auto';
                        sendBtn.classList.add('btn-ready');
                    }
                } else {
                    sendBtn.setAttribute('disabled', 'true');
                    sendBtn.style.opacity = '0.5';
                    sendBtn.style.cursor = 'not-allowed';
                    if (isSignup) {
                        sendBtn.style.pointerEvents = 'none';
                        sendBtn.classList.remove('btn-ready');
                    }
                }
            }
        };

        if (input) {
            input.addEventListener('input', (e) => {
                AppState.authValue = e.target.value;
                checkFormValidity();
            });
            input.addEventListener('blur', () => {
                if (isSignup) AppState.touched.contact = true;
                checkFormValidity();
            });
        }

        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                AppState.userName = e.target.value;
                checkFormValidity();
            });
            nameInput.addEventListener('blur', () => {
                if (isSignup) AppState.touched.name = true;
                checkFormValidity();
            });

            // Focus Name on Load (Signup only)
            if (isSignup) {
                setTimeout(() => {
                    nameInput.focus();
                }, 100);
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (nameInput) AppState.userName = nameInput.value;
                AppState.authMethod = e.target.dataset.method;
                AppState.authValue = input ? input.value : '';
                AppState.authError = false;
                renderScreen(screenName);

                // Auto-focus the contact input when switching methods (mostly for signup)
                setTimeout(() => {
                    const newInput = document.getElementById(`${prefix}-input`);
                    if (newInput) newInput.focus();
                }, 50);
            });
        });

        if (isSignup && genderBtns.length > 0) {
            genderBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pill = e.target.closest('.gender-pill');
                    if (!pill) return;

                    const selectedGender = pill.dataset.gender;
                    AppState.userGender = selectedGender;

                    // Unstyle all
                    genderBtns.forEach(b => b.classList.remove('active'));

                    // Style selected
                    pill.classList.add('active');

                    AppState.touched.gender = true;
                    checkFormValidity();

                    // Shift focus to the toggle block instead of the input immediately 
                    // so the user knows they have a choice
                    const toggleContainer = document.getElementById('signup-method-toggle-container');
                    if (toggleContainer) {
                        const activeTab = toggleContainer.querySelector('.segment-btn.active');
                        if (activeTab) {
                            // Make it focusable to guide keyboard users
                            activeTab.setAttribute('tabindex', '0');
                            activeTab.focus();
                        }
                    }
                });
            });
        }

        const btnWrapper = document.getElementById('signup-btn-wrapper');
        if (btnWrapper && isSignup) {
            btnWrapper.addEventListener('click', () => {
                if (sendBtn && sendBtn.hasAttribute('disabled')) {
                    AppState.touched.name = true;
                    AppState.touched.gender = true;
                    AppState.touched.contact = true;
                    checkFormValidity();
                }
            });
        }

        if (switchBtn) {
            switchBtn.addEventListener('click', (e) => {
                const target = switchBtn.getAttribute('data-target');
                AppState.authType = target;
                AppState.authError = false;

                // Clear state so fields are not auto-copied between screens
                AppState.authValue = '';
                AppState.userName = '';
                AppState.userGender = null;
                AppState.touched = { name: false, gender: false, contact: false };

                if (target === 'signup') {
                    window.location.hash = '#/create-account';
                } else if (target === 'login') {
                    window.location.hash = '#/login';
                }
            });
        }

        // Initialize Firebase Recaptcha on load of this screen
        if (typeof setupRecaptcha === 'function') {
            setupRecaptcha();
        }

        // Initial validity check
        checkFormValidity();

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                // Because button is disabled until valid, we can safely proceed.
                if (input) AppState.authValue = input.value.trim();
                if (nameInput) AppState.userName = nameInput.value.trim();

                if (AppState.authMethod === 'mobile') {
                    console.log("Mocking OTP for mobile.");
                }
                renderScreen('otp');
            });
        }
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

                // Assign matching Role mapped to login value
                let role = 'student';
                const lowerAuth = typeof AppState.authValue === 'string' ? AppState.authValue.toLowerCase() : '';
                if (lowerAuth.includes('superadmin') || lowerAuth === 'super@example.com') {
                    role = 'super_admin';
                } else if (lowerAuth.includes('admin') || lowerAuth === 'admin@example.com') {
                    role = 'admin';
                } else if (lowerAuth.includes('editor')) {
                    role = 'editor';
                }
                AppState.userRole = role;

                // Sync Visibility and Timers based on role
                const adminMenuBtn = document.getElementById('menu-admin-panel');
                if (role === 'admin' || role === 'super_admin') {
                    if (adminMenuBtn) adminMenuBtn.style.display = 'block';
                    startAdminInactivityTimer();
                } else {
                    if (adminMenuBtn) adminMenuBtn.style.display = 'none';
                }

                if (AppState.authType === 'signup') {
                    // Show success state for OTP
                    errorText.style.color = '#10b981';
                    errorText.innerHTML = '<span style="display: flex; align-items: center; justify-content: center; gap: 0.25rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Account created successfully</span>';
                    errorText.classList.add('show');

                    // Delay transition to welcome screen
                    setTimeout(() => {
                        // Re-load profile if it exists, otherwise save new one
                        if (!AppState.dateJoined) {
                            saveUserProfile();
                        }
                        renderScreen('welcome');
                    }, 1500);
                } else {
                    errorText.classList.remove('show');

                    // Re-load profile if it exists, otherwise save new one
                    if (!AppState.dateJoined) {
                        saveUserProfile();
                    }

                    // For sign in, skip the Welcome screen, go to level_select
                    renderScreen('welcome');
                }
            } else {
                errorText.style.color = '#ef4444';
                errorText.textContent = "Invalid OTP. Please try '1234'.";
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
                if (nextBtn) {
                    nextBtn.removeAttribute('disabled');
                    nextBtn.classList.add('btn-glow');
                }
            });
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                renderScreen('welcome');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (AppState.selectedLevel) {
                    // Go to Interest Select
                    renderScreen('interest_select');
                }
            });
        }
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
                if (startBtn) {
                    startBtn.removeAttribute('disabled');
                    startBtn.classList.add('btn-glow');
                }
            });
        });

        if (backBtn) {
            backBtn.addEventListener('click', () => {
                renderScreen('level_select');
            });
        }

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (AppState.selectedInterest) {
                    // Begin Quiz
                    AppState.answers = []; // Reset answers
                    renderScreen('quiz');
                    initQuiz(); // Located in engine.js
                }
            });
        }
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
                if (!confirm("Are you sure you want to save your exam changes? This modifies the global database!")) {
                    return;
                }
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

    if (screenName === 'edit_profile') {
        window.saveEditedProfile = function () {
            const nameInput = document.getElementById('edit-profile-name').value.trim();
            const contactInput = document.getElementById('edit-profile-contact').value.trim();
            const genderInput = document.getElementById('edit-profile-gender').value;
            const levelInput = document.getElementById('edit-profile-level').value;
            const interestInput = document.getElementById('edit-profile-interest').value;

            let isValid = true;

            // Validate Name
            if (!nameInput) {
                document.getElementById('edit-name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('edit-name-error').style.display = 'none';
            }

            // Validate Contact
            const isEmail = AppState.authMethod === 'email';
            let contactValid = false;
            if (isEmail) {
                contactValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInput);
            } else {
                contactValid = /^\d{10}$/.test(contactInput);
            }

            if (!contactValid) {
                document.getElementById('edit-contact-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('edit-contact-error').style.display = 'none';
            }

            if (isValid) {
                AppState.userName = nameInput;
                AppState.authValue = contactInput;
                AppState.userGender = genderInput || null;
                AppState.selectedLevel = levelInput || null;
                AppState.selectedInterest = interestInput || null;

                saveUserProfile();
                navigate('/profile');
            }
        };
    }
}

// Start app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', initApp);

// Global Auto-Logout Inactivity Handling
window.adminActivityListenersBound = false;
window.adminInactivityTimer = null;

window.resetAdminInactivityTimer = function () {
    if (window.adminInactivityTimer) clearTimeout(window.adminInactivityTimer);

    // 15 mins
    window.adminInactivityTimer = setTimeout(() => {
        if (AppState.isAuthenticated && (AppState.userRole === 'admin' || AppState.userRole === 'super_admin')) {
            alert('Your Admin Session has expired due to inactivity. You have been securely logged out.');
            const logoutBtn = document.getElementById('menu-logout');
            if (logoutBtn) logoutBtn.click();
        }
    }, 900000);
};

window.startAdminInactivityTimer = function () {
    window.resetAdminInactivityTimer();
    if (!window.adminActivityListenersBound) {
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, resetAdminInactivityTimer);
        });
        window.adminActivityListenersBound = true;
    }
};

// ---------------------------------------------------------
// SUPPORT AND SETTINGS SCREENS
// ---------------------------------------------------------

function buildSupportHeader(title) {
    return `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <h2 class="screen-title" style="margin: 0; font-size: 1.5rem;">${title}</h2>
            <button class="btn btn-secondary" onclick="navigate('/profile')" style="padding: 0.5rem 1rem; font-size: 0.875rem; white-space: nowrap;">Back</button>
        </div>
    `;
}

function renderHelpScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Help & FAQ')}
            <div class="profile-card-item" style="margin-bottom:1rem; height: auto;">
                <div class="profile-card-label">How do I retake the assessment?</div>
                <div class="profile-card-value" style="font-size: 1rem; font-weight: normal;">Go to the Profile Menu and select "Retake Assessment". This will guide you through the questions again.</div>
            </div>
            <div class="profile-card-item" style="margin-bottom:1rem; height: auto;">
                <div class="profile-card-label">Can I change my registered email or mobile?</div>
                <div class="profile-card-value" style="font-size: 1rem; font-weight: normal;">Yes, you can update your contact information from the "Edit Profile" screen.</div>
            </div>
            <div class="profile-card-item" style="margin-bottom:1rem; height: auto;">
                <div class="profile-card-label">How do I switch to dark mode?</div>
                <div class="profile-card-value" style="font-size: 1rem; font-weight: normal;">Click the moon/sun icon in the top right corner of the navigation bar to toggle between light and dark themes.</div>
            </div>
        </div>
    `;
}

function renderContactScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Contact Support')}
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Your Name</label>
                <input type="text" class="form-input" placeholder="Enter your name" value="${AppState.userName || ''}">
            </div>
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Email Address</label>
                <input type="email" class="form-input" placeholder="Enter your email" value="${AppState.authMethod === 'email' ? AppState.authValue : ''}">
            </div>
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Message</label>
                <textarea class="form-input" style="min-height: 120px; resize: vertical;" placeholder="How can we help you?"></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%;" onclick="alert('Message sent successfully!'); navigate('/profile');">Send Message</button>
        </div>
    `;
}

function renderReportIssueScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Report an Issue')}
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Issue Title</label>
                <input type="text" class="form-input" placeholder="Brief summary of the issue">
            </div>
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Description</label>
                <textarea class="form-input" style="min-height: 120px; resize: vertical;" placeholder="Please describe the issue in detail..."></textarea>
            </div>
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Screenshot (Optional)</label>
                <input type="file" class="form-input" accept="image/*" style="padding: 0.75rem; background: var(--card-bg);">
            </div>
            <button class="btn btn-primary" style="width:100%;" onclick="alert('Issue reported successfully!'); navigate('/profile');">Submit Bug Report</button>
        </div>
    `;
}

function renderFeedbackScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Send Feedback')}
            <p style="color: var(--text-muted); margin-bottom: 2rem;">We value your suggestions. Let us know how we can improve the app!</p>
            <div class="form-group">
                <label class="profile-card-label" style="display:block; margin-bottom:0.5rem;">Your Feedback</label>
                <textarea class="form-input" style="min-height: 150px; resize: vertical;" placeholder="Type your suggestions here..."></textarea>
            </div>
            <button class="btn btn-primary" style="width:100%;" onclick="alert('Thank you for your feedback!'); navigate('/profile');">Submit Feedback</button>
        </div>
    `;
}

function renderAboutScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('About App')}
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="font-size: 2.5rem; color: var(--primary-color); margin-bottom: 0.5rem;">GuidancePro</h1>
                <p style="color: var(--text-muted); font-size: 1.125rem;">Version 1.2.0-beta</p>
            </div>
            <div class="profile-grid">
                <div class="profile-card-item">
                    <div class="profile-card-label">Description</div>
                    <div class="profile-card-value" style="font-size: 1rem; font-weight: normal;">An intelligent platform designed to help students discover the best career paths and exams tailored to their skills.</div>
                </div>
                <div class="profile-card-item">
                    <div class="profile-card-label">Developer info</div>
                    <div class="profile-card-value" style="font-size: 1rem; font-weight: normal;">Guidance App Team</div>
                </div>
            </div>
        </div>
    `;
}

function renderPrivacyPolicyScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Privacy Policy')}
            <div style="color: var(--text-main); line-height: 1.6;">
                <h3 style="margin-bottom: 0.5rem;">1. Information We Collect</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">We collect information you provide directly to us, such as your name, contact info, and assessment answers to personalize your guidance.</p>
                <h3 style="margin-bottom: 0.5rem;">2. Use of Information</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">Your information is used to provide, maintain, and improve our services, including calculating personalized course recommendations.</p>
                <h3 style="margin-bottom: 0.5rem;">3. Data Security</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">We implement reasonable security practices to protect your information, but no method of transmission over the Internet is completely secure.</p>
            </div>
        </div>
    `;
}

function renderTermsScreen() {
    return `
        <div class="glass-card" style="max-width: 900px; margin: 2rem auto; padding: 2rem;">
            ${buildSupportHeader('Terms & Conditions')}
            <div style="color: var(--text-main); line-height: 1.6;">
                <h3 style="margin-bottom: 0.5rem;">1. Acceptance of Terms</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">By accessing or using GuidancePro, you agree to be bound by these Terms. If you do not agree to all the terms, you must not access the application.</p>
                <h3 style="margin-bottom: 0.5rem;">2. Advice Disclaimer</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">Our recommendations are generated based on algorithms and are intended as guidance, not professional guarantees. Always verify details independently.</p>
                <h3 style="margin-bottom: 0.5rem;">3. Modification of Services</h3>
                <p style="margin-bottom: 1rem; color: var(--text-muted);">We reserve the right to modify or discontinue, temporarily or permanently, the Service with or without notice.</p>
            </div>
        </div>
    `;
}
