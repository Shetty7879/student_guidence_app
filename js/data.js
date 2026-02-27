// data.js - Static Content Database

const AppData = {
    // Profiling Dimensions:
    // math_sci, commerce, arts, govt, private, physical, practical, theory

    // Question Bank
    questions: [
        {
            id: 'q1',
            text: {
                en: "Which type of subjects do you naturally enjoy studying the most?",
                hi: "आपको स्वाभाविक रूप से किस प्रकार के विषय पढ़ना सबसे ज्यादा पसंद है?",
                kn: "ನೀವು ಸ್ವಾಭಾವಿಕವಾಗಿ ಯಾವ ರೀತಿಯ ವಿಷಯಗಳನ್ನು ಅಧ್ಯಯನ ಮಾಡಲು ಹೆಚ್ಚು ಇಷ್ಟಪಡುತ್ತೀರಿ?"
            },
            options: [
                {
                    ans: { en: "PCMC (Physics, Chemistry, Maths, Computer Science)", hi: "PCMC (भौतिकी, रसायन विज्ञान, गणित, कंप्यूटर विज्ञान)", kn: "PCMC (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ)" },
                    weights: { math_sci: 3, practical: 1 }
                },
                {
                    ans: { en: "PCMB (Physics, Chemistry, Maths, Biology)", hi: "PCMB (भौतिकी, रसायन विज्ञान, गणित, जीव विज्ञान)", kn: "PCMB (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ, ಜೀವಶಾಸ್ತ್ರ)" },
                    weights: { math_sci: 3, theory: 1 }
                },
                {
                    ans: { en: "Accounts, Economics, Business Studies", hi: "लेखा, अर्थशास्त्र, व्यवसाय अध्ययन", kn: "ಅಕೌಂಟ್ಸ್, ಅರ್ಥಶಾಸ್ತ್ರ, ವ್ಯವಹಾರ ಅಧ್ಯಯನ" },
                    weights: { commerce: 3, theory: 1 }
                },
                {
                    ans: { en: "History, Politics, Languages, Literature", hi: "इतिहास, राजनीति, भाषा, साहित्य", kn: "ಇತಿಹಾಸ, ರಾಜಕೀಯ, ಭಾಷೆ, ಸಾಹಿತ್ಯ" },
                    weights: { arts: 3, theory: 2 }
                },
                {
                    ans: { en: "I prefer hands-on, practical work over reading books.", hi: "मुझे किताबें पढ़ने के बजाय हाथों-हाथ, व्यावहारिक काम करना पसंद है।", kn: "ನಾನು ಪುಸ್ತಕಗಳನ್ನು ಓದುವುದಕ್ಕಿಂತ ಪ್ರಾಯೋಗಿಕ ಕೆಲಸವನ್ನು ಇಷ್ಟಪಡುತ್ತೇನೆ." },
                    weights: { practical: 3 }
                }
            ]
        },
        {
            id: 'q2',
            text: {
                en: "How do you feel about your physical fitness and discipline?",
                hi: "आप अपनी शारीरिक फिटनेस और अनुशासन के बारे में कैसा महसूस करते हैं?",
                kn: "ನಿಮ್ಮ ದೈಹಿಕ ಫಿಟ್ನೆಸ್ ಮತ್ತು ಶಿಸ್ತಿನ ಬಗ್ಗೆ ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತದೆ?"
            },
            options: [
                {
                    ans: { en: "I am highly active, fit, and love strict discipline.", hi: "मैं अत्यधिक सक्रिय, फिट हूं और सख्त अनुशासन पसंद करता हूं।", kn: "ನಾನು ಹೆಚ್ಚು ಸಕ್ರಿಯ, ಫಿಟ್ ಆಗಿದ್ದೇನೆ ಮತ್ತು ಕಟ್ಟುನಿಟ್ಟಾದ ಶಿಸ್ತನ್ನು ಇಷ್ಟಪಡುತ್ತೇನೆ." },
                    weights: { physical: 3 }
                },
                {
                    ans: { en: "Average fitness, I play sports occasionally.", hi: "औसत फिटनेस, मैं कभी-कभी खेल खेलता हूं।", kn: "ಸರಾಸರಿ ಫಿಟ್ನೆಸ್, ನಾನು মাঝে মাঝে ಕ್ರೀಡೆಗಳನ್ನು ಆಡುತ್ತೇನೆ." },
                    weights: { physical: 1 }
                },
                {
                    ans: { en: "I prefer sitting, reading, or mental tasks.", hi: "मुझे बैठना, पढ़ना या मानसिक कार्य करना पसंद है।", kn: "ನಾನು ಕುಳಿತುಕೊಳ್ಳಲು, ಓದಲು ಅಥವಾ ಮಾನಸಿಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ." },
                    weights: { theory: 2, physical: -1 }
                }
            ]
        },
        {
            id: 'q3',
            text: {
                en: "What is your primary career goal in terms of job security vs. growth?",
                hi: "नौकरी की सुरक्षा बनाम विकास के संदर्भ में आपका प्राथमिक करियर लक्ष्य क्या है?",
                kn: "ಉದ್ಯೋಗ ಭದ್ರತೆ ವಿರುದ್ಧ ಬೆಳವಣಿಗೆಯ ವಿಷಯದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ವೃತ್ತಿ ಗುರಿ ಏನು?"
            },
            options: [
                {
                    ans: { en: "High job security, respect, stable pension (Govt Job)", hi: "उच्च नौकरी सुरक्षा, सम्मान, स्थिर पेंशन (सरकारी नौकरी)", kn: "ಹೆಚ್ಚಿನ ಉದ್ಯೋಗ ಭದ್ರತೆ, ಗೌರವ, ಸ್ಥಿರ ಪಿಂಚಣಿ (ಸರ್ಕಾರಿ ಉದ್ಯೋಗ)" },
                    weights: { govt: 2, theory: 1 }
                },
                {
                    ans: { en: "Fast growth, competitive salary, private sector", hi: "तेजी से विकास, प्रतिस्पर्धी वेतन, निजी क्षेत्र", kn: "ವೇಗದ ಬೆಳವಣಿಗೆ, ಸ್ಪರ್ಧಾತ್ಮಕ ವೇತನ, ಖಾಸಗಿ ವಲಯ" },
                    weights: { private: 3 }
                },
                {
                    ans: { en: "I want to start working and earning as early as possible", hi: "मैं जल्द से जल्द काम करना और कमाना शुरू करना चाहता हूं", kn: "ನಾನು ಸಾಧ್ಯವಾದಷ್ಟು ಬೇಗ ಕೆಲಸ ಮಾಡಲು ಮತ್ತು ಸಂಪಾದಿಸಲು ಪ್ರಾರಂಭಿಸಲು ಬಯಸುತ್ತೇನೆ" },
                    weights: { practical: 2, govt: 1 } // E.g., Constable/ITI
                }
            ]
        },
        {
            id: 'q4',
            text: {
                en: "Are you willing to spend 1-2 years intensely preparing for competitive exams?",
                hi: "क्या आप प्रतियोगी परीक्षाओं की तैयारी के लिए 1-2 साल बिताने के इच्छुक हैं?",
                kn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ತಯಾರಿ ನಡೆಸಲು ನೀವು 1-2 ವರ್ಷ ಕಳೆಯಲು ಸಿದ್ಧರಿದ್ದೀರಾ?"
            },
            options: [
                {
                    ans: { en: "Yes, fully committed to tough preparations.", hi: "हां, कठिन तैयारी के लिए पूरी तरह प्रतिबद्ध हूं।", kn: "ಹೌದು, ಕಠಿಣ ಸಿದ್ಧತೆಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಬದ್ಧರಾಗಿದ್ದೇವೆ." },
                    weights: { govt: 2, math_sci: 1, theory: 1 }
                },
                {
                    ans: { en: "Maybe, if the job guarantees security.", hi: "शायद, अगर नौकरी सुरक्षा की गारंटी देती है।", kn: "ಬಹುಶಃ, ಉದ್ಯೋಗವು ಭದ್ರತೆಯನ್ನು ಖಾತರಿಪಡಿಸಿದರೆ." },
                    weights: { govt: 1 }
                },
                {
                    ans: { en: "No, I prefer direct campus placements or degree-based jobs.", hi: "नहीं, मुझे प्रत्यक्ष कैंपस प्लेसमेंट या डिग्री-आधारित नौकरियां पसंद हैं।", kn: "ಇಲ್ಲ, ನಾನು ನೇರ ಕ್ಯಾಂಪಸ್ ನಿಯೋಜನೆಗಳು ಅಥವಾ ಪದವಿ-ಆಧಾರಿತ ಉದ್ಯೋಗಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ." },
                    weights: { private: 2, govt: -2 }
                }
            ]
        },
        {
            id: 'q5',
            text: {
                en: "How do you prefer to learn new things?",
                hi: "आप नई चीजें कैसे सीखना पसंद करते हैं?",
                kn: "ನೀವು ಹೊಸ ವಿಷಯಗಳನ್ನು ಹೇಗೆ ಕಲಿಯಲು ಇಷ್ಟಪಡುತ್ತೀರಿ?"
            },
            options: [
                {
                    ans: { en: "Reading extensively, writing notes, memorizing", hi: "व्यापक रूप से पढ़ना, नोट्स लिखना, याद रखना", kn: "ವ್ಯಾಪಕವಾಗಿ ಓದುವುದು, ಟಿಪ್ಪಣಿಗಳನ್ನು ಬರೆಯುವುದು, ಕಂಠಪಾಠ ಮಾಡುವುದು" },
                    weights: { theory: 2 }
                },
                {
                    ans: { en: "Building things, fixing machines, using computers practically", hi: "चीजें बनाना, मशीनें ठीक करना, कंप्यूटर का व्यावहारिक उपयोग करना", kn: "ವಸ್ತುಗಳನ್ನು ನಿರ್ಮಿಸುವುದು, ಯಂತ್ರಗಳನ್ನು ಸರಿಪಡಿಸುವುದು, ಕಂಪ್ಯೂಟರ್‌ಗಳನ್ನು ಪ್ರಾಯೋಗಿಕವಾಗಿ ಬಳಸುವುದು" },
                    weights: { practical: 3, math_sci: 1 }
                },
                {
                    ans: { en: "Managing people, organizing events, calculating finances", hi: "लोगों का प्रबंधन करना, आयोजनों का आयोजन करना, वित्त की गणना करना", kn: "ಜನರನ್ನು ನಿರ್ವಹಿಸುವುದು, ಈವೆಂಟ್‌ಗಳನ್ನು ಆಯೋಜಿಸುವುದು, ಹಣಕಾಸು ಲೆಕ್ಕಹಾಕುವುದು" },
                    weights: { commerce: 2, practical: 1 }
                }
            ]
        }
    ],

    // Database of Courses
    courses: [
        {
            id: "c_puc_pcmc",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Science (PCMC)", hi: "पीयूसी विज्ञान (PCMC)", kn: "ಪಿಯುಸಿ ವಿಜ್ಞಾನ (PCMC)" },
            description: { en: "Pre-University Course focusing on Physics, Chemistry, Maths, and Computer Science.", hi: "भौतिकी, रसायन विज्ञान, गणित और कंप्यूटर विज्ञान पर केंद्रित प्री-यूनिवर्सिटी कोर्स।", kn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನವನ್ನು ಕೇಂದ್ರೀಕರಿಸುವ ಪಿಯುಸಿ." },
            weights: { math_sci: 3, practical: 2, theory: 1, private: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "Engineering, BCA, Architecture, Defense" },
                salary: { en: "N/A - Stepping stone for degree" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Enroll in PUC Science (PCMC)" } },
                { step: { en: "3. Prepare for CET/JEE/NDA during PUC" } },
                { step: { en: "4. Pursue B.Tech or B.Sc" } }
            ]
        },
        {
            id: "c_puc_pcmb",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Science (PCMB)", hi: "पीयूसी विज्ञान (PCMB)", kn: "ಪಿಯುಸಿ ವಿಜ್ಞಾನ (PCMB)" },
            description: { en: "Pre-University Course focusing on Physics, Chemistry, Maths, and Biology.", hi: "भौतिकी, रसायन विज्ञान, गणित और जीव विज्ञान पर केंद्रित प्री-यूनिवर्सिटी कोर्स।", kn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ ಮತ್ತು ಜೀವಶಾಸ್ತ್ರವನ್ನು ಕೇಂದ್ರೀಕರಿಸುವ ಪಿಯುಸಿ." },
            weights: { math_sci: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "Medical, Agriculture, Pure Sciences" },
                salary: { en: "N/A - Stepping stone for degree" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Enroll in PUC Science (PCMB)" } },
                { step: { en: "3. Prepare for NEET/CET during PUC" } },
                { step: { en: "4. Pursue MBBS, B.Sc Ag, or B.Sc" } }
            ]
        },
        {
            id: "c_puc_commerce",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Commerce", hi: "पीयूसी वाणिज्य", kn: "ಪಿಯುಸಿ ವಾಣಿಜ್ಯ" },
            description: { en: "Pre-University Course focusing on Business, Accounts, Economics.", hi: "व्यवसाय, लेखा, अर्थशास्त्र पर केंद्रित प्री-यूनिवर्सिटी कोर्स।", kn: "ವ್ಯವಹಾರ, ಅಕೌಂಟ್ಸ್, ಅರ್ಥಶಾಸ್ತ್ರವನ್ನು ಕೇಂದ್ರೀಕರಿಸುವ ಪಿಯುಸಿ." },
            weights: { commerce: 3, theory: 2, private: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "CA, CS, B.Com, BBA" },
                salary: { en: "N/A - Stepping stone for degree" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Enroll in PUC Commerce" } },
                { step: { en: "3. Prepare for CA Foundation" } },
                { step: { en: "4. Pursue B.Com/BBA" } }
            ]
        },
        {
            id: "c_diploma",
            type: "course",
            category: "after_10th",
            title: { en: "Polytechnic / Diploma in Engineering", hi: "पॉलिटेक्निक / इंजीनियरिंग में डिप्लोमा", kn: "ಪಾಲಿಟೆಕ್ನಿಕ್ / ಎಂಜಿನಿಯರಿಂಗ್ ಡಿಪ್ಲೋಮಾ" },
            description: { en: "3-year practical engineering course (Civil, Mech, Comp Sc).", hi: "3 वर्षीय व्यावहारिक इंजीनियरिंग पाठ्यक्रम।", kn: "3 ವರ್ಷದ ಪ್ರಾಯೋಗಿಕ ಎಂಜಿನಿಯರಿಂಗ್ ಕೋರ್ಸ್." },
            weights: { math_sci: 2, practical: 3, private: 1, govt: 1 },
            details: {
                eligibility: { en: "10th Pass (minimum 35%)" },
                duration: { en: "3 Years" },
                scope: { en: "Junior Engineer, Direct 2nd year B.Tech admission" },
                salary: { en: "₹2.0 - 4.0 Lakhs / year initially" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Board Exams" } },
                { step: { en: "2. Clear State Diploma Entrance/Merit" } },
                { step: { en: "3. Complete 3-year Diploma" } },
                { step: { en: "4. Join job as Junior Engineer OR pursue B.Tech (Lateral Entry)" } }
            ]
        },
        {
            id: "c_iti",
            type: "course",
            category: "after_10th",
            title: { en: "ITI (Industrial Training Institute)", hi: "आईटीआई (औद्योगिक प्रशिक्षण संस्थान)", kn: "ಐಟಿಐ (ಕೈಗಾರಿಕಾ ತರಬೇತಿ ಸಂಸ್ಥೆ)" },
            description: { en: "Vocational training in trades like Electrician, Fitter, Welder.", hi: "इलेक्ट्रीशियन, फिटर जैसे ट्रेडों में व्यावसायिक प्रशिक्षण।", kn: "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್, ಫಿಟ್ಟರ್ ಮುಂತಾದ ವೃತ್ತಿಗಳಲ್ಲಿ ತರಬೇತಿ." },
            weights: { practical: 3, govt: 1, math_sci: 1 },
            details: {
                eligibility: { en: "10th Pass (8th pass for some trades)" },
                duration: { en: "1 to 2 Years" },
                scope: { en: "Technician in Railways, Factory worker, Self-employed" },
                salary: { en: "₹1.5 - 2.5 Lakhs / year initially" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Board Exams" } },
                { step: { en: "2. Admission to Govt or Private ITI based on merit" } },
                { step: { en: "3. Complete 1-2 years training" } },
                { step: { en: "4. Pass All India Trade Test (AITT) for NTC certificate" } },
                { step: { en: "5. Apprenticeship / Railways / Factory Jobs" } }
            ]
        },
        {
            id: "c_btech",
            type: "course",
            category: "puc_science",
            title: { en: "B.Tech / B.E (Engineering)", hi: "बी.टेक / बी.ई (इंजीनियरिंग)", kn: "ಬಿ.ಟೆಕ್ / ಬಿ.ಇ (ಎಂಜಿನಿಯರಿಂಗ್)" },
            description: { en: "Professional undergraduate engineering degree.", hi: "व्यावसायिक स्नातक इंजीनियरिंग डिग्री।", kn: "ವೃತ್ತಿಪರ ಪದವಿಪೂರ್ವ ಎಂಜಿನಿಯರಿಂಗ್ ಪದವಿ." },
            weights: { math_sci: 3, private: 2, theory: 1, practical: 1 },
            details: {
                eligibility: { en: "PUC Science (PCM) mandatory" },
                duration: { en: "4 Years" },
                scope: { en: "Software Developer, Core Engineer, Data Scientist" },
                salary: { en: "₹4.0 - 15.0+ Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC Science (PCM)" } },
                { step: { en: "2. Clear CET / JEE Mains / Advanced" } },
                { step: { en: "3. Complete 4-year degree" } },
                { step: { en: "4. Campus Placement / Higher Studies (GATE/MS)" } }
            ]
        },
        {
            id: "c_bcom",
            type: "course",
            category: "puc_commerce",
            title: { en: "B.Com / BBM + CA Foundation", hi: "बी.कॉम / बीबीएम + सीए फाउंडेशन", kn: "ಬಿ.ಕಾಂ / ಬಿಬಿಎಂ + ಸಿಎ ಫೌಂಡೇಶನ್" },
            description: { en: "Bachelor's in Commerce/Management with prep for Chartered Accountancy.", hi: "चार्टर्ड अकाउंटेंसी की तैयारी के साथ वाणिज्य/प्रबंधन में स्नातक।", kn: "ಲೆಕ್ಕಪರಿಶೋಧನೆ ತಯಾರಿಯೊಂದಿಗೆ ವಾಣಿಜ್ಯ/ನಿರ್ವಹಣೆಯಲ್ಲಿ ಸ್ನಾತಕೋತ್ತರ ಪದವಿ." },
            weights: { commerce: 3, theory: 2, private: 2 },
            details: {
                eligibility: { en: "PUC Commerce/Arts" },
                duration: { en: "3 Years for degree, +2-3 for CA" },
                scope: { en: "Accountant, Financial Analyst, Auditor" },
                salary: { en: "₹3.0 - 8.0 Lakhs / year (Higher for CA)" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC Commerce" } },
                { step: { en: "2. Enroll in B.Com/BBM" } },
                { step: { en: "3. Register & clear CA Foundation" } },
                { step: { en: "4. Complete Articleship & CA Final" } }
            ]
        },
        {
            id: "c_ba_bed",
            type: "course",
            category: "puc_arts",
            title: { en: "B.A + B.Ed (Integrated Teaching)", hi: "बी.ए + बी.एड (एकीकृत शिक्षण)", kn: "ಬಿ.ಎ + ಬಿ.ಎಡ್ (ಬೋಧನೆ)" },
            description: { en: "Combined degree for aspiring teachers in Arts subjects.", hi: "कला विषयों में महत्वाकांक्षी शिक्षकों के लिए संयुक्त डिग्री।", kn: "ಕಲಾ ವಿಷಯಗಳಲ್ಲಿ ಶಿಕ್ಷಕರಾಗಲು ಬಯಸುವವರಿಗೆ ಪದವಿ." },
            weights: { arts: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "PUC Arts/Commerce/Science" },
                duration: { en: "4 Years (Integrated)" },
                scope: { en: "Govt School Teacher, Private Tutor" },
                salary: { en: "₹2.5 - 5.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC" } },
                { step: { en: "2. Enroll in BA+B.Ed Integrated Course" } },
                { step: { en: "3. Clear TET (Teacher Eligibility Test)" } },
                { step: { en: "4. Apply for Govt teaching posts" } }
            ]
        },
        {
            id: "c_mbbs",
            type: "course",
            category: "puc_science",
            title: { en: "MBBS / Medical Sciences", hi: "एमबीबीएस / चिकित्सा विज्ञान", kn: "ಎಂಬಿಬಿಎಸ್ / ವೈದ್ಯಕೀಯ ವಿಜ್ಞಾನ" },
            description: { en: "Professional degree in medicine and surgery.", hi: "चिकित्सा और सर्जरी में व्यावसायिक डिग्री।", kn: "ವೈದ್ಯಕೀಯ ಮತ್ತು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಯಲ್ಲಿ ವೃತ್ತಿಪರ ಪದವಿ." },
            weights: { math_sci: 3, theory: 3, govt: 1, practical: 1 },
            details: {
                eligibility: { en: "PUC Science (PCMB/PCB) mandatory" },
                duration: { en: "5.5 Years" },
                scope: { en: "Doctor, Surgeon, Medical Officer" },
                salary: { en: "₹6.0 - 20.0+ Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC Science (PCMB)" } },
                { step: { en: "2. Clear NEET (National Eligibility cum Entrance Test)" } },
                { step: { en: "3. Complete 5.5-year degree including internship" } },
                { step: { en: "4. Practice as a Doctor or pursue MD/MS" } }
            ]
        },
        {
            id: "c_bsc_agri",
            type: "course",
            category: "puc_science",
            title: { en: "B.Sc Agriculture", hi: "बी.एससी कृषि", kn: "ಬಿ.ಎಸ್ಸಿ ಕೃಷಿ" },
            description: { en: "Degree focusing on agricultural science and practices.", hi: "कृषि विज्ञान और प्रथाओं पर केंद्रित डिग्री।", kn: "ಕೃಷಿ ವಿಜ್ಞಾನ ಮತ್ತು ಅಭ್ಯಾಸಗಳನ್ನು ಕೇಂದ್ರೀಕರಿಸುವ ಪದವಿ." },
            weights: { math_sci: 2, practical: 2, govt: 2 },
            details: {
                eligibility: { en: "PUC Science (PCMB/PCB)" },
                duration: { en: "4 Years" },
                scope: { en: "Agriculture Officer, Research Scientist" },
                salary: { en: "₹3.0 - 10.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC Science" } },
                { step: { en: "2. Clear State Agricultural Entrance Exam" } },
                { step: { en: "3. Complete 4-year degree" } },
                { step: { en: "4. Apply for Govt Agriculture Officer posts or Private Sectors" } }
            ]
        },
        {
            id: "c_bca",
            type: "course",
            category: "all",
            title: { en: "BCA (Bachelor of Computer Applications)", hi: "बीसीए (बैचलर ऑफ कंप्यूटर एप्लीकेशन)", kn: "ಬಿಸಿಎ (ಬ್ಯಾಚುಲರ್ ಆಫ್ ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಷನ್ಸ್)" },
            description: { en: "Undergraduate degree in computer applications and software development.", hi: "कंप्यूटर एप्लीकेशन और सॉफ्टवेयर डेवलपमेंट में स्नातक डिग्री।", kn: "ಕಂಪ್ಯೂಟರ್ ಅಪ್ಲಿಕೇಷನ್ಸ್ ಮತ್ತು ಸಾಫ್ಟ್‌ವೇರ್ ಅಭಿವೃದ್ಧಿಯಲ್ಲಿ ಪದವಿಪೂರ್ವ ಪದವಿ." },
            weights: { math_sci: 1, commerce: 1, practical: 2, private: 3 },
            details: {
                eligibility: { en: "PUC (Any Stream with Maths/CS preferred)" },
                duration: { en: "3 Years" },
                scope: { en: "Software Developer, System Administrator" },
                salary: { en: "₹3.0 - 8.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Pass PUC" } },
                { step: { en: "2. Enroll in BCA" } },
                { step: { en: "3. Learn coding languages (Java, Python, Web Dev)" } },
                { step: { en: "4. IT Placements / MCA" } }
            ]
        }
    ],

    // Database of Government Exams
    exams: [
        {
            id: "e_agniveer",
            type: "exam",
            category: "after_10th", // Applies to 10th and PUC, logic engine will handle
            allow_all: true,
            title: { en: "Indian Army (Agniveer GD)", hi: "भारतीय सेना (अग्निवीर जीडी)", kn: "ಭಾರತೀಯ ಸೇನೆ (ಅಗ್ನಿವೀರ್ ಜಿಡಿ)" },
            description: { en: "General Duty soldier recruitment scheme for the Indian Armed Forces.", hi: "भारतीय सशस्त्र बलों के लिए जनरल ड्यूटी सैनिक भर्ती योजना।", kn: "ಭಾರತೀಯ ಸಶಸ್ತ್ರ ಪಡೆಗಳಿಗೆ ಜನರಲ್ ಡ್ಯೂಟಿ ಸೈನಿಕ ನೇಮಕಾತಿ ಯೋಜನೆ." },
            weights: { physical: 3, govt: 3, practical: 1 },
            details: {
                eligibility: { en: "10th Pass (min 45% aggregate)" },
                age_limit: { en: "17.5 to 21 Years" },
                difficulty: { en: "Moderate (High Physical standards)" },
                prep_time: { en: "6 - 12 Months" },
                salary: { en: "₹30,000/month initial + allowances + Seva Nidhi" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Physical prep: Running, Pushups, Pullups" } },
                { step: { en: "3. Clear Online CEE (Common Entrance Exam)" } },
                { step: { en: "4. Pass Physical Fitness & Medical Test" } },
                { step: { en: "5. Join as Agniveer" } }
            ]
        },
        {
            id: "e_police",
            type: "exam",
            category: "after_10th",
            allow_all: true,
            title: { en: "State Police Constable", hi: "राज्य पुलिस कांस्टेबल", kn: "ರಾಜ್ಯ ಪೊಲೀಸ್ ಕಾನ್ಸ್ಟೇಬಲ್" },
            description: { en: "Recruitment for Constable rank in state police departments.", hi: "राज्य पुलिस विभागों में कांस्टेबल पद के लिए भर्ती।", kn: "ರಾಜ್ಯ ಪೊಲೀಸ್ ಇಲಾಖೆಗಳಲ್ಲಿ ಕಾನ್ಸ್ಟೇಬಲ್ ಹುದ್ದೆಗೆ ನೇಮಕಾತಿ." },
            weights: { physical: 2, govt: 3, arts: 1 },
            details: {
                eligibility: { en: "10th/12th Pass depending on state" },
                age_limit: { en: "18 to 25 Years (varies)" },
                difficulty: { en: "Moderate" },
                prep_time: { en: "6 - 10 Months" },
                salary: { en: "₹21,700 - 69,100 / month (Level 3)" }
            },
            roadmap: [
                { step: { en: "1. Meet Physical Measurement standards" } },
                { step: { en: "2. Clear Written Exam (GK, Reasoning, Math)" } },
                { step: { en: "3. Pass Physical Endurance Test (Race)" } },
                { step: { en: "4. Medical Exam & Document Verification" } }
            ]
        },
        {
            id: "e_nda",
            type: "exam",
            category: "puc_science",
            title: { en: "NDA (National Defence Academy)", hi: "एनडीए (राष्ट्रीय रक्षा अकादमी)", kn: "ಎನ್‌ಡಿಎ (ರಾಷ್ಟ್ರೀಯ ರಕ್ಷಣಾ ಅಕಾಡೆಮಿ)" },
            description: { en: "Officer level entry to Army, Navy, and Air Force.", hi: "सेना, नौसेना और वायु सेना में अधिकारी स्तर पर प्रवेश।", kn: "ಸೇನೆ, ನೌಕಾಪಡೆ ಮತ್ತು ವಾಯುಪಡೆಗೆ ಅಧಿಕಾರಿ ಮಟ್ಟದ ಪ್ರವೇಶ." },
            weights: { math_sci: 2, physical: 2, govt: 3 },
            details: {
                eligibility: { en: "12th Pass (PCM required for AirForce/Navy)" },
                age_limit: { en: "16.5 to 19.5 Years" },
                difficulty: { en: "High" },
                prep_time: { en: "1 - 2 Years" },
                salary: { en: "Stipend during training, approx ₹56,100 starting post-training" }
            },
            roadmap: [
                { step: { en: "1. Pass 12th Board Exams (PCM)" } },
                { step: { en: "2. Clear NDA Written Exam (UPSC)" } },
                { step: { en: "3. Clear 5-Day SSB Interview (Psychological, Group tasks)" } },
                { step: { en: "4. Pass Medicals & Merit List" } }
            ]
        },
        {
            id: "e_ssc_chsl",
            type: "exam",
            category: "puc_commerce",
            allow_all: true,
            title: { en: "SSC CHSL (Clerk/Data Entry)", hi: "कर्मचारी चयन आयोग - सीएचएसएल", kn: "SSC CHSL (ಕ್ಲರ್ಕ್)" },
            description: { en: "Staff Selection Commission Combined Higher Secondary Level Exam for central govt ministries.", hi: "केंद्रीय सरकारी मंत्रालयों के लिए क्लर्क भर्ती।", kn: "ಕೇಂದ್ರ ಸರ್ಕಾರಿ ಸಚಿವಾಲಯಗಳಿಗೆ ಕ್ಲರ್ಕ್ ನೇಮಕಾತಿ." },
            weights: { theory: 2, govt: 3, commerce: 1, arts: 1 },
            details: {
                eligibility: { en: "12th Pass (Any Stream)" },
                age_limit: { en: "18 to 27 Years" },
                difficulty: { en: "Moderate - High Competition" },
                prep_time: { en: "8 - 12 Months" },
                salary: { en: "₹19,900 - 81,100 / month (Level 2/4)" }
            },
            roadmap: [
                { step: { en: "1. Pass 12th Class" } },
                { step: { en: "2. Clear Tier-1 (Computer Based Test)" } },
                { step: { en: "3. Clear Tier-2 (Objective + Typing Test)" } },
                { step: { en: "4. Document Verification & Posting" } }
            ]
        }
    ]
};
