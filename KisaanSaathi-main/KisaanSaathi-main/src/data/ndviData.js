// Satallite NDVI Telemetry & Field Polygon Data Store for KisaanSaathi

export const FARMER_NDVI_PROFILES = {
 1: { // Ramesh Nayak - Balipatna (Tomato)
 farmerId: 1,
 name: "Ramesh Nayak",
 village: "Balipatna",
 district: "Khurda",
 crop: "Tomato",
 acres: 2.5,
 areaHa: 1.01,
 center: [20.1785, 85.8920],
 polygon: [
 [20.1792, 85.8912],
 [20.1795, 85.8930],
 [20.1778, 85.8935],
 [20.1772, 85.8918]
 ],
 ndviScore: 0.83,
 ndviMax: 0.88,
 healthRating: "Optimal Vigor",
 healthPillClass: "good",
 nitrogenStatus: {
 "en-IN": "Nitrogen levels are optimal. Hold top-dressing N fertilizer to prevent crop lodging.",
 "hi-IN": "नाइट्रोजन का स्तर इष्टतम है। फसल को गिरने से बचाने के लिए यूरिया का छिड़काव रोकें।",
 "or-IN": "ନାଇଟ୍ରୋଜେନ୍ ସ୍ତର ଉତ୍ତମ ଅଛି। ଫସଲ ନଟଳିବା ପାଇଁ ୟୁରିଆ ପ୍ରୟୋଗ ସ୍ଥଗିତ ରଖନ୍ତୁ।"
 },
 moistureStatus: {
 "en-IN": "Transpiration rates are steady. Maintain baseline drip irrigation schedule.",
 "hi-IN": "वाष्पोत्सर्जन दर स्थिर है। ड्रिप सिंचाई अनुसूची बनाए रखें।",
 "or-IN": "ବାଷ୍ପୀକରଣ ହାର ସ୍ଥିର ଅଛି। ଡ୍ରିପ୍ ଜଳସେଚନ ଜାରି ରଖନ୍ତୁ।"
 },
 actionPlan: {
 "en-IN": "Field (1.01 HA) is in peak condition. Conduct edge scouting for high canopy humidity to prevent fungal/rust onset.",
 "hi-IN": "खेतः 1.01 हेक्टेयर शीर्ष स्थिति में है। फंगल/रस्ट से बचाव के लिए खेतों के किनारों का निरीक्षण करें।",
 "or-IN": "ଜମି (୧.୦୧ ହେକ୍ଟର) ଉତ୍ତମ ସ୍ଥିତିରେ ଅଛି। ଫଙ୍ଗସ୍ ସଂକ୍ରମଣରୁ ରକ୍ଷା ପାଇଁ କ୍ଷେତ୍ର ନିରୀକ୍ଷଣ କରନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.28, 0.42, 0.58, 0.71, 0.81, 0.84, 0.83, 0.83],
 nirHistory: [0.15, 0.30, 0.48, 0.62, 0.74, 0.78, 0.75, 0.72],
 rgbHistory: [0.10, 0.18, 0.25, 0.32, 0.38, 0.40, 0.39, 0.38]
 },
 2: { // Sunita Behera - Khurda (Onion)
 farmerId: 2,
 name: "Sunita Behera",
 village: "Khurda",
 district: "Khurda",
 crop: "Onion",
 acres: 3.0,
 areaHa: 1.21,
 center: [20.1830, 85.6210],
 polygon: [
 [20.1838, 85.6200],
 [20.1842, 85.6222],
 [20.1822, 85.6228],
 [20.1818, 85.6205]
 ],
 ndviScore: 0.58,
 ndviMax: 0.66,
 healthRating: "Moderate Stress",
 healthPillClass: "warn",
 nitrogenStatus: {
 "en-IN": "Chlorophyll deficit detected in yellow patch zones. Targeted Variable-Rate Nitrogen required.",
 "hi-IN": "पीले धब्बे वाले क्षेत्रों में क्लोरोफिल की कमी। लक्षित नाइट्रोजन छिड़काव की आवश्यकता।",
 "or-IN": "ହଳଦିଆ ଚିହ୍ନ ଥିବା ସ୍ଥାନରେ କ୍ଲୋରୋଫିଲ୍ ଅଭାବ। ସଠିକ୍ ପରିମାଣର ନାଇଟ୍ରୋଜେନ୍ ସାର ଆବଶ୍ୟକ।"
 },
 moistureStatus: {
 "en-IN": "Mid-season moisture stress detected in field center.",
 "hi-IN": "खेत के केंद्र में मध्यम नमी की कमी देखी गई।",
 "or-IN": "ଜମିର ମଝି ଭାଗରେ ଜଳାଭାବ ପରିଲକ୍ଷିତ ହୋଇଛି।"
 },
 actionPlan: {
 "en-IN": "Apply 25-30 kg/ha Neem Coated Urea on low-vigor patches. Increase micro-irrigation by +15% over the next 5 days.",
 "hi-IN": "कम बढ़त वाले हिस्सों पर 25-30 किग्रा/हेक्टेयर नीम लेपित यूरिया दें। अगले 5 दिनों में सिंचाई 15% बढ़ाएं।",
 "or-IN": "ଦୁର୍ବଳ ଅଞ୍ଚଳରେ ୨୫-୩୦ କିଗ୍ରା/ହେକ୍ଟର ୟୁରିଆ ଦିଅନ୍ତୁ। ଆଗାମୀ ୫ ଦିନ ମଧ୍ୟରେ ଜଳସେଚନ ୧୫% ବୃଦ୍ଧି କରନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.22, 0.35, 0.45, 0.52, 0.59, 0.62, 0.58, 0.58],
 nirHistory: [0.12, 0.24, 0.36, 0.44, 0.50, 0.53, 0.49, 0.48],
 rgbHistory: [0.08, 0.14, 0.20, 0.26, 0.30, 0.32, 0.31, 0.30]
 },
 3: { // Manoj Sahoo - Balipatna (Wheat)
 farmerId: 3,
 name: "Manoj Sahoo",
 village: "Balipatna",
 district: "Khurda",
 crop: "Wheat",
 acres: 5.0,
 areaHa: 2.02,
 center: [20.1720, 85.8850],
 polygon: [
 [20.1730, 85.8835],
 [20.1735, 85.8865],
 [20.1708, 85.8870],
 [20.1702, 85.8840]
 ],
 ndviScore: 0.79,
 ndviMax: 0.85,
 healthRating: "High Density Canopy",
 healthPillClass: "good",
 nitrogenStatus: {
 "en-IN": "Excellent chlorophyll absorption across the wheat crop canopy.",
 "hi-IN": "गेहूं की फसल में उत्कृष्ट क्लोरोफिल अवशोषण दर्ज।",
 "or-IN": "ଗହମ ଫସଲରେ କ୍ଲୋରୋଫିଲ୍ ଶୋଷଣ ଖୁବ୍ ଭଲ ରହିଛି।"
 },
 moistureStatus: {
 "en-IN": "Soil moisture is well balanced following canal release.",
 "hi-IN": "नहर के पानी के बाद मिट्टी की नमी अच्छी तरह संतुलित है।",
 "or-IN": "କେନାଲ ପାଣି ଆସିବା ପରେ ମାଟିର ଆର୍ଦ୍ରତା ଠିକ୍ ଅଛି।"
 },
 actionPlan: {
 "en-IN": "Crop growth index is very strong. Prepare for mid-stage flowering spray of potassium nitrate (13-0-45 @ 1%).",
 "hi-IN": "फसल वृद्धि सूचकांक बहुत मजबूत है। फूल आने पर पोटेशियम नाइट्रेट (13-0-45 @ 1%) छिड़काव की तैयारी करें।",
 "or-IN": "ଫସଲ ବୃଦ୍ଧି ହାର ଖୁବ୍ ଭଲ। ଫୁଲ ଆସିବା ସମୟରେ ପଟାସିୟମ୍ ନାଇଟ୍ରେଟ୍ ସ୍ପ୍ରେ କରନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.30, 0.46, 0.62, 0.74, 0.80, 0.82, 0.81, 0.79],
 nirHistory: [0.18, 0.32, 0.50, 0.65, 0.72, 0.76, 0.73, 0.71],
 rgbHistory: [0.12, 0.20, 0.28, 0.35, 0.40, 0.42, 0.41, 0.39]
 },
 4: { // Laxmi Pradhan - Tangi (Tomato)
 farmerId: 4,
 name: "Laxmi Pradhan",
 village: "Tangi",
 district: "Khurda",
 crop: "Tomato",
 acres: 1.8,
 areaHa: 0.73,
 center: [19.9540, 85.4050],
 polygon: [
 [19.9548, 85.4040],
 [19.9552, 85.4060],
 [19.9532, 85.4065],
 [19.9528, 85.4045]
 ],
 ndviScore: 0.61,
 ndviMax: 0.69,
 healthRating: "Moderate Vigor",
 healthPillClass: "warn",
 nitrogenStatus: {
 "en-IN": "Moderate nitrogen deficiency in north quadrant.",
 "hi-IN": "उत्तरी हिस्से में मध्यम नाइट्रोजन की कमी।",
 "or-IN": "ଉତ୍ତର ଭାଗରେ ନାଇଟ୍ରୋଜେନ୍ ଅଭାବ ଦେଖାଦେଇଛି।"
 },
 moistureStatus: {
 "en-IN": "Dry soil upper layer due to high ambient heat.",
 "hi-IN": "उच्च तापमान के कारण मिट्टी की ऊपरी परत सूखी है।",
 "or-IN": "ଅଧିକ ଖରା ହେତୁ ମାଟିର ଉପର ପରସ୍ତ ଶୁଖିଯାଇଛି।"
 },
 actionPlan: {
 "en-IN": "Perform evening irrigation and spray micronutrient mixture (Zinc + Boron 2g/L).",
 "hi-IN": "शाम के समय सिंचाई करें और सूक्ष्म पोषक तत्व (जिंक + बोरोन 2 ग्राम/लीटर) का छिड़काव करें।",
 "or-IN": "ସନ୍ଧ୍ୟା ସମୟରେ ଜଳସେଚନ କରନ୍ତୁ ଏବଂ ଜିଙ୍କ୍ + ବୋରୋନ୍ ସ୍ପ୍ରେ କରନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.20, 0.32, 0.44, 0.55, 0.63, 0.65, 0.62, 0.61],
 nirHistory: [0.10, 0.22, 0.34, 0.46, 0.52, 0.54, 0.51, 0.50],
 rgbHistory: [0.07, 0.13, 0.19, 0.25, 0.29, 0.31, 0.30, 0.29]
 },
 5: { // Bikash Rout - Chilika (Paddy)
 farmerId: 5,
 name: "Bikash Rout",
 village: "Chilika",
 district: "Khurda",
 crop: "Paddy",
 acres: 4.0,
 areaHa: 1.62,
 center: [19.8210, 85.3120],
 polygon: [
 [19.8220, 85.3108],
 [19.8225, 85.3132],
 [19.8200, 85.3138],
 [19.8195, 85.3114]
 ],
 ndviScore: 0.33,
 ndviMax: 0.41,
 healthRating: "Critical Deficit",
 healthPillClass: "alert",
 nitrogenStatus: {
 "en-IN": "Severe biomass stunting & nitrogen depletion caused by 51% drought deficit.",
 "hi-IN": "51% सूखा घाटे के कारण पौधों की वृद्धि में गंभीर रुकावट और नाइट्रोजन की कमी।",
 "or-IN": "୫୧% ମରୁଡ଼ି ଯୋଗୁଁ ଗଛ ବଢ଼ିପାରୁନାହିଁ ଏବଂ ନାଇଟ୍ରୋଜେନ୍ ଅଭାବ ଅତ୍ୟଧିକ।"
 },
 moistureStatus: {
 "en-IN": "Severe soil drought stress. Root zone moisture critically low.",
 "hi-IN": "गंभीर मिट्टी सूखा। जड़ों में नमी का स्तर बेहद कम।",
 "or-IN": "ମାଟି ଅତ୍ୟଧିକ ଶୁଖିଯାଇଛି। ଚେର ପାଖରେ ପାଣି ନାହିଁ।"
 },
 actionPlan: {
 "en-IN": "IMMEDIATE FIELD INSPECTION REQUIRED: Trigger PMFBY drought loss survey & deploy emergency solar pump water relief.",
 "hi-IN": "तत्काल क्षेत्र निरीक्षण आवश्यक: फसल बीमा (PMFBY) सूखा सर्वेक्षण शुरू करें और सौर पंप से पानी दें।",
 "or-IN": "ତୁରନ୍ତ କ୍ଷେତ୍ର ପରିଦର୍ଶନ ଆବଶ୍ୟକ: ଫସଲ ବୀମା (PMFBY) ସର୍ଭେ କରନ୍ତୁ ଏବଂ ଜରୁରୀ ଜଳସେଚନ ଯୋଗାନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.18, 0.25, 0.32, 0.38, 0.36, 0.35, 0.34, 0.33],
 nirHistory: [0.09, 0.15, 0.22, 0.28, 0.26, 0.24, 0.23, 0.22],
 rgbHistory: [0.06, 0.10, 0.15, 0.19, 0.20, 0.21, 0.20, 0.20]
 },
 6: { // Anita Jena - Khurda (Onion)
 farmerId: 6,
 name: "Anita Jena",
 village: "Khurda",
 district: "Khurda",
 crop: "Onion",
 acres: 2.0,
 areaHa: 0.81,
 center: [20.1890, 85.6150],
 polygon: [
 [20.1898, 85.6140],
 [20.1902, 85.6162],
 [20.1882, 85.6168],
 [20.1878, 85.6146]
 ],
 ndviScore: 0.87,
 ndviMax: 0.91,
 healthRating: "Optimal Health",
 healthPillClass: "good",
 nitrogenStatus: {
 "en-IN": "Saturated chlorophyll indices. Excellent leaf color and bulb development.",
 "hi-IN": "क्लोरोफिल सूचकांक बहुत अच्छा। पत्तियों का रंग और कंद विकास उत्कृष्ट।",
 "or-IN": "କ୍ଲୋରୋଫିଲ୍ ସ୍ତର ଅତି ଉତ୍ତମ। ପତ୍ରର ରଙ୍ଗ ଓ ପିଆଜ ବୃଦ୍ଧି ଖୁବ୍ ଭଲ।"
 },
 moistureStatus: {
 "en-IN": "Solar micro-pump providing consistent moisture profile.",
 "hi-IN": "सौर माइक्रो-पंप लगातार नमी प्रदान कर रहा है।",
 "or-IN": "ସୋଲାର୍ ପମ୍ପ୍ ଦ୍ୱାରା ନିୟମିତ ଜଳସେଚନ ହେଉଛି।"
 },
 actionPlan: {
 "en-IN": "Field is in top condition. Stop nitrogen application 15 days before bulb harvesting.",
 "hi-IN": "खेत बहुत अच्छी स्थिति में है। प्याज की कटाई से 15 दिन पहले नाइट्रोजन देना बंद कर दें।",
 "or-IN": "ଜମି ସମ୍ପୂର୍ଣ୍ଣ ଭଲ ଅଛି। ଅମଳର ୧୫ ଦିନ ପୂର୍ବରୁ ସାର ଦେବା ବନ୍ଦ କରନ୍ତୁ।"
 },
 historyDates: ['May 15', 'Jun 01', 'Jun 15', 'Jul 01', 'Jul 15', 'Aug 01', 'Aug 15', 'Aug 28'],
 ndviHistory: [0.32, 0.48, 0.65, 0.78, 0.85, 0.89, 0.88, 0.87],
 nirHistory: [0.20, 0.35, 0.52, 0.68, 0.75, 0.80, 0.78, 0.77],
 rgbHistory: [0.12, 0.22, 0.30, 0.38, 0.42, 0.45, 0.44, 0.43]
 }
};

export function getFarmerNdviProfile(farmerId) {
 return FARMER_NDVI_PROFILES[farmerId] || FARMER_NDVI_PROFILES[1];
}

// Localized Suggested Voice Prompt Chips for Farmers
export const DEMO_VOICE_PROMPTS = {
 "en-IN": [
 { question: "What is my field NDVI canopy score?" },
 { question: "Do I need to apply Urea fertilizer right now?" },
 { question: "Is my crop facing moisture or drought stress?" },
 { question: "Show tomato mandi prices in nearby markets" }
 ],
 "hi-IN": [
 { question: "मेरी फसल का NDVI स्कोर और स्वास्थ्य कैसा है?" },
 { question: "क्या मुझे अभी खेत में यूरिया खाद डालनी चाहिए?" },
 { question: "क्या मेरी फसल में पानी की कमी या सूखा है?" },
 { question: "पास की मंडियों में टमाटर का भाव क्या है?" }
 ],
 "or-IN": [
 { question: "ମୋ ଜମିର NDVI ସ୍କୋର ଓ ଫସଲ ସ୍ଥିତି କେମିତି ଅଛି?" },
 { question: "ମୋତେ ଏବେ ୟୁରିଆ ସାର ଦେବାକୁ ପଡ଼ିବ କି?" },
 { question: "ମୋ ଫସଲରେ ଜଳାଭାବ କିମ୍ବା ମରୁଡ଼ି ସମସ୍ୟା ଅଛି କି?" },
 { question: "ପାଖ ମଣ୍ଡିରେ ଟମାଟୋ ଦର କେତେ ଅଛି?" }
 ]
};

// District Jurisdiction Summary Data for Agricultural Officers
export const JURISDICTION_SUMMARY = {
 district: "Khurda District",
 state: "Odisha",
 totalBlocks: 4,
 totalTrackedFarmers: 6,
 healthyCount: 3, // NDVI >= 0.70
 moderateCount: 2, // NDVI 0.40 - 0.69
 criticalCount: 1, // NDVI < 0.40
 blocks: [
 { name: "Balipatna Block", center: [20.1750, 85.8890], farmersCount: 2, avgNdvi: 0.81, status: "Healthy" },
 { name: "Khurda Sadar Block", center: [20.1860, 85.6180], farmersCount: 2, avgNdvi: 0.725, status: "Healthy" },
 { name: "Tangi Block", center: [19.9535, 85.4052], farmersCount: 1, avgNdvi: 0.61, status: "Moderate Stress" },
 { name: "Chilika Block", center: [19.8210, 85.3120], farmersCount: 1, avgNdvi: 0.33, status: "Critical Drought" }
 ]
};
