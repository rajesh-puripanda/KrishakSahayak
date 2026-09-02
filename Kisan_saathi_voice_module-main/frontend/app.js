// --- Agri Voice Assistant Frontend Controller ---

class AgriVoiceApp {
    constructor() {
        this.currentLanguage = 'hi'; // 'hi' or 'or'
        this.currentState = 'idle';  // 'idle' | 'listening' | 'thinking' | 'speaking'
        this.isMuted = false;
        this.recognition = null;
        this.currentAudio = null;
        this.recognitionActive = false;

        this.initDOMElements();
        this.initSpeechRecognition();
        this.bindEvents();
        this.loadDemoChips();
    }

    initDOMElements() {
        this.micBtn = document.getElementById('micBtn');
        this.micIcon = document.getElementById('micIcon');
        this.thinkingSpinner = document.getElementById('thinkingSpinner');
        this.speakingWaves = document.getElementById('speakingWaves');
        
        this.statusLabel = document.getElementById('statusLabel');
        this.subStatus = document.getElementById('subStatus');
        
        this.responseContainer = document.getElementById('responseContainer');
        this.responseText = document.getElementById('responseText');
        this.userQueryEcho = document.getElementById('userQueryEcho');
        this.advisorLabel = document.getElementById('advisorLabel');
        
        this.langHi = document.getElementById('langHi');
        this.langOr = document.getElementById('langOr');
        this.demoChipsContainer = document.getElementById('demoChips');
        
        this.profileBtn = document.getElementById('profileBtn');
        this.profileModal = document.getElementById('profileModal');
        this.closeProfileBtn = document.getElementById('closeProfileBtn');
        
        this.audioToggleBtn = document.getElementById('audioToggleBtn');
        this.speakerOnIcon = document.getElementById('speakerOnIcon');
        this.speakerMuteIcon = document.getElementById('speakerMuteIcon');
    }

    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;

            this.recognition.onstart = () => {
                this.recognitionActive = true;
                this.setState('listening');
            };

