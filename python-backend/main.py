from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import feedparser
import urllib.parse
import requests
from geopy.distance import geodesic
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# FULL DELHI AREA DATA (DENSE)
# =============================

area_coordinates = {
    "Dwarka": (28.5921, 77.0460),
    "Janakpuri": (28.6219, 77.0878),
    "Tilak Nagar": (28.6396, 77.0853),
    "Rajouri Garden": (28.6425, 77.1221),
    "Paschim Vihar": (28.6692, 77.0953),
    "Rohini": (28.7041, 77.1025),
    "Pitampura": (28.6953, 77.1310),
    "Shalimar Bagh": (28.7155, 77.1654),
    "Model Town": (28.7056, 77.1931),
    "Civil Lines": (28.6769, 77.2250),
    "Karol Bagh": (28.6519, 77.1909),
    "Paharganj": (28.6429, 77.2195),
    "Connaught Place": (28.6315, 77.2167),
    "Daryaganj": (28.6446, 77.2408),
    "Chandni Chowk": (28.6506, 77.2303),
    "Saket": (28.5245, 77.2066),
    "Hauz Khas": (28.5494, 77.2001),
    "Greater Kailash": (28.5496, 77.2403),
    "Lajpat Nagar": (28.5677, 77.2432),
    "Vasant Kunj": (28.5355, 77.1544),
    "Malviya Nagar": (28.5355, 77.2100),
    "Kalkaji": (28.5430, 77.2588),
    "Chhatarpur": (28.5056, 77.1750),
    "Mayur Vihar": (28.5944, 77.3055),
    "Laxmi Nagar": (28.6328, 77.2773),
    "Preet Vihar": (28.6350, 77.2922),
    "Shahdara": (28.6744, 77.2890),
    "Anand Vihar": (28.6469, 77.3154),
    "Seelampur": (28.6694, 77.2690),
    "Yamuna Vihar": (28.7037, 77.2773),
    "Palam": (28.5910, 77.0820),
    "Najafgarh": (28.6127, 76.9790),
    "Mahipalpur": (28.5475, 77.1240),
    "Bawana": (28.7995, 77.0393),
    "Narela": (28.8527, 77.0920),
}

severity_weights = {
    "rape": 10,
    "sexual assault": 9,
    "harassment": 6,
    "murder": 9,
    "shooting": 8,
    "stabbing": 7,
    "robbery": 5,
}

# =============================
# RSS SCORE (MORE ENTRIES)
# =============================

def generate_rss_scores():
    logger.info("Fetching RSS feeds...")
    area_scores = {}

    for area in area_coordinates:
        query = f"{area} crime OR rape OR robbery OR murder"
        encoded_query = urllib.parse.quote(query)
        url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"

        try:
            feed = feedparser.parse(url)
            score = 0
            # Limit to 5 entries per area to speed up startup, increase if needed
            for entry in feed.entries[:5]:  
                title = entry.title.lower()
                for keyword, weight in severity_weights.items():
                    if keyword in title:
                        score += weight
            
            area_scores[area] = score
        except Exception as e:
            logger.error(f"Error fetching RSS for {area}: {e}")
            area_scores[area] = 0

    max_score = max(area_scores.values()) if area_scores else 1

    areas = []
    for area, raw_score in area_scores.items():
        lat, lng = area_coordinates[area]
        normalized = round((raw_score / max_score) * 10, 2) if max_score else 0

        areas.append({
            "area": area,
            "lat": lat,
            "lng": lng,
            "score": normalized
        })

    logger.info("RSS feed processing complete.")
    return areas

# =============================
# DENSE GRID
# =============================

