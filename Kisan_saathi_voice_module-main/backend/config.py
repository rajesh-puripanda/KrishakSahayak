import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# LiveKit Configuration
LIVEKIT_URL = os.getenv("LIVEKIT_URL", "wss://demo-livekit.example.com")
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY", "")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET", "")

# ElevenLabs Configuration
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_MODEL_ID = os.getenv("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")

# High quality natural multilingual voices
# Default: Multilingual male/female voices compatible with Hindi/Odia pronunciation
ELEVENLABS_VOICE_ID_HINDI = os.getenv("ELEVENLABS_VOICE_ID_HINDI", "pNInz6obpgDQGcFmaJgB")
ELEVENLABS_VOICE_ID_ODIA = os.getenv("ELEVENLABS_VOICE_ID_ODIA", "pNInz6obpgDQGcFmaJgB")

# Server Configuration
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", "8000"))
DEBUG = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
