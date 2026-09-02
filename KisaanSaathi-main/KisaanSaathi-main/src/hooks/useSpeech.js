import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useSpeech() {
 const { lang } = useLanguage();
 const [listening, setListening] = useState(false);
 const [transcript, setTranscript] = useState('');
 const [speaking, setSpeaking] = useState(false);
 const recRef = useRef(null);

 useEffect(() => {
 return () => {
 if (recRef.current) {
 try { recRef.current.abort(); } catch (e) {}
 }
 if (typeof window !== 'undefined' && window.speechSynthesis) {
 window.speechSynthesis.cancel();
 }
 };
 }, []);

 const startListening = (onResultCallback) => {
 const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

 // Cross-Browser Fallback for iOS Safari / Firefox / Opera without WebSpeech API
 if (!SR) {
 console.warn("Native SpeechRecognition unavailable in this browser. Activating prompt fallback.");
 const promptTitle = lang.code === 'hi-IN'
 ? 'अपना कृषि सवाल या जानकारी लिखें:'
 : lang.code === 'or-IN'
 ? 'ଆପଣଙ୍କ କୃଷି ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ:'
 : 'Enter your farming question or details:';
 
 const userText = prompt(promptTitle, lang.code === 'hi-IN' ? 'मेरी फसल की हालत कैसी है?' : 'ମୋ ଫସଲ ସ୍ଥିତି କେମିତି ଅଛି?');
 if (userText && userText.trim()) {
 setTranscript(userText.trim());
 if (onResultCallback) onResultCallback(userText.trim());
 }
 return;
 }

 try {
 if (recRef.current) {
 recRef.current.abort();
 }

 const rec = new SR();
 rec.lang = lang.code || 'hi-IN'; // e.g. hi-IN, or-IN, en-IN
 rec.continuous = false;
 rec.interimResults = false;

 rec.onstart = () => {
 setListening(true);
 };

 rec.onresult = (e) => {
 const text = e.results[0][0].transcript;
 setTranscript(text);
 if (onResultCallback) onResultCallback(text);
 };

 rec.onend = () => {
 setListening(false);
 };

 rec.onerror = (err) => {
 console.warn("Speech recognition error:", err);
 setListening(false);
 };

 recRef.current = rec;
 rec.start();
 } catch (e) {
 console.error("Failed to start speech recognition:", e);
 setListening(false);
 }
 };

 const stopListening = () => {
 if (recRef.current) {
 try { recRef.current.stop(); } catch (e) {}
 }
 setListening(false);
 };

 const speak = (text) => {
 if (typeof window === 'undefined' || !window.speechSynthesis) return;

 window.speechSynthesis.cancel();

 // Sanitize markdown tags, HTML symbols, asterisks, brackets, and emojis before speaking
 const cleanText = text
 .replace(/<[^>]*>?/gm, '') // Remove HTML tags
 .replace(/[*_#~[\]()]/g, '') // Remove markdown symbols
 .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Remove emojis
 .trim();

 if (!cleanText) return;

 const utter = new SpeechSynthesisUtterance(cleanText);
 utter.lang = lang.code || 'hi-IN';
 utter.rate = 0.95; // Slightly slower for clarity
 utter.pitch = 1.0;

 // Match best native voice for language
 const voices = window.speechSynthesis.getVoices();
 const langPrefix = (lang.code || 'hi-IN').split('-')[0];
 const matchedVoice = voices.find(v => v.lang.startsWith(langPrefix));
 if (matchedVoice) {
 utter.voice = matchedVoice;
 }

 utter.onstart = () => setSpeaking(true);
 utter.onend = () => setSpeaking(false);
 utter.onerror = () => setSpeaking(false);

 window.speechSynthesis.speak(utter);
 };

 const stopSpeaking = () => {
 if (typeof window !== 'undefined' && window.speechSynthesis) {
 window.speechSynthesis.cancel();
 setSpeaking(false);
 }
 };

 return {
 listening,
 speaking,
 transcript,
 setTranscript,
 startListening,
 stopListening,
 speak,
 stopSpeaking
 };
}