            this.recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                console.log('Recognized speech:', speechResult);
                this.handleVoiceQuery(speechResult);
            };

            this.recognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                this.recognitionActive = false;
                if (this.currentState === 'listening') {
                    this.setState('idle');
                    this.subStatus.textContent = this.currentLanguage === 'hi' 
                        ? 'आवाज़ नहीं सुनाई दी, दोबारा माइक दबाएं' 
                        : 'ସ୍ୱର ଶୁଣାଗଲା ନାହିଁ, ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ';
                }
            };

            this.recognition.onend = () => {
                this.recognitionActive = false;
                if (this.currentState === 'listening') {
                    this.setState('thinking');
                }
            };
        } else {
            console.warn('Web Speech API not supported in this browser. Fallback enabled.');
        }
    }

    bindEvents() {
        // Main Mic Click
        this.micBtn.addEventListener('click', () => this.toggleMicrophone());

        // Language Switcher
        this.langHi.addEventListener('click', () => this.setLanguage('hi'));
        this.langOr.addEventListener('click', () => this.setLanguage('or'));

        // Profile Modal
        this.profileBtn.addEventListener('click', () => this.profileModal.classList.remove('hidden'));
        this.closeProfileBtn.addEventListener('click', () => this.profileModal.classList.add('hidden'));
        this.profileModal.addEventListener('click', (e) => {
            if (e.target === this.profileModal) this.profileModal.classList.add('hidden');
        });

        // Audio Mute Toggle
        this.audioToggleBtn.addEventListener('click', () => this.toggleMute());
    }

    setState(newState) {
        this.currentState = newState;
        this.micBtn.className = `mic-button state-${newState}`;

        // Icons
        this.micIcon.classList.toggle('hidden', newState === 'thinking' || newState === 'speaking');
        this.thinkingSpinner.classList.toggle('hidden', newState !== 'thinking');
        this.speakingWaves.classList.toggle('hidden', newState !== 'speaking');

        // Status text based on state & language
        const isHi = this.currentLanguage === 'hi';
        
        switch (newState) {
            case 'idle':
                this.statusLabel.textContent = isHi ? 'बोलने के लिए दबाएं' : 'କହିବା ପାଇଁ ଦବାନ୍ତୁ';
                this.subStatus.textContent = isHi ? 'अपना सवाल पूछें' : 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ';
                break;
            case 'listening':
                this.statusLabel.textContent = isHi ? 'सुन रहा हूँ...' : 'ଶୁଣୁଛି...';
                this.subStatus.textContent = isHi ? 'अपनी फसल के बारे में बोलें' : 'ନିଜ ଫସଲ ବିଷୟରେ କୁହନ୍ତୁ';
                break;
            case 'thinking':
                this.statusLabel.textContent = isHi ? 'सलाह तैयार हो रही है...' : 'ପରାମର୍ଶ ପ୍ରସ୍ତୁତ ହେଉଛି...';
                this.subStatus.textContent = isHi ? 'कृषि डेटा का विश्लेषण' : 'କୃଷି ବିଶ୍ଳେଷଣ';
                break;
            case 'speaking':
                this.statusLabel.textContent = isHi ? 'बोल रहा हूँ...' : 'କହୁଛି...';
                this.subStatus.textContent = isHi ? 'सलाहकार की आवाज़' : 'ପରାମର୍ଶଦାତାଙ୍କ ସ୍ୱର';
                break;
        }
    }

    setLanguage(lang) {
        if (this.currentLanguage === lang) return;
        this.currentLanguage = lang;
        
        this.langHi.classList.toggle('active', lang === 'hi');
        this.langOr.classList.toggle('active', lang === 'or');
        
        this.advisorLabel.textContent = lang === 'hi' ? 'कृषि सलाहकार' : 'କୃଷି ପରାମର୍ଶଦାତା';
        
        // Stop current audio/recognition if any
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        this.setState('idle');
        this.loadDemoChips();
    }

    toggleMicrophone() {
        if (this.currentState === 'listening') {
            if (this.recognition && this.recognitionActive) {
                this.recognition.stop();
            }
            this.setState('idle');
            return;
        }

        if (this.currentState === 'speaking') {
            if (this.currentAudio) {
                this.currentAudio.pause();
                this.currentAudio = null;
            }
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            this.setState('idle');
            return;
        }

        if (this.recognition) {
            try {
                // Set recognition language
                this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'or-IN';
                this.recognition.start();
            } catch (err) {
                console.warn('Recognition start warning:', err);
                this.recognition.stop();
                setTimeout(() => this.recognition.start(), 200);
            }
        } else {
            // Fallback prompt dialog if SpeechRecognition not supported in browser
            const defaultPrompt = this.currentLanguage === 'hi' ? 'मेरी फसल की हालत कैसी है?' : 'ମୋ ଫସଲର ଅବସ୍ଥା କେମିତି ଅଛି?';
            const userText = prompt(this.currentLanguage === 'hi' ? 'अपना सवाल लिखें:' : 'ପ୍ରଶ୍ନ ଲେଖନ୍ତୁ:', defaultPrompt);
            if (userText) {
                this.handleVoiceQuery(userText);
            }
        }
    }

    async handleVoiceQuery(queryText) {
        if (!queryText || !queryText.trim()) {
            this.setState('idle');
            return;
        }

        this.setState('thinking');
        this.userQueryEcho.textContent = `"${queryText}"`;
        this.responseContainer.classList.remove('hidden');
        this.responseText.textContent = this.currentLanguage === 'hi' ? 'सलाह तैयार की जा रही है...' : 'ପରାମର୍ଶ ପ୍ରସ୍ତୁତ ହେଉଛି...';

        try {
            const response = await fetch('/api/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: queryText,
                    language: this.currentLanguage,
                    synthesize_audio: !this.isMuted
                })
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data = await response.json();
            this.displayAndPlayResponse(data);
        } catch (err) {
            console.error('Error handling query:', err);
            this.responseText.textContent = this.currentLanguage === 'hi' 
                ? 'अभी संपर्क में थोड़ी समस्या है। कृपया दोबारा पूछें।'
                : 'ଏବେ ସମସ୍ୟା ଦେଖାଦେଇଛି। ଦୟାକରି ପୁଣି ପଚାରନ୍ତୁ।';
            this.setState('idle');
        }
    }

    displayAndPlayResponse(data) {
        this.responseText.textContent = data.answer;
        this.responseContainer.classList.remove('hidden');

        if (this.isMuted) {
            this.setState('idle');
            return;
        }

        // Play audio synthesized with ElevenLabs
        if (data.has_audio && data.audio_base64) {
            this.playBase64Audio(data.audio_base64);
        } else {
            // Browser Web Speech Synthesis fallback
            this.playBrowserTTS(data.answer, data.language);
        }
    }

    playBase64Audio(base64Data) {
        this.setState('speaking');
        
        if (this.currentAudio) {
            this.currentAudio.pause();
        }

        const audio = new Audio(`data:audio/mp3;base64,${base64Data}`);
        this.currentAudio = audio;

        audio.onended = () => {
            this.setState('idle');
            this.currentAudio = null;
        };

        audio.onerror = (e) => {
            console.warn('Audio playback error, falling back to browser synthesis:', e);
            this.playBrowserTTS(this.responseText.textContent, this.currentLanguage);
        };

        audio.play().catch(e => {
            console.warn('Audio autoplay blocked or failed:', e);
            this.setState('idle');
        });
    }

    playBrowserTTS(text, lang) {
        if (!('speechSynthesis' in window)) {
            this.setState('idle');
            return;
        }

        this.setState('speaking');
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'hi-IN'; // Most browsers use hi-IN for Indic speech
        utterance.rate = 0.95; // Calm, respectful pace for agricultural advisor tone
        utterance.pitch = 1.0;

        utterance.onend = () => {
            this.setState('idle');
        };

        utterance.onerror = () => {
            this.setState('idle');
        };

        window.speechSynthesis.speak(utterance);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.speakerOnIcon.classList.toggle('hidden', this.isMuted);
        this.speakerMuteIcon.classList.toggle('hidden', !this.isMuted);

        if (this.isMuted) {
            if (this.currentAudio) this.currentAudio.pause();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (this.currentState === 'speaking') this.setState('idle');
        }
    }

    async loadDemoChips() {
        try {
            const res = await fetch(`/api/prompts?lang=${this.currentLanguage}`);
            const data = await res.json();
            
            this.demoChipsContainer.innerHTML = '';
            (data.prompts || []).forEach(promptItem => {
                const btn = document.createElement('button');
                btn.className = 'chip-btn';
                btn.textContent = promptItem.question;
                btn.addEventListener('click', () => {
                    this.handleVoiceQuery(promptItem.question);
                });
                this.demoChipsContainer.appendChild(btn);
            });
        } catch (e) {
            console.warn('Could not load suggested chips:', e);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.agriApp = new AgriVoiceApp();
});
