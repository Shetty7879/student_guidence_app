// js/firebase-client.js - Firebase Initialization and Auth Logic

const firebaseConfig = {
    apiKey: "AIzaSyDfBlgBJfzxj7GC61wIVqkNHxU7zQaDLLA",
    authDomain: "student-guidance-app-f17e2.firebaseapp.com",
    projectId: "student-guidance-app-f17e2",
    storageBucket: "student-guidance-app-f17e2.firebasestorage.app",
    messagingSenderId: "577897839582",
    appId: "1:577897839582:web:0713593fdd10df4d267b4f"
};

// Initialize Firebase App globally
firebase.initializeApp(firebaseConfig);

// Setup Auth reference
const auth = firebase.auth();

// Set language based on AppState if needed, default to English
auth.languageCode = 'en';

// Global variables for OTP handling
window.recaptchaVerifier = null;
window.confirmationResult = null;

function setupRecaptcha() {
    // If it exists, clear it to prevent duplicate UI rendering
    if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
    }

    // Initialize invisible recaptcha attached to the 'btn-send-otp' button
    // It verifies silently in the background before sending the SMS
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-wrapper', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log("Recaptcha verified");
        },
        'expired-callback': () => {
            // Response expired. Ask user to solve reCAPTCHA again.
            console.error("Recaptcha expired");
        }
    });
}
