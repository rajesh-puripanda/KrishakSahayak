# Internal Dummy Agricultural Data
# IMPORTANT: The numerical values and technical metrics (crop_health, leaf_health,
# soil_moisture %, crop_stress score, NDVI, GNDVI) are purely internal signals.
# The voice assistant must NEVER expose or utter these technical terms or scores to the farmer.

DUMMY_DATA = {
    "farmer": {
        "name": "Ramesh",
        "crop": "Rice",
        "stage": "Vegetative (टिलरिंग अवस्था)",
        "location": "Demo Farm"
    },
    "weather": {
        "temperature": 31,
        "humidity": 62,
        "rain_probability": 20,
        "forecast": "Dry and warm over the next 2-3 days"
    },

    # Internal values — NEVER mention these names or numbers to the farmer
    "crop_health": 42,
    "leaf_health": 51,
    "soil_moisture": 38,
    "crop_stress": 67
}

def get_dummy_data() -> dict:
    """Returns a copy of the current internal dummy data."""
    return DUMMY_DATA.copy()

def update_dummy_data(updates: dict) -> dict:
    """Updates internal dummy data for live demonstration tests."""
    global DUMMY_DATA
    for key, value in updates.items():
        if key in DUMMY_DATA:
            if isinstance(DUMMY_DATA[key], dict) and isinstance(value, dict):
                DUMMY_DATA[key].update(value)
            else:
                DUMMY_DATA[key] = value
    return DUMMY_DATA

def get_farmer_profile() -> dict:
    """Returns farmer profile for the frontend UI profile card."""
    return {
        "name": DUMMY_DATA["farmer"]["name"],
        "crop": DUMMY_DATA["farmer"]["crop"],
        "location": DUMMY_DATA["farmer"]["location"]
    }
