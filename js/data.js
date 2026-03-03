// Temporary overwrite file to build new courses object without relying on node/regex search.
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
                        { ans: { en: "Administrative & Clerical (SSC CHSL/CGL)", hi: "प्रशासनिक और लिपिक (SSC CHSL/CGL)", kn: "ಆಡಳಿತ और ಕ್ಲೆರಿಕಲ್ (SSC CHSL/CGL)" }, weights: { govt: 3, theory: 2 } },
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
        // AFTER 10th COURSES
        {
            id: "c_puc_science_pcmb",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Science (PCMB)", hi: "पीयूसी विज्ञान (PCMB)", kn: "ಪಿಯುಸಿ ವಿಜ್ಞಾನ (PCMB)" },
            description: { en: "Pre-University Course focusing on Physics, Chemistry, Maths, and Biology. Leads to Medical and Engineering.", hi: "विज्ञान और जीव विज्ञान पर केंद्रित प्री-यूनिवर्सिटी कोर्स।", kn: "ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಗಣಿತ ಮತ್ತು ಜೀವಶಾಸ್ತ್ರವನ್ನು ಒಳಗೊಂಡಿರುವ ಪಿಯು ಕೋರ್ಸ್." },
            weights: { math_sci: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "Medical, Agriculture, Pure Sciences, Engineering via PCMB" },
                salary: { en: "Stepping stone to graduation" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Enroll in PUC Science (PCMB)" } },
                { step: { en: "3. Prepare for NEET/CET during PUC" } }
            ]
        },
        {
            id: "c_puc_science_pcmc",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Science (PCMC)", hi: "पीयूसी विज्ञान (PCMC)", kn: "ಪಿಯುಸಿ ವಿಜ್ಞಾನ (PCMC)" },
            description: { en: "Pre-University Course focusing on Computers, Maths, Physics, Chemistry. Ideal for Engineering/IT.", hi: "इंजीनियरिंग के लिए विज्ञान (PCMC) कोर्स।", kn: "ಟೆಕ್ನಾಲಜಿ ಕ್ಷೇತ್ರಕ್ಕೆ ಸೂಕ್ತವಾದ ಪಿಯು ಕೋರ್ಸ್." },
            weights: { math_sci: 3, practical: 2, theory: 1, private: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "Engineering, BCA, Architecture, Defense" },
                salary: { en: "Stepping stone to graduation" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th Class" } },
                { step: { en: "2. Enroll in PUC Science (PCMC)" } }
            ]
        },
        {
            id: "c_puc_commerce",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Commerce", hi: "पीयूसी वाणिज्य", kn: "ಪಿಯುಸಿ ವಾಣಿಜ್ಯ" },
            description: { en: "Pre-University Course focusing on Business, Accounts, Economics.", hi: "व्यवसाय और एकाउंट्स आधारित कोर्स।", kn: "ವಾಣಿಜ್ಯ, ಅಕೌಂಟ್ಸ್ ಮತ್ತು ಅರ್ಥಶಾಸ್ತ್ರದ ಕೋರ್ಸ್." },
            weights: { commerce: 3, theory: 2, private: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "CA, CS, B.Com, BBA" },
                salary: { en: "Stepping stone to graduation" }
            },
            roadmap: [
                { step: { en: "1. Enroll in PUC Commerce" } },
                { step: { en: "2. Pursue B.Com/BBA or Professional degrees" } }
            ]
        },
        {
            id: "c_puc_arts",
            type: "course",
            category: "after_10th",
            title: { en: "PUC Arts", hi: "पीयूसी कला", kn: "ಪಿಯುಸಿ ಕಲೆ" },
            description: { en: "Pre-University Arts focusing on Humanities, Languages, History, Sociology.", hi: "मानविकी और भाषाओं पर कोर्स।", kn: "ಮಾನವಿಕ ಮತ್ತು ಭಾಷೆಗಳ ಅಧ್ಯಯನ." },
            weights: { arts: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 Years" },
                scope: { en: "BA, LLB, Civil Services Preparation" },
                salary: { en: "Stepping stone to graduation" }
            },
            roadmap: [
                { step: { en: "1. Enroll in PUC Arts" } }
            ]
        },
        {
            id: "c_diploma_polytechnic",
            type: "course",
            category: "after_10th",
            title: { en: "Polytechnic / Diploma in Engineering", hi: "पॉलिटेक्निक", kn: "ಪಾಲಿಟೆಕ್ನಿಕ್ ಡಿಪ್ಲೊಮಾ" },
            description: { en: "3-year practical engineering course (Mechanical, Civil, Electrical, CS).", hi: "3 वर्षीय व्यावहारिक इंजीनियरिंग पाठ्यक्रम।", kn: "3 ವರ್ಷದ ಪ್ರಾಯೋಗಿಕ ಎಂಜಿನಿಯರಿಂಗ್ ಕೋರ್ಸ್." },
            weights: { math_sci: 2, practical: 3, private: 1, govt: 1 },
            details: {
                eligibility: { en: "10th Pass (minimum 35%)" },
                duration: { en: "3 Years" },
                scope: { en: "Junior Engineer, Direct 2nd year B.Tech admission" },
                salary: { en: "₹2.0 - 4.0 Lakhs / year initially" }
            },
            roadmap: [
                { step: { en: "1. Clear State Diploma Entrance/Merit" } },
                { step: { en: "2. Complete 3-year Diploma" } },
                { step: { en: "3. Join job OR pursue B.Tech (Lateral Entry)" } }
            ]
        },
        {
            id: "c_diploma_paramedical",
            type: "course",
            category: "after_10th",
            title: { en: "Paramedical Diploma", hi: "पैरामेडिकल डिप्लोमा", kn: "ಪ್ಯಾರಾಮೆಡಿಕಲ್ ಡಿಪ್ಲೊಮಾ" },
            description: { en: "Health industry diploma for lab tech, X-Ray, D.Pharma.", hi: "स्वास्थ्य उद्योग डिप्लोमा।", kn: "ಆರೋಗ್ಯ ಕ್ಷೇತ್ರದ ಡಿಪ್ಲೊಮಾ." },
            weights: { math_sci: 1, practical: 2, govt: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "2 to 3 Years" },
                scope: { en: "Lab Technician, Pharmacist, Clinical Assistant" },
                salary: { en: "₹1.5 - 3.5 Lakhs / year initially" }
            },
            roadmap: [
                { step: { en: "1. Pass 10th" } },
                { step: { en: "2. Join DMLT or D.Pharma" } }
            ]
        },
        {
            id: "c_iti",
            type: "course",
            category: "after_10th",
            title: { en: "ITI (Industrial Training)", hi: "आईटीआई", kn: "ಐಟಿಐ" },
            description: { en: "Vocational training in trades like Electrician, Fitter, Welder, COPA.", hi: "व्यावसायिक प्रशिक्षण।", kn: "ವೃತ್ತಿಪರ ತರಬೇತಿ." },
            weights: { practical: 3, govt: 1, math_sci: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                duration: { en: "1 to 2 Years" },
                scope: { en: "Technician in Railways, Factory worker" },
                salary: { en: "₹1.5 - 2.5 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Admission based on 10th marks" } },
                { step: { en: "2. Complete Apprentice Training" } }
            ]
        },

        // PUC SCIENCE PCMB COURSES
        {
            id: "c_mbbs",
            type: "course",
            category: "puc_science_pcmb",
            title: { en: "MBBS / BDS", hi: "एमबीबीएस", kn: "ಎಂಬಿಬಿಎಸ್" },
            description: { en: "Professional clinical degrees in medicine and dental surgery.", hi: "मेडिकल डिग्री।", kn: "ವೈದ್ಯಕೀಯ ಪದವಿ." },
            weights: { math_sci: 3, theory: 2, govt: 1, practical: 1 },
            details: {
                eligibility: { en: "PUC Science (PCMB) mandatory via NEET" },
                duration: { en: "5-6 Years" },
                scope: { en: "Doctor, Surgeon, Medical Officer" },
                salary: { en: "₹6.0 - 20.0+ Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear NEET exam" } },
                { step: { en: "2. Complete medical curriculum + Internship" } }
            ]
        },
        {
            id: "c_allied_health",
            type: "course",
            category: "puc_science_pcmb",
            title: { en: "Allied Health (B.Sc Nursing, Radiology, Lab Tech)", hi: "नर्सिंग और संबद्ध स्वास्थ्य", kn: "ನರ್ಸಿಂಗ್ ಮತ್ತು ಪೂರಕ ಆರೋಗ್ಯ" },
            description: { en: "Specialized degrees in Nursing, Physiotherapy, Lab Tech.", hi: "विशेषीकृत स्वास्थ्य डिग्री।", kn: "ನರ್ಸಿಂಗ್, ಫಿಸಿಯೋಥೆರಪಿ." },
            weights: { math_sci: 2, practical: 2, govt: 1 },
            details: {
                eligibility: { en: "PUC Science (PCMB)" },
                duration: { en: "3-4 Years" },
                scope: { en: "Nurse, Radiologist, Physiotherapist" },
                salary: { en: "₹3.0 - 6.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear Nursing/Allied CET" } },
                { step: { en: "2. Complete Degree" } }
            ]
        },
        {
            id: "c_bsc_agri",
            type: "course",
            category: "puc_science_pcmb",
            title: { en: "B.Sc Agriculture / Horticulture", hi: "कृषि विज्ञान", kn: "ಕೃಷಿ ವಿಜ್ಞಾನ" },
            description: { en: "Study of agriculture, food tech, and forestry.", hi: "कृषि अध्ययन।", kn: "ಕೃಷಿ ಮತ್ತು ಆಹಾರ ತಂತ್ರಜ್ಞಾನ." },
            weights: { math_sci: 2, practical: 2, govt: 2 },
            details: {
                eligibility: { en: "PUC Science (PCMB via practical exam/CET)" },
                duration: { en: "4 Years" },
                scope: { en: "Agri Officer, Researcher, Food Tech" },
                salary: { en: "₹3.0 - 8.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear Agricultural Entrance" } }
            ]
        },

        // PUC SCIENCE PCMC COURSES
        {
            id: "c_btech",
            type: "course",
            category: "puc_science_pcmc", // Primarily PCMC, though PCMB can also do Engineering
            title: { en: "B.E / B.Tech (Core Engineering & IT)", hi: "इंजीनियरिंग", kn: "ಎಂಜಿನಿಯರಿಂಗ್" },
            description: { en: "Degrees in Computer Science, AI, Mechanical, Civil, Electronics.", hi: "सॉफ्टवेयर और कोर इंजीनियरिंग डिग्री।", kn: "ಎಂಜಿನಿಯರಿಂಗ್, ಐಟಿ ಪದವಿ." },
            weights: { math_sci: 3, private: 2, theory: 1, practical: 1 },
            details: {
                eligibility: { en: "PUC Science with Maths" },
                duration: { en: "4 Years" },
                scope: { en: "Software Developer, Design Engineer" },
                salary: { en: "₹4.0 - 15.0+ Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear KCET / JEE Mains" } },
                { step: { en: "2. Complete 4-year technical degree" } }
            ]
        },
        {
            id: "c_bca_cs",
            type: "course",
            category: "puc_science_pcmc",
            title: { en: "BCA / B.Sc Computer Science", hi: "बीसीए / बी.एससी सीएस", kn: "ಬಿಸಿಎ / ಬಿ.ಎಸ್ಸಿ ಸಿಎಸ್" },
            description: { en: "Undergrad degrees focused fully on programming and software.", hi: "प्रोग्रामिंग डिग्री।", kn: "ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಪದವಿ." },
            weights: { math_sci: 1, practical: 2, private: 3 },
            details: {
                eligibility: { en: "PUC (Any stream, Maths preferred)" },
                duration: { en: "3-4 Years" },
                scope: { en: "Software Engineer, Analyst" },
                salary: { en: "₹3.0 - 8.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. College Admissions" } }
            ]
        },

        // PUC COMMERCE COURSES
        {
            id: "c_bcom",
            type: "course",
            category: "puc_commerce",
            title: { en: "B.Com / BBA (Business Management)", hi: "बी.कॉम / बीबीए", kn: "ಬಿ.ಕಾಂ / ಬಿಬಿಎ" },
            description: { en: "Degrees focusing on accounting, finance, and business administration.", hi: "व्यवसाय प्रबंधन और लेखांकन।", kn: "ವಾಣಿಜ್ಯ ಮತ್ತು ನಿರ್ವಹಣೆ ಪದವಿ." },
            weights: { commerce: 3, theory: 2, private: 2 },
            details: {
                eligibility: { en: "PUC Commerce/Arts" },
                duration: { en: "3 Years" },
                scope: { en: "Accountant, Manager, HR, Sales" },
                salary: { en: "₹3.0 - 6.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Enroll in Degree" } }
            ]
        },
        {
            id: "c_ca_cs",
            type: "course",
            category: "puc_commerce",
            title: { en: "CA / CS / CMA (Professional Certifications)", hi: "सीए / सीएस", kn: "ಸಿಎ / ಸಿಎಸ್" },
            description: { en: "High-tier professional courses for corporate finance and compliance.", hi: "पेशेवर चार्टर्ड एकाउंटेंट।", kn: "ವೃತ್ತಿಪರ ಅಕೌಂಟೆಂಟ್ ತರಬೇತಿ." },
            weights: { commerce: 3, theory: 3, private: 1 },
            details: {
                eligibility: { en: "PUC Commerce (Clear Foundation)" },
                duration: { en: "4-5 Years" },
                scope: { en: "Corporate Auditor, Tax Consultant" },
                salary: { en: "₹8.0 - 20.0+ Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear Foundation Level" } },
                { step: { en: "2. Articleship Training" } },
                { step: { en: "3. Clear Final Exam" } }
            ]
        },

        // PUC ARTS COURSES
        {
            id: "c_ba",
            type: "course",
            category: "puc_arts",
            title: { en: "B.A (History, Sociology, Psychology)", hi: "बी.ए", kn: "ಬಿ.ಎ" },
            description: { en: "Arts degrees focused on humanities, civil service prep, and psychology.", hi: "मानविकी और मनोविज्ञान।", kn: "ಮಾನವಿಕ ಪದವಿ." },
            weights: { arts: 3, theory: 3, govt: 1 },
            details: {
                eligibility: { en: "PUC Any Stream" },
                duration: { en: "3 Years" },
                scope: { en: "Civil Services, Teaching, Social Work" },
                salary: { en: "₹2.0 - 5.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. College Application" } }
            ]
        },
        {
            id: "c_law",
            type: "course",
            category: "puc_arts",
            title: { en: "B.A L.L.B (Integrated Law)", hi: "बी.ए एल.एल.बी (कपूर लॉ)", kn: "ಕಾನೂನು ಪದವಿ" },
            description: { en: "Integrated 5-year law degree.", hi: "कानून की डिग्री।", kn: "ಕಾನೂನು ಅಧ್ಯಯನ." },
            weights: { arts: 2, theory: 3, govt: 1 },
            details: {
                eligibility: { en: "PUC Any stream (via CLAT or merit)" },
                duration: { en: "5 Years" },
                scope: { en: "Advocate, Corporate Lawyer, Judge" },
                salary: { en: "₹4.0 - 15.0 Lakhs / year" }
            },
            roadmap: [
                { step: { en: "1. Clear CLAT / State Law Entrance" } },
                { step: { en: "2. Complete 5 Years Integrated Degree" } }
            ]
        }
    ],

    // Database of Government Exams
    exams: [
        {
            id: "e_agniveer",
            type: "exam",
            category: "after_10th",
            allow_all: true,
            title: { en: "Indian Army (Agniveer GD)", hi: "भारतीय सेना", kn: "ಭಾರತೀಯ ಸೇನೆ" },
            description: { en: "General Duty soldier recruitment scheme.", hi: "सैनिक भर्ती योजना।", kn: "ಜನರಲ್ ಡ್ಯೂಟಿ ಸೈನಿಕ ನೇಮಕಾತಿ." },
            weights: { physical: 3, govt: 3, practical: 1 },
            details: {
                eligibility: { en: "10th Pass" },
                age_limit: { en: "17.5 to 21 Years" },
                difficulty: { en: "Moderate (Physically High)" },
                prep_time: { en: "6 - 12 Months" },
                salary: { en: "₹30,000/month initial" }
            },
            roadmap: [{ step: { en: "1. Physical Prep -> Online CEE -> Medical" } }]
        },
        {
            id: "e_police_constable",
            type: "exam",
            category: "after_10th",
            allow_all: true,
            title: { en: "State Police Constable", hi: "राज्य पुलिस", kn: "ರಾಜ್ಯ ಪೊಲೀಸ್" },
            description: { en: "Recruitment for Constable rank in state police departments.", hi: "राज्य पुलिस में कांस्टेबल।", kn: "ರಾಜ್ಯ ಪೊಲೀಸ್." },
            weights: { physical: 2, govt: 3, arts: 1 },
            details: {
                eligibility: { en: "10th/12th Pass" },
                age_limit: { en: "18 to 25 Years" },
                difficulty: { en: "Moderate" },
                prep_time: { en: "6 - 10 Months" },
                salary: { en: "Level 3 Pay" }
            },
            roadmap: [{ step: { en: "1. Written -> Physical Test" } }]
        },
        {
            id: "e_upsc_nda",
            type: "exam",
            category: "puc_science_pcmc",
            allow_all: true,
            title: { en: "NDA (National Defence Academy)", hi: "एनडीए", kn: "ಎನ್‌ಡಿಎ" },
            description: { en: "Officer level entry to Army, Navy, and Air Force.", hi: "अधिकारी स्तर प्रवेश।", kn: "ಅಧಿಕಾರಿ ಪ್ರವೇಶ." },
            weights: { math_sci: 2, physical: 2, govt: 3 },
            details: {
                eligibility: { en: "12th Pass (PCM required for AirForce/Navy)" },
                age_limit: { en: "16.5 to 19.5 Years" },
                difficulty: { en: "High" },
                prep_time: { en: "1 - 2 Years" },
                salary: { en: "Stipend, starting approx ₹56,100" }
            },
            roadmap: [{ step: { en: "1. Written -> SSB Interview -> Medicals" } }]
        },
        {
            id: "e_ssc_chsl",
            type: "exam",
            category: "puc_commerce",
            allow_all: true,
            title: { en: "SSC CHSL (Clerk/Data Entry)", hi: "सीएचएसएल", kn: "SSC CHSL" },
            description: { en: "Central Govt ministry clerk recruitment.", hi: "क्लर्क भर्ती।", kn: "ಕ್ಲರ್ಕ್ ನೇಮಕಾತಿ." },
            weights: { theory: 2, govt: 3, commerce: 1, arts: 1 },
            details: {
                eligibility: { en: "12th Pass" },
                age_limit: { en: "18 to 27 Years" },
                difficulty: { en: "Moderate-High Competition" },
                prep_time: { en: "8 - 12 Months" },
                salary: { en: "Level 2/4" }
            },
            roadmap: [{ step: { en: "1. Tier-1 -> Tier-2 Typing Test" } }]
        },
        {
            id: "e_neet",
            type: "exam",
            category: "puc_science_pcmb",
            title: { en: "NEET UG (Medical Entrance)", hi: "नीट यूजी", kn: "ನೀಟ್ ಯುಜಿ" },
            description: { en: "National level medical entrance exam.", hi: "मेडिकल प्रवेश।", kn: "ವೈದ್ಯಕೀಯ ಪ್ರವೇಶ." },
            weights: { math_sci: 3, theory: 2, govt: 1 },
            details: {
                eligibility: { en: "12th Pass with PCB" },
                difficulty: { en: "Very High" },
                salary: { en: "Medical degrees leading to Doctor" },
                prep_time: { en: "2 Years" },
                age_limit: { en: "17+ Years" }
            },
            roadmap: [{ step: { en: "1. Subject preparation -> NEET Exam -> Counselling" } }]
        }
    ],

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
