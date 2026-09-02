import os
import sys
import pytest
from pathlib import Path
from fastapi.testclient import TestClient

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_path))

from agent import get_farming_advice, sanitize_response, FORBIDDEN_JARGON
from demo_questions import find_best_demo_match, DEMO_DATABASE, detect_language
from dummy_data import get_dummy_data, get_farmer_profile
from main import app

client = TestClient(app)

def test_crop_condition_hindi():
    """Test canonical question 1: Crop condition in Hindi."""
    query = "मेरी फसल की हालत कैसी है?"
    result = get_farming_advice(query, preferred_lang="hi")
    assert result["category"] == "crop_condition"
    assert "तनाव" in result["answer"]
    assert "सिंचाई" in result["answer"]
    assert result["language"] == "hi"

def test_crop_condition_hindi_variations():
    """Test variations for crop condition in Hindi."""
    variations = [
        "फसल कैसी चल रही है?",
        "मेरी फसल ठीक है?",
        "फसल में कोई परेशानी है?",
        "मेरी फसल में क्या समस्या है?",
        "फसल कैसी है"
    ]
    for q in variations:
        result = get_farming_advice(q, preferred_lang="hi")
        assert result["category"] == "crop_condition", f"Failed on variation: {q}"
        assert "सिंचाई" in result["answer"]

def test_water_irrigation_hindi():
    """Test question 2: Water / Irrigation in Hindi."""
    query = "क्या मेरी फसल को पानी चाहिए?"
    result = get_farming_advice(query, preferred_lang="hi")
    assert result["category"] == "water_irrigation"
    assert "हल्की सिंचाई" in result["answer"]
    assert "नमी" in result["answer"]

def test_fertilizer_hindi():
    """Test question 3: Fertilizer in Hindi."""
    query = "कौन सी खाद डालूं?"
    result = get_farming_advice(query, preferred_lang="hi")
    assert result["category"] == "fertilizer"
    assert "नाइट्रोजन" in result["answer"]
    assert "सप्ताह में एक बार" in result["answer"]

def test_rain_hindi():
    """Test question 4: Rain in Hindi."""
    query = "बारिश होगी क्या?"
    result = get_farming_advice(query, preferred_lang="hi")
    assert result["category"] == "rain_weather"
    assert "बारिश की संभावना कम है" in result["answer"]

def test_odia_questions():
    """Test Odia questions and answers."""
    # Crop condition
    q1 = "ମୋ ଫସଲର ଅବସ୍ଥା କେମିତି ଅଛି?"
    res1 = get_farming_advice(q1, preferred_lang="or")
    assert res1["category"] == "crop_condition"
    assert "ସିଞ୍ଚାଇ" in res1["answer"]

    # Water
    q2 = "ମୋ ଫସଲକୁ ପାଣି ଦରକାର କି?"
    res2 = get_farming_advice(q2, preferred_lang="or")
    assert res2["category"] == "water_irrigation"
    assert "ହାଲୁକା ସିଞ୍ଚାଇ" in res2["answer"]

    # Fertilizer
    q3 = "କେଉଁ ସାର ଦେବି?"
    res3 = get_farming_advice(q3, preferred_lang="or")
    assert res3["category"] == "fertilizer"
    assert "ନାଇଟ୍ରୋଜେନ୍" in res3["answer"]

    # Rain
    q4 = "ବର୍ଷା ହେବ କି?"
    res4 = get_farming_advice(q4, preferred_lang="or")
    assert res4["category"] == "rain_weather"
    assert "ବର୍ଷାର ସମ୍ଭାବନା କମ୍" in res4["answer"]

def test_no_technical_jargon_in_advice():
    """Verify that technical jargon (NDVI, percentages, distress scores) is NEVER exposed."""
    all_queries = [
        "मेरी फसल की हालत कैसी है?",
        "क्या मेरी फसल को पानी चाहिए?",
        "कौन सी खाद डालूं?",
        "बारिश होगी क्या?",
        "पत्तियों में कोई बीमारी है क्या?",
        "कुछ सामान्य सलाह दो"
    ]
    forbidden_terms = ["ndvi", "gndvi", "soil moisture score", "distress score", "vegetation index", "0.42", "38%", "67%"]
    
    for q in all_queries:
        res = get_farming_advice(q, preferred_lang="hi")
        answer_lower = res["answer"].lower()
        for term in forbidden_terms:
            assert term not in answer_lower, f"Forbidden term '{term}' found in response for query '{q}'"

def test_fastapi_endpoints():
    """Verify FastAPI endpoints."""
    # Health check
    r_health = client.get("/api/health")
    assert r_health.status_code == 200
    assert r_health.json()["status"] == "healthy"

    # Profile endpoint
    r_profile = client.get("/api/profile")
    assert r_profile.status_code == 200
    profile_data = r_profile.json()
    assert profile_data["crop"] == "Rice"
    assert profile_data["location"] == "Demo Farm"

    # Prompts endpoint
    r_prompts = client.get("/api/prompts?lang=hi")
    assert r_prompts.status_code == 200
    prompts = r_prompts.json()["prompts"]
    assert len(prompts) >= 4

    # Process query endpoint (without external ElevenLabs TTS call)
    r_query = client.post("/api/query", json={
        "query": "मेरी फसल की हालत कैसी है?",
        "language": "hi",
        "synthesize_audio": False
    })
    assert r_query.status_code == 200
    res_data = r_query.json()
    assert "तनाव" in res_data["answer"]
    assert res_data["category"] == "crop_condition"
