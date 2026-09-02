import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useAIAdvisor() {
 const { lang } = useLanguage();
 const [loading, setLoading] = useState(false);

 const askAI = async (query, topicContext = 'general') => {
 if (!query || !query.trim()) return null;

 setLoading(true);
 const qLower = query.toLowerCase();

 let generatedAnswer = null;
 let actionTarget = null;
 let confidence = 'high';

 if (qLower.includes('weather') || qLower.includes('rain') || qLower.includes('बारिश') || qLower.includes('मौसम') || qLower.includes('ବର୍ଷା') || qLower.includes('వర్షం')) {
 actionTarget = 'weather';
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'वर्तमान में 38% वर्षा की कमी है। आज का तापमान 33°C है और अगले 48 घंटों में बारिश की संभावना कम है। कृपया यूरिया का छिड़काव रोकें और ड्रिप सिंचाई का प्रयोग करें।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'ବର୍ତ୍ତମାନ ୩୮% ବର୍ଷା ଅଭାବ ରହିଛି। ଆଜି ତାପମାତ୍ରା ୩୩°C। ପରବର୍ତ୍ତୀ ୨ ଦିନ ମଧ୍ୟରେ ବର୍ଷା ସମ୍ଭାବନା କମ୍, ମାଟିରେ ଆର୍ଦ୍ରତା ରଖିବାକୁ ଜଳସେଚନ କରନ୍ତୁ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'ప్రస్తుతం 38% వర్షపాత లోటు నమోదైంది. ఉష్ణోగ్రత 33°C ఉంది. రాబోయే 2 రోజుల్లో వర్షం తక్కువగా ఉండవచ్చు. బిందు సేద్యం ఉపయోగించండి.';
 } else {
 generatedAnswer = 'Rainfall deficit of 38% is currently recorded in your block. Temperature is 33°C with dry conditions. Delay top-dressing Urea and prioritize root-zone drip irrigation.';
 }
 } else if (qLower.includes('fertilizer') || qLower.includes('खाद') || qLower.includes('urea') || qLower.includes('dap') || qLower.includes('npk') || qLower.includes('ସାର') || qLower.includes('ఎరువులు')) {
 actionTarget = 'fertilizer';
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'फसल के लिए बुआई के समय DAP (50 किग्रा/एकड़) और पोटाश (25 किग्रा) बेसल खुराक के रूप में दें। 25-30 दिन बाद नीम लेपित यूरिया की पहली टॉप ड्रेसिंग करें। विस्तृत गणना के लिए उर्वरक सलाहकार विज़ार्ड देखें।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'ବୁଣିବା ସମୟରେ DAP ଓ ପଟାସ ମୂଳ ସାର ଭାବରେ ଦିଅନ୍ତୁ। ୨୫-୩୦ ଦିନ ପରେ ନିମ୍ କୋଟେଡ୍ ୟୁରିଆ ପ୍ରୟୋଗ କରନ୍ତୁ। ସଠିକ୍ ପରିମାଣ ପାଇଁ ଖତ-ସାର କାଲକୁଲେଟର ଦେଖନ୍ତୁ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'విత్తే సమయంలో DAP మరియు పొటాష్‌ను ప్రాథమిక ఎరువుగా వేయండి. 25-30 రోజుల తర్వాత వేప పూత పూసిన యూరియా వేయండి. ఖచ్చితమైన మోతాదుకు ఎరువుల కాలిక్యులేటర్ చూడండి.';
 } else {
 generatedAnswer = 'For balanced nutrition, apply DAP (50 kg/acre) & MOP (25 kg/acre) as basal dose at sowing. Apply Neem Coated Urea in 2 splits at 25 and 45 days. Use our interactive Fertilizer Wizard below.';
 }
 } else if (qLower.includes('tomato') || qLower.includes('price') || qLower.includes('टमाटर') || qLower.includes('भाव') || qLower.includes('मंडी') || qLower.includes('onion') || qLower.includes('ମଣ୍ଡି') || qLower.includes('మార్కెట్')) {
 actionTarget = 'market';
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'स्थानीय बलिपटना मंडी में टमाटर ₹9/किग्रा तक गिर चुका है, लेकिन भुवनेश्वर मुख्य मंडी (18 किमी) में भाव ₹14/किग्रा और कटक में ₹16/किग्रा है। उपज को नजदीकी बड़े बाजार में ले जाने पर ₹5-7/किग्रा का अतिरिक्त लाभ मिलेगा।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'ସ୍ଥାନୀୟ ମଣ୍ଡିରେ ଟମାଟୋ ଦର ₹୯/କିଗ୍ରା ରହିଛି, କିନ୍ତୁ ଭୁବନେଶ୍ୱର ମୁଖ୍ୟ ମଣ୍ଡିରେ ₹୧୪ ଓ କଟକରେ ₹୧୬ ମିଳୁଛି। ବଡ଼ ମଣ୍ଡିକୁ ନେଲେ ଅଧିକ ଲାଭ ମିଳିବ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'స్థానిక మార్కెట్‌లో టమాటా ధర ₹9/కేజీకి పడిపోయింది, కానీ భువనేశ్వర్ మెయిన్ మార్కెట్‌లో ₹14, కటక్‌లో ₹16 పలుకుతోంది. సమీప పెద్ద మార్కెట్‌కు తీసుకెళ్లడం మంచిది.';
 } else {
 generatedAnswer = 'Local Balipatna mandi tomato rate is down to ₹9/kg (50% crash). However, Bhubaneswar Unit-1 mandi (18km) offers ₹14/kg and Cuttack Malgodown offers ₹16/kg. Consider pooled transport to avoid local distress selling.';
 }
 } else if (qLower.includes('loan') || qLower.includes('कर्ज') || qLower.includes('ऋण') || qLower.includes('kcc') || qLower.includes('interest') || qLower.includes('ଋଣ') || qLower.includes('రుణం')) {
 actionTarget = 'loans';
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'आपके KCC ऋण की अंतिम तिथि अगले 5 दिनों में है। समय पर भुगतान करने पर 3% ब्याज छूट (सब्सिडी) मिलेगी जिससे प्रभावी ब्याज मात्र 4% रहेगा। यदि भुगतान में कठिनाई है तो तुरंत बैंक में पुनर्गठन का आवेदन करें।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'ଆପଣଙ୍କ କେସିସି ଋଣ କିସ୍ତି ୫ ଦିନ ମଧ୍ୟରେ ପରିଶୋଧ କରିବାକୁ ଅଛି। ଠିକ୍ ସମୟରେ ଦେଲେ ୩% ସୁଧ ଛାଡ଼ ମିଳିବ। ଅସୁବିଧା ଥିଲେ ବ୍ୟାଙ୍କରେ ପୁନର୍ଗଠନ ପାଇଁ ଆବେଦନ କରନ୍ତୁ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'మీ KCC పంట రుణం గడువు 5 రోజుల్లో ఉంది. సకాలంలో చెల్లిస్తే 3% వడ్డీ రాయితీ లభిస్తుంది. కష్టంగా ఉంటే బ్యాంక్ ద్వారా రుణ పునర్వ్యవస్థీకరణ కోరవచ్చు.';
 } else {
 generatedAnswer = 'Your KCC loan has a repayment due date in 5 days. Timely repayment qualifies for a 3% prompt repayment interest subvention (effective 4% rate). If facing distress, tap below to request a crop-loss restructuring.';
 }
 } else if (qLower.includes('scheme') || qLower.includes('subsidy') || qLower.includes('योजना') || qLower.includes('बीमा') || qLower.includes('fasal bima') || qLower.includes('ଯୋଜନା') || qLower.includes('పథకాలు')) {
 actionTarget = 'schemes';
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'आप प्रधानमंत्री फसल बीमा योजना (PMFBY) के तहत सूखा और फसल नुकसान के लिए 85% सरकारी सब्सिडी पर बीमा करवा सकते हैं। साथ ही ड्रिप सिंचाई के लिए PMKSY के तहत 55% सब्सिडी उपलब्ध है।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଫସଲ ବୀମା ଯୋଜନା (PMFBY) ରେ ୮୫% ସରକାରୀ ସବସିଡି ସହିତ ଫସଲ ବୀମା କରନ୍ତୁ। ଡ୍ରିପ୍ ଜଳସେଚନ ପାଇଁ ୫୫% ସବସିଡି ଉପଲବ୍ଧ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'PM ఫసల్ బీమా యోజన ద్వారా 85% ప్రభుత్వ రాయితీతో పంట బీమా పొందవచ్చు. సూక్ష్మ సేద్యం (డ్రిప్) కొరకు 55% సబ్సిడీ అందుబాటులో ఉంది.';
 } else {
 generatedAnswer = 'Under PM Fasal Bima Yojana (PMFBY), up to 85% of your crop insurance premium is paid by the Government. For micro-irrigation, PMKSY provides a 55% capital subsidy for smallholders.';
 }
 } else {
 if (lang.code === 'hi-IN') {
 generatedAnswer = 'कृषि सहायक AI: आपकी कृषि स्थिति के अनुसार, कम वर्षा और कीट प्रकोप के समय नीम तेल (1500 ppm @ 3 मिली/लीटर) का छिड़काव करें और मिट्टी में नमी बनाए रखने हेतु पुआल की मल्चिंग अपनाएं।';
 } else if (lang.code === 'or-IN') {
 generatedAnswer = 'କୃଷି ସହାୟକ AI: ବର୍ତ୍ତମାନ ପାଣିପାଗ ଓ ମାଟିର ସ୍ଥିତି ଅନୁସାରେ ନିମ୍ବ ତେଲ ସ୍ପ୍ରେ କରନ୍ତୁ ଏବଂ ମୂଳ ପାଖରେ ମଲଚିଂ ବ୍ୟବହାର କରି ଜଳ ସଂରକ୍ଷଣ କରନ୍ତୁ।';
 } else if (lang.code === 'te-IN') {
 generatedAnswer = 'కృషి సహాయక్ AI: ప్రస్తుత వాతావరణ పరిస్థితుల్లో వేప నూనె (3ml/లీటర్) పిచికారీ చేయండి మరియు నేలలో తేమ నిలిచి ఉండేలా మల్చింగ్ పాటించండి.';
 } else {
 generatedAnswer = 'Krishi Sahayak AI Advisor: For optimal yield under current weather stresses, inspect crop canopy for early sucking pests, apply bio-pesticides (Neem oil 1500ppm @ 3ml/L), and utilize organic mulch to conserve sub-soil moisture.';
 }
 }

 await new Promise(r => setTimeout(r, 600));
 setLoading(false);

 return {
 answer: generatedAnswer,
 actionTarget,
 confidence
 };
 };

 return {
 askAI,
 loading
 };
}