def generate_grid(areas):
    logger.info("Generating grid...")
    grid = []

    min_lat, max_lat = 28.40, 28.90
    min_lon, max_lon = 76.90, 77.35

    step = 0.02   # grid resolution

    lat = min_lat
    while lat <= max_lat:
        lon = min_lon
        while lon <= max_lon:

            score = 0

            for area in areas:
                if area["score"] > 6:
                    dist = geodesic((lat, lon), (area["lat"], area["lng"])).meters
                    if dist < 2500:   # larger radius
                        influence = 20 * (1 - (dist / 2500))  # stronger influence
                        score += influence

            grid.append({
                "lat": lat,
                "lng": lon,
                "score": round(score, 2)
            })

            lon += step
        lat += step

    return grid

import threading
import time

# ... existing imports ...

import threading
import time
import math
import random
from datetime import datetime, timedelta
from dateutil import parser as date_parser

# ... existing imports ...

# =============================
# INCIDENT SCORING LOGIC
# =============================

KEYWORDS = {
    "high": ['murder', 'homicide', 'rape', 'gangrape', 'sexual assault', 'shooting', 'killed', 'dead'],
    "medium": ['robbery', 'stabbing', 'kidnapping', 'assault', 'attack', 'gun', 'knife'],
    "low": ['theft', 'snatching', 'harassment', 'molestation', 'arrested', 'busted', 'seized', 'police'],
}

def calculate_safety_score(incidents):
    base_score = 100
    now = datetime.now()
    total_weighted_severity = 0

    if not incidents:
        return 85  # Default safe-ish score

    for incident in incidents:
        # Parse date (handle various RSS date formats)
        try:
            pub_date = date_parser.parse(incident["pubDate"]).replace(tzinfo=None)
        except:
            pub_date = now

        diff_days = (now - pub_date).days
        
        # Severity
        severity = 0
        title = incident["title"].lower()
        
        if any(k in title for k in KEYWORDS["high"]):
            severity = 25
        elif any(k in title for k in KEYWORDS["medium"]):
            severity = 15
        elif any(k in title for k in KEYWORDS["low"]):
            severity = 7

        # Time Decay
        time_multiplier = 0.2
        if diff_days <= 7:
            time_multiplier = 1.0
        elif diff_days <= 14:
            time_multiplier = 0.8
        elif diff_days <= 30:
            time_multiplier = 0.5

        total_weighted_severity += severity * time_multiplier

    # Logarithmic scaling
    log_penalty = math.log(1 + total_weighted_severity) * 15
    
    # Density factor
    density_factor = min(2, len(incidents) / 10)
    
    # Source diversity (simplified)
    unique_sources = len(set(i["source"] for i in incidents))
    source_factor = min(1.5, unique_sources / 5) if unique_sources > 0 else 1

    final_penalty = log_penalty * density_factor * source_factor
    final_score = base_score - final_penalty
    
    return max(0, min(100, round(final_score)))

