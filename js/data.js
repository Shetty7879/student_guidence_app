// data.js - Static Content Database

const AppData = {
    // Profiling Dimensions:
    // math_sci, commerce, arts, govt, private, physical, practical, theory

    // Question Bank (Dynamic by Stream & Interest)
    questionSets: {
        after_10th: {
            courses: [
                {
                    id: 'after_10th_c_q1',
                    text: {
                        en: "Which type of subjects do you naturally enjoy studying the most?",
                        hi: "आपको स्वाभाविक रूप से किस प्रकार के विषय पढ़ना सबसे ज्यादा पसंद है?",
                        kn: "ನೀವು ಸ್ವಾಭಾವಿಕವಾಗಿ ಯಾವ ರೀತಿಯ ವಿಷಯಗಳನ್ನು ಅಧ್ಯಯನ ಮಾಡಲು ಹೆಚ್ಚು ಇಷ್ಟಪಡುತ್ತೀರಿ?"
                    },
                    options: [
                        { ans: { en: "Maths & Science (Physics, Chemistry, Biology)", hi: "गणित और विज्ञान", kn: "ಗಣಿತ ಮತ್ತು ವಿಜ್ಞಾನ" }, weights: { math_sci: 3, theory: 1 } },
                        { ans: { en: "Social Studies, History, Languages", hi: "सामाजिक अध्ययन, इतिहास, भाषाएं", kn: "ಸಮಾಜ ಅಧ್ಯಯನ, ಇತಿಹಾಸ, ಭಾಷೆಗಳು" }, weights: { arts: 3, theory: 2 } },
                        { ans: { en: "Computers, Coding, Technology", hi: "कंप्यूटर, कोडिंग, प्रौद्योगिकी", kn: "ಕಂಪ್ಯೂಟರ್, ಕೋಡಿಂಗ್, ತಂತ್ರಜ್ಞಾನ" }, weights: { math_sci: 2, practical: 2 } },
                        { ans: { en: "Business basics, Economics, Accounts", hi: "व्यापार की मूल बातें", kn: "ವ್ಯವಹಾರದ ಮೂಲಗಳು" }, weights: { commerce: 3, theory: 1 } }
                    ]
                },
                {
                    id: 'after_10th_c_q2',
                    text: {
                        en: "How do you prefer to study and learn new things?",
                        hi: "आप नई चीजें कैसे पढ़ना और सीखना पसंद करते हैं?",
                        kn: "ನೀವು ಹೊಸ ವಿಷಯಗಳನ್ನು ಅಧ್ಯಯನ ಮಾಡಲು ಮತ್ತು ಕಲಿಯಲು ಹೇಗೆ ಇಷ್ಟಪಡುತ್ತೀರಿ?"
                    },
                    options: [
                        { ans: { en: "I love reading books and writing detailed notes.", hi: "मुझे किताबें पढ़ना और विस्तृत नोट्स लिखना पसंद है।", kn: "ನಾನು ಪುಸ್ತಕಗಳನ್ನು ಓದುವುದು ಮತ್ತು ವಿವರವಾದ ಟಿಪ್ಪಣಿಗಳನ್ನು ಬರೆಯುವುದು ಇಷ್ಟಪಡುತ್ತೇನೆ." }, weights: { theory: 3 } },
                        { ans: { en: "I prefer practical experiments, building models, or lab work.", hi: "मुझे व्यावहारिक प्रयोग पसंद है।", kn: "ನಾನು ಪ್ರಾಯೋಗಿಕ ಪ್ರಯೋಗಗಳನ್ನು ಬಯಸುತ್ತೇನೆ." }, weights: { practical: 3, math_sci: 1 } },
                        { ans: { en: "I like group discussions and participating in debates.", hi: "मुझे समूह चर्चा पसंद है।", kn: "ನಾನು ಗುಂಪು ಚರ್ಚೆಗಳನ್ನು ಇಷ್ಟಪಡುತ್ತೇನೆ." }, weights: { arts: 2, theory: 1 } }
                    ]
                }
            ],
            exams: [
                {
                    id: 'after_10th_e_q1',
                    text: {
                        en: "How do you feel about your physical fitness and discipline?",
                        hi: "आप अपनी शारीरिक फिटनेस और अनुशासन के बारे में कैसा महसूस करते हैं?",
                        kn: "ನಿಮ್ಮ ದೈಹಿಕ ಫಿಟ್ನೆಸ್ ಮತ್ತು ಶಿಸ್ತಿನ ಬಗ್ಗೆ ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತದೆ?"
                    },
                    options: [
                        { ans: { en: "Highly active, fit, and love strict discipline (Army/Police).", hi: "अत्यधिक सक्रिय, फिट, सख्त अनुशासन (सेना/पुलिस)।", kn: "ಹೆಚ್ಚು ಸಕ್ರಿಯ, ಕಟ್ಟುನಿಟ್ಟಾದ ಶಿಸ್ತು (ಸೇನೆ/ಪೊಲೀಸ್)." }, weights: { physical: 3, govt: 2 } },
                        { ans: { en: "I prefer sitting, reading, or mental tasks (Clerk/Admin).", hi: "मुझे बैठना, पढ़ना या मानसिक कार्य करना पसंद है।", kn: "ನಾನು ಕುಳಿತುಕೊಳ್ಳಲು, ಓದಲು ಅಥವಾ ಮಾನಸಿಕ ಕಾರ್ಯಗಳನ್ನು ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ." }, weights: { theory: 2, govt: 2 } }
                    ]
                },
                {
                    id: 'after_10th_e_q2',
                    text: {
                        en: "Are you willing to spend 1-2 years intensely preparing for competitive exams?",
                        hi: "क्या आप प्रतियोगी परीक्षाओं की तैयारी के लिए 1-2 साल बिताने के इच्छुक हैं?",
                        kn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ತಯಾರಿ ನಡೆಸಲು ನೀವು 1-2 ವರ್ಷ ಕಳೆಯಲು ಸಿದ್ಧರಿದ್ದೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Yes, fully committed to tough preparations.", hi: "हां, कठिन तैयारी के लिए पूरी तरह प्रतिबद्ध हूं।", kn: "ಹೌದು, ಕಠಿಣ ಸಿದ್ಧತೆಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಬದ್ಧರಾಗಿದ್ದೇವೆ." }, weights: { govt: 3, theory: 2 } },
                        { ans: { en: "No, I want to join early with basic tests.", hi: "नहीं, मैं बुनियादी परीक्षणों के साथ जल्दी जुड़ना चाहता हूं।", kn: "ಇಲ್ಲ, ನಾನು ಮೂಲ ಪರೀಕ್ಷೆಗಳೊಂದಿಗೆ ಬೇಗನೆ ಸೇರಲು ಬಯಸುತ್ತೇನೆ." }, weights: { govt: 1, practical: 1, physical: 1 } }
                    ]
                }
            ]
        },
        puc_science_pcmb: {
            courses: [
                {
                    id: 'puc_pcmb_c_q1',
                    text: {
                        en: "Which subject combination do you find most interesting in PCMB?",
                        hi: "PCMB में आपको कौन सा विषय संयोजन सबसे दिलचस्प लगता है?",
                        kn: "PCMB ಯಲ್ಲಿ ಯಾವ ವಿಷಯ ಸಂಯೋಜನೆಯು ನಿಮಗೆ ಹೆಚ್ಚು ಆಸಕ್ತಿದಾಯಕವಾಗಿದೆ?"
                    },
                    options: [
                        { ans: { en: "Biology & Chemistry (Medical/Life Sciences)", hi: "जीव विज्ञान और रसायन विज्ञान", kn: "ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ರಸಾಯನಶಾಸ್ತ್ರ" }, weights: { math_sci: 3, theory: 2 } },
                        { ans: { en: "Physics & Maths (Engineering/Research)", hi: "भौतिकी और गणित", kn: "ಭೌತಶಾಸ್ತ್ರ ಮತ್ತು ಗಣಿತ" }, weights: { math_sci: 2, practical: 2, private: 1 } },
                        { ans: { en: "Biology & Physics (Agri/Biotech)", hi: "जीव विज्ञान और भौतिकी", kn: "ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ಭೌತಶಾಸ್ತ್ರ" }, weights: { math_sci: 2, govt: 1, practical: 1 } }
                    ]
                },
                {
                    id: 'puc_pcmb_c_q2',
                    text: {
                        en: "Are you preparing for or willing to intensely prepare for NEET?",
                        hi: "क्या आप NEET की तैयारी कर रहे हैं?",
                        kn: "ನೀವು NEET ಗೆ ತಯಾರಿ ನಡೆಸುತ್ತಿದ್ದೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Yes, focused entirely on MBBS/Dental.", hi: "हां, पूरी तरह से एमबीबीएस पर केंद्रित।", kn: "ಹೌದು, ಎಂಬಿಬಿಎಸ್ ಮೇಲೆ ಕೇಂದ್ರೀಕೃತವಾಗಿದೆ." }, weights: { math_sci: 3, theory: 2, private: 1 } },
                        { ans: { en: "Maybe, but open to B.Sc Agri, Pharmacy, or pure sciences.", hi: "शायद, लेकिन बी.एससी कृषि, फार्मेसी के लिए तैयार।", kn: "ಬಹುಶಃ, ಆದರೆ ಬಿ.ಎಸ್ಸಿ ಕೃಷಿ, ಫಾರ್ಮಸಿಗೆ ಮುಕ್ತವಾಗಿದೆ." }, weights: { govt: 2, theory: 1, math_sci: 1 } },
                        { ans: { en: "No, prefer other non-medical degrees.", hi: "नहीं, अन्य गैर-चिकित्सा डिग्री पसंद करते हैं।", kn: "ಇಲ್ಲ, ಇತರ ವೈದ್ಯಕೀಯೇತರ ಪದವಿಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡಿ." }, weights: { private: 1 } }
                    ]
                }
            ],
            exams: [
                {
                    id: 'puc_pcmb_e_q1',
                    text: {
                        en: "Are you interested in joining the Armed Forces Medical Services or NDA?",
                        hi: "क्या आप सशस्त्र बल चिकित्सा सेवा या एनडीए में शामिल होने के इच्छुक हैं?",
                        kn: "ನೀವು ಸಶಸ್ತ್ರ ಪಡೆಗಳ ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು ಅಥವಾ ಎನ್‌ಡಿಎಗೆ ಸೇರಲು ಆಸಕ್ತಿ ಹೊಂದಿದ್ದೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Yes, I am physically fit and want to serve in Defense.", hi: "हां, मैं शारीरिक रूप से फिट हूं और रक्षा में सेवा करना चाहता हूं।", kn: "ಹೌದು, ನಾನು ದೈಹಿಕವಾಗಿ ಸದೃಢನಾಗಿದ್ದೇನೆ ಮತ್ತು ರಕ್ಷಣಾ ವಲಯದಲ್ಲಿ ಸೇವೆ ಸಲ್ಲಿಸಲು ಬಯಸುತ್ತೇನೆ." }, weights: { physical: 3, govt: 3, math_sci: 1 } },
                        { ans: { en: "No, I prefer civilian government roles.", hi: "नहीं, मैं नागरिक सरकारी भूमिकाओं को प्राथमिकता देता हूं।", kn: "ಇಲ್ಲ, ನಾನು ನಾಗರಿಕ ಸರ್ಕಾರಿ ಪಾತ್ರಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ." }, weights: { theory: 2, govt: 2 } }
                    ]
                }
            ]
        },
        puc_science_pcmc: {
            courses: [
                {
                    id: 'puc_pcmc_c_q1',
                    text: {
                        en: "What area of PCMC excites you the most?",
                        hi: "PCMC का कौन सा क्षेत्र आपको सबसे ज्यादा उत्साहित करता है?",
                        kn: "PCMC ಯ ಯಾವ ಕ್ಷೇತ್ರವು ನಿಮ್ಮನ್ನು ಹೆಚ್ಚು ಉತ್ಸುಕಗೊಳಿಸುತ್ತದೆ?"
                    },
                    options: [
                        { ans: { en: "Coding, Software, and Computer Science", hi: "कोडिंग, सॉफ्टवेयर", kn: "ಕೋಡಿಂಗ್, ಸಾಫ್ಟ್‌ವೇರ್" }, weights: { math_sci: 2, practical: 2, private: 2 } },
                        { ans: { en: "Mathematics, Logic, and Problem Solving", hi: "गणित, तर्क", kn: "ಗಣಿತ, ತರ್ಕ" }, weights: { math_sci: 3, theory: 2 } },
                        { ans: { en: "Physics, Electronics, and Hardware", hi: "भौतिकी, इलेक्ट्रॉनिक्स", kn: "ಭೌತಶಾಸ್ತ್ರ, ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್" }, weights: { practical: 3, math_sci: 1 } }
                    ]
                },
                {
                    id: 'puc_pcmc_c_q2',
                    text: {
                        en: "Are you targeting engineering entrance exams like JEE or CET?",
                        hi: "क्या आप जेईई या सीईटी जैसी इंजीनियरिंग प्रवेश परीक्षाओं को लक्षित कर रहे हैं?",
                        kn: "ನೀವು JEE ಅಥವಾ CET ಯಂತಹ ಎಂಜಿನಿಯರಿಂಗ್ ಪ್ರವೇಶ ಪರೀಕ್ಷೆಗಳನ್ನು ಗುರಿಯಾಗಿಸಿಕೊಂಡಿದ್ದೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Yes, focused purely on getting into top engineering colleges.", hi: "हां, इंजीनियरिंग पर केंद्रित।", kn: "ಹೌದು, ಎಂಜಿನಿಯರಿಂಗ್ ಮೇಲೆ ಕೇಂದ್ರೀಕೃತವಾಗಿದೆ." }, weights: { private: 2, math_sci: 2, theory: 1 } },
                        { ans: { en: "I am preparing, but open to B.Sc CS, BCA.", hi: "मैं तैयारी कर रहा हूं, लेकिन बीएससी सीएस, बीसीए के लिए खुला हूं।", kn: "ನಾನು ತಯಾರಿ ನಡೆಸುತ್ತಿದ್ದೇನೆ, ಆದರೆ ಬಿ.ಎಸ್ಸಿ ಸಿಎಸ್, ಬಿಸಿಎಗೆ ಮುಕ್ತವಾಗಿದ್ದೇನೆ." }, weights: { govt: 1, practical: 2 } }
                    ]
                }
            ],
            exams: [
                {
                    id: 'puc_pcmc_e_q1',
                    text: {
                        en: "Do you prefer a dynamic physical job (like Armed Forces/Police) or desk-based Govt jobs (SSC/Banking)?",
                        hi: "क्या आप एक गतिशील शारीरिक नौकरी या डेस्क-आधारित सरकारी नौकरी पसंद करते हैं?",
                        kn: "ಕ್ರಿಯಾತ್ಮಕ ದೈಹಿಕ ಉದ್ಯೋಗ ಅಥವಾ ಡೆಸ್ಕ್ ಆಧಾರಿತ ಸರ್ಕಾರಿ ಉದ್ಯೋಗವನ್ನು ನೀವು ಬಯಸುತ್ತೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Dynamic/Physical job (NDA, Armed Forces)", hi: "डायनेमिक/फिजिकल जॉब (एनडीए, सशस्त्र बल)", kn: "ಕ್ರಿಯಾತ್ಮಕ/ದೈಹಿಕ ಉದ್ಯೋಗ (ಎನ್‌ಡಿಎ, ಸಶಸ್ತ್ರ ಪಡೆಗಳು)" }, weights: { physical: 3, govt: 3 } },
                        { ans: { en: "Desk-based Govt admin/clerical roles", hi: "डेस्क-आधारित सरकारी व्यवस्थापक/लिपिक भूमिकाएँ", kn: "ಡೆಸ್ಕ್ ಆಧಾರಿತ ಸರ್ಕಾರಿ ಆಡಳಿತ/ಕ್ಲೆರಿಕಲ್ ಪಾತ್ರಗಳು" }, weights: { theory: 2, govt: 3, commerce: 1 } }
                    ]
                }
            ]
        },
        puc_commerce: {
            courses: [
                {
                    id: 'puc_comm_c_q1',
                    text: {
                        en: "Which aspect of Commerce do you enjoy more?",
                        hi: "आपको वाणिज्य का कौन सा पहलू अधिक पसंद है?",
                        kn: "ವಾಣಿಜ್ಯದ ಯಾವ ಅಂಶವನ್ನು ನೀವು ಹೆಚ್ಚು ಆನಂದಿಸುತ್ತೀರಿ?"
                    },
                    options: [
                        { ans: { en: "Accountancy and Number crunching", hi: "अकाउंटेंसी और नंबर क्रंचिंग", kn: "ಅಕೌಂಟೆನ್ಸಿ ಮತ್ತು ನಂಬರ್ ಕ್ರಂಚಿಂಗ್" }, weights: { commerce: 3, theory: 1 } },
                        { ans: { en: "Business Studies, Management, and Leadership", hi: "व्यवसाय अध्ययन, प्रबंधन और नेतृत्व", kn: "ವ್ಯವಹಾರ ಅಧ್ಯಯನ, ನಿರ್ವಹಣೆ ಮತ್ತು ನಾಯಕತ್ವ" }, weights: { commerce: 2, practical: 1, private: 1 } },
                        { ans: { en: "Economics, Finance, and Market trends", hi: "अर्थशास्त्र, वित्त और बाजार के रुझान", kn: "ಅರ್ಥಶಾಸ್ತ್ರ, ಹಣಕಾಸು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳು" }, weights: { commerce: 2, theory: 2 } }
                    ]
                },
                {
                    id: 'puc_comm_c_q2',
                    text: {
                        en: "Are you planning to prepare for Professional Exams like CA, CS, or CMA?",
                        hi: "क्या आप सीए, सीएस या सीएमए जैसी व्यावसायिक परीक्षाओं की तैयारी करने की योजना बना रहे हैं?",
                        kn: "ನೀವು CA, CS, ಅಥವಾ CMA ಯಂತಹ ವೃತ್ತಿಪರ ಪರೀಕ್ಷೆಗಳಿಗೆ ತಯಾರಿ ನಡೆಸಲು ಯೋಜಿಸುತ್ತಿದ್ದೀರಾ?"
                    },
                    options: [
                        { ans: { en: "Yes, I am highly dedicated to clearing CA/CS.", hi: "हां, मैं सीए/सीएस पास करने के लिए अत्यधिक समर्पित हूं।", kn: "ಹೌದು, CA/CS ಅನ್ನು ತೆರವುಗೊಳಿಸಲು ನಾನು ಹೆಚ್ಚು ಸಮರ್ಪಿತನಾಗಿದ್ದೇನೆ." }, weights: { commerce: 3, theory: 2, private: 2 } },
                        { ans: { en: "No, I prefer doing B.Com/BBA alone.", hi: "नहीं, मैं बीकॉम/बीबीए करना पसंद करता हूं।", kn: "ಇಲ್ಲ, ನಾನು ಬಿ.ಕಾಂ/ಬಿಬಿಎ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ." }, weights: { private: 2, practical: 1 } }
                    ]
                }
            ],
            exams: [
                {
                    id: 'puc_comm_e_q1',
                    text: {
                        en: "Which government sector appeals to you the most?",
                        hi: "कौन सा सरकारी क्षेत्र आपको सबसे ज्यादा आकर्षित करता है?",
                        kn: "ಯಾವ ಸರ್ಕಾರಿ ವಲಯವು ನಿಮ್ಮನ್ನು ಹೆಚ್ಚು ಆಕರ್ಷಿಸುತ್ತದೆ?"
                    },
                    options: [
                        { ans: { en: "Banking & Finance Sector (IBPS/SBI)", hi: "बैंकिंग और वित्त क्षेत्र (IBPS/SBI)", kn: "ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಹಣಕಾಸು ವಲಯ (IBPS/SBI)" }, weights: { commerce: 2, govt: 3, theory: 2 } },
                        { ans: { en: "Administrative & Clerical (SSC CHSL/CGL)", hi: "प्रशासनिक और लिपिक (SSC CHSL/CGL)", kn: "ಆಡಳಿತ ಮತ್ತು ಕ್ಲೆರಿಕಲ್ (SSC CHSL/CGL)" }, weights: { govt: 3, theory: 2 } },
                        { ans: { en: "Police or Defense Forces", hi: "पुलिस या रक्षा बल", kn: "ಪೊಲೀಸ್ ಅಥವಾ ರಕ್ಷಣಾ ಪಡೆಗಳು" }, weights: { physical: 3, govt: 2 } }
                    ]
                }
            ]
        },
        puc_arts: {
            courses: [
                {
                    id: 'puc_arts_c_q1',
                    text: {
                        en: "What drove you to choose the Arts/Humanities stream?",
                        hi: "किस चीज़ ने आपको कला/मानविकी स्ट्रीम चुनने के लिए प्रेरित किया?",
                        kn: "ಕಲಾ/ಮಾನವಿಕ ಸ್ಟ್ರೀಮ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ನಿಮ್ಮನ್ನು ಪ್ರೇರೇಪಿಸಿದ್ದು ಯಾವುದು?"
                    },
                    options: [
                        { ans: { en: "Interests in History, Politics, Sociology.", hi: "इतिहास, राजनीति, समाजशास्त्र में रुचि।", kn: "ಇತಿಹಾಸ, ರಾಜಕೀಯ, ಸಮಾಜಶಾಸ್ತ್ರದಲ್ಲಿ ಆಸಕ್ತಿ." }, weights: { arts: 2, theory: 2 } },
                        { ans: { en: "Passion for Languages and Literature.", hi: "भाषा और साहित्य का शौक।", kn: "ಭಾಷೆಗಳು ಮತ್ತು ಸಾಹಿತ್ಯದ ಬಗ್ಗೆ ಒಲವು." }, weights: { arts: 3, theory: 1 } },
                        { ans: { en: "Creativity (Fine Arts, Journalism, Media).", hi: "रचनात्मकता (ललित कला, पत्रकारिता, मीडिया)।", kn: "ಸೃಜನಶೀಲತೆ (ಲಲಿತಕಲೆಗಳು, ಪತ್ರಿಕೋದ್ಯಮ, ಮಾಧ್ಯಮ)." }, weights: { arts: 2, private: 2, practical: 2 } }
                    ]
                },
                {
                    id: 'puc_arts_c_q2',
                    text: {
                        en: "How much reading and writing are you willing to do?",
                        hi: "आप कितना पढ़ना और लिखना चाहते हैं?",
                        kn: "ನೀವು ಎಷ್ಟು ಓದಲು ಮತ್ತು ಬರೆಯಲು ಸಿದ್ಧರಿದ್ದೀರಿ?"
                    },
                    options: [
                        { ans: { en: "I can read extensively and write long, analytical essays.", hi: "मैं बड़े पैमाने पर पढ़ सकता हूं और लंबे निबंध लिख सकता हूं।", kn: "ನಾನು ವ್ಯಾಪಕವಾಗಿ ಓದಬಲ್ಲೆ ಮತ್ತು ದೀರ್ಘ ಪ್ರಬಂಧಗಳನ್ನು ಬರೆಯಬಲ್ಲೆ." }, weights: { theory: 3, arts: 1 } },
                        { ans: { en: "I prefer practical expressions like debates, speech, or art.", hi: "मैं व्यावहारिक अभिव्यक्ति पसंद करता हूं।", kn: "ನಾನು ಪ್ರಾಯೋಗಿಕ ಅಭಿವ್ಯಕ್ತಿಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೇನೆ." }, weights: { practical: 3, arts: 1 } }
                    ]
                }
            ],
            exams: [
                {
                    id: 'puc_arts_e_q1',
                    text: {
                        en: "What is your main goal for Government Service?",
                        hi: "सरकारी सेवा के लिए आपका मुख्य लक्ष्य क्या है?",
                        kn: "ಸರ್ಕಾರಿ ಸೇವೆಗಾಗಿ ನಿಮ್ಮ ಮುಖ್ಯ ಗುರಿ ಏನು?"
                    },
                    options: [
                        { ans: { en: "Civil Services (IAS/IPS/KAS) to serve society at a high level.", hi: "समाज की सेवा के लिए सिविल सेवा (आईएएस/आईपीएस)।", kn: "ನಾಗರಿಕ ಸೇವೆಗಳು (IAS/IPS)." }, weights: { govt: 4, theory: 3, arts: 1 } },
                        { ans: { en: "Administrative/Clerical jobs for security (SSC/FDA).", hi: "सुरक्षा के लिए प्रशासनिक/लिपिक नौकरियां (एसएससी/एफडीए)।", kn: "ಆಡಳಿತ/ಕ್ಲೆರಿಕಲ್ ಉದ್ಯೋಗಗಳು (SSC/FDA)." }, weights: { govt: 3, theory: 1 } },
                        { ans: { en: "Police forces (State Police/Sub-Inspector).", hi: "पुलिस बल (राज्य पुलिस/उप-निरीक्षक)।", kn: "ಪೊಲೀಸ್ ಪಡೆಗಳು." }, weights: { physical: 3, govt: 3 } }
                    ]
                }
            ]
        }
    },

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
            ]
        },
        {
            id: "e_neet",
            type: "exam",
            category: "puc_science_pcmb",
            title: { en: "NEET UG (Medical Entrance)", hi: "नीट यूजी (मेडिकल प्रवेश)", kn: "ನೀಟ್ ಯುಜಿ (ವೈದ್ಯಕೀಯ ಪ್ರವೇಶ)" },
            description: { en: "National level medical entrance exam for MBBS/BDS.", hi: "एमबीबीएस/बीडीएस के लिए राष्ट्रीय स्तर की मेडिकल प्रवेश परीक्षा।", kn: "ಎಂಬಿಬಿಎಸ್/ಬಿಡಿಎಸ್ ಗಾಗಿ ರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದ ವೈದ್ಯಕೀಯ ಪ್ರವೇಶ ಪರೀಕ್ಷೆ." },
            weights: { math_sci: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "12th Pass with Physics, Chemistry, Biology" },
                age_limit: { en: "17+ Years" },
                difficulty: { en: "Very High" },
                prep_time: { en: "1 - 2 Years" },
                salary: { en: "Depends on placement/practice" }
            },
            roadmap: [
                { step: { en: "1. Pass 12th Board Exams (PCB)" } },
                { step: { en: "2. Prepare & Clear NEET UG" } },
                { step: { en: "3. Attend Counseling for College Allotment" } }
            ]
        },
        {
            id: "e_kcet",
            type: "exam",
            category: "puc_science",
            title: { en: "KCET (Karnataka State Entrance)", hi: "केसीईटी (कर्नाटक राज्य प्रवेश)", kn: "ಕೆಸಿಇಟಿ (ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪ್ರವೇಶ)" },
            description: { en: "State level entrance exam for Engineering, Pharmacy, and Agriculture.", hi: "इंजीनियरिंग, फार्मेसी और कृषि के लिए राज्य स्तरीय प्रवेश परीक्षा।", kn: "ಎಂಜಿನಿಯರಿಂಗ್, ಫಾರ್ಮಸಿ ಮತ್ತು ಕೃಷಿಗಾಗಿ ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರವೇಶ ಪರೀಕ್ಷೆ." },
            weights: { math_sci: 3, practical: 2, theory: 1 },
            details: {
                eligibility: { en: "12th Pass (PUC) with PCM / PCB" },
                age_limit: { en: "No upper age limit" },
                difficulty: { en: "High" },
                prep_time: { en: "1 Year" },
                salary: { en: "Depends on degree pursued" }
            },
            roadmap: [
                { step: { en: "1. Pass 2nd PUC Exams" } },
                { step: { en: "2. Clear KCET" } },
                { step: { en: "3. State counseling for college admission" } }
            ]
        }
    ],

    // Government Exam Updates Data (KCET, NEET, etc.)
    examUpdates: [
        {
            id: "update_kcet",
            name: "KCET (Karnataka Common Entrance Test)",
            notificationDate: "January 10, 2026",
            appStartDate: "January 15, 2026",
            appEndDate: "February 20, 2026",
            examDate: "April 18 - 19, 2026",
            resultDate: "May 25, 2026 (Tentative)",
            eligibility: { en: "12th Pass (PUC) with Physics, Chemistry, and Math/Biology.", hi: "भौतिकी, रसायन विज्ञान और गणित/जीव विज्ञान के साथ 12वीं (पीयूसी) पास।", kn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ ಮತ್ತು ಗಣಿತ/ಜೀವಶಾಸ್ತ್ರದೊಂದಿಗೆ 12ನೇ ತೇರ್ಗಡೆ (PUC)." },
            officialWebsite: "cetonline.karnataka.gov.in/kea/",
            lastUpdated: "February 28, 2026"
        },
        {
            id: "update_neet",
            name: "NEET UG (National Eligibility cum Entrance Test)",
            notificationDate: "February 09, 2026",
            appStartDate: "February 09, 2026",
            appEndDate: "March 09, 2026",
            examDate: "May 03, 2026",
            resultDate: "June 14, 2026 (Tentative)",
            eligibility: { en: "12th Pass with Physics, Chemistry, Biology/Biotechnology and English.", hi: "भौतिकी, रसायन विज्ञान, जीव विज्ञान/जैव प्रौद्योगिकी और अंग्रेजी के साथ 12वीं पास।", kn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವಶಾಸ್ತ್ರ/ಜೈವಿಕ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನೊಂದಿಗೆ 12ನೇ ತೇರ್ಗಡೆ." },
            officialWebsite: "exams.nta.ac.in/NEET/",
            lastUpdated: "February 15, 2026"
        }
    ]
};
