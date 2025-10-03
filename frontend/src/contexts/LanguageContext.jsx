import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Language Context
const LanguageContext = createContext();

// Language translations
const translations = {
  en: {
    // Common terms
    welcome: "Welcome",
    login: "Login",
    logout: "Logout",
    dashboard: "Dashboard",
    consultation: "Consultation",
    results: "Results",
    home: "Home",
    
    // Login page
    welcomeToMedAid: "Welcome to MedAid",
    letsGetStarted: "Let's get started with your health consultation",
    fullName: "Full Name",
    age: "Age",
    emailAddress: "Email Address",
    preferredLanguage: "Preferred Language",
    howToCommunicate: "How would you like to communicate?",
    typeText: "Type/Text",
    report: "Report",
    startConsultation: "Start Health Consultation",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
    
    // Consultation page
    healthConsultation: "Health Consultation",
    describeSymptoms: "Describe Your Symptoms",
    uploadMedicalReport: "Upload Medical Report",
    dragDropReport: "Drag & drop your medical report here or click to browse",
    supportsFiles: "Supports PDF, PNG, JPG files",
    chooseFile: "Choose File",
    medicalHistory: "Medical History",
    doYouHaveConditions: "Do you have any of the following conditions?",
    otherConditions: "Other Conditions (if any)",
    listOtherConditions: "List any other medical conditions",
    uploadReportOptional: "Upload Medical Report (Optional)",
    reviewInformation: "Review Your Information",
    symptoms: "Symptoms",
    medicalHistoryLabel: "Medical History",
    uploadedReport: "Uploaded Report",
    notProvided: "Not provided",
    noMedicalHistory: "No medical history provided",
    noReportUploaded: "No report uploaded",
    previous: "Previous",
    next: "Next",
    submitForAnalysis: "Submit for Analysis",
    processing: "Processing...",
    
    // Results page
    healthAssessment: "Health Assessment Results",
    basedOnSymptoms: "Based on your symptoms and medical history",
    immediateAttention: "Immediate Medical Attention Required",
    urgentEvaluation: "Your symptoms suggest urgent medical evaluation is required. Please seek immediate care at the nearest hospital or call emergency services.",
    medicalEvaluation: "Medical Evaluation Recommended",
    professionalEvaluation: "Your symptoms suggest a medical condition that requires professional evaluation. Please consult with a healthcare provider within 24-48 hours.",
    aiReasoning: "AI Reasoning",
    possibleConditions: "Possible Conditions",
    confidenceAnalysis: "Confidence Analysis",
    recommendations: "Recommendations",
    drinkFluids: "Drink plenty of fluids to stay hydrated",
    getRest: "Get adequate rest to help your body recover",
    monitorSymptoms: "Monitor your symptoms closely for any changes",
    ifWorsen: "If symptoms worsen or persist for more than 48 hours, seek medical attention",
    painRelief: "Consider over-the-counter pain relief if appropriate",
    similarCases: "Similar Cases",
    emergencyContacts: "Emergency Contacts",
    ambulance: "Ambulance",
    nationalEmergency: "National Emergency",
    poisonControl: "Poison Control",
    medicalHelpline: "Medical Helpline",
    newConsultation: "New Consultation",
    downloadReport: "Download Report",
    shareReport: "Share Report",
    
    // Dashboard
    myHealthDashboard: "My Health Dashboard",
    memberSince: "Member since",
    totalConsultations: "Total Consultations",
    medicalConditions: "Medical Conditions",
    healthScore: "Health Score",
    reportsUploaded: "Reports Uploaded",
    recentConsultations: "Recent Consultations",
    youHavent: "You haven't had any consultations yet.",
    startFirst: "Start your first health consultation to see your history here.",
    healthTips: "Health Tips",
    stayHydrated: "Stay Hydrated: Drink at least 8 glasses of water daily.",
    regularExercise: "Regular Exercise: Aim for 30 minutes of activity daily.",
    balancedDiet: "Balanced Diet: Include fruits and vegetables in every meal.",
    sleepWell: "Sleep Well: Get 7-8 hours of quality sleep each night.",
    quickActions: "Quick Actions",
    uploadReport: "Upload Medical Report",
    viewTimeline: "View Health Timeline",
    exportData: "Export Health Data",
    
    // Emergency Alert
    emergencyAlert: "Emergency Alert",
    immediateHelp: "Immediate Help Needed",
    callAmbulance: "Call Ambulance (108)",
    callEmergency: "Call Emergency (112)",
    emergencyInstructions: "While waiting for help:",
    stayCalm: "Stay calm and reassure the patient",
    checkBreathing: "Check if the patient is breathing",
    controlBleeding: "Control any bleeding with direct pressure",
    dontMove: "Do not move the patient if spinal injury is suspected"
  },
  hi: {
    // Common terms
    welcome: "स्वागत है",
    login: "लॉग इन करें",
    logout: "लॉग आउट",
    dashboard: "डैशबोर्ड",
    consultation: "परामर्श",
    results: "परिणाम",
    home: "होम",
    
    // Login page
    welcomeToMedAid: "मेडएड में आपका स्वागत है",
    letsGetStarted: "आइए आपके स्वास्थ्य परामर्श के साथ शुरुआत करें",
    fullName: "पूरा नाम",
    age: "आयु",
    emailAddress: "ईमेल पता",
    preferredLanguage: "पसंदीदा भाषा",
    howToCommunicate: "आप कैसे संचार करना चाहेंगे?",
    typeText: "टाइप/टेक्स्ट",
    report: "रिपोर्ट",
    startConsultation: "स्वास्थ्य परामर्श शुरू करें",
    alreadyHaveAccount: "क्या आपके पास पहले से एक खाता है?",
    signIn: "साइन इन करें",
    
    // Consultation page
    healthConsultation: "स्वास्थ्य परामर्श",
    describeSymptoms: "अपने लक्षणों का वर्णन करें",
    uploadMedicalReport: "चिकित्सा रिपोर्ट अपलोड करें",
    dragDropReport: "अपनी चिकित्सा रिपोर्ट को यहाँ ड्रैग एंड ड्रॉप करें या ब्राउज़ करने के लिए क्लिक करें",
    supportsFiles: "पीडीएफ, पीएनजी, जेपीजी फ़ाइलें समर्थित हैं",
    chooseFile: "फ़ाइल चुनें",
    medicalHistory: "चिकित्सा इतिहास",
    doYouHaveConditions: "क्या आपके पास निम्नलिखित में से कोई स्थिति है?",
    otherConditions: "अन्य स्थितियाँ (यदि कोई हो)",
    listOtherConditions: "किसी भी अन्य चिकित्सा स्थितियों की सूची बनाएँ",
    uploadReportOptional: "चिकित्सा रिपोर्ट अपलोड करें (वैकल्पिक)",
    reviewInformation: "अपनी जानकारी की समीक्षा करें",
    symptoms: "लक्षण",
    medicalHistoryLabel: "चिकित्सा इतिहास",
    uploadedReport: "अपलोड की गई रिपोर्ट",
    notProvided: "प्रदान नहीं की गई",
    noMedicalHistory: "कोई चिकित्सा इतिहास प्रदान नहीं किया गया",
    noReportUploaded: "कोई रिपोर्ट अपलोड नहीं की गई",
    previous: "पिछला",
    next: "अगला",
    submitForAnalysis: "विश्लेषण के लिए प्रस्तुत करें",
    processing: "प्रसंस्करण...",
    
    // Results page
    healthAssessment: "स्वास्थ्य मूल्यांकन परिणाम",
    basedOnSymptoms: "आपके लक्षणों और चिकित्सा इतिहास के आधार पर",
    immediateAttention: "तत्काल चिकित्सा ध्यान आवश्यक",
    urgentEvaluation: "आपके लक्षणों को देखते हुए तत्काल चिकित्सा मूल्यांकन की आवश्यकता है। कृपया निकटतम अस्पताल में तत्काल देखभाल लें या आपातकालीन सेवाओं को कॉल करें।",
    medicalEvaluation: "चिकित्सा मूल्यांकन की सिफारिश की गई",
    professionalEvaluation: "आपके लक्षणों को देखते हुए एक चिकित्सा स्थिति है जिसके लिए पेशेवर मूल्यांकन की आवश्यकता है। कृपया 24-48 घंटों के भीतर स्वास्थ्य सेवा प्रदाता से परामर्श लें।",
    aiReasoning: "एआई तर्क",
    possibleConditions: "संभावित स्थितियाँ",
    confidenceAnalysis: "आत्मविश्वास विश्लेषण",
    recommendations: "सिफारिशें",
    drinkFluids: "पर्याप्त तरल पदार्थ पीकर जलयोजन बनाए रखें",
    getRest: "अपने शरीर को बरामद करने में मदत के लिए पर्याप्त आराम प्राप्त करें",
    monitorSymptoms: "किसी भी परिवर्तन के लिए अपने लक्षणों की निकटता से निगरानी करें",
    ifWorsen: "यदि लक्षण बिगड़ते हैं या 48 घंटों से अधिक समय तक बने रहते हैं, तो चिकित्सा ध्यान लें",
    painRelief: "यदि उपयुक्त हो तो ओवर-द-काउंटर दर्द निवारण पर विचार करें",
    similarCases: "समान मामले",
    emergencyContacts: "आपातकालीन संपर्क",
    ambulance: "रोगी वाहन",
    nationalEmergency: "राष्ट्रीय आपातकाल",
    poisonControl: "जहर नियंत्रण",
    medicalHelpline: "चिकित्सा हेल्पलाइन",
    newConsultation: "नया परामर्श",
    downloadReport: "रिपोर्ट डाउनलोड करें",
    shareReport: "रिपोर्ट साझा करें",
    
    // Dashboard
    myHealthDashboard: "मेरा स्वास्थ्य डैशबोर्ड",
    memberSince: "सदस्यता तारीख",
    totalConsultations: "कुल परामर्श",
    medicalConditions: "चिकित्सा स्थितियाँ",
    healthScore: "स्वास्थ्य स्कोर",
    reportsUploaded: "रिपोर्ट अपलोड की गई",
    recentConsultations: "हाल के परामर्श",
    youHavent: "आपके पास अभी तक कोई परामर्श नहीं हुआ है।",
    startFirst: "अपना इतिहास यहाँ देखने के लिए अपना पहला स्वास्थ्य परामर्श शुरू करें।",
    healthTips: "स्वास्थ्य युक्तियाँ",
    stayHydrated: "जलयोजन बनाए रखें: प्रतिदिन कम से कम 8 गिलास पानी पीएँ।",
    regularExercise: "नियमित व्यायाम: प्रतिदिन 30 मिनट की गतिविधि का लक्ष्य रखें।",
    balancedDiet: "संतुलित आहार: हर मील में फल और सब्जियाँ शामिल करें।",
    sleepWell: "अच्छी तरह सोएँ: प्रत्येक रात 7-8 घंटे की गुणवत्ता वाली नींद प्राप्त करें।",
    quickActions: "त्वरित कार्रवाइयाँ",
    uploadReport: "चिकित्सा रिपोर्ट अपलोड करें",
    viewTimeline: "स्वास्थ्य समयरेखा देखें",
    exportData: "स्वास्थ्य डेटा निर्यात करें",
    
    // Emergency Alert
    emergencyAlert: "आपातकालीन चेतावनी",
    immediateHelp: "तत्काल सहायता की आवश्यकता है",
    callAmbulance: "रोगी वाहन बुलाएं (108)",
    callEmergency: "आपातकालीन कॉल करें (112)",
    emergencyInstructions: "सहायता की प्रतीक्षा करते समय:",
    stayCalm: "शांत रहें और रोगी को बहलाएं",
    checkBreathing: "जांचें कि रोगी को सांस आ रही है",
    controlBleeding: "सीधे दबाव के साथ किसी भी खून को नियंत्रित करें",
    dontMove: "यदि मेरुदंड की चोट का संदेह है तो रोगी को न हटाएं"
  },
  mr: {
    // Common terms
    welcome: "स्वागत आहे",
    login: "लॉग इन करा",
    logout: "लॉग आउट करा",
    dashboard: "डॅशबोर्ड",
    consultation: "सल्लामसलत",
    results: "निकाल",
    home: "होम",
    
    // Login page
    welcomeToMedAid: "मेडएड मध्ये आपले स्वागत आहे",
    letsGetStarted: "चला आपल्या आरोग्य सल्लामसलतीसह सुरवात करूया",
    fullName: "पूर्ण नाव",
    age: "वय",
    emailAddress: "ईमेल पत्ता",
    preferredLanguage: "पसंतीची भाषा",
    howToCommunicate: "तुम्ही कसे संप्रेषित करू इच्छिता?",
    typeText: "टाइप/मजकूर",
    report: "अहवाल",
    startConsultation: "आरोग्य सल्लामसलत सुरू करा",
    alreadyHaveAccount: "आधीपासूनच खाते आहे का?",
    signIn: "साइन इन करा",
    
    // Consultation page
    healthConsultation: "आरोग्य सल्लामसलत",
    describeSymptoms: "तुमच्या लक्षणांचे वर्णन करा",
    uploadMedicalReport: "वैद्यकीय अहवाल अपलोड करा",
    dragDropReport: "तुमचा वैद्यकीय अहवाल इथे ड्रॅग आणि ड्रॉप करा किंवा ब्राउझ करण्यासाठी क्लिक करा",
    supportsFiles: "PDF, PNG, JPG फाइल्स समर्थित आहेत",
    chooseFile: "फाइल निवडा",
    medicalHistory: "वैद्यकीय इतिहास",
    doYouHaveConditions: "तुमच्याकडे खालीलपैकी काही स्थिती आहे का?",
    otherConditions: "इतर स्थिती (असल्यास)",
    listOtherConditions: "इतर कोणत्याही वैद्यकीय स्थितींची यादी करा",
    uploadReportOptional: "वैद्यकीय अहवाल अपलोड करा (पर्यायी)",
    reviewInformation: "तुमची माहिती पुनरावलोकन करा",
    symptoms: "लक्षणे",
    medicalHistoryLabel: "वैद्यकीय इतिहास",
    uploadedReport: "अपलोड केलेला अहवाल",
    notProvided: "प्रदान केलेले नाही",
    noMedicalHistory: "कोणताही वैद्यकीय इतिहास प्रदान केलेला नाही",
    noReportUploaded: "कोणताही अहवाल अपलोड केलेला नाही",
    previous: "मागील",
    next: "पुढील",
    submitForAnalysis: "विश्लेषणासाठी सबमिट करा",
    processing: "प्रक्रिया सुरू आहे...",
    
    // Results page
    healthAssessment: "आरोग्य मूल्यांकन निकाल",
    basedOnSymptoms: "तुमच्या लक्षणांवर आणि वैद्यकीय इतिहासावर आधारित",
    immediateAttention: "तातडीने वैद्यकीय लक्ष आवश्यक",
    urgentEvaluation: "तुमच्या लक्षणांवरून तातडीने वैद्यकीय मूल्यांकन आवश्यक आहे. कृपया सर्वात जवळच्या रुग्णालयात तातडीने काळजी घ्या किंवा आणीबाणीच्या सेवांचा तातडीने वापर करा.",
    medicalEvaluation: "वैद्यकीय मूल्यांकन शिफारस केले",
    professionalEvaluation: "तुमच्या लक्षणांवरून वैद्यकीय स्थिती आहे ज्यासाठी व्यावसायिक मूल्यांकन आवश्यक आहे. कृपया 24-48 तासांच्या आत आरोग्य सेवा प्रदात्याशी सल्लामसलत घ्या.",
    aiReasoning: "AI तर्क",
    possibleConditions: "संभाव्य स्थिती",
    confidenceAnalysis: "आत्मविश्वास विश्लेषण",
    recommendations: "शिफारसी",
    drinkFluids: "जलयोजन कायम ठेवण्यासाठी पुरेशी द्रव प्या",
    getRest: "तुमच्या शरीराला बरामद करण्यास मदत करण्यासाठी पुरेशी स्वानुभव घ्या",
    monitorSymptoms: "कोणत्याही बदलांसाठी तुमच्या लक्षणांचे निकटतेने निरीक्षण करा",
    ifWorsen: "जर लक्षणे वाईट होतील किंवा 48 तासांहून अधिक काळ टिकतील तर वैद्यकीय लक्ष घ्या",
    painRelief: "योग्य असल्यास ओव्हर-द-काउंटर दुखापत निवारणाचा विचार करा",
    similarCases: "समान प्रकरणे",
    emergencyContacts: "आणीबाणीचे संपर्क",
    ambulance: "रुग्णवाहिका",
    nationalEmergency: "राष्ट्रीय आणीबाणी",
    poisonControl: "विष नियंत्रण",
    medicalHelpline: "वैद्यकीय हेल्पलाइन",
    newConsultation: "नवीन सल्लामसलत",
    downloadReport: "अहवाल डाउनलोड करा",
    shareReport: "अहवाल सामायिक करा",
    
    // Dashboard
    myHealthDashboard: "माझा आरोग्य डॅशबोर्ड",
    memberSince: "सदस्यत्वापासून",
    totalConsultations: "एकूण सल्लामसलती",
    medicalConditions: "वैद्यकीय स्थिती",
    healthScore: "आरोग्य स्कोअर",
    reportsUploaded: "अहवाल अपलोड केले",
    recentConsultations: "अलीकडील सल्लामसलती",
    youHavent: "तुमच्याकडे अद्याप कोणत्याही सल्लामसलती नाहीत.",
    startFirst: "तुमचा इतिहास इथे पाहण्यासाठी तुमची पहिली आरोग्य सल्लामसलत सुरू करा.",
    healthTips: "आरोग्य टिपा",
    stayHydrated: "जलयोजन कायम ठेवा: दररोज किमान 8 गlasses पाणी प्या.",
    regularExercise: "नेहमीचे व्यायाम: दररोज 30 मिनिटे क्रीडा करण्याचा प्रयत्न करा.",
    balancedDiet: "संतुलित आहार: प्रत्येक जेवणात फळे आणि भाज्या समाविष्ट करा.",
    sleepWell: "चांगले झोपा: प्रत्येक रात्री 7-8 तास गुणवत्तापूर्ण झोप घ्या.",
    quickActions: "जलद कृती",
    uploadReport: "वैद्यकीय अहवाल अपलोड करा",
    viewTimeline: "आरोग्य काळपरिपाटी पहा",
    exportData: "आरोग्य डेटा निर्यात करा",
    
    // Emergency Alert
    emergencyAlert: "आणीबाणीची चेतावणी",
    immediateHelp: "तातडीने मदतीची आवश्यकता आहे",
    callAmbulance: "रुग्णवाहिका फोन करा (108)",
    callEmergency: "आणीबाणी कॉल करा (112)",
    emergencyInstructions: "मदतीची प्रतीक्षा करताना:",
    stayCalm: "शांत राहा आणि रुग्णाला बहलवा",
    checkBreathing: "रुग्ण श्वास घेत आहे का ते तपासा",
    controlBleeding: "थेट दबावाने कोणताही रक्तस्राव नियंत्रित करा",
    dontMove: "मेरुदंडाच्या जखमेचा संशय असल्यास रुग्णाला हलवू नका"
  }
};

// Language Context Provider
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Change language and save preference
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  // Get translation for a key
  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;