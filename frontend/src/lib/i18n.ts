// Dictionary i18n for the 10 major Indian languages KisanAlert supports —
// the same set as the sibling KisanVoice project. Fixed UI chrome is
// hand-authored here for zero-latency rendering; dynamic AI/SMS content is
// translated live via Cloud Translation (see lib/voice.ts + api.ts) when a
// GOOGLE_CLOUD_API_KEY is configured on the backend, falling back to
// Gemini's own in-language generation otherwise.

export type Lang = "en" | "hi" | "ta" | "te" | "mr" | "pa" | "bn" | "kn" | "ml" | "gu";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "bn", label: "বাংলা" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "gu", label: "ગુજરાતી" },
];

// BCP-47 locales — used for both browser Web Speech fallback and as the
// mapping key backend/gcp.py mirrors for Cloud Speech-to-Text/TTS.
export const SPEECH_LOCALE: Record<Lang, string> = {
  en: "en-IN", hi: "hi-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN",
  pa: "pa-IN", bn: "bn-IN", kn: "kn-IN", ml: "ml-IN", gu: "gu-IN",
};

const D: Record<string, Record<Lang, string>> = {
  app_title: {
    en: "KisanAlert", hi: "किसान अलर्ट", ta: "கிசான் அலர்ட்", te: "కిసాన్ అలర్ట్",
    mr: "किसान अलर्ट", pa: "ਕਿਸਾਨ ਅਲਰਟ", bn: "কিষান অ্যালার্ট", kn: "ಕಿಸಾನ್ ಅಲರ್ಟ್",
    ml: "കിസാൻ അലർട്ട്", gu: "કિસાન અલર્ટ",
  },
  tagline: {
    en: "Smart Water, Crop & Advisory System",
    hi: "स्मार्ट जल, फसल और सलाह प्रणाली",
    ta: "ஸ்மார்ட் நீர், பயிர் & ஆலோசனை அமைப்பு",
    te: "స్మార్ట్ నీరు, పంట & సలహా వ్యవస్థ",
    mr: "स्मार्ट पाणी, पीक आणि सल्ला प्रणाली",
    pa: "ਸਮਾਰਟ ਪਾਣੀ, ਫ਼ਸਲ ਅਤੇ ਸਲਾਹ ਪ੍ਰਣਾਲੀ",
    bn: "স্মার্ট জল, ফসল ও পরামর্শ ব্যবস্থা",
    kn: "ಸ್ಮಾರ್ಟ್ ನೀರು, ಬೆಳೆ ಮತ್ತು ಸಲಹಾ ವ್ಯವಸ್ಥೆ",
    ml: "സ്മാർട്ട് ജലം, വിള & ഉപദേശ സംവിധാനം",
    gu: "સ્માર્ટ પાણી, પાક અને સલાહ સિસ્ટમ",
  },
  nav_dashboard: {
    en: "Dashboard", hi: "डैशबोर्ड", ta: "டாஷ்போர்டு", te: "డాష్‌బోర్డ్", mr: "डॅशबोर्ड",
    pa: "ਡੈਸ਼ਬੋਰਡ", bn: "ড্যাশবোর্ড", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", ml: "ഡാഷ്ബോർഡ്", gu: "ડેશબોર્ડ",
  },
  nav_advisor: {
    en: "Crop Advisor", hi: "फसल सलाहकार", ta: "பயிர் ஆலோசகர்", te: "పంట సలహాదారు",
    mr: "पीक सल्लागार", pa: "ਫ਼ਸਲ ਸਲਾਹਕਾਰ", bn: "ফসল পরামর্শদাতা", kn: "ಬೆಳೆ ಸಲಹೆಗಾರ",
    ml: "വിള ഉപദേഷ്ടാവ്", gu: "પાક સલાહકાર",
  },
  nav_alerts: {
    en: "Alerts", hi: "अलर्ट", ta: "எச்சரிக்கைகள்", te: "అలర్ట్‌లు", mr: "सूचना",
    pa: "ਚੇਤਾਵਨੀਆਂ", bn: "সতর্কতা", kn: "ಎಚ್ಚರಿಕೆಗಳು", ml: "അലേർട്ടുകൾ", gu: "ચેતવણીઓ",
  },
  nav_health: {
    en: "Crop Health", hi: "फसल स्वास्थ्य", ta: "பயிர் ஆரோக்கியம்", te: "పంట ఆరోగ్యం",
    mr: "पीक आरोग्य", pa: "ਫ਼ਸਲ ਸਿਹਤ", bn: "ফসলের স্বাস্থ্য", kn: "ಬೆಳೆ ಆರೋಗ್ಯ",
    ml: "വിള ആരോഗ്യം", gu: "પાક આરોગ્ય",
  },
  nav_rsk: {
    en: "RSK Desk", hi: "RSK डेस्क", ta: "RSK டெஸ்க்", te: "RSK డెస్క్", mr: "RSK डेस्क",
    pa: "RSK ਡੈਸਕ", bn: "RSK ডেস্ক", kn: "RSK ಡೆಸ್ಕ್", ml: "RSK ഡെസ്ക്", gu: "RSK ડેસ્ક",
  },
  nav_sms: {
    en: "SMS / IVR", hi: "SMS / IVR", ta: "SMS / IVR", te: "SMS / IVR", mr: "SMS / IVR",
    pa: "SMS / IVR", bn: "SMS / IVR", kn: "SMS / IVR", ml: "SMS / IVR", gu: "SMS / IVR",
  },
  location_ph: {
    en: "Village / district (e.g. Anantapur)",
    hi: "गाँव / ज़िला (जैसे अनंतपुर)",
    ta: "கிராமம் / மாவட்டம் (எ.கா. அனந்தபூர்)",
    te: "గ్రామం / జిల్లా (ఉదా. అనంతపురం)",
    mr: "गाव / जिल्हा (उदा. अनंतपूर)",
    pa: "ਪਿੰਡ / ਜ਼ਿਲ੍ਹਾ (ਜਿਵੇਂ ਅਨੰਤਪੁਰ)",
    bn: "গ্রাম / জেলা (যেমন অনন্তপুর)",
    kn: "ಗ್ರಾಮ / ಜಿಲ್ಲೆ (ಉದಾ. ಅನಂತಪುರ)",
    ml: "ഗ്രാമം / ജില്ല (ഉദാ. അനന്തപൂർ)",
    gu: "ગામ / જિલ્લો (દા.ત. અનંતપુર)",
  },
  fetch: {
    en: "Get Advisory", hi: "सलाह पाएं", ta: "ஆலோசனை பெறவும்", te: "సలహా పొందండి",
    mr: "सल्ला मिळवा", pa: "ਸਲਾਹ ਲਵੋ", bn: "পরামর্শ নিন", kn: "ಸಲಹೆ ಪಡೆಯಿರಿ",
    ml: "ഉപദേശം നേടുക", gu: "સલાહ મેળવો",
  },
  temp: {
    en: "Temperature", hi: "तापमान", ta: "வெப்பநிலை", te: "ఉష్ణోగ్రత", mr: "तापमान",
    pa: "ਤਾਪਮਾਨ", bn: "তাপমাত্রা", kn: "ತಾಪಮಾನ", ml: "താപനില", gu: "તાપમાન",
  },
  past_rain: {
    en: "Rain, past 7 days", hi: "बारिश, पिछले 7 दिन", ta: "மழை, கடந்த 7 நாட்கள்",
    te: "వర్షం, గత 7 రోజులు", mr: "पाऊस, गेल्या 7 दिवसांचा", pa: "ਮੀਂਹ, ਪਿਛਲੇ 7 ਦਿਨ",
    bn: "বৃষ্টি, গত ৭ দিন", kn: "ಮಳೆ, ಕಳೆದ 7 ದಿನಗಳು", ml: "മഴ, കഴിഞ്ഞ 7 ദിവസം",
    gu: "વરસાદ, છેલ્લા 7 દિવસ",
  },
  outlook_rain: {
    en: "Rain, next 16 days", hi: "बारिश, अगले 16 दिन", ta: "மழை, அடுத்த 16 நாட்கள்",
    te: "వర్షం, రాబోయే 16 రోజులు", mr: "पाऊस, पुढील 16 दिवस", pa: "ਮੀਂਹ, ਅਗਲੇ 16 ਦਿਨ",
    bn: "বৃষ্টি, আগামী ১৬ দিন", kn: "ಮಳೆ, ಮುಂದಿನ 16 ದಿನಗಳು", ml: "മഴ, അടുത്ത 16 ദിവസം",
    gu: "વરસાદ, આગામી 16 દિવસ",
  },
  dry_spell: {
    en: "Dry spell", hi: "सूखा", ta: "வறட்சி காலம்", te: "పొడి వాతావరణం", mr: "कोरडा हंगाम",
    pa: "ਖੁਸ਼ਕ ਦੌਰ", bn: "শুষ্ক মেয়াদ", kn: "ಒಣ ಹವಾಮಾನ", ml: "വരൾച്ചക്കാലം", gu: "સૂકો ગાળો",
  },
  days: {
    en: "days", hi: "दिन", ta: "நாட்கள்", te: "రోజులు", mr: "दिवस", pa: "ਦਿਨ",
    bn: "দিন", kn: "ದಿನಗಳು", ml: "ദിവസം", gu: "દિવસ",
  },
  next_rain: {
    en: "Next rain", hi: "अगली बारिश", ta: "அடுத்த மழை", te: "తదుపరి వర్షం",
    mr: "पुढील पाऊस", pa: "ਅਗਲਾ ਮੀਂਹ", bn: "পরবর্তী বৃষ্টি", kn: "ಮುಂದಿನ ಮಳೆ",
    ml: "അടുത്ത മഴ", gu: "આગામી વરસાદ",
  },
  district: {
    en: "District", hi: "ज़िला", ta: "மாவட்டம்", te: "జిల్లా", mr: "जिल्हा", pa: "ਜ਼ਿਲ੍ਹਾ",
    bn: "জেলা", kn: "ಜಿಲ್ಲೆ", ml: "ജില്ല", gu: "જિલ્લો",
  },
  season: {
    en: "Season", hi: "मौसम", ta: "பருவம்", te: "సీజన్", mr: "हंगाम", pa: "ਮੌਸਮ",
    bn: "মরসুম", kn: "ಋತು", ml: "സീസൺ", gu: "ઋતુ",
  },
  irrigation: {
    en: "Irrigation source", hi: "सिंचाई स्रोत", ta: "பாசன மூலம்", te: "నీటిపారుదల మూలం",
    mr: "सिंचन स्रोत", pa: "ਸਿੰਚਾਈ ਸਰੋਤ", bn: "সেচ উৎস", kn: "ನೀರಾವರಿ ಮೂಲ",
    ml: "ജലസേചന സ്രോതസ്സ്", gu: "સિંચાઈ સ્ત્રોત",
  },
  groundwater: {
    en: "Groundwater depth", hi: "भूजल गहराई", ta: "நிலத்தடி நீர் ஆழம்", te: "భూగర్భజల లోతు",
    mr: "भूजल खोली", pa: "ਧਰਤੀ ਹੇਠਲੇ ਪਾਣੀ ਦੀ ਡੂੰਘਾਈ", bn: "ভূগর্ভস্থ জলের গভীরতা",
    kn: "ಅಂತರ್ಜಲ ಆಳ", ml: "ഭൂഗർഭജല ആഴം", gu: "ભૂગર્ભજળ ઊંડાઈ",
  },
  acres: {
    en: "Acres", hi: "एकड़", ta: "ஏக்கர்", te: "ఎకరాలు", mr: "एकर", pa: "ਏਕੜ",
    bn: "একর", kn: "ಎಕರೆ", ml: "ഏക്കർ", gu: "એકર",
  },
  get_recommendation: {
    en: "Recommend Crops", hi: "फसल सुझाएं", ta: "பயிர் பரிந்துரை", te: "పంటలను సిఫార్సు చేయండి",
    mr: "पीक सुचवा", pa: "ਫ਼ਸਲ ਸੁਝਾਓ", bn: "ফসল সুপারিশ করুন", kn: "ಬೆಳೆ ಶಿಫಾರಸು ಮಾಡಿ",
    ml: "വിള ശുപാർശ ചെയ്യുക", gu: "પાક સૂચવો",
  },
  ai_advice: {
    en: "AI Advisory", hi: "AI सलाह", ta: "AI ஆலோசனை", te: "AI సలహా", mr: "AI सल्ला",
    pa: "AI ਸਲਾਹ", bn: "AI পরামর্শ", kn: "AI ಸಲಹೆ", ml: "AI ഉപദേശം", gu: "AI સલાહ",
  },
  speak: {
    en: "Listen", hi: "सुनें", ta: "கேளுங்கள்", te: "వినండి", mr: "ऐका", pa: "ਸੁਣੋ",
    bn: "শুনুন", kn: "ಕೇಳಿ", ml: "കേൾക്കുക", gu: "સાંભળો",
  },
  describe: {
    en: "Describe the problem (type or speak)",
    hi: "समस्या बताएं (लिखें या बोलें)",
    ta: "பிரச்சினையை விவரிக்கவும் (தட்டச்சு அல்லது பேசவும்)",
    te: "సమస్యను వివరించండి (టైప్ లేదా మాట్లాడండి)",
    mr: "समस्या सांगा (टाइप करा किंवा बोला)",
    pa: "ਸਮੱਸਿਆ ਦੱਸੋ (ਲਿਖੋ ਜਾਂ ਬੋਲੋ)",
    bn: "সমস্যা বর্ণনা করুন (লিখুন বা বলুন)",
    kn: "ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ (ಟೈಪ್ ಅಥವಾ ಮಾತನಾಡಿ)",
    ml: "പ്രശ്നം വിവരിക്കുക (ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ സംസാരിക്കുക)",
    gu: "સમસ્યા વર્ણવો (ટાઇપ કરો અથવા બોલો)",
  },
  upload_photo: {
    en: "Upload crop photo", hi: "फसल की फोटो डालें", ta: "பயிர் புகைப்படத்தை பதிவேற்றவும்",
    te: "పంట ఫోటో అప్‌లోడ్ చేయండి", mr: "पिकाचा फोटो अपलोड करा", pa: "ਫ਼ਸਲ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ",
    bn: "ফসলের ছবি আপলোড করুন", kn: "ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", ml: "വിളയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക",
    gu: "પાકનો ફોટો અપલોડ કરો",
  },
  diagnose: {
    en: "Diagnose", hi: "निदान करें", ta: "கண்டறியவும்", te: "నిర్ధారించండి", mr: "निदान करा",
    pa: "ਜਾਂਚ ਕਰੋ", bn: "নির্ণয় করুন", kn: "ರೋಗ ಪತ್ತೆ ಮಾಡಿ", ml: "രോഗനിർണയം ചെയ്യുക",
    gu: "નિદાન કરો",
  },
  escalated: {
    en: "Escalated to Rythu Seva Kendra — an expert will follow up",
    hi: "रायथु सेवा केंद्र भेजा गया — विशेषज्ञ संपर्क करेंगे",
    ta: "ரைது சேவா கேந்திரத்திற்கு அனுப்பப்பட்டது — நிபுணர் தொடர்பு கொள்வார்",
    te: "రైతు సేవా కేంద్రానికి పంపబడింది — నిపుణుడు సంప్రదిస్తారు",
    mr: "रयथू सेवा केंद्राकडे पाठवले — तज्ञ संपर्क करतील",
    pa: "ਰਾਇਥੂ ਸੇਵਾ ਕੇਂਦਰ ਭੇਜਿਆ ਗਿਆ — ਮਾਹਰ ਸੰਪਰਕ ਕਰਨਗੇ",
    bn: "রায়থু সেবা কেন্দ্রে পাঠানো হয়েছে — বিশেষজ্ঞ যোগাযোগ করবেন",
    kn: "ರೈತ ಸೇವಾ ಕೇಂದ್ರಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ — ತಜ್ಞರು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ",
    ml: "റൈത്തു സേവാ കേന്ദ്രത്തിലേക്ക് അയച്ചു — വിദഗ്ധൻ ബന്ധപ്പെടും",
    gu: "રયથુ સેવા કેન્દ્રમાં મોકલાયું — નિષ્ણાત સંપર્ક કરશે",
  },
  self_treat: {
    en: "Low risk — follow the treatment below",
    hi: "कम जोखिम — नीचे दिया उपचार करें",
    ta: "குறைந்த ஆபத்து — கீழே உள்ள சிகிச்சையைப் பின்பற்றவும்",
    te: "తక్కువ ప్రమాదం — క్రింది చికిత్సను అనుసరించండి",
    mr: "कमी धोका — खालील उपचार करा",
    pa: "ਘੱਟ ਜੋਖਮ — ਹੇਠਾਂ ਦਿੱਤਾ ਇਲਾਜ ਕਰੋ",
    bn: "কম ঝুঁকি — নিচের চিকিৎসা অনুসরণ করুন",
    kn: "ಕಡಿಮೆ ಅಪಾಯ — ಕೆಳಗಿನ ಚಿಕಿತ್ಸೆ ಅನುಸರಿಸಿ",
    ml: "കുറഞ്ഞ അപകടസാധ്യത — താഴെയുള്ള ചികിത്സ പിന്തുടരുക",
    gu: "ઓછું જોખમ — નીચે આપેલી સારવાર અનુસરો",
  },
  subscribe: {
    en: "Subscribe", hi: "सब्सक्राइब", ta: "குழுசேரவும்", te: "సబ్‌స్క్రైబ్", mr: "सबस्क्राइब करा",
    pa: "ਸਬਸਕ੍ਰਾਈਬ ਕਰੋ", bn: "সাবস্ক্রাইব করুন", kn: "ಚಂದಾದಾರರಾಗಿ", ml: "സബ്‌സ്‌ക്രൈബ് ചെയ്യുക",
    gu: "સબ્સ્ક્રાઇબ કરો",
  },
  phone_ph: {
    en: "Mobile number", hi: "मोबाइल नंबर", ta: "மொபைல் எண்", te: "మొబైల్ నంబర్",
    mr: "मोबाइल नंबर", pa: "ਮੋਬਾਈਲ ਨੰਬਰ", bn: "মোবাইল নম্বর", kn: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    ml: "മൊബൈൽ നമ്പർ", gu: "મોબાઇલ નંબર",
  },
  sms_preview: {
    en: "Preview today's SMS", hi: "आज का SMS देखें", ta: "இன்றைய SMS ஐப் பார்க்கவும்",
    te: "నేటి SMS చూడండి", mr: "आजचा SMS पहा", pa: "ਅੱਜ ਦਾ SMS ਵੇਖੋ", bn: "আজকের SMS দেখুন",
    kn: "ಇಂದಿನ SMS ವೀಕ್ಷಿಸಿ", ml: "ഇന്നത്തെ SMS കാണുക", gu: "આજનો SMS જુઓ",
  },
  farmer_name: {
    en: "Farmer name", hi: "किसान का नाम", ta: "விவசாயி பெயர்", te: "రైతు పేరు",
    mr: "शेतकऱ्याचे नाव", pa: "ਕਿਸਾਨ ਦਾ ਨਾਮ", bn: "কৃষকের নাম", kn: "ರೈತರ ಹೆಸರು",
    ml: "കർഷകന്റെ പേര്", gu: "ખેડૂતનું નામ",
  },
  village: {
    en: "Village", hi: "गाँव", ta: "கிராமம்", te: "గ్రామం", mr: "गाव", pa: "ਪਿੰਡ",
    bn: "গ্রাম", kn: "ಗ್ರಾಮ", ml: "ഗ്രാമം", gu: "ગામ",
  },
  crop: {
    en: "Crop", hi: "फसल", ta: "பயிர்", te: "పంట", mr: "पीक", pa: "ਫ਼ਸਲ",
    bn: "ফসল", kn: "ಬೆಳೆ", ml: "വിള", gu: "પાક",
  },
  loading: {
    en: "Working…", hi: "काम हो रहा है…", ta: "செயல்படுகிறது…", te: "పని జరుగుతోంది…",
    mr: "काम सुरू आहे…", pa: "ਕੰਮ ਹੋ ਰਿਹਾ ਹੈ…", bn: "কাজ চলছে…", kn: "ಕೆಲಸ ನಡೆಯುತ್ತಿದೆ…",
    ml: "ജോലി നടക്കുന്നു…", gu: "કામ ચાલી રહ્યું છે…",
  },
  hotspot_map: {
    en: "District Hotspot Map", hi: "ज़िला हॉटस्पॉट मानचित्र", ta: "மாவட்ட ஹாட்ஸ்பாட் வரைபடம்",
    te: "జిల్లా హాట్‌స్పాట్ మ్యాప్", mr: "जिल्हा हॉटस्पॉट नकाशा", pa: "ਜ਼ਿਲ੍ਹਾ ਹੌਟਸਪੌਟ ਨਕਸ਼ਾ",
    bn: "জেলা হটস্পট মানচিত্র", kn: "ಜಿಲ್ಲಾ ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ", ml: "ജില്ലാ ഹോട്ട്‌സ്പോട്ട് മാപ്പ്",
    gu: "જિલ્લા હોટસ્પોટ નકશો",
  },
  ivr_chat: {
    en: "Ask by voice or text (Dialogflow)", hi: "आवाज़ या टेक्स्ट से पूछें (Dialogflow)",
    ta: "குரல் அல்லது உரையால் கேளுங்கள் (Dialogflow)", te: "వాయిస్ లేదా టెక్స్ట్‌తో అడగండి (Dialogflow)",
    mr: "आवाज किंवा मजकूराने विचारा (Dialogflow)", pa: "ਆਵਾਜ਼ ਜਾਂ ਟੈਕਸਟ ਨਾਲ ਪੁੱਛੋ (Dialogflow)",
    bn: "কণ্ঠ বা টেক্সট দিয়ে জিজ্ঞাসা করুন (Dialogflow)", kn: "ಧ್ವನಿ ಅಥವಾ ಪಠ್ಯದ ಮೂಲಕ ಕೇಳಿ (Dialogflow)",
    ml: "ശബ്ദം അല്ലെങ്കിൽ ടെക്സ്റ്റ് വഴി ചോദിക്കുക (Dialogflow)", gu: "અવાજ અથવા ટેક્સ્ટ દ્વારા પૂછો (Dialogflow)",
  },
  send: {
    en: "Send", hi: "भेजें", ta: "அனுப்பு", te: "పంపండి", mr: "पाठवा", pa: "ਭੇਜੋ",
    bn: "পাঠান", kn: "ಕಳುಹಿಸಿ", ml: "അയയ്ക്കുക", gu: "મોકલો",
  },
};

export function t(key: string, lang: Lang): string {
  return D[key]?.[lang] ?? D[key]?.en ?? key;
}

// Browser Web Speech synthesis — the offline fallback when Cloud TTS
// (backend /api/tts) is not configured. See lib/voice.ts for the
// capability-aware wrapper that picks between the two.
export function speak(text: string, lang: Lang) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.slice(0, 600));
  u.lang = SPEECH_LOCALE[lang];
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
