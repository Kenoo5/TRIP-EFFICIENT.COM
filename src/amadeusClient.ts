// src/amadeusClient.ts

// Amadeus test (sandbox) URLs
const AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const API_BASE = "https://test.api.amadeus.com";

// In-memory token cache
let accessToken: string | null = null;
let tokenExpiresAt = 0;

// ---- 1) Get / refresh access token ---------------------------------
async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Reuse token if still valid
  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  const clientId = process.env.REACT_APP_AMADEUS_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_AMADEUS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("❌ Amadeus env missing:", {
      REACT_APP_AMADEUS_CLIENT_ID: clientId,
      REACT_APP_AMADEUS_CLIENT_SECRET: clientSecret ? "SET" : "MISSING",
    });
    throw new Error("Amadeus credentials are not set in .env");
  }

  const body = new URLSearchParams();
  body.append("grant_type", "client_credentials");
  body.append("client_id", clientId);
  body.append("client_secret", clientSecret);

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("❌ Amadeus auth error:", data);
    throw new Error(`Failed to get Amadeus token. Status: ${res.status}`);
  }

  // Save token in memory
  accessToken = data.access_token;
  const expiresInMs = (data.expires_in || 1800) * 1000; // default 30 min
  // refresh 60s before expiry
  tokenExpiresAt = now + expiresInMs - 60_000;

  return accessToken!;
}

// ---- 2) Generic GET helper you can reuse ---------------------------
export async function amadeusGet(
  path: string,
  params: Record<string, any> = {}
) {
  const token = await getAccessToken();

  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  console.log("🔎 Calling Amadeus:", url.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // not JSON, leave as text
  }

  if (!res.ok) {
    console.error("❌ Amadeus API error RAW:", {
      status: res.status,
      body: json || text,
    });

    let message = `Amadeus API error: ${res.status}`;
    const firstError = json?.errors?.[0];
    if (firstError) {
      const title = firstError.title || "";
      const detail = firstError.detail || "";
      message += ` – ${title} ${detail}`;
    }

    throw new Error(message.trim());
  }

  return json;
}

// ---- 3) Helper for Recommended Locations endpoint (optional) -------
// Not currently used in PlannerPage, but kept in case you reuse it
export async function getRecommendedLocations(
  cityCode: string,
  travelerCountryCode: string = "IN"
) {
  return amadeusGet("/v1/reference-data/recommended-locations", {
    cityCodes: cityCode,
    travelerCountryCode,
  });
}

// ---- 4) City search: name -> city info (iataCode + geo) -------------
export async function searchCityByName(cityName: string) {
  return amadeusGet("/v1/reference-data/locations", {
    keyword: cityName,
    subType: "CITY",
  });
}

// ---- 5) Flight Offers Search ----------------------------------------
export async function searchFlights(
  originCode: string,
  destinationCode: string,
  departureDate: string,
  adults: number = 1
) {
  return amadeusGet("/v2/shopping/flight-offers", {
    originLocationCode: originCode,
    destinationLocationCode: destinationCode,
    departureDate,
    adults,
    currencyCode: "INR",
    max: 5,
  });
}

// ---- 6) Points of Interest (things to see/do in city) ---------------
export async function getPointsOfInterest(
  latitude: number,
  longitude: number,
  radius: number = 20
) {
  return amadeusGet("/v1/reference-data/locations/points-of-interest", {
    latitude,
    longitude,
    radius,
  });
}

// ---- 7) Tours & Activities ------------------------------------------
export async function getActivities(
  latitude: number,
  longitude: number,
  radius: number = 20
) {
  return amadeusGet("/v1/shopping/activities", {
    latitude,
    longitude,
    radius,
  });
}
