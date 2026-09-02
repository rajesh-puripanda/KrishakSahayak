import re
import unicodedata
from difflib import SequenceMatcher

# Prepared demo questions, variations, and high-reliability agricultural advice answers
DEMO_DATABASE = [
    {
        "id": "crop_condition",
        "category": "condition",
        "hindi": {
            "canonical_question": "मेरी फसल की हालत कैसी है?",
            "answer": "आपकी फसल में थोड़ा तनाव दिखाई दे रहा है। मिट्टी में नमी कम है और बारिश की संभावना भी कम है। अगले एक-दो दिन में हल्की सिंचाई कर दें और पत्तियों का रंग ध्यान से देखें।",
            "variations": [
                "मेरी फसल की हालत कैसी है",
                "मेरी फसल की हालत कैसी है?",
                "फसल कैसी चल रही है",
                "फसल कैसी चल रही है?",
                "मेरी फसल ठीक है",
                "मेरी फसल ठीक है?",
                "फसल में कोई परेशानी है",
                "फसल में कोई परेशानी है?",
                "मेरी फसल में क्या समस्या है",
                "मेरी फसल में क्या समस्या है?",
                "फसल कैसी है",
                "खेत की हालत कैसी है",
                "धान की फसल कैसी है",
                "मेरी फसल का हाल बताओ",
                "फसल की स्थिति कैसी है",
                "फसल में कोई दिक्कत है क्या",
                "meri fasal ki halat kaisi hai",
                "fasal kaisi hai"
            ],
            "keywords": ["हालत", "कैसी", "ठीक", "परेशानी", "समस्या", "हाल", "स्थिति", "दिक्कत", "फसल"]
        },
        "odia": {
            "canonical_question": "ମୋ ଫସଲର ଅବସ୍ଥା କେମିତି ଅଛି?",
            "answer": "ଆପଣଙ୍କ ଫସଲରେ ଟିକେ ଚାପ ଦେଖାଯାଉଛି। ମାଟିରେ ଆର୍ଦ୍ରତା କମ୍ ଅଛି ଏବଂ ବର୍ଷାର ସମ୍ଭାବନା ମଧ୍ୟ କମ୍। ଆସନ୍ତା ଏକ ଦୁଇ ଦିନ ମଧ୍ୟରେ ହାଲୁକା ସିଞ୍ଚାଇ କରନ୍ତୁ।",
            "variations": [
                "ମୋ ଫସଲର ଅବସ୍ଥା କେମିତି ଅଛି",
                "ମୋ ଫସଲର ଅବସ୍ଥା କେମିତି ଅଛି?",
                "ଫସଲ କେମିତି ଅଛି",
                "ଫସଲ କେମିତି ଅଛି?",
                "ମୋ ଫସଲ ଠିକ ଅଛି ତ",
                "ମୋ ଫସଲ ଠିକ୍ ଅଛି ତ?",
                "ଫସଲରେ କିଛି ଅସୁବିଧା ଅଛି କି",
                "ଫସଲରେ କିଛି ଅସୁବିଧା ଅଛି କି?",
                "ମୋ ଫସଲରେ କଣ ସମସ୍ୟା ଅଛି",
                "ମୋ ଧାନ ଫସଲ କେମିତି ଅଛି",
                "ଜମିର ଅବସ୍ଥା କେମିତି",
                "ମୋ ଫସଲ ଭଲ ଅଛି ତ",
                "mo phasala kemiti achi",
                "fasala kemiti achi"
            ],
            "keywords": ["ଅବସ୍ଥା", "କେମିତି", "ଠିକ", "ଅସୁବିଧା", "ସମସ୍ୟା", "ଭଲ", "ଫସଲ", "ଜମି"]
        }
    },
    {
        "id": "water_irrigation",
        "category": "water",
        "hindi": {
            "canonical_question": "क्या मेरी फसल को पानी चाहिए?",
            "answer": "हाँ, अभी मिट्टी में नमी थोड़ी कम है और बारिश की संभावना भी कम है। इसलिए अगले एक-दो दिन में हल्की सिंचाई करना अच्छा रहेगा।",
            "variations": [
                "क्या मेरी फसल को पानी चाहिए",
                "क्या मेरी फसल को पानी चाहिए?",
                "पानी देना पड़ेगा क्या",
                "पानी देना पड़ेगा क्या?",
                "खेत में पानी डालूं क्या",
                "खेत में पानी डालूं क्या?",
                "सिंचाई की जरूरत है क्या",
                "सिंचाई की जरूरत है क्या?",
                "पानी कब देना चाहिए",
                "पानी कब देना चाहिए?",
                "खेत में पानी कब दूं",
                "सिंचाई कब करूं",
                "क्या पानी की जरूरत है",
                "पानी देना है क्या",
                "kya pani chahiye",
                "pani kab du",
                "sinchai kab kare"
            ],
            "keywords": ["पानी", "सिंचाई", "नमी", "सींचना", "जल", "पानी देना"]
        },
        "odia": {
            "canonical_question": "ମୋ ଫସଲକୁ ପାଣି ଦରକାର କି?",
            "answer": "ହଁ, ଏବେ ମାଟିରେ ଆର୍ଦ୍ରତା ଟିକେ କମ୍ ଅଛି ଏବଂ ବର୍ଷାର ସମ୍ଭାବନା ମଧ୍ୟ କମ୍। ତେଣୁ ଆସନ୍ତା ଏକ ଦୁଇ ଦିନ ମଧ୍ୟରେ ହାଲୁକା ସିଞ୍ଚାଇ କରିବା ଭଲ।",
            "variations": [
                "ମୋ ଫସଲକୁ ପାଣି ଦରକାର କି",
                "ମୋ ଫସଲକୁ ପାଣି ଦରକାର କି?",
                "ପାଣି ମଡାଇବାକୁ ପଡିବ କି",
                "ପାଣି ମଡାଇବା ଦରକାର କି?",
                "ଜମିରେ ପାଣି ଦେବି କି",
                "କେବେ ସିଞ୍ଚାଇ କରିବି",
                "ପାଣି ଦେବା ଦରକାର କି",
                "ଜମିକୁ ପାଣି ଦରକାର କି",
                "କେତେବେଳେ ପାଣି ଦେବି",
                "pani darkar ki",
                "sinchai karibi ki"
            ],
            "keywords": ["ପାଣି", "ସିଞ୍ଚାଇ", "ମଡାଇବା", "ଦରକାର", "ଆର୍ଦ୍ରତା"]
        }
    },
    {
        "id": "fertilizer",
        "category": "fertilizer",
        "hindi": {
            "canonical_question": "कौन सी खाद डालूं?",
            "answer": "अभी बहुत ज्यादा खाद डालने की जरूरत नहीं है। पहले खेत में नमी बनाए रखें। जरूरत महसूस होने पर थोड़ी मात्रा में नाइट्रोजन वाली खाद दें और सप्ताह में एक बार से ज्यादा न डालें।",
            "variations": [
                "कौन सी खाद डालूं",
                "कौन सी खाद डालूं?",
                "खाद की जरूरत है क्या",
                "खाद की जरूरत है क्या?",
                "यूरिया डालूं क्या",
                "यूरिया डालूं क्या?",
                "फसल में कौन सी खाद देनी चाहिए",
                "खाद कब डालना है",
                "कितनी खाद डालूं",
                "क्या खाद डालना चाहिए",
                "खाद कौन सी अच्छी रहेगी",
                "उर्वरक कौन सा डालूं",
                "khad konsi dalu",
                "urea dalu kya"
            ],
            "keywords": ["खाद", "यूरिया", "उर्वरक", "नाइट्रोजन", "डीएपी", "पोषक"]
        },
        "odia": {
            "canonical_question": "କେଉଁ ସାର ଦେବି?",
            "answer": "ଏବେ ଅଧିକ ସାର ଦେବାର ଆବଶ୍ୟକତା ନାହିଁ। ପ୍ରଥମେ ମାଟିରେ ଆର୍ଦ୍ରତା ରଖନ୍ତୁ। ଆବଶ୍ୟକ ହେଲେ ଅଳ୍ପ ପରିମାଣରେ ନାଇଟ୍ରୋଜେନ୍ ସାର ଦିଅନ୍ତୁ ଏବଂ ସପ୍ତାହରେ ଥରେରୁ ଅଧିକ ଦିଅନ୍ତୁ ନାହିଁ।",
            "variations": [
                "କେଉଁ ସାର ଦେବି",
                "କେଉଁ ସାର ଦେବି?",
                "ସାର ଦେବା ଦରକାର କି",
                "ସାର ଦେବା ଦରକାର କି?",
                "ୟୁରିଆ ସାର ପକାଇବି କି",
                "କେତେ ସାର ଦେବି",
                "କେଉଁ ସାର ପକାଇବି",
                "ସାର କେବେ ଦେବି",
                "ଜମିରେ ସାର ପକାଇବା ଦରକାର କି",
                "sar kouthi debi",
                "keu sara debi"
            ],
            "keywords": ["ସାର", "ୟୁରିଆ", "ନାଇଟ୍ରୋଜେନ୍", "ପକାଇବି", "ଦେବି"]
        }
    },
    {
        "id": "rain_weather",
        "category": "weather",
        "hindi": {
            "canonical_question": "बारिश होगी क्या?",
            "answer": "अभी बारिश की संभावना कम है। इसलिए केवल बारिश के भरोसे न रहें और मिट्टी की नमी कम होने पर सिंचाई कर दें।",
            "variations": [
                "बारिश होगी क्या",
                "बारिश होगी क्या?",
                "क्या बारिश आने वाली है",
                "मौसम कैसा रहेगा",
                "मौसम कैसा रहेगा?",
                "आज बारिश होगी क्या",
                "कल बारिश होगी",
                "क्या आज पानी बरसेगा",
                "बारिश कब होगी",
                "मौसम का हाल क्या है",
                "barish hogi kya",
                "mausam kaisa rahega"
            ],
            "keywords": ["बारिश", "मौसम", "बरसात", "बरसेगा", "बादल", "तापमान", "पानी बरसना"]
        },
        "odia": {
            "canonical_question": "ବର୍ଷା ହେବ କି?",
            "answer": "ଏବେ ବର୍ଷାର ସମ୍ଭାବନା କମ୍ ଅଛି। ତେଣୁ କେବଳ ବର୍ଷା ଉପରେ ଭରସା ନକରି ମାଟିର ଆର୍ଦ୍ରତା କମିଲେ ସିଞ୍ଚାଇ କରନ୍ତୁ।",
            "variations": [
                "ବର୍ଷା ହେବ କି",
                "ବର୍ଷା ହେବ କି?",
                "ବର୍ଷା ଆସିବ କି",
                "ପାଗ କେମିତି ରହିବ",
                "ପାଗ କେମିତି ରହିବ?",
                "ଆଜି ବର୍ଷା ହେବ କି",
                "କାଲି ବର୍ଷା ହେବ କି",
                "ଆଜି ପାଣି ହେବ କି",
                "ବର୍ଷା କେବେ ହେବ",
                "barsa heba ki",
                "paga kemiti rahiba"
            ],
            "keywords": ["ବର୍ଷା", "ପାଗ", "ମେଘ", "ବର୍ଷିବ", "ପାଣି ହେବ"]
        }
    },
    {
        "id": "pest_disease_stress",
        "category": "stress",
        "hindi": {
            "canonical_question": "पत्तियों में कोई बीमारी या कीड़ा लगा है क्या?",
            "answer": "फसल में हल्का तनाव है और पत्तियां थोड़ी मुरझाई दिख रही हैं। पहले खेत में हल्की सिंचाई करें। अगर पत्तियों पर कीड़ों के लक्षण दिखें तो स्थानीय कृषि अधिकारी से सलाह लेकर ही दवा का छिड़काव करें।",
            "variations": [
                "पत्तियों में कोई बीमारी है क्या",
                "पत्तियों का रंग पीला क्यों हो रहा है",
                "कीड़ा लगा है क्या",
                "कीट लगा है क्या",
                "फसल में कोई बीमारी है क्या",
                "पत्तियां पीली हो रही हैं",
                "दवा का छिड़काव करूं क्या",
                "keeda laga hai kya",
                "bimari hai kya"
            ],
            "keywords": ["बीमारी", "कीड़ा", "कीट", "पीली", "मुरझाई", "छिड़काव", "दवा", "पत्ती", "पत्तियों"]
        },
        "odia": {
            "canonical_question": "ପତ୍ରରେ କିଛି ରୋଗ ବା ପୋକ ଲାଗିଛି କି?",
            "answer": "ଫସଲରେ ସାମାନ୍ୟ ଚାପ ଅଛି ଏବଂ ପତ୍ରଗୁଡ଼ିକ ଟିକେ ମଉଳି ଯାଇଛି। ପ୍ରଥମେ ହାଲୁକା ସିଞ୍ଚାଇ କରନ୍ତୁ। ଯଦି ପୋକର ଲକ୍ଷଣ ଦେଖାଯାଏ ତେବେ ସ୍ଥାନୀୟ କୃଷି ଅଧିକାରୀଙ୍କ ପରାମର୍ଶ ନେଇ ଔଷଧ ସିଞ୍ଚନ କରନ୍ତୁ।",
            "variations": [
                "ପତ୍ରରେ କିଛି ରୋଗ ଅଛି କି",
                "ପତ୍ର ହଳଦିଆ ପଡୁଛି କାହିଁକି",
                "ପୋକ ଲାଗିଛି କି",
                "ଫସଲରେ କିଛି ରୋଗ ଅଛି କି",
                "ଔଷଧ ସିଞ୍ଚନ କରିବି କି",
                "poka lagichi ki",
                "roga achi ki"
            ],
            "keywords": ["ରୋଗ", "ପୋକ", "ହଳଦିଆ", "ମଉଳି", "ଔଷଧ", "ପତ୍ର", "ସିଞ୍ଚନ"]
        }
    }
]

