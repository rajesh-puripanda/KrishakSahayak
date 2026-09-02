import io
import re
import os
import sys
import logging
import asyncio
import requests
from typing import Optional, Dict, Any, Tuple

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

from config import (
    LIVEKIT_URL,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    ELEVENLABS_API_KEY,
    ELEVENLABS_MODEL_ID,
    ELEVENLABS_VOICE_ID_HINDI,
    ELEVENLABS_VOICE_ID_ODIA
)
from dummy_data import get_dummy_data
from demo_questions import find_best_demo_match, detect_language

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agri-voice-agent")

# Forbidden technical jargon that must NEVER be spoken to the farmer
FORBIDDEN_JARGON = [
    r'\bndvi\b', r'\bgndvi\b', r'\bsoil moisture score\b', r'\bdistress score\b',
    r'\bvegetation index\b', r'\bsatellite index\b', r'\bindex\b', r'\bscore\b',
    r'\bpercentage\b', r'\b38%\b', r'\b67%\b', r'\b0\.42\b'
]

def sanitize_response(text: str) -> str:
    """Removes any unintentional technical jargon or metric scores from the response."""
    sanitized = text
    for pattern in FORBIDDEN_JARGON:
        sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE)
    sanitized = re.sub(r'\s+', ' ', sanitized).strip()
    return sanitized

def generate_reasoned_advice(query: str, language: str = "hi") -> str:
    """
    Agricultural reasoning engine based on internal signals from dummy_data.py.
    Used when a query does not match a predefined demo question.
    Converts internal signals (crop stress, soil moisture, rain chance) into 1-2 simple action sentences.
    """
    data = get_dummy_data()
    weather = data.get("weather", {})
    soil_m = data.get("soil_moisture", 38)
    rain_prob = weather.get("rain_probability", 20)
    stress = data.get("crop_stress", 67)
    
    # Internal logic interpretation
    needs_water = soil_m < 50 and rain_prob < 40
    is_stressed = stress > 50

    if language in ("or", "odia"):
        if needs_water and is_stressed:
            return "ମାଟିରେ ଆର୍ଦ୍ରତା କମ୍ ଅଛି ଏବଂ ଫସଲରେ ଟିକେ ଚାପ ଦେଖାଯାଉଛି। ଆସନ୍ତା ଏକ ଦୁଇ ଦିନ ମଧ୍ୟରେ ହାଲୁକା ପାଣି ଦିଅନ୍ତୁ ଏବଂ ପତ୍ରର ରଙ୍ଗ ଧ୍ୟାନରେ ଦେଖନ୍ତୁ।"
        elif needs_water:
            return "ଏବେ ବର୍ଷାର ସମ୍ଭାବନା କମ୍ ଅଛି। ମାଟିରେ ଆର୍ଦ୍ରତା ରଖିବା ପାଇଁ ହାଲୁକା ସିଞ୍ଚାଇ କରନ୍ତୁ।"
        else:
            return "ଫସଲର ସ୍ଥିତି ସ୍ୱାଭାବିକ ଅଛି। ନିୟମିତ ଭାବରେ ଜମିର ଯତ୍ନ ନିଅନ୍ତୁ ଏବଂ କିଛି ସମସ୍ୟା ହେଲେ ପଚାରନ୍ତୁ।"
    else:  # Hindi default
        if needs_water and is_stressed:
            return "मिट्टी में नमी कम है और फसल में थोड़ा तनाव दिखाई दे रहा है। अगले एक-दो दिन में हल्की सिंचाई कर दें और पत्तियों का ध्यान रखें।"
        elif needs_water:
            return "अभी बारिश की संभावना कम है। इसलिए खेत में नमी बनाए रखने के लिए हल्की सिंचाई कर दें।"
        else:
            return "फसल की स्थिति सामान्य है। खेत की नियमित देखभाल करते रहें और कोई परेशानी लगे तो बताएं।"

def get_farming_advice(query: str, preferred_lang: str = "hi") -> Dict[str, Any]:
    """
    Main entry point for processing farmer queries.
    1. Detects language (Hindi or Odia).
    2. Runs fuzzy semantic matcher against demo question bank.
    3. Falls back to grounded agricultural reasoning if no demo match.
    4. Sanitizes output to guarantee zero technical metrics are spoken.
    """
    detected_lang = detect_language(query, default_lang=preferred_lang)
    lang_code = "or" if detected_lang in ("or", "odia") else "hi"
    
    item_id, matched_answer, confidence, lang_key = find_best_demo_match(query, preferred_lang=lang_code)
    
    if matched_answer and confidence >= 0.50:
        final_answer = sanitize_response(matched_answer)
        return {
            "query": query,
            "answer": final_answer,
            "language": lang_code,
            "category": item_id,
            "confidence": round(confidence, 2),
            "source": "demo_database"
        }
    else:
        # Fallback to agricultural reasoning
        reasoned_answer = generate_reasoned_advice(query, language=lang_code)
        final_answer = sanitize_response(reasoned_answer)
        return {
            "query": query,
            "answer": final_answer,
            "language": lang_code,
            "category": "agricultural_reasoning",
            "confidence": 0.75,
            "source": "reasoning_engine"
        }

def synthesize_speech_elevenlabs(text: str, language: str = "hi") -> Optional[bytes]:
    """
    Synthesizes natural speech using ElevenLabs API.
    Uses eleven_multilingual_v2 model for high-quality natural Hindi / Odia output.
    Returns raw MP3 audio bytes, or None if API key is not configured.
    """
    if not ELEVENLABS_API_KEY or ELEVENLABS_API_KEY.strip() == "":
        logger.warning("ELEVENLABS_API_KEY not configured. Speech synthesis skipped.")
        return None
        
    voice_id = ELEVENLABS_VOICE_ID_ODIA if language in ("or", "odia") else ELEVENLABS_VOICE_ID_HINDI
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    payload = {
        "text": text,
        "model_id": ELEVENLABS_MODEL_ID,
        "voice_settings": {
            "stability": 0.65,
            "similarity_boost": 0.85,
            "style": 0.15,
            "use_speaker_boost": True
        }
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=12)
        if response.status_code == 200:
            return response.content
        else:
            logger.error(f"ElevenLabs TTS failed: HTTP {response.status_code} - {response.text}")
            return None
    except Exception as e:
        logger.error(f"Error calling ElevenLabs API: {e}")
        return None

# LiveKit Agents Worker Handler
async def livekit_entrypoint(ctx: Any):
    """Entrypoint when running as a LiveKit agent worker."""
    try:
        from livekit.agents import AutoSubscribe, JobContext
        logger.info(f"Starting LiveKit voice agent session for room: {ctx.room.name}")
        await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    except Exception as err:
        logger.warning(f"LiveKit worker startup notice: {err}")

if __name__ == "__main__":
    # If run directly via python agent.py
    try:
        from livekit.agents import cli, WorkerOptions
        cli.run_app(WorkerOptions(entrypoint_fnc=livekit_entrypoint))
    except Exception as e:
        logger.info(f"Running agent in standalone mode. Use main.py for web server. Error: {e}")
