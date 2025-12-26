import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  searchCityByName,
  searchFlights,
  getPointsOfInterest,
  getActivities,
} from "./amadeusClient"; // adjust path if needed

type ItineraryStop = {
  id: string;
  name: string;
  type: string;
  durationHours: number;
  ecoScore?: number;
};

type Itinerary = {
  start: string;
  end: string;
  days: number;
  budget: number;
  interests: string[];
  stops: ItineraryStop[];
};

function PlannerPage() {
  const [start, setStart] = useState<string>("Paris");
  const [end, setEnd] = useState<string>("Barcelona");
  const [days, setDays] = useState<number>(3);
  const [interests, setInterests] = useState<string[]>(["nature"]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // extra: store flights / poi / activities
  const [flights, setFlights] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const toggleInterest = (tag: string) => {
    setInterests((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );
  };

  // small helper to build a departure date = tomorrow
  const getDefaultDepartureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // ---------------- AMADEUS API INTEGRATION -----------------
  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setFlights([]);
    setPois([]);
    setActivities([]);

    try {
      // 1) Find start & end cities in Amadeus
      const [startRes, endRes] = await Promise.all([
        searchCityByName(start),
        searchCityByName(end),
      ]);

      const startCity = (startRes as any)?.data?.[0];
      const endCity = (endRes as any)?.data?.[0];

      if (!startCity || !endCity) {
        setError("Could not find one of the cities. Try Paris / Barcelona / Delhi / Mumbai.");
        setLoading(false);
        return;
      }

      const originCode = startCity.iataCode;
      const destCode = endCity.iataCode;

      const destLat = endCity.geoCode?.latitude;
      const destLon = endCity.geoCode?.longitude;

      if (destLat == null || destLon == null) {
        setError("Destination geo coordinates not available.");
        setLoading(false);
        return;
      }

      // Just for fun: internal traveler profile based on interests
      const travelerProfile =
        interests.includes("adventure")
          ? "ADVENTURE FOCUSED"
          : interests.includes("spiritual")
          ? "SPIRITUAL / RELAXATION"
          : interests.includes("culture")
          ? "CULTURE & LOCAL LIFE"
          : "GENERAL EXPLORER";

      console.log("🧭 Planner input:", {
        start,
        end,
        originCode,
        destCode,
        destLat,
        destLon,
        travelerProfile,
        days,
        interests,
      });

      const departureDate = getDefaultDepartureDate();

      // 2) Parallel calls:
      //   - flights between origin & dest
      //   - points of interest around destination
      //   - activities/tours around destination
      const [flightRes, poiRes, actRes] = await Promise.all([
        searchFlights(originCode, destCode, departureDate, 1),
        getPointsOfInterest(destLat, destLon, 20),
        getActivities(destLat, destLon, 20),
      ]);

      const flightData = (flightRes as any)?.data || [];
      const poiData = (poiRes as any)?.data || [];
      const actData = (actRes as any)?.data || [];

      setFlights(flightData);
      setPois(poiData);
      setActivities(actData);

      if (!Array.isArray(poiData) || poiData.length === 0) {
        setError(
          `No points of interest found for ${end} (${destCode}). Try a big city like Paris / Barcelona.`
        );
        setLoading(false);
        return;
      }

      // 3) Build itinerary stops from POIs (top 5)
      const stops: ItineraryStop[] = poiData.slice(0, 5).map((p: any, i: number) => ({
        id: "poi_" + i,
        name: p.name || `Place ${i + 1}`,
        type: p.category || "place",
        durationHours: 3,
        ecoScore: Math.floor(Math.random() * 3) + 7,
      }));

      const budgetPresets: Record<string, number> = {
        Backpacker: 2500,
        Comfort: 5500,
        Premium: 12000,
      };

      const budget = budgetPresets["Comfort"];

      const newItinerary: Itinerary = {
        start,
        end,
        days,
        budget,
        interests,
        stops,
      };

      setItinerary(newItinerary);
    } catch (err: any) {
      console.error("🔥 Planner generateItinerary error:", err);
      setError("Unable to fetch itinerary. Check console / API limits.");
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
      <section className="col-span-8 bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold">
          AI-Powered Trip Planner (Amadeus Integration)
        </h3>
        <p className="text-sm text-slate-500">
          Flights + places to visit + activities from Amadeus APIs.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Start city</label>
            <input
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="e.g. Paris, Delhi"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Try: Paris, Barcelona, Delhi, Mumbai for testing.
            </p>
          </div>
          <div>
            <label className="text-sm">End city</label>
            <input
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="e.g. Barcelona, Mumbai"
            />
          </div>
          <div>
            <label className="text-sm">Days</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm">
              Budget preset is on the Budget page
            </label>
            <div className="mt-1 text-xs text-slate-500">
              Budget & eco suggestions are on the Budget page.
            </div>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm">Interests</label>
          <div className="flex gap-2 mt-2">
            {["nature", "culture", "adventure", "spiritual"].map((tag) => (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-3 py-1 rounded-full border ${
                  interests.includes(tag) ? "bg-green-50" : ""
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={generateItinerary}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {loading ? "Loading..." : "Generate Itinerary"}
          </button>
          <button className="px-4 py-2 rounded border">Use AI (TODO)</button>
        </div>

        <div className="mt-6 h-64 bg-slate-50 rounded flex items-center justify-center text-slate-400">
          MAP / ROUTE VIEW (TODO: integrate Maps API)
        </div>

        <div className="mt-6 bg-slate-50 p-4 rounded space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!itinerary && !loading && !error && (
            <div className="text-slate-500">
              No itinerary yet — generate to see flights, key places, and activities.
            </div>
          )}

          {itinerary && (
            <div>
              <h4 className="font-semibold">
                Itinerary — {itinerary.start} → {itinerary.end} ({itinerary.days} days)
              </h4>
              <ul className="mt-2 space-y-2">
                {itinerary.stops.map((p) => (
                  <li key={p.id} className="p-2 bg-white rounded shadow-sm">
                    <div className="font-medium">
                      {p.name} ({p.type})
                    </div>
                    <div className="text-xs text-slate-500">
                      Duration: {p.durationHours} hrs • Eco score:{" "}
                      {p.ecoScore ?? "—"}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Flights */}
          {flights.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm">Suggested Flights</h4>
              <ul className="mt-1 space-y-1 text-xs">
                {flights.map((f: any, i) => {
                  const price = f.price?.total;
                  const itinerary = f.itineraries?.[0];
                  const duration = itinerary?.duration;
                  const segments = itinerary?.segments || [];
                  const firstSegment = segments[0];
                  const lastSegment = segments[segments.length - 1];

                  return (
                    <li key={i} className="bg-white rounded p-2 shadow-sm">
                      <div>
                        {firstSegment?.departure?.iataCode} →{" "}
                        {lastSegment?.arrival?.iataCode} • {duration}
                      </div>
                      <div className="text-slate-500">
                        Price: {price ? `₹${price}` : "N/A"}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Activities */}
          {activities.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm">Tours & Activities</h4>
              <ul className="mt-1 space-y-1 text-xs">
                {activities.slice(0, 5).map((a: any, i) => (
                  <li key={i} className="bg-white rounded p-2 shadow-sm">
                    <div>{a.name}</div>
                    <div className="text-slate-500">
                      {a.shortDescription || a.description || ""}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <aside className="col-span-4 space-y-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="text-sm text-slate-500">Quick Actions</div>
          <div className="mt-2 flex flex-col gap-2">
            <button className="p-2 rounded border text-sm">
              Save Plan (TODO: persist)
            </button>
            <button className="p-2 rounded border text-sm">Share Plan</button>
            <button className="p-2 rounded border text-sm">
              Book Guide (Local Connect)
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <div className="font-medium">Before Booking</div>
          <div className="text-xs text-slate-500 mt-2">
            Check Safety Hub for weather and local news (linked to Safety page).
          </div>
          <Link
            to="/safety"
            className="mt-3 inline-block text-sm text-green-600"
          >
            Open Safety Hub →
          </Link>
        </div>
      </aside>
    </div>
  );
}

export default PlannerPage;
