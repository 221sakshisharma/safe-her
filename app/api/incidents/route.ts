import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// Keywords with associated severity weights (higher is worse)
const KEYWORDS = {
  high: ['murder', 'homicide', 'rape', 'gangrape', 'sexual assault', 'shooting', 'killed', 'dead'],
  medium: ['robbery', 'stabbing', 'kidnapping', 'assault', 'attack', 'gun', 'knife'],
  low: ['theft', 'snatching', 'harassment', 'molestation', 'arrested', 'busted', 'seized', 'police'],
};

// Function to calculate safety score
function calculateSafetyScore(incidents: any[]) {
  let baseScore = 100;
  const now = new Date();

  let totalWeightedSeverity = 0;

  incidents.forEach((incident) => {
    const pubDate = new Date(incident.pubDate);
    const diffTime = Math.abs(now.getTime() - pubDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Severity weights
    let severity = 0;
    const title = incident.title.toLowerCase();

    if (KEYWORDS.high.some(k => title.includes(k))) severity = 25;
    else if (KEYWORDS.medium.some(k => title.includes(k))) severity = 15;
    else if (KEYWORDS.low.some(k => title.includes(k))) severity = 7;

    // Time decay
    let timeMultiplier = 1;
    if (diffDays <= 7) timeMultiplier = 1.0;       // Last week → full impact
    else if (diffDays <= 14) timeMultiplier = 0.8; // 1–2 weeks → slightly reduced
    else if (diffDays <= 30) timeMultiplier = 0.5; // 2–4 weeks → medium impact
    else timeMultiplier = 0.2;                     // Older → low impact


    totalWeightedSeverity += severity * timeMultiplier;
  });

  // Logarithmic scaling (diminishing returns)
  const logPenalty = Math.log(1 + totalWeightedSeverity) * 15;

  // Incident density normalization
  const densityFactor = Math.min(2, incidents.length / 10);

  // Source diversity boost
  const uniqueSources = new Set(incidents.map(i => i.source)).size;
  const sourceFactor = Math.min(1.5, uniqueSources / 5);

  const finalPenalty = logPenalty * densityFactor * sourceFactor;

  const finalScore = baseScore - finalPenalty;

  return Math.max(0, Math.min(100, Math.round(finalScore)));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'Latitude and Longitude required' }, { status: 400 });
  }

  try {
    // 1. Reverse Geocoding using Nominatim (OpenStreetMap)
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const geoRes = await fetch(geoUrl, {
      headers: {
        'User-Agent': 'SafeHer/1.0 (safety-app-project)',
      },
    });
    
    if (!geoRes.ok) throw new Error('Failed to fetch location data');
    const geoData = await geoRes.json();
    
    // Extract meaningful location name
    // Prefer: residential, suburb, city_district, town, city, village
    const address = geoData.address || {};
    const locationName = 
      address.residential || 
      address.suburb || 
      address.neighbourhood ||
      address.city_district || 
      address.town || 
      address.city || 
      address.village || 
      'New Delhi';

    // 2. Build Google News RSS Query
    // Query format: "LocationName (keyword1 OR keyword2 ...)"
    const allKeywords = [...KEYWORDS.high, ...KEYWORDS.medium, ...KEYWORDS.low];
    // Take a subset to avoid URL length issues, or group them
    const queryKeywords = [
        "rape", "sexual assault", "harassment", 
        "robbery", "snatching", "stabbing", 
        "shooting", "murder", "arrested", "crime"
    ];
    
    const query = `${locationName} (${queryKeywords.join(' OR ')})`;
    const encodedQuery = encodeURIComponent(query);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;

    // 3. Fetch and Parse RSS
    const feed = await parser.parseURL(rssUrl);
    
    // 4. Process Incidents
    const incidents = feed.items.map((item) => ({
      title: item.title || 'Unknown Incident',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(),
      source: item.contentSnippet || 'Google News',
      snippet: item.contentSnippet || '',
    })).slice(0, 20); // Limit to top 20

    // 5. Calculate Score
    const safetyScore = calculateSafetyScore(incidents);
    
    // Determine Risk Level
    let riskLevel = 'Low';
    if (safetyScore < 40) riskLevel = 'High';
    else if (safetyScore < 70) riskLevel = 'Moderate';

    return NextResponse.json({
      location: locationName,
      fullAddress: geoData.display_name,
      safetyScore,
      riskLevel,
      incidents,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
