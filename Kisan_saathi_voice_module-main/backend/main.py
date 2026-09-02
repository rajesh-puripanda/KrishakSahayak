import os
import sys
import base64
import logging
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from config import (
    HOST,
    PORT,
    DEBUG,
    LIVEKIT_URL,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    ELEVENLABS_API_KEY
)
from dummy_data import get_dummy_data, update_dummy_data, get_farmer_profile
from demo_questions import get_demo_prompt_chips
from agent import get_farming_advice, synthesize_speech_elevenlabs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agri-server")

app = FastAPI(title="Agri Voice Assistant Backend", version="1.0.0")

# CORS middleware for local testing and judge demonstrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_dir = Path(__file__).resolve().parent.parent / "frontend"

# Request / Response Schemas
class QueryRequest(BaseModel):
    query: str
    language: Optional[str] = "hi"
    synthesize_audio: Optional[bool] = True

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "hi"

class DummyDataUpdateRequest(BaseModel):
    updates: dict

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "livekit_configured": bool(LIVEKIT_API_KEY and LIVEKIT_API_SECRET),
        "elevenlabs_configured": bool(ELEVENLABS_API_KEY)
    }

@app.get("/api/profile")
async def profile():
    """Returns the farmer profile for the frontend modal."""
    return get_farmer_profile()

@app.get("/api/dummy-data")
async def dummy_data():
    """Returns internal agricultural signals (for developer verification)."""
    return get_dummy_data()

@app.post("/api/dummy-data/update")
async def update_data(payload: DummyDataUpdateRequest):
    """Allows updating dummy data to test dynamic scenarios live."""
    updated = update_dummy_data(payload.updates)
    return {"status": "success", "dummy_data": updated}

@app.get("/api/prompts")
async def demo_prompts(lang: str = "hi"):
    """Returns prepared demo question chips for quick testing in Hindi or Odia."""
    return {"language": lang, "prompts": get_demo_prompt_chips(language=lang)}

@app.post("/api/query")
async def process_query(payload: QueryRequest):
    """
    Main endpoint:
    Processes Hindi / Odia question, matches or reasons farming advice,
    and optionally synthesizes natural audio with ElevenLabs.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    result = get_farming_advice(query=payload.query.strip(), preferred_lang=payload.language or "hi")
    
    audio_base64 = None
    has_audio = False
    
    if payload.synthesize_audio:
        try:
            audio_bytes = synthesize_speech_elevenlabs(result["answer"], language=result["language"])
            if audio_bytes:
                audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
                has_audio = True
        except Exception as e:
            logger.warning(f"Audio synthesis warning: {e}")
            
    return {
        "query": result["query"],
        "answer": result["answer"],
        "language": result["language"],
        "category": result["category"],
        "confidence": result.get("confidence", 1.0),
        "source": result.get("source", "demo_database"),
        "has_audio": has_audio,
        "audio_base64": audio_base64
    }

@app.post("/api/tts")
async def tts(payload: TTSRequest):
    """Direct streaming TTS endpoint for ElevenLabs."""
    if not payload.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    audio_bytes = synthesize_speech_elevenlabs(payload.text, language=payload.language or "hi")
    if not audio_bytes:
        raise HTTPException(status_code=503, detail="ElevenLabs TTS not available or API key not set")
        
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.get("/api/token")
async def get_livekit_token(room: str = "agri-demo-room", identity: str = "farmer-user"):
    """Generates LiveKit room token for WebRTC voice streaming."""
    if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
        return {
            "configured": False,
            "message": "LiveKit API Key/Secret not set in .env. Use web audio fallback."
        }
    try:
        from livekit import api
        token = api.AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET) \
            .with_identity(identity) \
            .with_name("Demo Farmer") \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room,
                can_publish=True,
                can_subscribe=True,
            ))
        jwt_token = token.to_jwt()
        return {
            "configured": True,
            "url": LIVEKIT_URL,
            "token": jwt_token,
            "room": room
        }
    except Exception as e:
        logger.error(f"Error creating LiveKit token: {e}")
        return {
            "configured": False,
            "error": str(e)
        }

# Mount static frontend directory
if frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")

@app.get("/")
async def serve_index():
    index_file = frontend_dir / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "Frontend not found at " + str(index_file)}

if __name__ == "__main__":
    import uvicorn
    print(f"🌱 Starting Agri Voice Agent Server on http://{HOST}:{PORT}")
    uvicorn.run("main:app", host=HOST, port=PORT, reload=DEBUG)
