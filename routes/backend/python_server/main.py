from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import feedparser
import urllib.parse
import requests
from geopy.distance import geodesic

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

    area_scores = {}

    for area in area_coordinates:
        query = f"{area} crime OR rape OR robbery OR murder"
        encoded_query = urllib.parse.quote(query)
        url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-IN&gl=IN&ceid=IN:en"

        feed = feedparser.parse(url)

        score = 0
        for entry in feed.entries[:15]:  # more entries
            title = entry.title.lower()
            for keyword, weight in severity_weights.items():
                if keyword in title:
                    score += weight

        area_scores[area] = score

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

    return areas

# =============================
# DENSE GRID
# =============================

def generate_grid(areas):

    grid = []

    min_lat, max_lat = 28.40, 28.90
    min_lon, max_lon = 76.90, 77.35

    step = 0.02   # smaller step = denser grid

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

# =============================
# STARTUP
# =============================

cached_response = {}

@app.on_event("startup")
def startup():
    areas = generate_rss_scores()
    grid = generate_grid(areas)

    global cached_response
    cached_response = {
        "areas": areas,
        "grid": grid
    }

    print("===== SYSTEM READY =====")

@app.get("/heatmap")
def heatmap():
    return cached_response

# =============================
# SIMPLE ROUTE
# =============================

@app.get("/route")
def get_route(start_lon: float, start_lat: float,
              end_lon: float, end_lat: float):

    osrm_url = f"http://router.project-osrm.org/route/v1/foot/{start_lon},{start_lat};{end_lon},{end_lat}?overview=full&geometries=geojson"

    response = requests.get(osrm_url)
    data = response.json()

    if "routes" not in data or len(data["routes"]) == 0:
        return {"error": "No routes found"}

    route = data["routes"][0]

    return {
        "fastest": {
            "coords": route["geometry"]["coordinates"],
            "distance": route["distance"]
        },
        "safest": {
            "coords": route["geometry"]["coordinates"],
            "distance": route["distance"]
        },
        "balanced": {
            "coords": route["geometry"]["coordinates"],
            "distance": route["distance"]
        }
    }