def clean_text(text: str) -> str:
    """Normalize text: strip, lowercase, remove punctuation and extra spaces."""
    if not text:
        return ""
    text = unicodedata.normalize('NFKD', text)
    text = re.sub(r'[^\w\s\u0900-\u097F\u0B00-\u0B7F]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip().lower()
    return text

def calculate_similarity(a: str, b: str) -> float:
    """Calculates sequence matcher string similarity between two cleaned strings."""
    return SequenceMatcher(None, clean_text(a), clean_text(b)).ratio()

def detect_language(text: str, default_lang: str = "hi") -> str:
    """Detects if text contains Odia characters (U+0B00 to U+0B7F) or Hindi (U+0900 to U+097F)."""
    odia_chars = sum(1 for ch in text if '\u0B00' <= ch <= '\u0B7F')
    hindi_chars = sum(1 for ch in text if '\u0900' <= ch <= '\u097F')
    
    if odia_chars > 0 and odia_chars >= hindi_chars:
        return "or"
    if hindi_chars > 0 and hindi_chars > odia_chars:
        return "hi"
    return default_lang

def find_best_demo_match(query: str, preferred_lang: str = "hi") -> tuple:
    """
    Finds the best matching demo question and answer using multi-strategy fuzzy matching:
    1. Exact / High fuzzy variation match
    2. Substring containment
    3. Keyword overlap score
    
    Returns (item_id, answer_text, confidence_score, matched_lang)
    """
    cleaned_query = clean_text(query)
    lang = detect_language(query, default_lang=preferred_lang)
    lang_key = "odia" if lang in ("or", "odia") else "hindi"
    
    best_match = None
    highest_score = 0.0
    
    query_words = set(cleaned_query.split())
    
    for item in DEMO_DATABASE:
        lang_data = item.get(lang_key, {})
        if not lang_data:
            continue
            
        # Strategy 1: Check variations similarity
        for variation in lang_data.get("variations", []):
            cleaned_var = clean_text(variation)
            # Exact match
            if cleaned_query == cleaned_var:
                return item["id"], lang_data["answer"], 1.0, lang_key
                
            # Direct substring match
            if cleaned_var in cleaned_query or cleaned_query in cleaned_var:
                ratio = max(len(cleaned_var), len(cleaned_query)) / (max(len(cleaned_var), len(cleaned_query)) + 1)
                score = 0.85 + (0.1 * ratio)
                if score > highest_score:
                    highest_score = score
                    best_match = (item["id"], lang_data["answer"], highest_score, lang_key)
            
            # Fuzzy ratio
            sim = calculate_similarity(cleaned_query, cleaned_var)
            if sim > highest_score:
                highest_score = sim
                best_match = (item["id"], lang_data["answer"], highest_score, lang_key)
                
        # Strategy 2: Keyword overlap
        keywords = lang_data.get("keywords", [])
        matched_kw = sum(1 for kw in keywords if clean_text(kw) in cleaned_query or any(clean_text(kw) in w for w in query_words))
        if matched_kw > 0:
            kw_score = min(0.9, 0.45 + (0.2 * matched_kw))
            if kw_score > highest_score:
                highest_score = kw_score
                best_match = (item["id"], lang_data["answer"], highest_score, lang_key)
                
    if best_match and highest_score >= 0.50:
        return best_match
        
    return None, None, highest_score, lang_key

def get_demo_prompt_chips(language: str = "hi") -> list:
    """Returns curated demo questions for quick-tap testing on UI."""
    lang_key = "odia" if language in ("or", "odia") else "hindi"
    chips = []
    for item in DEMO_DATABASE:
        lang_data = item.get(lang_key, {})
        if lang_data:
            chips.append({
                "id": item["id"],
                "category": item["category"],
                "question": lang_data["canonical_question"],
                "answer": lang_data["answer"]
            })
    return chips