@app.get("/incidents")
def get_incidents(lat: float, lng: float):
    try:
        # 1. Reverse Geocoding
        location = geolocator.reverse((lat, lng), exactly_one=True)
        address = location.raw.get("address", {})
        
        location_name = (
            address.get("residential") or 
            address.get("suburb") or 
            address.get("neighbourhood") or 
            address.get("city_district") or 
            address.get("city") or 
            "New Delhi"
        )

        # 2. Google News RSS
        query_keywords = [
            "rape", "sexual assault", "harassment", 
            "robbery", "snatching", "stabbing", 
            "shooting", "murder", "arrested", "crime"
        ]
        query = f"{location_name} ({' OR '.join(query_keywords)})"
        encoded_query = urllib.parse.quote(query)
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"
        
        feed = feedparser.parse(rss_url)
        
        # 3. Process Incidents
        incidents = []
        for entry in feed.entries[:20]:
            # Mock coordinates around user
            lat_offset = (random.random() - 0.5) * 0.02
            lng_offset = (random.random() - 0.5) * 0.02
            
            title = entry.title.lower()
            severity = "low"
            if any(k in title for k in KEYWORDS["high"]): severity = "high"
            elif any(k in title for k in KEYWORDS["medium"]): severity = "medium"

            incidents.append({
                "title": entry.title,
                "link": entry.link,
                "pubDate": entry.published,
                "source": entry.source.get("title", "Google News") if "source" in entry else "Google News",
                "snippet": entry.summary if "summary" in entry else "",
                "lat": lat + lat_offset,
                "lng": lng + lng_offset,
                "severity": severity,
                "type": "crime" # simplified
            })

        # 4. Calculate Score
        safety_score = calculate_safety_score(incidents)
        
        risk_level = "Low"
        if safety_score < 40: risk_level = "High"
        elif safety_score < 70: risk_level = "Moderate"

        # 5. Mock Nearby Places
        nearby_places = [
            {"id": 1, "lat": lat + 0.002, "lng": lng + 0.002, "name": "City Police Station", "type": "police"},
            {"id": 2, "lat": lat - 0.003, "lng": lng + 0.004, "name": "General Hospital", "type": "hospital"},
            {"id": 3, "lat": lat + 0.004, "lng": lng - 0.003, "name": "Fire Department", "type": "fire"},
        ]

        return {
            "location": location_name,
            "fullAddress": location.address,
            "safetyScore": safety_score,
            "riskLevel": risk_level,
            "incidents": incidents,
            "nearbyPlaces": nearby_places
        }

    except Exception as e:
        logger.error(f"Incident fetch error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =============================
# STARTUP
# =============================

cached_response = {
    "areas": [],
    "grid": []
}

def background_data_update():
    global cached_response
    logger.info("Starting background data update...")
    try:
        areas = generate_rss_scores()
        grid = generate_grid(areas)
        cached_response = {
            "areas": areas,
            "grid": grid
        }
        logger.info("Background data update complete!")
    except Exception as e:
        logger.error(f"Error in background update: {e}")

@app.on_event("startup")
async def startup():
    # Start data generation in a background thread so server starts immediately
    thread = threading.Thread(target=background_data_update)
    thread.daemon = True
    thread.start()
    
    print("===== SERVER STARTED (Data loading in background) =====")

@app.get("/")
def root():
    return {
        "status": "SafeHer Python Server Running",
        "data_ready": len(cached_response["grid"]) > 0
    }

@app.get("/heatmap")
def heatmap():
    if not cached_response:
        return {"areas": [], "grid": []}
    return cached_response

from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent="safeher_app")

# ... existing code ...

@app.get("/geocode")
def geocode(query: str):
    try:
        location = geolocator.geocode(query)
        if location:
            return {"lat": location.latitude, "lng": location.longitude, "address": location.address}
        raise HTTPException(status_code=404, detail="Location not found")
    except Exception as e:
        logger.error(f"Geocoding error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# =============================
# ROUTE
# =============================

@app.get("/route")
def get_route(start_lon: float, start_lat: float,
              end_lon: float, end_lat: float):

    # OSRM Public Server (Demo only - heavily rate limited)
    osrm_url = f"http://router.project-osrm.org/route/v1/foot/{start_lon},{start_lat};{end_lon},{end_lat}?overview=full&geometries=geojson&alternatives=true"

    try:
        response = requests.get(osrm_url)
        data = response.json()

        if "routes" not in data or len(data["routes"]) == 0:
            raise HTTPException(status_code=404, detail="No routes found")

        # In a real implementation, we would analyze each route against our safety grid
        # For now, we return the first route as "fastest" and simulate "safest"
        
        routes = data["routes"]
        fastest_route = routes[0]
        
        # Simulating a safer route if alternatives exist, otherwise use same
        safest_route = routes[1] if len(routes) > 1 else fastest_route

        return {
            "fastest": {
                "coords": fastest_route["geometry"]["coordinates"],
                "distance": fastest_route["distance"],
                "duration": fastest_route["duration"]
            },
            "safest": {
                "coords": safest_route["geometry"]["coordinates"],
                "distance": safest_route["distance"],
                "duration": safest_route["duration"]
            }
        }
    except Exception as e:
        logger.error(f"Routing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
