import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { amadeusGet } from "./amadeusClient";
import Footer from "./Footer";
import { getRecommendedLocations } from "./amadeusClient";
import {
  searchCityByName,
  searchFlights,
  getPointsOfInterest,
  getActivities,   // 👈 make sure this is here
} from "./amadeusClient"; // adjust path if needed
import SmartBudgetSplit from "./SmartBudgetSplit";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { useNavigate } from "react-router-dom";


import BookingPage from "./BookingPage";
/* ⭐ TELL TYPESCRIPT THAT GOOGLE EXISTS ⭐ */
declare global {
  interface Window {
    google: any;
  }
}

type Alert = { id: number; message: string; type: string };
type SuggestionTip = { id: number; user: string; tip: string };

const MOCK_ALERTS: Alert[] = [
  { id: 1, message: "Heavy traffic expected near Main Market due to festival.", type: "Crowd" },
  { id: 2, message: "Scattered rain expected in the evening.", type: "Weather" },
  { id: 3, message: "Pickpocket incidents reported at City Square.", type: "Safety" }
];

const MOCK_TIPS: SuggestionTip[] = [
  { id: 1, user: "Ravi", tip: "Always carry a small first aid kit." },
  { id: 2, user: "Priya", tip: "Take picture of ID & save offline." }
];





/*
  Smart Yatra - TypeScript-ready single-file React demo (frontend-only)
  - TailwindCSS classes are used for quick styling
*/

// ------------------
// TypeScript Interfaces
// ------------------
interface RecommendedLocation {
  name: string;
  iataCode?: string;
  category?: string;
  relevance?: number;
}

interface Itinerary {
  start: string;
  end: string;
  days: number;
  budget: number;
  interests: string[];
  stops: ItineraryStop[];
}
type StopType = "destination" | "monument" | "experience";

interface ItineraryStop {
  id: string;
  name: string;
  type: StopType;
  durationHours: number;
  ecoScore?: number;
}

interface Itinerary {
  start: string;
  end: string;
  days: number;
  budget: number;
  interests: string[];
  stops: ItineraryStop[];
}

interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  experiences: number;
}



// import TopNav from "./components/TopNav";

// function App() {
//   return (
//     <>
//       <TopNav />
//       {/* routes here */}
//                 <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/planner" element={<PlannerPage />} />
//             <Route path="/budget" element={<BudgetPage />} />
//             <Route path="/calendar" element={<CalendarPage />} />
//             <Route path="/community" element={<CommunityPage />} />
//             <Route path="/booking" element={<BookingPage />} />
//             <Route path="/safety" element={<SafetyPage />} />
//             <Route path="/suggestions" element={<SuggestionsPage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/signup" element={<SignupPage />} />
//           </Routes>
//     </>
//   );
// }

// export default App;


























// // ---------------------------------TOP NAV FIRE BASE LOGIN ONLY-------------------------
// // ------------------
// // Shared Components
// // -----------------
// function TopNav() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const storedUser = localStorage.getItem("user");
//   let user: { name?: string; email?: string; coins?: number } | null = null;

//   if (storedUser) {
//     try {
//       user = JSON.parse(storedUser);
//     } catch {
//       user = { email: storedUser };
//     }
//   }

//   const logout = () => {
//     localStorage.removeItem("user");
//     window.location.reload();
//   };

//   const displayName = user?.name || user?.email || "Guest";
//   const coins = user?.coins || 0;

//   return (
//     <header className="w-full bg-white shadow-sm sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

//         {/* 🔹 LOGO */}
//         <Link to="/" className="flex items-center gap-4 cursor-pointer">
//           <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
//             SY
//           </div>
//           <div>
//             <div className="font-bold text-lg leading-tight">Smart Yatra</div>
//             <div className="text-xs text-slate-500">
//               AI + Green Coins → Sustainable travel
//             </div>
//           </div>
//         </Link>

//         {/* 🔹 Desktop Menu */}
//         <div className="hidden md:flex items-center gap-3 text-sm">

//           <Link to="/planner" className="px-3 py-2 rounded hover:bg-slate-100">Planner</Link>
//           <Link to="/budget" className="px-3 py-2 rounded hover:bg-slate-100">Budget</Link>
//           <Link to="/calendar" className="px-3 py-2 rounded hover:bg-slate-100">Festival</Link>
//           <Link to="/community" className="px-3 py-2 rounded hover:bg-slate-100">Community</Link>
//           <Link to="/safety" className="px-3 py-2 rounded hover:bg-slate-100">Safety Hub</Link>
//           <Link to="/suggestions" className="px-3 py-2 rounded hover:bg-slate-100">Suggestions</Link>

//           {/* auth */}
//           {!user && (
//             <>
//               <Link to="/login" className="px-3 py-2 rounded hover:bg-slate-100">Login</Link>
//               <Link to="/signup" className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">
//                 Sign Up
//               </Link>
//             </>
//           )}
          
//           {user && (
//             <>
//               {/* coins animation */}
//               <span className="flex items-center gap-1 px-3 py-2 rounded bg-yellow-100 text-yellow-700 font-semibold">
//                 🪙 {coins}
//               </span>
//               <span className="text-sm text-slate-600">
//                 Hi, <span className="font-semibold">{displayName}</span>
//               </span>
//               <button
//                 onClick={logout}
//                 className="px-3 py-2 rounded hover:bg-red-50 text-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>

//         {/* 🔹 Mobile Button */}
//         <button
//           className="md:hidden text-2xl"
//           onClick={() => setMenuOpen(!menuOpen)}
//         >
//           ☰
//         </button>
//       </div>

//       {/* 🔹 Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden bg-white border-t flex flex-col p-3 gap-2 text-sm">
//           <Link to="/planner" className="px-3 py-2 rounded hover:bg-slate-100">Planner</Link>
//           <Link to="/budget" className="px-3 py-2 rounded hover:bg-slate-100">Budget</Link>
//           <Link to="/calendar" className="px-3 py-2 rounded hover:bg-slate-100">Festival</Link>
//           <Link to="/community" className="px-3 py-2 rounded hover:bg-slate-100">Community</Link>
//           <Link to="/safety" className="px-3 py-2 rounded hover:bg-slate-100">Safety Hub</Link>
//           <Link to="/suggestions" className="px-3 py-2 rounded hover:bg-slate-100">Suggestions</Link>

//           {!user && (
//             <>
//               <Link to="/login" className="px-3 py-2 rounded hover:bg-slate-100">Login</Link>
//               <Link to="/signup" className="px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700">
//                 Sign Up
//               </Link>
//             </>
//           )}

//           {user && (
//             <>
//               <span className="flex items-center gap-1 px-3 py-2 rounded bg-yellow-100 text-yellow-700 font-semibold">
//                 🪙 {coins}
//               </span>
//               <span className="text-sm px-2">
//                 Hi, <span className="font-semibold">{displayName}</span>
//               </span>
//               <button
//                 onClick={logout}
//                 className="px-3 py-2 rounded hover:bg-red-50 text-red-600"
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </header>
//   );
// }
// export {};
// export default TopNav;

function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* ---------------- THEME SETUP ---------------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  /* ---------------- USER SETUP ---------------- */
  const storedUser = localStorage.getItem("user");
  let user: { name?: string; email?: string; coins?: number } | null = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      user = { email: storedUser };
    }
  }

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const displayName = user?.name || user?.email || "Guest";
  const coins = user?.coins || 0;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-blue-600 text-white flex items-center justify-center font-bold">
            SY
          </div>
          <div>
            <div className="font-bold text-lg dark:text-white">
              Smart Yatra
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              AI + Eco Coins → Smart Travel
            </div>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          {[
            ["Planner", "/planner"],
            ["Budget", "/budget"],
            ["Festival", "/calendar"],
            ["Community", "/community"],
            ["Safety", "/safety"],
            ["Suggestions", "/suggestions"],
          ].map(([label, path]) => (
            <Link
              key={label}
              to={path}
              className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {label}
            </Link>
          ))}

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700"
            title="Toggle Theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {!user && (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white"
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="px-3 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-semibold">
                🪙 {coins}
              </span>
              <span className="text-sm">
                Hi, <span className="font-semibold">{displayName}</span>
              </span>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl dark:text-white"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-700 p-4 space-y-2 text-sm">
          <button
            onClick={toggleTheme}
            className="w-full text-left px-3 py-2 rounded-lg border dark:border-slate-700"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {[
            ["Planner", "/planner"],
            ["Budget", "/budget"],
            ["Festival", "/calendar"],
            ["Community", "/community"],
            ["Safety", "/safety"],
            ["Suggestions", "/suggestions"],
          ].map(([label, path]) => (
            <Link
              key={label}
              to={path}
              className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {label}
            </Link>
          ))}

          {!user ? (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-lg">
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-600 text-white"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="px-3 py-2 text-yellow-600">
                🪙 {coins} Eco Coins
              </div>
              <div className="px-3 py-2">Hi, {displayName}</div>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

// export {};
// export default TopNav;








































// -------------------------------- Planner header (typed) ---------------------------------


type EarnAction = {
  id: number;
  title: string;
  coins: number;
  desc: string;
  tag: string;
};

type Reward = {
  id: number;
  title: string;
  coinsRequired: number;
  type: "Handicraft" | "Ticket";
  desc: string;
};

const EARN_ACTIONS: EarnAction[] = [
  {
    id: 1,
    title: "Daily Login Reward",
    coins: 2,
    desc: "Open the app and login once per day to keep your streak alive.",
    tag: "Daily"
  },
  {
    id: 2,
    title: "Give a Smart Suggestion",
    coins: 5,
    desc: "Share a useful travel tip or suggestion for other travelers.",
    tag: "Community"
  },
  {
    id: 3,
    title: "Share Trip Image / Memory",
    coins: 8,
    desc: "Upload a travel photo with a short story or caption.",
    tag: "Photo"
  },
  {
    id: 4,
    title: "Engage on Posts (Like + Comment)",
    coins: 6,
    desc: "Like & comment on other users’ travel posts (minimum 3 interactions).",
    tag: "Social"
  },
  {
    id: 5,
    title: "Follow Our Social Channels",
    coins: 6,
    desc: "Follow our Instagram / YouTube / other accounts or add your own social link.",
    tag: "Social"
  }
];

const REWARDS: Reward[] = [
  {
    id: 1,
    title: "Local Handicraft Souvenir",
    coinsRequired: 40,
    type: "Handicraft",
    desc: "Redeem for a small handcrafted item from verified local artisans."
  },
  {
    id: 2,
    title: "Museum / Fort Entry Ticket Discount",
    coinsRequired: 60,
    type: "Ticket",
    desc: "Use eco coins to get a discount on selected historical place tickets."
  },
  {
    id: 3,
    title: "Village Experience / Workshop Discount",
    coinsRequired: 80,
    type: "Handicraft",
    desc: "Save on pottery, weaving or handicraft workshops powered by local communities."
  }
];

// export function HomePage() {
//   // Mock eco coins – in real app this will come from backend / user profile
//   const [ecoCoins, setEcoCoins] = useState(18);
//   const levelGoal = 100; // target coins for next level

//   const handleLoginReward = () => setEcoCoins((c) => c + 2);
//   const handleSuggestionReward = () => setEcoCoins((c) => c + 5);
//   const handleImageShareReward = () => setEcoCoins((c) => c + 8);

//   const progress = Math.min(100, Math.round((ecoCoins / levelGoal) * 100));

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
//       <div className="max-w-6xl mx-auto p-6 space-y-6">
//         {/* TOP: HERO + COIN SUMMARY */}
//         <header className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
//           {/* HERO TEXT */}
//           <div className="md:col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">
//                 Welcome to <span className="text-green-600">Eco Travel Hub</span>
//               </h1>
//               <p className="mt-2 text-sm text-slate-600">
//                 Plan smarter trips, support local communities and earn{" "}
//                 <span className="font-semibold text-green-700">Eco Coins</span>{" "}
//                 for every valuable action you take.
//               </p>
//             </div>

//             <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
//               <div>
//                 <div className="text-slate-400">Today’s Login</div>
//                 <div className="font-semibold">+2 coins</div>
//               </div>
//               <div>
//                 <div className="text-slate-400">Suggest & Help</div>
//                 <div className="font-semibold">+5 coins / suggestion</div>
//               </div>
//               <div>
//                 <div className="text-slate-400">Share Travel Moments</div>
//                 <div className="font-semibold">+8 coins / image</div>
//               </div>
//             </div>
//           </div>

//           {/* COIN PANEL */}
//           <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
//             <div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium">Your Eco Coins</span>
//                 <span className="text-[11px] text-slate-500">
//                   Next reward at {levelGoal} coins
//                 </span>
//               </div>
//               <div className="mt-2 text-3xl font-bold text-green-700">
//                 {ecoCoins}
//                 <span className="text-sm text-slate-400 ml-1">EC</span>
//               </div>

//               {/* Progress */}
//               <div className="mt-3">
//                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
//                   <div
//                     className="h-2 bg-green-500 rounded-full transition-all"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//                 <div className="text-[11px] text-slate-500 mt-1">
//                   {progress}% of level goal
//                 </div>
//               </div>
//             </div>

//             {/* Quick demo buttons (mock actions) */}
//             <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
//               <button
//                 onClick={handleLoginReward}
//                 className="px-3 py-1 rounded bg-green-50 text-green-700 border border-green-100"
//               >
//                 Login (+2)
//               </button>
//               <button
//                 onClick={handleSuggestionReward}
//                 className="px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100"
//               >
//                 Add Suggestion (+5)
//               </button>
//               <button
//                 onClick={handleImageShareReward}
//                 className="px-3 py-1 rounded bg-purple-50 text-purple-700 border border-purple-100"
//               >
//                 Share Image (+8)
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* MAIN BODY: EARN COINS + REWARDS */}
//         <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* HOW TO EARN */}
//           <section className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
//             <h2 className="text-lg font-semibold flex items-center gap-2">
//               How to Earn Eco Coins
//               <span className="text-[11px] text-slate-500 font-normal">
//                 Engage, share and support responsibly
//               </span>
//             </h2>

//             <div className="mt-4 space-y-3">
//               {EARN_ACTIONS.map((a) => (
//                 <div
//                   key={a.id}
//                   className="border border-slate-100 rounded-xl p-3 flex justify-between items-start hover:border-green-200 transition"
//                 >
//                   <div>
//                     <div className="text-sm font-medium flex items-center gap-2">
//                       {a.title}
//                       <span className="text-[10px] px-2 py-[2px] rounded-full bg-slate-100 text-slate-500">
//                         {a.tag}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-600 mt-1">{a.desc}</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-xs text-slate-400">Reward</div>
//                     <div className="text-sm font-semibold text-green-700">
//                       +{a.coins} EC
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Social Call-to-Action Block */}
//             <div className="mt-5 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-xs">
//               <div className="font-medium mb-1">Social Boost & Creator Support</div>
//               <p className="text-slate-600">
//                 Earn extra coins when you{" "}
//                 <span className="font-semibold">like, comment & follow</span> travel
//                 creators or add your own Instagram / YouTube link under your profile.
//                 This helps build a real travel community, not just an app.
//               </p>
//             </div>
//           </section>

//           {/* REDEEM SECTION */}
//           <aside className="space-y-4">
//             <div className="bg-white rounded-2xl shadow p-5">
//               <h2 className="text-lg font-semibold">Redeem Your Eco Coins</h2>
//               <p className="text-xs text-slate-500 mt-1">
//                 Use your coins for real-world value: support artisans, get ticket
//                 discounts and more.
//               </p>

//               <div className="mt-4 space-y-3">
//                 {REWARDS.map((r) => (
//                   <div
//                     key={r.id}
//                     className="border border-slate-100 rounded-xl p-3 text-xs flex flex-col gap-1"
//                   >
//                     <div className="flex justify-between items-center">
//                       <div className="font-semibold text-slate-800">{r.title}</div>
//                       <span
//                         className={`px-2 py-[2px] rounded-full text-[10px] ${
//                           r.type === "Handicraft"
//                             ? "bg-orange-50 text-orange-700"
//                             : "bg-blue-50 text-blue-700"
//                         }`}
//                       >
//                         {r.type}
//                       </span>
//                     </div>
//                     <p className="text-slate-600">{r.desc}</p>
//                     <div className="flex justify-between items-center mt-1">
//                       <span className="text-[11px] text-slate-500">
//                         Requires{" "}
//                         <span className="font-semibold text-green-700">
//                           {r.coinsRequired} EC
//                         </span>
//                       </span>
//                       <button
//                         className="text-[11px] px-2 py-1 rounded bg-green-600 text-white disabled:bg-slate-200 disabled:text-slate-400"
//                         disabled={ecoCoins < r.coinsRequired}
//                       >
//                         {ecoCoins >= r.coinsRequired ? "Redeem" : "Not enough coins"}
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* QUICK SNAPSHOT */}
//             <div className="bg-white rounded-2xl shadow p-4 text-xs">
//               <div className="font-medium">Quick Snapshot</div>
//               <ul className="mt-2 space-y-1 text-slate-600">
//                 <li>• Login today → secure your +2 coins streak</li>
//                 <li>• Add 1 travel suggestion → +5 coins & help others</li>
//                 <li>• Share 1 travel photo → +8 coins & inspire community</li>
//                 <li>• Social engagement (likes/comments/follows) → +6 coins</li>
//               </ul>
//             </div>
//           </aside>
//         </main>
//       </div>
//     </div>
//   );
// }



// export function HomePage() {
//   const [ecoCoins, setEcoCoins] = useState(18);
//   const levelGoal = 100;

//   const handleLoginReward = () => setEcoCoins((c) => c + 2);
//   const handleSuggestionReward = () => setEcoCoins((c) => c + 5);
//   const handleImageShareReward = () => setEcoCoins((c) => c + 8);

//   const progress = Math.min(100, Math.round((ecoCoins / levelGoal) * 100));

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white text-slate-800">
//       <div className="max-w-6xl mx-auto p-6 space-y-8">

//         {/* ================= HERO + COINS ================= */}
//         <header className="grid grid-cols-1 md:grid-cols-3 gap-6">

//           {/* HERO */}
//           <div className="md:col-span-2 rounded-3xl p-6 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
//             <h1 className="text-2xl font-bold">
//               Eco Travel Hub 🌍
//             </h1>
//             <p className="mt-2 text-sm text-green-100">
//               Plan smarter trips, support local communities and earn{" "}
//               <span className="font-semibold text-white">Eco Coins</span>{" "}
//               with every responsible action.
//             </p>

//             <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
//               <div className="bg-white/10 rounded-xl p-3">
//                 <div className="opacity-80">Daily Login</div>
//                 <div className="font-semibold">+2 Coins</div>
//               </div>
//               <div className="bg-white/10 rounded-xl p-3">
//                 <div className="opacity-80">Suggestions</div>
//                 <div className="font-semibold">+5 Coins</div>
//               </div>
//               <div className="bg-white/10 rounded-xl p-3">
//                 <div className="opacity-80">Photo Sharing</div>
//                 <div className="font-semibold">+8 Coins</div>
//               </div>
//             </div>
//           </div>

//           {/* COIN PANEL */}
//           <div className="bg-white rounded-3xl shadow-lg p-5 flex flex-col justify-between border border-blue-100">
//             <div>
//               <div className="flex justify-between text-sm font-medium">
//                 <span>Your Eco Coins</span>
//                 <span className="text-xs text-slate-500">
//                   Next level: {levelGoal}
//                 </span>
//               </div>

//               <div className="mt-3 text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//                 {ecoCoins} EC
//               </div>

//               <div className="mt-4">
//                 <div className="w-full h-2 bg-slate-100 rounded-full">
//                   <div
//                     className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>
//                 <div className="text-[11px] text-slate-500 mt-1">
//                   {progress}% progress to next reward
//                 </div>
//               </div>
//             </div>

//             <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
//               <button onClick={handleLoginReward}
//                 className="px-3 py-1 rounded-lg bg-green-100 text-green-700">
//                 Login +2
//               </button>
//               <button onClick={handleSuggestionReward}
//                 className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700">
//                 Suggest +5
//               </button>
//               <button onClick={handleImageShareReward}
//                 className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700">
//                 Share +8
//               </button>
//             </div>
//           </div>
//         </header>

//         {/* ================= MAIN CONTENT ================= */}
//         <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* EARN COINS */}
//           <section className="lg:col-span-2 bg-white rounded-3xl shadow p-6 border border-green-100">
//             <h2 className="text-lg font-semibold text-green-700">
//               How to Earn Eco Coins
//             </h2>

//             <div className="mt-4 space-y-3">
//               {EARN_ACTIONS.map((a) => (
//                 <div
//                   key={a.id}
//                   className="p-4 rounded-2xl border border-slate-100 hover:border-green-300 transition flex justify-between"
//                 >
//                   <div>
//                     <div className="font-medium text-sm flex gap-2">
//                       {a.title}
//                       <span className="text-[10px] px-2 py-[2px] rounded-full bg-blue-50 text-blue-700">
//                         {a.tag}
//                       </span>
//                     </div>
//                     <p className="text-xs text-slate-600 mt-1">{a.desc}</p>
//                   </div>

//                   <div className="text-right">
//                     <div className="text-xs text-slate-400">Reward</div>
//                     <div className="font-semibold text-green-700">
//                       +{a.coins} EC
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-green-50 border border-dashed border-blue-200 text-xs">
//               <div className="font-medium text-blue-700">
//                 Community & Social Boost
//               </div>
//               <p className="mt-1 text-slate-600">
//                 Like, comment, follow creators or add your own social profile
//                 and earn bonus eco coins while growing a real travel community.
//               </p>
//             </div>
//           </section>

//           {/* REDEEM */}
//           <aside className="space-y-4">

//             <div className="bg-white rounded-3xl shadow p-5 border border-blue-100">
//               <h2 className="text-lg font-semibold text-blue-700">
//                 Redeem Eco Coins
//               </h2>

//               <div className="mt-4 space-y-3">
//                 {REWARDS.map((r) => (
//                   <div
//                     key={r.id}
//                     className="rounded-2xl border border-slate-100 p-4 text-xs"
//                   >
//                     <div className="flex justify-between">
//                       <div className="font-semibold">{r.title}</div>
//                       <span className={`px-2 py-[2px] rounded-full text-[10px]
//                         ${r.type === "Handicraft"
//                           ? "bg-orange-100 text-orange-700"
//                           : "bg-blue-100 text-blue-700"}`}>
//                         {r.type}
//                       </span>
//                     </div>

//                     <p className="mt-1 text-slate-600">{r.desc}</p>

//                     <div className="mt-2 flex justify-between items-center">
//                       <span className="text-[11px]">
//                         {r.coinsRequired} EC required
//                       </span>
//                       <button
//                         disabled={ecoCoins < r.coinsRequired}
//                         className="px-3 py-1 rounded-lg text-white text-[11px]
//                         bg-gradient-to-r from-green-600 to-blue-600
//                         disabled:from-slate-300 disabled:to-slate-300"
//                       >
//                         Redeem
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl shadow p-4 text-xs border border-green-100">
//               <div className="font-medium text-green-700">Quick Snapshot</div>
//               <ul className="mt-2 space-y-1 text-slate-600">
//                 <li>• Login daily → +2 coins</li>
//                 <li>• Add suggestions → +5 coins</li>
//                 <li>• Share photos → +8 coins</li>
//                 <li>• Social engagement → +6 coins</li>
//               </ul>
//             </div>

//           </aside>
//         </main>
//       </div>
//     </div>
//   );
// }
// export {};


export function HomePage() {
  const [ecoCoins, setEcoCoins] = useState(18);
  const levelGoal = 100;

  const handleLoginReward = () => setEcoCoins((c) => c + 2);
  const handleSuggestionReward = () => setEcoCoins((c) => c + 5);
  const handleImageShareReward = () => setEcoCoins((c) => c + 8);

  const progress = Math.min(100, Math.round((ecoCoins / levelGoal) * 100));

  return (
    <div className="min-h-screen transition-colors duration-300
      bg-gradient-to-br from-green-50 via-blue-50 to-white
      dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-800
      text-slate-800 dark:text-slate-100"
    >
      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* ================= HERO + COINS ================= */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* HERO */}
          <div className="md:col-span-2 rounded-3xl p-6 shadow-lg
            bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <h1 className="text-2xl font-bold">
              Eco Travel Hub 🌍
            </h1>
            <p className="mt-2 text-sm text-green-100">
              Plan smarter trips, support local communities and earn{" "}
              <span className="font-semibold text-white">Eco Coins</span>{" "}
              with every responsible action.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
              {[
                ["Daily Login", "+2 Coins"],
                ["Suggestions", "+5 Coins"],
                ["Photo Sharing", "+8 Coins"],
              ].map(([title, value]) => (
                <div key={title} className="bg-white/10 rounded-xl p-3">
                  <div className="opacity-80">{title}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* COIN PANEL */}
          <div className="rounded-3xl shadow-lg p-5 flex flex-col justify-between
            bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
            <div>
              <div className="flex justify-between text-sm font-medium">
                <span>Your Eco Coins</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Next level: {levelGoal}
                </span>
              </div>

              <div className="mt-3 text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {ecoCoins} EC
              </div>

              <div className="mt-4">
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {progress}% progress to next reward
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-[11px]">
              <button onClick={handleLoginReward}
                className="px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Login +2
              </button>
              <button onClick={handleSuggestionReward}
                className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Suggest +5
              </button>
              <button onClick={handleImageShareReward}
                className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                Share +8
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* EARN COINS */}
          <section className="lg:col-span-2 rounded-3xl shadow p-6
            bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-400">
              How to Earn Eco Coins
            </h2>

            <div className="mt-4 space-y-3">
              {EARN_ACTIONS.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-2xl border transition
                  border-slate-100 dark:border-slate-700
                  hover:border-green-300 dark:hover:border-green-500
                  flex justify-between"
                >
                  <div>
                    <div className="font-medium text-sm flex gap-2">
                      {a.title}
                      <span className="text-[10px] px-2 py-[2px] rounded-full
                        bg-blue-50 dark:bg-blue-900/40
                        text-blue-700 dark:text-blue-300">
                        {a.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {a.desc}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Reward</div>
                    <div className="font-semibold text-green-700 dark:text-green-400">
                      +{a.coins} EC
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl text-xs
              bg-gradient-to-r from-blue-50 to-green-50
              dark:from-slate-700 dark:to-slate-700
              border border-dashed border-blue-200 dark:border-slate-600">
              <div className="font-medium text-blue-700 dark:text-blue-300">
                Community & Social Boost
              </div>
              <p className="mt-1 text-slate-600 dark:text-slate-300">
                Like, comment, follow creators or add your own social profile
                and earn bonus eco coins while growing a real travel community.
              </p>
            </div>
          </section>

          {/* REDEEM */}
          <aside className="space-y-4">

            <div className="rounded-3xl shadow p-5
              bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-400">
                Redeem Eco Coins
              </h2>

              <div className="mt-4 space-y-3">
                {REWARDS.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border p-4 text-xs
                    border-slate-100 dark:border-slate-700"
                  >
                    <div className="flex justify-between">
                      <div className="font-semibold">{r.title}</div>
                      <span className={`px-2 py-[2px] rounded-full text-[10px]
                        ${r.type === "Handicraft"
                          ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300"
                          : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"}`}>
                        {r.type}
                      </span>
                    </div>

                    <p className="mt-1 text-slate-600 dark:text-slate-300">
                      {r.desc}
                    </p>

                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-[11px]">
                        {r.coinsRequired} EC required
                      </span>
                      <button
                        disabled={ecoCoins < r.coinsRequired}
                        className="px-3 py-1 rounded-lg text-white text-[11px]
                        bg-gradient-to-r from-green-600 to-blue-600
                        disabled:from-slate-400 disabled:to-slate-400"
                      >
                        Redeem
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl shadow p-4 text-xs
              bg-white dark:bg-slate-800 border border-green-100 dark:border-slate-700">
              <div className="font-medium text-green-700 dark:text-green-400">
                Quick Snapshot
              </div>
              <ul className="mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                <li>• Login daily → +2 coins</li>
                <li>• Add suggestions → +5 coins</li>
                <li>• Share photos → +8 coins</li>
                <li>• Social engagement → +6 coins</li>
              </ul>
            </div>

          </aside>
        </main>
      </div>
    </div>
  );
}


























































// // ---------------------------------------Planner Page --------------------------------------------------------------------



interface Itinerary {
  start: string;
  end: string;
  days: number;
  budget: number;
  interests: string[];
  stops: ItineraryStop[];
}


function PlannerPage() {
  const [start, setStart] = useState<string>("Paris");
  const [end, setEnd] = useState<string>("Barcelona");
  const [days, setDays] = useState<number>(3);
  const [interests, setInterests] = useState<string[]>(["nature"]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [flights, setFlights] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const toggleInterest = (tag: string) => {
    setInterests((cur) =>
      cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
    );
  };

  const getDefaultDepartureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  /* ⭐ GOOGLE MAP INTEGRATION ⭐ */
  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(
      document.getElementById("planner-map") as HTMLElement,
      {
        center: { lat: 28.6139, lng: 77.2090 }, // Delhi default
        zoom: 6,
      }
    );

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
    });

    // Enable autocomplete for inputs
    const startInput = document.getElementById("start") as HTMLInputElement;
    const endInput = document.getElementById("destination") as HTMLInputElement;
    if (startInput) new window.google.maps.places.Autocomplete(startInput);
    if (endInput) new window.google.maps.places.Autocomplete(endInput);

    // Auto draw route when itinerary is generated
    if (itinerary) {
      directionsService.route(
        {
          origin: itinerary.start,
          destination: itinerary.end,
          travelMode: "DRIVING",
        },
        (result: any, status: any) => {
          if (status === "OK") {
            directionsRenderer.setDirections(result);
          }
        }
      );
    }
  }, [itinerary]);
  /* ⭐ END GOOGLE MAP INTEGRATION ⭐ */


  // ---------------- AMADEUS API INTEGRATION -----------------
  const generateItinerary = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    setFlights([]);
    setPois([]);
    setActivities([]);

    try {
      const [startRes, endRes] = await Promise.all([
        searchCityByName(start),
        searchCityByName(end),
      ]);

      const startCity = (startRes as any)?.data?.[0];
      const endCity = (endRes as any)?.data?.[0];

      if (!startCity || !endCity) {
        setError(
          "Could not find one of the cities. Try big cities like Paris / Barcelona / Delhi / Mumbai."
        );
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

      const [flightResult, poiResult, actResult] = await Promise.allSettled([
        searchFlights(originCode, destCode, departureDate, 1),
        getPointsOfInterest(destLat, destLon, 20),
        getActivities(destLat, destLon, 20),
      ]);

      if (flightResult.status === "fulfilled") {
        const flightData = (flightResult.value as any)?.data || [];
        setFlights(flightData);
      } 

      if (actResult.status === "fulfilled") {
        const actData = (actResult.value as any)?.data || [];
        setActivities(actData);
      }

      let poiData: any[] = [];
      if (poiResult.status === "fulfilled") {
        poiData = ((poiResult.value as any) || {}).data || [];
        setPois(poiData);
      }

      let stops: ItineraryStop[] = [];

      if (Array.isArray(poiData) && poiData.length > 0) {
        stops = poiData.slice(0, 5).map((p: any, i: number) => ({
          id: "poi_" + i,
          name: p.name || `Place ${i + 1}`,
          type: p.category || "place",
          durationHours: 3,
          ecoScore: Math.floor(Math.random() * 3) + 7,
        }));
      } else if (flights.length > 0) {
        stops = [
          {
            id: "flight_only",
            name: `Travel to ${end}`,
            type: "destination",
            durationHours: 3,
            ecoScore: 7,
          },
        ];
      } else {
        setError(
          `No places or flights found for this route. Try a big city like Paris → Barcelona.`
        );
        setLoading(false);
        return;
      }

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
      setError(
        err?.message || "Unable to fetch itinerary. Check console / API limits."
      );
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------------------

// ======== API MODE ====
// ----------------------END OF PLANNER PAGE-----------------------------
// return (

//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
//       bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
//       <section className="col-span-8 bg-white p-6 rounded-2xl shadow">
//         <h3 className="text-xl font-semibold">
//           AI-Powered Trip Planner (Amadeus Integration)
//         </h3>
//         <p className="text-sm text-slate-500">
//           Flights + places to visit + activities from Amadeus APIs.
//         </p>


//         <div className="mt-4 grid grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm">Start city</label>
//             <input
//               value={start}
//               onChange={(e) => setStart(e.target.value)}
//               className="w-full p-2 border rounded mt-1"
//               placeholder="e.g. Paris, Delhi"
//             />
//             <p className="text-[11px] text-slate-400 mt-1">
//               Try: Paris, Barcelona, Delhi, Mumbai for testing.
//             </p>
//           </div>
//           <div>
//             <label className="text-sm">End city</label>
//             <input
//               value={end}
//               onChange={(e) => setEnd(e.target.value)}
//               className="w-full p-2 border rounded mt-1"
//               placeholder="e.g. Barcelona, Mumbai"
//             />
//           </div>
//           <div>
//             <label className="text-sm">Days</label>
//             <input
//               type="number"
//               value={days}
//               onChange={(e) => setDays(Number(e.target.value))}
//               className="w-full p-2 border rounded mt-1"
//             />
//           </div>
//           <div>
//             <label className="text-sm">
//               Budget preset is on the Budget page
//             </label>
//             <div className="mt-1 text-xs text-slate-500">
//               Budget & eco suggestions are on the Budget page.
//             </div>
//           </div>
//         </div>

//         <div className="mt-4">
//           <label className="text-sm">Interests</label>
//           <div className="flex gap-2 mt-2">
//             {["nature", "culture", "adventure", "spiritual"].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => toggleInterest(tag)}
//                 className={`px-3 py-1 rounded-full border ${
//                   interests.includes(tag) ? "bg-green-50" : ""
//                 }`}
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="mt-4 flex gap-3">
//           <button
//             onClick={generateItinerary}
//             disabled={loading}
//             className="px-4 py-2 rounded bg-green-600 text-white"
//           >
//             {loading ? "Loading..." : "Generate Itinerary"}
//           </button>
//           <button className="px-4 py-2 rounded border">Use AI (TODO)</button>
//         </div>

// {/* ⭐ Google Map Container ⭐ */}
// <div
//   id="planner-map"
//   className="mt-6 h-64 bg-slate-200 rounded overflow-hidden shadow-inner"
//   style={{ width: "100%" }}
// ></div>
//         <div className="mt-6 bg-slate-50 p-4 rounded space-y-4">
//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           {!itinerary && !loading && !error && (
//             <div className="text-slate-500">
//               No itinerary yet — generate to see flights, key places, and
//               activities.
//             </div>
//           )}

//           {itinerary && (
//             <div>
//               <h4 className="font-semibold">
//                 Itinerary — {itinerary.start} → {itinerary.end} (
//                 {itinerary.days} days)
//               </h4>
//               <ul className="mt-2 space-y-2">
//                 {itinerary.stops.map((p) => (
//                   <li key={p.id} className="p-2 bg-white rounded shadow-sm">
//                     <div className="font-medium">
//                       {p.name} ({p.type})
//                     </div>
//                     <div className="text-xs text-slate-500">
//                       Duration: {p.durationHours} hrs • Eco score:{" "}
//                       {p.ecoScore ?? "—"}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Flights */}
//           {flights.length > 0 && (
//             <div className="mt-4">
//               <h4 className="font-semibold text-sm">Suggested Flights</h4>
//               <ul className="mt-1 space-y-1 text-xs">
//                 {flights.map((f: any, i) => {
//                   const price = f.price?.total;
//                   const itinerary = f.itineraries?.[0];
//                   const duration = itinerary?.duration;
//                   const segments = itinerary?.segments || [];
//                   const firstSegment = segments[0];
//                   const lastSegment = segments[segments.length - 1];

//                   return (
//                     <li key={i} className="bg-white rounded p-2 shadow-sm">
//                       <div>
//                         {firstSegment?.departure?.iataCode} →{" "}
//                         {lastSegment?.arrival?.iataCode} • {duration}
//                       </div>
//                       <div className="text-slate-500">
//                         Price: {price ? `₹${price}` : "N/A"}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>
//           )}

//           {/* Activities */}
//           {activities.length > 0 && (
//             <div className="mt-4">
//               <h4 className="font-semibold text-sm">Tours & Activities</h4>
//               <ul className="mt-1 space-y-1 text-xs">
//                 {activities.slice(0, 5).map((a: any, i) => (
//                   <li key={i} className="bg-white rounded p-2 shadow-sm">
//                     <div>{a.name}</div>
//                     <div className="text-slate-500">
//                       {a.shortDescription || a.description || ""}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </section>

    //   <aside className="col-span-4 space-y-4">
    //     <div className="bg-white p-4 rounded shadow-sm">
    //       <div className="text-sm text-slate-500">Quick Actions</div>
    //       <div className="mt-2 flex flex-col gap-2">
    //         <button className="p-2 rounded border text-sm">
    //           Save Plan (TODO: persist)
    //         </button>
    //         <button className="p-2 rounded border text-sm">Share Plan</button>
    //         <button className="p-2 rounded border text-sm">
    //           Book Guide (Local Connect)
    //         </button>
    //       </div>
    //     </div>

    //     <div className="bg-white p-4 rounded shadow-sm">
    //       <div className="font-medium">Before Booking</div>
    //       <div className="text-xs text-slate-500 mt-2">
    //         Check Safety Hub for weather and local news (linked to Safety page).
    //       </div>
    //       <Link
    //         to="/safety"
    //         className="mt-3 inline-block text-sm text-green-600"
    //       >
    //         Open Safety Hub →
    //       </Link>
    //     </div>
    //   </aside>
    // </div>
//   );
// }


return (
  <div
    className="
      max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
      bg-slate-100 dark:bg-slate-950
      text-slate-800 dark:text-slate-100
    "
  >
    {/* ================= MAIN SECTION ================= */}
    <section
      className="
        col-span-12 lg:col-span-8
        bg-white dark:bg-slate-900
        p-6 rounded-2xl shadow
        border border-slate-200 dark:border-slate-700
      "
    >
      <h3 className="text-xl font-semibold">
        AI-Powered Trip Planner (Amadeus Integration)
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Flights + places to visit + activities from Amadeus APIs.
      </p>

      {/* INPUTS */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Start city</label>
          <input
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 mt-1 rounded border
              bg-white dark:bg-slate-800
              border-slate-300 dark:border-slate-700"
            placeholder="e.g. Paris, Delhi"
          />
          <p className="text-[11px] text-slate-400">
            Try: Paris, Barcelona, Delhi, Mumbai
          </p>
        </div>

        <div>
          <label className="text-sm">End city</label>
          <input
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 mt-1 rounded border
              bg-white dark:bg-slate-800
              border-slate-300 dark:border-slate-700"
            placeholder="e.g. Barcelona"
          />
        </div>

        <div>
          <label className="text-sm">Days</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full p-2 mt-1 rounded border
              bg-white dark:bg-slate-800
              border-slate-300 dark:border-slate-700"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          Budget & eco suggestions are available on the Budget page.
        </div>
      </div>

      {/* INTERESTS */}
      <div className="mt-4">
        <label className="text-sm">Interests</label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {["nature", "culture", "adventure", "spiritual"].map((tag) => (
            <button
              key={tag}
              onClick={() => toggleInterest(tag)}
              className={`px-3 py-1 rounded-full text-sm border
                ${
                  interests.includes(tag)
                    ? "bg-green-100 dark:bg-green-900 border-green-500"
                    : "border-slate-300 dark:border-slate-700"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={generateItinerary}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-white
          bg-gradient-to-r from-green-600 to-blue-600"
        >
          {loading ? "Loading..." : "Generate Itinerary"}
        </button>

        <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700">
          Use AI (TODO)
        </button>
      </div>

      {/* ⭐ GOOGLE MAP ⭐ */}
      <div
        id="planner-map"
        className="mt-6 h-64 rounded shadow-inner
        bg-slate-200 dark:bg-slate-700"
        style={{ width: "100%" }}
      />

      {/* ================= RESULTS ================= */}
      <div
        className="mt-6 p-4 rounded-xl space-y-4
        bg-slate-50 dark:bg-slate-900
        border border-slate-200 dark:border-slate-700"
      >
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm font-medium">
            {error}
          </p>
        )}

        {!itinerary && !loading && !error && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No itinerary yet — generate to see flights, key places, and activities.
          </p>
        )}

        {itinerary && (
          <div>
            <h4 className="font-semibold">
              Itinerary — {itinerary.start} → {itinerary.end} ({itinerary.days} days)
            </h4>

            <ul className="mt-3 space-y-2">
              {itinerary.stops.map((p) => (
                <li
                  key={p.id}
                  className="p-3 rounded-lg shadow-sm
                  bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700"
                >
                  <div className="font-medium">
                    {p.name} ({p.type})
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Duration: {p.durationHours} hrs • Eco score: {p.ecoScore ?? "—"}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FLIGHTS */}
      {flights.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm">Suggested Flights</h4>
              <ul className="mt-1 font-semibold text-sm space-y-1 text-xs">
                {flights.map((f: any, i) => {
                  const price = f.price?.total;
                  const itinerary = f.itineraries?.[0];
                  const duration = itinerary?.duration;
                  const segments = itinerary?.segments || [];
                  const firstSegment = segments[0];
                  const lastSegment = segments[segments.length - 1];

                  return (
                    <li key={i} className="bg-green font-semibold text-sm rounded p-2 shadow-sm">
                      <div>
                        {firstSegment?.departure?.iataCode} →{" "}
                        {lastSegment?.arrival?.iataCode} • {duration}
                      </div>
                      <div className=" text-slate-500">
                        Price: {price ? `₹${price}` : "N/A"}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        {/* ACTIVITIES */}
        {activities.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm">Tours & Activities</h4>
            <ul className="mt-2 space-y-2 text-xs">
              {activities.slice(0, 5).map((a: any, i) => (
                <li
                  key={i}
                  className="p-2 rounded-lg
                  bg-white dark:bg-slate-800
                  border border-slate-200 dark:border-slate-700"
                >
                  <div className="font-medium">{a.name}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>

    {/* ================= SIDEBAR ================= */}
<aside className="col-span-12 lg:col-span-4 space-y-4">

  {/* QUICK ACTIONS */}
  <div
    className="
      p-5 rounded-2xl shadow
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-700
    "
  >
    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
      Quick Actions
    </div>

    <div className="mt-4 flex flex-col gap-3">
      <button
        className="
          p-2.5 rounded-lg text-sm font-medium
          border border-slate-300 dark:border-slate-700
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition
        "
      >
        💾 Save Plan
      </button>

      <button
        className="
          p-2.5 rounded-lg text-sm font-medium
          border border-slate-300 dark:border-slate-700
          hover:bg-slate-100 dark:hover:bg-slate-800
          transition
        "
      >
        🔗 Share Plan
      </button>

      <button
        className="
          p-2.5 rounded-lg text-sm font-medium
          bg-green-600 hover:bg-green-700
          text-white transition
        "
      >
        👤 Book Guide
      </button>
    </div>
  </div>

  {/* BEFORE BOOKING */}
  <div
    className="
      p-5 rounded-2xl shadow
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-700
    "
  >
    <div className="font-semibold text-slate-800 dark:text-slate-100">
      Before Booking
    </div>

    <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
      Check Safety Hub for weather updates, local alerts, and community
      travel advisories before confirming your plan.
    </div>

    <Link
      to="/safety"
      className="
        inline-flex items-center gap-1
        mt-4 text-sm font-medium
        text-green-600 dark:text-green-400
        hover:underline
      "
    >
      Open Safety Hub →
    </Link>
  </div>

</aside>









        </div>
      // </div>
    // </aside>
  // </div>
   













  
);









































{/* // ============================================================  above main code of an planner page ========= */}



//  function PlannerPage() {------
//   // -------------------- STATE (UNCHANGED) --------------------
//   const [start, setStart] = useState<string>("Paris");
//   const [end, setEnd] = useState<string>("Barcelona");
//   const [days, setDays] = useState<number>(3);
//   const [interests, setInterests] = useState<string[]>(["nature"]);
//   const [itinerary, setItinerary] = useState<Itinerary | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [flights, setFlights] = useState<any[]>([]);
//   const [pois, setPois] = useState<any[]>([]);
//   const [activities, setActivities] = useState<any[]>([]);

// // const [loading, setLoading] = useState(false);

//   const generateItinerary = async () => {
//     setLoading(true);
//     // logic
//     setLoading(false);
//   };









//   const toggleInterest = (tag: string) => {
//     setInterests((cur) =>
//       cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
//     );
//   };

//   // -------------------- GOOGLE MAP (UNCHANGED) --------------------
//   useEffect(() => {
//     if (!window.google) return;

//     const map = new window.google.maps.Map(
//       document.getElementById("planner-map") as HTMLElement,
//       {
//         center: { lat: 28.6139, lng: 77.209 },
//         zoom: 6,
//       }
//     );

//     if (itinerary) {
//       const ds = new window.google.maps.DirectionsService();
//       const dr = new window.google.maps.DirectionsRenderer({ map });

//       ds.route(
//         {
//           origin: itinerary.start,
//           destination: itinerary.end,
//           travelMode: "DRIVING",
//         },
//         (res: any, status: any) => {
//           if (status === "OK") dr.setDirections(res);
//         }
//       );
//     }
//   }, [itinerary]);






















//   // -------------------- UI --------------------
//   return (
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
//       text-slate-800 dark:text-slate-100">

//       {/* ================= LEFT : MAIN PLANNER ================= */}
//       <section className="col-span-12 lg:col-span-8
//         bg-white dark:bg-slate-800
//         rounded-3xl shadow p-6
//         border border-slate-200 dark:border-slate-700">

//         <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
//           AI-Powered Trip Planner
//         </h3>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           Flights, places & activities powered by Amadeus APIs
//         </p>

//         {/* FORM */}
//         <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

//           <div>
//             <label>Start City</label>
//             <input
//               value={start}
//               onChange={(e) => setStart(e.target.value)}
//               className="w-full mt-1 p-2 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             />
//           </div>

//           <div>
//             <label>End City</label>
//             <input
//               value={end}
//               onChange={(e) => setEnd(e.target.value)}
//               className="w-full mt-1 p-2 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             />
//           </div>

//           <div>
//             <label>Days</label>
//             <input
//               type="number"
//               value={days}
//               onChange={(e) => setDays(Number(e.target.value))}
//               className="w-full mt-1 p-2 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             />
//           </div>

//           <div className="text-xs text-slate-500 dark:text-slate-400 mt-6">
//             Budget & eco suggestions are available on the Budget page.
//           </div>
//         </div>

//         {/* INTERESTS */}
//         <div className="mt-5">
//           <label className="text-sm">Interests</label>
//           <div className="mt-2 flex flex-wrap gap-2">
//             {["nature", "culture", "adventure", "spiritual"].map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => toggleInterest(tag)}
//                 className={`px-3 py-1 rounded-full border text-xs
//                 ${
//                   interests.includes(tag)
//                     ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
//                     : "border-slate-300 dark:border-slate-600"
//                 }`}
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ACTION */}
//         <div className="mt-5 flex gap-3">
//           <button
//             onClick={generateItinerary}
//             disabled={loading}
//             className="px-5 py-2 rounded-lg text-white font-medium
//               bg-gradient-to-r from-green-600 to-blue-600"
//           >
//             {loading ? "Generating..." : "Generate Itinerary"}
//           </button>
//           <button className="px-4 py-2 rounded-lg border text-sm">
//             Use AI (Coming Soon)
//           </button>
//         </div>

//         {/* MAP */}
//         <div
//           id="planner-map"
//           className="mt-6 h-64 rounded-2xl
//             bg-slate-200 dark:bg-slate-700"
//         />

//         {/* RESULT */}
//         <div className="mt-6 p-4 rounded-2xl
//           bg-slate-50 dark:bg-slate-900">

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           {!itinerary && !loading && !error && (
//             <p className="text-slate-500 dark:text-slate-400 text-sm">
//               No itinerary yet — generate to see results.
//             </p>
//           )}

//           {itinerary && (
//             <>
//               <h4 className="font-semibold">
//                 {itinerary.start} → {itinerary.end} ({itinerary.days} days)
//               </h4>

//               <ul className="mt-3 space-y-2">
//                 {itinerary.stops.map((p) => (
//                   <li
//                     key={p.id}
//                     className="p-3 rounded-xl
//                       bg-white dark:bg-slate-800 shadow-sm"
//                   >
//                     <div className="font-medium">{p.name}</div>
//                     <div className="text-xs text-slate-500">
//                       {p.durationHours} hrs • Eco score {p.ecoScore}
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       </section>

//       {/* ================= RIGHT : SIDEBAR ================= */}
//       <aside className="col-span-12 lg:col-span-4 space-y-4">

//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
//           <div className="font-medium">Quick Actions</div>
//           <div className="mt-3 flex flex-col gap-2 text-sm">
//             <button className="p-2 rounded border">Save Plan</button>
//             <button className="p-2 rounded border">Share Plan</button>
//             <button className="p-2 rounded border">Book Local Guide</button>
//           </div>
//         </div>

//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
//           <div className="font-medium">Before Booking</div>
//           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
//             Check Safety Hub for weather & local alerts.
//           </p>
//           <Link
//             to="/safety"
//             className="inline-block mt-3 text-sm text-green-600"
//           >
//             Open Safety Hub →
//           </Link>
//         </div>

//       </aside>
//     </div>
//   );
// }


// ======================================DESING PAGE OF PLANNER END======================




// _________________________________ BUDGET PAGE SECTION _________________________________________

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);
};

type BudgetPreset = "Backpacker" | "Comfort" | "Premium";

interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transport: number;
  experiences: number;
}

const BudgetPage: React.FC = () => {
  const [preset, setPreset] = useState<BudgetPreset>("Comfort");
  const [budgetInput, setBudgetInput] = useState<string>("");
  const [daysInput, setDaysInput] = useState<string>("");

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("budgetData");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.preset) setPreset(parsed.preset);
      if (parsed.budgetInput) setBudgetInput(parsed.budgetInput);
      if (parsed.daysInput) setDaysInput(parsed.daysInput);
    }
  }, []);

  const computeBreakdown = (p: BudgetPreset): BudgetBreakdown => {
    if (p === "Backpacker")
      return { accommodation: 30, food: 30, transport: 25, experiences: 15 };
    if (p === "Premium")
      return { accommodation: 55, food: 15, transport: 15, experiences: 15 };
    // Comfort
    return { accommodation: 45, food: 20, transport: 20, experiences: 15 };
  };

  const breakdown = computeBreakdown(preset);
  const totalBudget = Math.max(0, Number(budgetInput) || 0);
  const totalDays = Math.max(0, Number(daysInput) || 0);

  const calcAmount = (percent: number) =>
    totalBudget ? Math.round((totalBudget * percent) / 100) : 0;

  const amounts = {
    accommodation: calcAmount(breakdown.accommodation),
    food: calcAmount(breakdown.food),
    transport: calcAmount(breakdown.transport),
    experiences: calcAmount(breakdown.experiences),
  };

  const perDay =
    totalBudget > 0 && totalDays > 0
      ? Math.round(totalBudget / totalDays)
      : 0;

  // Highest spending category – used in Smart Insights
  const highestCategory = (() => {
    const entries = Object.entries(breakdown) as [keyof BudgetBreakdown, number][];
    const [maxKey] = entries.reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      entries[0]
    );
    switch (maxKey) {
      case "accommodation":
        return "Accommodation";
      case "food":
        return "Food & Drinks";
      case "transport":
        return "Transport";
      case "experiences":
        return "Experiences & Activities";
      default:
        return "";
    }
  })();

  // Save to localStorage
  const saveBudget = () => {
    localStorage.setItem(
      "budgetData",
      JSON.stringify({ preset, budgetInput, daysInput })
    );
    alert("Budget saved ✔");
  };

  // Export visible budget report to PDF
  const exportPDF = async () => {
    const report = document.getElementById("budget-report");
    if (!report) return;
    const canvas = await html2canvas(report);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 5, 5, 200, 285);
    pdf.save("Budget_Report.pdf");
  };

  const pieData = {
    labels: ["Accommodation", "Food", "Transport", "Experiences"],
    datasets: [
      {
        data: [
          breakdown.accommodation,
          breakdown.food,
          breakdown.transport,
          breakdown.experiences,
        ],
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const barData = {
    labels: ["Accommodation", "Food", "Transport", "Experiences"],
    datasets: [
      {
        label: "Budget Split (₹)",
        data: [
          amounts.accommodation,
          amounts.food,
          amounts.transport,
          amounts.experiences,
        ],
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

//   return (
//     <div
//       id="budget-report"
//       className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6"
//     >
//       {/* MAIN SECTION */}
//       <section className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow space-y-6">
//         <div>
//           <h3 className="text-xl font-semibold">
//             Smart Budgeting & Eco Suggestions
//           </h3>
//           <p className="text-sm text-slate-500 mt-1">
//             Enter your minimum trip budget and get a smart, visual split of your
//             expenses based on your travel style. This helps you predict where
//             your money will go before you travel.
//           </p>
//         </div>

//         {/* Inputs */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="md:col-span-1">
//             <label className="text-sm font-medium">
//               Minimum Trip Budget (₹)
//             </label>
//             <input
//               type="number"
//               value={budgetInput}
//               onChange={(e) => setBudgetInput(e.target.value)}
//               placeholder="e.g. 15000"
//               className="w-full p-2 border rounded mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="text-sm font-medium">Trip Days (optional)</label>
//             <input
//               type="number"
//               value={daysInput}
//               onChange={(e) => setDaysInput(e.target.value)}
//               placeholder="e.g. 5"
//               className="w-full p-2 border rounded mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="md:col-span-1">
//             <label className="text-sm font-medium">Travel Style Preset</label>
//             <select
//               value={preset}
//               onChange={(e) => setPreset(e.target.value as BudgetPreset)}
//               className="w-full p-2 border rounded mt-1 text-sm"
//             >
//               <option value="Backpacker">Backpacker (Low-cost)</option>
//               <option value="Comfort">Comfort (Balanced)</option>
//               <option value="Premium">Premium (Luxury focused)</option>
//             </select>
//             <div className="mt-2 text-xs text-slate-500">
//               Preset controls the percentage split between categories.
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-slate-50 p-4 rounded">
//             <div className="font-medium mb-2">Pie View (Percentages)</div>
//             <Pie data={pieData} />
//           </div>
//           <div className="bg-slate-50 p-4 rounded">
//             <div className="font-medium mb-2">Bar View (₹ Amounts)</div>
//             <Bar data={barData} />
//           </div>
//         </div>

//         {/* Numeric Breakdown */}
//         <div className="mt-2 p-4 bg-slate-50 rounded">
//           <div className="font-medium mb-2">Detailed Amounts</div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-700">
//             <div className="flex justify-between">
//               <span>Accommodation</span>
//               <span>
//                 {breakdown.accommodation}% · ₹ {amounts.accommodation}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>Food & Drinks</span>
//               <span>
//                 {breakdown.food}% · ₹ {amounts.food}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>Transport</span>
//               <span>
//                 {breakdown.transport}% · ₹ {amounts.transport}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span>Experiences & Activities</span>
//               <span>
//                 {breakdown.experiences}% · ₹ {amounts.experiences}
//               </span>
//             </div>
//           </div>
//           {totalBudget > 0 && (
//             <div className="mt-3 text-sm font-semibold text-slate-800 flex flex-wrap gap-4">
//               <span>Total Budget: ₹ {totalBudget}</span>
//               {perDay > 0 && (
//                 <span>
//                   Approx. per day: ₹ {perDay} ({totalDays} days)
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Eco insights (your snippet) */}
//         <div className="mt-4 p-4 bg-white rounded shadow border">
//           <div className="font-medium mb-2">Eco Suggestions</div>
//           <ul className="text-sm space-y-2">
//             <li>Prefer public transport when possible.</li>
//             <li>Choose eco-certified stays.</li>
//             <li>Eat local and reduce food waste.</li>
//             <li>Walk or cycle short distances.</li>
//           </ul>
//         </div>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-3 mt-2">
//           <button
//             onClick={saveBudget}
//             className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
//           >
//             Save Plan
//           </button>
//           <button
//             onClick={exportPDF}
//             className="px-4 py-2 bg-green-600 text-white rounded text-sm"
//           >
//             Export PDF
//           </button>
//         </div>
//       </section>

//       {/* SIDEBAR (your snippet) */}
//       <aside className="col-span-12 lg:col-span-4 space-y-4">
//         <div className="bg-white p-4 rounded shadow">
//           <div className="font-medium">Smart Insights</div>
//           <p className="mt-2 text-sm text-slate-600">
//             Highest spending category: <b>{highestCategory}</b>
//           </p>
//           {perDay > 0 && (
//             <p className="mt-1 text-sm text-slate-600">
//               Recommended per-day spending: <b>₹{perDay}</b>
//             </p>
//           )}
//           {!totalBudget && (
//             <p className="mt-1 text-sm text-slate-500">
//               Enter a budget to see personalised insights.
//             </p>
//           )}
//         </div>

//         <div className="bg-white p-4 rounded shadow">
//           <div className="font-medium">Rewards Preview</div>
//           <p className="mt-2 text-sm text-slate-600">
//             Earn Green Coins for eco-friendly choices. Redeem for rewards later.
//           </p>
//         </div>
//       </aside>
//     </div>
//   );
// };
return (
  <div
    id="budget-report"
    className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
    bg-slate-50 dark:bg-slate-900
    text-slate-800 dark:text-slate-100"
  >
    {/* MAIN SECTION */}
    <section
      className="col-span-12 lg:col-span-8
      bg-white dark:bg-slate-800
      p-6 rounded-2xl shadow
      border border-slate-200 dark:border-slate-700
      space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
          Smart Budgeting & Eco Suggestions
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your minimum trip budget and get a smart, visual split of your
          expenses based on your travel style.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Minimum Trip Budget (₹)</label>
          <input
            type="number"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            placeholder="e.g. 15000"
            className="w-full p-2 mt-1 rounded
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-900
              focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Trip Days (optional)</label>
          <input
            type="number"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            placeholder="e.g. 5"
            className="w-full p-2 mt-1 rounded
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-900
              focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Travel Style Preset</label>
          <select
            value={preset}
            onChange={(e) => setPreset(e.target.value as BudgetPreset)}
            className="w-full p-2 mt-1 rounded
              border border-slate-300 dark:border-slate-600
              bg-white dark:bg-slate-900"
          >
            <option value="Backpacker">Backpacker (Low-cost)</option>
            <option value="Comfort">Comfort (Balanced)</option>
            <option value="Premium">Premium (Luxury)</option>
          </select>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Preset controls category percentage split.
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
          <div className="font-medium mb-2">Pie View (Percentages)</div>
          <Pie data={pieData} />
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
          <div className="font-medium mb-2">Bar View (₹ Amounts)</div>
          <Bar data={barData} />
        </div>
      </div>

      {/* Numeric Breakdown */}
      <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
        <div className="font-medium mb-2">Detailed Amounts</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span>Accommodation</span>
            <span>{breakdown.accommodation}% · ₹ {amounts.accommodation}</span>
          </div>
          <div className="flex justify-between">
            <span>Food & Drinks</span>
            <span>{breakdown.food}% · ₹ {amounts.food}</span>
          </div>
          <div className="flex justify-between">
            <span>Transport</span>
            <span>{breakdown.transport}% · ₹ {amounts.transport}</span>
          </div>
          <div className="flex justify-between">
            <span>Experiences</span>
            <span>{breakdown.experiences}% · ₹ {amounts.experiences}</span>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="mt-3 font-semibold text-green-600 dark:text-green-400 flex flex-wrap gap-4">
            <span>Total Budget: ₹ {totalBudget}</span>
            {perDay > 0 && (
              <span>
                Per day: ₹ {perDay} ({totalDays} days)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Eco Suggestions */}
      <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border">
        <div className="font-medium mb-2">Eco Suggestions</div>
        <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
          <li>• Prefer public transport</li>
          <li>• Choose eco-certified stays</li>
          <li>• Eat local & reduce waste</li>
          <li>• Walk or cycle short distances</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-2">
        <button
          onClick={saveBudget}
          className="px-4 py-2 rounded text-sm text-white
          bg-gradient-to-r from-blue-600 to-green-600"
        >
          Save Plan
        </button>
        <button
          onClick={exportPDF}
          className="px-4 py-2 rounded text-sm text-white
          bg-gradient-to-r from-green-600 to-blue-600"
        >
          Export PDF
        </button>
      </div>
    </section>

    {/* SIDEBAR */}
    <aside className="col-span-12 lg:col-span-4 space-y-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
        <div className="font-medium">Smart Insights</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Highest spending category: <b>{highestCategory}</b>
        </p>
        {perDay > 0 && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Recommended per-day spending: <b>₹{perDay}</b>
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
        <div className="font-medium">Rewards Preview</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Earn Green Coins for eco-friendly choices.
        </p>
      </div>
    </aside>
  </div>
);
};

// =====================================================BUDGET PAGE MAIN====================


// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );


// const BudgetPage: React.FC = () => {
//   // ---------------- STATE & LOGIC (UNCHANGED) ----------------
//   const [preset, setPreset] = useState<BudgetPreset>("Comfort");
//   const [budgetInput, setBudgetInput] = useState<string>("");
//   const [daysInput, setDaysInput] = useState<string>("");

//   useEffect(() => {
//     const saved = localStorage.getItem("budgetData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       if (parsed.preset) setPreset(parsed.preset);
//       if (parsed.budgetInput) setBudgetInput(parsed.budgetInput);
//       if (parsed.daysInput) setDaysInput(parsed.daysInput);
//     }
//   }, []);

//   // ---------------- UI ----------------
//   return (
//     <div
//       id="budget-report"
//       className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
//       text-slate-800 dark:text-slate-100"
//     >
//       {/* ================= MAIN ================= */}
//       <section
//         className="col-span-12 lg:col-span-8
//         bg-white dark:bg-slate-800
//         p-6 rounded-3xl shadow
//         border border-slate-200 dark:border-slate-700
//         space-y-6"
//       >
//         <div>
//           <h3 className="text-xl font-semibold text-green-700 dark:text-green-400">
//             Smart Budgeting & Eco Suggestions
//           </h3>
//           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//             Enter your minimum trip budget and get a smart, visual split of your
//             expenses based on your travel style.
//           </p>
//         </div>

//         {/* INPUTS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="text-sm font-medium">
//               Minimum Trip Budget (₹)
//             </label>
//             <input
//               type="number"
//               value={budgetInput}
//               onChange={(e) => setBudgetInput(e.target.value)}
//               className="w-full p-2 mt-1 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Trip Days (optional)</label>
//             <input
//               type="number"
//               value={daysInput}
//               onChange={(e) => setDaysInput(e.target.value)}
//               className="w-full p-2 mt-1 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium">Travel Style Preset</label>
//             <select
//               value={preset}
//               onChange={(e) => setPreset(e.target.value as BudgetPreset)}
//               className="w-full p-2 mt-1 rounded-lg border
//                 bg-white dark:bg-slate-900
//                 border-slate-300 dark:border-slate-700"
//             >
//               <option value="Backpacker">Backpacker (Low-cost)</option>
//               <option value="Comfort">Comfort (Balanced)</option>
//               <option value="Premium">Premium (Luxury)</option>
//             </select>
//             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
//               Preset controls category percentages.
//             </p>
//           </div>
//         </div>

//         {/* CHARTS */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
//             <div className="font-medium mb-2">Pie View (%)</div>
//             <Pie data={pieData} />
//           </div>

//           <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl">
//             <div className="font-medium mb-2">Bar View (₹)</div>
//             <Bar data={barData} />
//           </div>
//         </div>

//         {/* BREAKDOWN */}
//         <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
//           <div className="font-medium mb-2">Detailed Amounts</div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
//             <div className="flex justify-between">
//               <span>Accommodation</span>
//               <span>₹ {amounts.accommodation}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Food</span>
//               <span>₹ {amounts.food}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Transport</span>
//               <span>₹ {amounts.transport}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Experiences</span>
//               <span>₹ {amounts.experiences}</span>
//             </div>
//           </div>

//           {totalBudget > 0 && (
//             <div className="mt-3 text-sm font-semibold">
//               Total: ₹ {totalBudget}
//               {perDay > 0 && (
//                 <span className="ml-4">
//                   Per day: ₹ {perDay} ({totalDays} days)
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* ECO SUGGESTIONS */}
//         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border">
//           <div className="font-medium mb-2">Eco Suggestions</div>
//           <ul className="text-sm space-y-2">
//             <li>• Prefer public transport.</li>
//             <li>• Choose eco-certified stays.</li>
//             <li>• Eat local food.</li>
//             <li>• Walk or cycle short distances.</li>
//           </ul>
//         </div>

//         {/* ACTIONS */}
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={saveBudget}
//             className="px-4 py-2 rounded-lg text-white
//               bg-gradient-to-r from-blue-600 to-green-600"
//           >
//             Save Plan
//           </button>
//           <button
//             onClick={exportPDF}
//             className="px-4 py-2 rounded-lg text-white
//               bg-gradient-to-r from-green-600 to-blue-600"
//           >
//             Export PDF
//           </button>
//         </div>
//       </section>

//       {/* ================= SIDEBAR ================= */}
//       <aside className="col-span-12 lg:col-span-4 space-y-4">
//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
//           <div className="font-medium">Smart Insights</div>
//           <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
//             Highest spending category: <b>{highestCategory}</b>
//           </p>
//           {perDay > 0 && (
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               Recommended per-day: ₹ {perDay}
//             </p>
//           )}
//         </div>

//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
//           <div className="font-medium">Rewards Preview</div>
//           <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
//             Earn Eco Coins for smart, sustainable spending.
//           </p>
//         </div>
//       </aside>
//     </div>
//   );
// };




// import React, { useEffect, useState } from "react";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement,
// } from "chart.js";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

/* ---------------- ChartJS setup ---------------- */
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   BarElement
// );

/* ---------------- Types ---------------- */
// type BudgetPreset = "Backpacker" | "Comfort" | "Premium";

// interface BudgetBreakdown {
//   accommodation: number;
//   food: number;
//   transport: number;
//   experiences: number;
// }

// /* ---------------- Component ---------------- */
// const BudgetPage: React.FC = () => {
//   const [preset, setPreset] = useState<BudgetPreset>("Comfort");
//   const [budgetInput, setBudgetInput] = useState("");
//   const [daysInput, setDaysInput] = useState("");

//   /* -------- Load saved data -------- */
//   useEffect(() => {
//     const saved = localStorage.getItem("budgetData");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       setPreset(parsed.preset || "Comfort");
//       setBudgetInput(parsed.budgetInput || "");
//       setDaysInput(parsed.daysInput || "");
//     }
//   }, []);

//   /* -------- Budget logic -------- */
//   const computeBreakdown = (p: BudgetPreset): BudgetBreakdown => {
//     if (p === "Backpacker")
//       return { accommodation: 30, food: 30, transport: 25, experiences: 15 };
//     if (p === "Premium")
//       return { accommodation: 55, food: 15, transport: 15, experiences: 15 };
//     return { accommodation: 45, food: 20, transport: 20, experiences: 15 };
//   };

//   const breakdown = computeBreakdown(preset);

//   const totalBudget = Math.max(0, Number(budgetInput) || 0);
//   const totalDays = Math.max(0, Number(daysInput) || 0);

//   const calcAmount = (percent: number) =>
//     totalBudget ? Math.round((totalBudget * percent) / 100) : 0;

//   const amounts = {
//     accommodation: calcAmount(breakdown.accommodation),
//     food: calcAmount(breakdown.food),
//     transport: calcAmount(breakdown.transport),
//     experiences: calcAmount(breakdown.experiences),
//   };

//   const perDay =
//     totalBudget > 0 && totalDays > 0
//       ? Math.round(totalBudget / totalDays)
//       : 0;

//   const highestCategory = Object.entries(breakdown).reduce((a, b) =>
//     b[1] > a[1] ? b : a
//   )[0];

//   /* -------- Charts -------- */
//   const pieData = {
//     labels: ["Accommodation", "Food", "Transport", "Experiences"],
//     datasets: [
//       {
//         data: Object.values(breakdown),
//         backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   const barData = {
//     labels: ["Accommodation", "Food", "Transport", "Experiences"],
//     datasets: [
//       {
//         label: "Amount (₹)",
//         data: Object.values(amounts),
//         backgroundColor: ["#6366f1", "#10b981", "#f59e0b", "#ef4444"],
//       },
//     ],
//   };

//   /* -------- Actions -------- */
//   const saveBudget = () => {
//     localStorage.setItem(
//       "budgetData",
//       JSON.stringify({ preset, budgetInput, daysInput })
//     );
//     alert("Budget saved ✔");
//   };

//   const exportPDF = async () => {
//     const report = document.getElementById("budget-report");
//     if (!report) return;
//     const canvas = await html2canvas(report);
//     const pdf = new jsPDF("p", "mm", "a4");
//     pdf.addImage(canvas.toDataURL("image/png"), "PNG", 5, 5, 200, 285);
//     pdf.save("Budget_Report.pdf");
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div
//       id="budget-report"
//       className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
//       text-slate-800 dark:text-slate-100"
//     >
//       {/* MAIN */}
//       <section className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow space-y-6">
//         <h3 className="text-xl font-semibold text-green-600">
//           Smart Budgeting & Eco Suggestions
//         </h3>

//         {/* Inputs */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <input
//             placeholder="Budget (₹)"
//             value={budgetInput}
//             onChange={(e) => setBudgetInput(e.target.value)}
//             className="p-2 rounded border dark:bg-slate-900"
//           />
//           <input
//             placeholder="Days"
//             value={daysInput}
//             onChange={(e) => setDaysInput(e.target.value)}
//             className="p-2 rounded border dark:bg-slate-900"
//           />
//           <select
//             value={preset}
//             onChange={(e) => setPreset(e.target.value as BudgetPreset)}
//             className="p-2 rounded border dark:bg-slate-900"
//           >
//             <option value="Backpacker">Backpacker</option>
//             <option value="Comfort">Comfort</option>
//             <option value="Premium">Premium</option>
//           </select>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Pie data={pieData} />
//           <Bar data={barData} />
//         </div>

//         {/* Breakdown */}
//         <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded">
//           {Object.entries(amounts).map(([k, v]) => (
//             <div key={k} className="flex justify-between text-sm">
//               <span>{k}</span>
//               <span>₹ {v}</span>
//             </div>
//           ))}
//           {totalBudget > 0 && (
//             <div className="mt-2 font-semibold">
//               Total ₹ {totalBudget}
//               {perDay > 0 && <span> · Per day ₹ {perDay}</span>}
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//           <button
//             onClick={saveBudget}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Save Plan
//           </button>
//           <button
//             onClick={exportPDF}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             Export PDF
//           </button>
//         </div>
//       </section>

//       {/* Sidebar */}
//       <aside className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow">
//         <h4 className="font-medium">Smart Insight</h4>
//         <p className="text-sm mt-2">
//           Highest spending category: <b>{highestCategory}</b>
//         </p>
//       </aside>
//     </div>
//   );
// };

// export default BudgetPage;










// ======================================FESTIVAL SECTION ==============================
type Festival = {
  id: number | string;
  name: string;
  date: any;
  location: string;
  theme?: string;
  description?: string;
};

const FALLBACK_FESTIVALS: Festival[] = [
  {
    id: 1,
    name: "Holi",
    date: "2025-03-14",
    location: "India",
    theme: "Color & Joy",
    description: "Festival of colors celebrated with gulaal, music and sweets.",
  },
  {
    id: 2,
    name: "Diwali",
    date: "2025-10-20",
    location: "India",
    theme: "Festival of Lights",
    description: "Lighting diyas, fireworks and family gatherings.",
  },
];

const culturalTips = [
  "Travel during festivals to explore authentic culture and local cuisine.",
  "Book stays in advance — prices increase during festivals.",
  "Attend local community events to experience traditions deeply.",
  "Carry traditional wear if you want to participate in rituals.",
];

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState<string[]>([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/festivals?year=2025");
        const json = await res.json();

        if (Array.isArray(json) && json.length > 0) {
          setFestivals(json);
        } else {
          throw new Error("Empty API response");
        }
      } catch (err) {
        console.error("API Error — using fallback:", err);
        setError("Unable to load live festivals. Showing sample data.");
        setFestivals(FALLBACK_FESTIVALS);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  const toggleFavorite = (festival: string) => {
    setFavorites((prev) =>
      prev.includes(festival)
        ? prev.filter((f) => f !== festival)
        : [...prev, festival]
    );
  };

  const addTodo = () => {
    if (!todo.trim()) return;
    setTodoList((prev) => [...prev, todo.trim()]);
    setTodo("");
  };

  const removeTodo = (i: number) => {
    setTodoList((prev) => prev.filter((_, index) => index !== i));
  };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h3 className="text-xl font-semibold">Festival-Aware Calendar</h3>
//       <p className="text-sm text-slate-500">
//         Track festivals, plan trips, mark favourites & set reminders.
//       </p>

//       {loading && <p>Loading festivals…</p>}
//       {error && <p className="text-red-500 text-sm">{error}</p>}

//       {/* FESTIVAL CARDS */}
//       {festivals.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {festivals.map((f) => (
//             <div key={f.id} className="bg-white p-4 shadow rounded-xl space-y-1">
//               <p className="text-xs text-gray-400">
//                 {typeof f.date === "string" ? f.date : f.date.iso}
//               </p>
//               <p className="font-semibold">{f.name}</p>
//               <p className="text-xs text-gray-500">{f.location}</p>
//               {f.theme && <p className="italic text-xs text-gray-600">“{f.theme}”</p>}
//               {f.description && (
//                 <p className="text-xs text-gray-600 mt-1">{f.description}</p>
//               )}

//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => navigate(`/planner?festival=${encodeURIComponent(f.name)}`)}
//                   className="bg-blue-600 text-white text-sm rounded px-3 py-1"
//                 >
//                   Plan Trip
//                 </button>

//                 <button
//                   onClick={() => toggleFavorite(f.name)}
//                   className={`text-sm px-3 py-1 rounded border ${
//                     favorites.includes(f.name)
//                       ? "bg-yellow-400 border-yellow-500"
//                       : "bg-white"
//                   }`}
//                 >
//                   {favorites.includes(f.name) ? "★ Favorited" : "☆ Favorite"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* TODO LIST */}
//       <div className="bg-white p-4 rounded-xl shadow space-y-3">
//         <h4 className="font-semibold">Festival To-Do List 📝</h4>
//         <div className="flex gap-2">
//           <input
//             value={todo}
//             onChange={(e) => setTodo(e.target.value)}
//             className="border p-2 flex-1 rounded text-sm"
//             placeholder="e.g., Book tickets for Diwali"
//           />
//           <button
//             onClick={addTodo}
//             className="bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Add
//           </button>
//         </div>

//         {todoList.length === 0 ? (
//           <p className="text-xs text-gray-500">No reminders</p>
//         ) : (
//           <ul className="text-sm space-y-2">
//             {todoList.map((t, i) => (
//               <li key={i} className="flex justify-between bg-gray-50 p-2 rounded">
//                 {t}
//                 <button onClick={() => removeTodo(i)} className="text-red-600 text-xs">
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* FAVORITES */}
//       {favorites.length > 0 && (
//         <div className="bg-yellow-50 p-4 rounded-xl shadow space-y-1">
//           <h4 className="text-sm font-semibold text-yellow-700">
//             Your Favorite Festivals ⭐
//           </h4>
//           <p className="text-sm">{favorites.join(" • ")}</p>
//         </div>
//       )}

//       {/* CULTURAL TIPS */}
//       <div className="bg-white p-4 rounded-xl shadow space-y-2">
//         <h4 className="text-lg font-semibold">Cultural Travel Insights 🌍</h4>
//         {culturalTips.map((tip, i) => (
//           <p key={i} className="text-sm">• {tip}</p>
//         ))}
//       </div>
//     </div>
//   );
// };

// =================================MAIN CODE ABOVE=======================







return (
  <div
    className="
      max-w-6xl mx-auto p-6 space-y-6
      bg-slate-100 dark:bg-slate-950
      text-slate-800 dark:text-slate-100
    "
  >
    <h3 className="text-2xl font-bold">
      Festival-Aware Calendar 🎉
    </h3>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Track festivals, plan trips, mark favourites & set reminders.
    </p>

    {loading && (
      <p className="text-sm text-blue-600 dark:text-blue-400">
        Loading festivals…
      </p>
    )}
    {error && (
      <p className="text-red-500 dark:text-red-400 text-sm">
        {error}
      </p>
    )}

    {/* ================= FESTIVAL CARDS ================= */}
    {festivals.length > 0 && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {festivals.map((f) => (
          <div
            key={f.id}
            className="
              p-4 rounded-2xl shadow
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              space-y-1
            "
          >
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {typeof f.date === "string" ? f.date : f.date.iso}
            </p>

            <p className="font-semibold text-lg">{f.name}</p>
            <p className="text-xs text-slate-500">{f.location}</p>

            {f.theme && (
              <p className="italic text-xs text-indigo-600 dark:text-indigo-400">
                “{f.theme}”
              </p>
            )}

            {f.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {f.description}
              </p>
            )}

            <div className="flex gap-2 pt-3">
              <button
                onClick={() =>
                  navigate(
                    `/planner?festival=${encodeURIComponent(f.name)}`
                  )
                }
                className="
                  px-3 py-1 text-sm rounded-lg text-white
                  bg-gradient-to-r from-blue-600 to-indigo-600
                "
              >
                Plan Trip
              </button>

              <button
                onClick={() => toggleFavorite(f.name)}
                className={`text-sm px-3 py-1 rounded-lg border
                  ${
                    favorites.includes(f.name)
                      ? "bg-yellow-400 border-yellow-500 text-black"
                      : "border-slate-300 dark:border-slate-600"
                  }
                `}
              >
                {favorites.includes(f.name) ? "★ Favorited" : "☆ Favorite"}
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* ================= TODO LIST ================= */}
    <div
      className="
        p-4 rounded-2xl shadow space-y-3
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
      "
    >
      <h4 className="font-semibold text-lg">
        Festival To-Do List 📝
      </h4>

      <div className="flex gap-2">
        <input
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="
            flex-1 p-2 rounded-lg border text-sm
            bg-white dark:bg-slate-800
            border-slate-300 dark:border-slate-700
          "
          placeholder="e.g., Book tickets for Diwali"
        />
        <button
          onClick={addTodo}
          className="
            px-4 py-2 rounded-lg text-white
            bg-green-600 hover:bg-green-700
          "
        >
          Add
        </button>
      </div>

      {todoList.length === 0 ? (
        <p className="text-xs text-slate-500">
          No reminders
        </p>
      ) : (
        <ul className="text-sm space-y-2">
          {todoList.map((t, i) => (
            <li
              key={i}
              className="
                flex justify-between items-center
                p-2 rounded-lg
                bg-slate-50 dark:bg-slate-800
              "
            >
              {t}
              <button
                onClick={() => removeTodo(i)}
                className="text-red-500 text-xs"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* ================= FAVORITES ================= */}
    {favorites.length > 0 && (
      <div
        className="
          p-4 rounded-2xl shadow
          bg-yellow-50 dark:bg-yellow-900/30
        "
      >
        <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
          Your Favorite Festivals ⭐
        </h4>
        <p className="text-sm mt-1">
          {favorites.join(" • ")}
        </p>
      </div>
    )}

    {/* ================= CULTURAL TIPS ================= */}
    <div
      className="
        p-4 rounded-2xl shadow space-y-2
        bg-white dark:bg-slate-900
        border border-slate-200 dark:border-slate-700
      "
    >
      <h4 className="text-lg font-semibold">
        Cultural Travel Insights 🌍
      </h4>
      {culturalTips.map((tip, i) => (
        <p key={i} className="text-sm text-slate-600 dark:text-slate-400">
          • {tip}
        </p>
      ))}
    </div>
  </div>
);

};














// ------------------------------------------Community-Page------------------------------------------------

type LocalShop = {
  id: number;
  shopName: string;
  category: string;
  city: string;
  contact: string;
  mapLink: string;
  image?: string;
};

type LeaderboardEntry = {
  id: number;
  name: string;
  coins: number;
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: 1, name: "You", coins: 240 },
  { id: 2, name: "Ananya", coins: 210 },
  { id: 3, name: "Rahul", coins: 180 },
  { id: 4, name: "Sara", coins: 150 },
];

type ExperienceCategory = "Culture" | "Workshop" | "Food" | "Nature";

interface CommunityExperience {
  id: number;
  title: string;
  host: string;
  price: string;
  tag: string;
  category: ExperienceCategory;
  rating: number;
  reviews: number;
  slotsLeft: number;
  badge?: string;
}

const MOCK_EXPERIENCES: CommunityExperience[] = [
  {
    id: 1,
    title: "Old City Cultural Walk",
    host: "Local Guide: Sita Devi",
    price: "₹500 / day",
    tag: "Guided Tour",
    category: "Culture",
    rating: 4.8,
    reviews: 32,
    slotsLeft: 3,
    badge: "Popular",
  },
  {
    id: 2,
    title: "Handicraft Workshop with Village Artisans",
    host: "Village Artisans Collective",
    price: "₹300 / session",
    tag: "Hands-on",
    category: "Workshop",
    rating: 4.6,
    reviews: 18,
    slotsLeft: 6,
  },
  {
    id: 3,
    title: "Street Food Night Crawl",
    host: "Foodie Friends Club",
    price: "₹450 / person",
    tag: "Food Walk",
    category: "Food",
    rating: 4.9,
    reviews: 41,
    slotsLeft: 4,
    badge: "Top Rated",
  },
  {
    id: 4,
    title: "Sunrise Nature Hike & Village Breakfast",
    host: "Green Trails Youth Group",
    price: "₹550 / person",
    tag: "Outdoor",
    category: "Nature",
    rating: 4.7,
    reviews: 24,
    slotsLeft: 2,
  },
];




export  function CommunityPage() {
  const navigate = useNavigate();

  const [leaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [selectedCategory, setSelectedCategory] =
    useState<ExperienceCategory | "All">("All");
  const [cityFilter, setCityFilter] = useState("");
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDetails, setIdeaDetails] = useState("");

  const [localShops, setLocalShops] = useState<LocalShop[]>([]);
  const [showShopForm, setShowShopForm] = useState(false);

  const [shopForm, setShopForm] = useState({
    shopName: "",
    category: "",
    city: "",
    contact: "",
    mapLink: "",
    image: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("localShops");
    if (saved) setLocalShops(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("localShops", JSON.stringify(localShops));
  }, [localShops]);

  const handleShopImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () =>
      setShopForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalShops([...localShops, { id: Date.now(), ...shopForm }]);
    setShopForm({
      shopName: "",
      category: "",
      city: "",
      contact: "",
      mapLink: "",
      image: "",
    });
    setShowShopForm(false);
  };

  const filteredExperiences = MOCK_EXPERIENCES.filter((exp) => {
    const categoryMatch =
      selectedCategory === "All" || exp.category === selectedCategory;

    const cityMatch =
      cityFilter.trim() === "" ||
      exp.title.toLowerCase().includes(cityFilter.toLowerCase()) ||
      exp.host.toLowerCase().includes(cityFilter.toLowerCase());

    return categoryMatch && cityMatch;
  });

  const handleBook = (exp: CommunityExperience) => {
    navigate(`/booking?exp=${encodeURIComponent(exp.title)}`);
  };

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) return;
    setIdeaTitle("");
    setIdeaDetails("");
  };

  const yourCoins = leaderboard.find((p) => p.name === "You")?.coins ?? 0;
  const impactProgress = Math.min(100, Math.round((yourCoins / 500) * 100));


const categories: (ExperienceCategory | "All")[] = [
  "All",
  "Culture",
  "Workshop",
  "Food",
  "Nature",
];
//   return (
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
//       {/* MAIN SECTION */}
//       <section className="col-span-12 md:col-span-8 bg-white p-6 rounded-2xl shadow">
//         <h3 className="text-xl font-semibold">Community & Local Experiences</h3>
//         <p className="text-sm text-slate-500">
//           Book local guides, community-run experiences and view verified
//           listings (mock data). Discover activities hosted by real people, not
//           big tour operators.
//         </p>

//         {/* Filters */}
//         <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
//           <div className="flex flex-wrap gap-2">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 type="button"
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`text-xs px-3 py-1.5 rounded-full border transition ${
//                   selectedCategory === cat
//                     ? "bg-green-600 text-white border-green-600"
//                     : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
//                 }`}
//               >
//                 {cat === "All" ? "All types" : cat}
//               </button>
//             ))}
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="text"
//               value={cityFilter}
//               onChange={(e) => setCityFilter(e.target.value)}
//               placeholder="Search by area / host…"
//               className="text-xs md:text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//         </div>

//         {/* ORIGINAL SIMPLE OPTIONS (kept exactly, just wired to booking) */}
//         <div className="mt-4 space-y-4">
//           <div className="bg-slate-50 p-4 rounded">
//             Local Guide: Sita Devi — Cultural Walk — ₹500/day —{" "}
//             <button
//               className="ml-2 text-green-600"
//               onClick={() =>
//                 navigate(
//                   `/booking?exp=${encodeURIComponent("Old City Cultural Walk")}`
//                 )
//               }
//             >
//               Book
//             </button>
//           </div>
//           <div className="bg-slate-50 p-4 rounded">
//             Handicraft Workshop — Village Artisans — ₹300 —{" "}
//             <button
//               className="ml-2 text-green-600"
//               onClick={() =>
//                 navigate(
//                   `/booking?exp=${encodeURIComponent(
//                     "Handicraft Workshop with Village Artisans"
//                   )}`
//                 )
//               }
//             >
//               Reserve
//             </button>
//           </div>
//         </div>

//         {/* ENHANCED EXPERIENCE CARDS */}
//         <div className="mt-6 grid gap-4">
//           {filteredExperiences.map((exp) => (
//             <div
//               key={exp.id}
//               className="border border-slate-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-sm transition"
//             >
//               <div>
//                 <div className="flex items-center gap-2">
//                   <h4 className="text-sm md:text-base font-semibold">
//                     {exp.title}
//                   </h4>
//                   {exp.badge && (
//                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
//                       {exp.badge}
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-xs text-slate-500 mt-1">
//                   {exp.host} • {exp.tag} • {exp.category}
//                 </div>
//                 <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
//                   <span className="font-semibold text-slate-800">
//                     {exp.price}
//                   </span>
//                   <span className="flex items-center gap-1">
//                     ⭐ {exp.rating}{" "}
//                     <span className="text-slate-400">
//                       ({exp.reviews} reviews)
//                     </span>
//                   </span>
//                   <span className="text-amber-600 font-medium">
//                     {exp.slotsLeft} slots left
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleBook(exp)}
//                   className="px-4 py-2 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition"
//                 >
//                   Book Now
//                 </button>
//                 <button className="text-xs text-slate-500 hover:text-slate-700">
//                   View details
//                 </button>
//               </div>
//             </div>
//           ))}

//           {filteredExperiences.length === 0 && (
//             <div className="text-xs text-slate-500 mt-2">
//               No experiences match your filter yet. Try clearing search or
//               selecting &quot;All types&quot;.
//             </div>
//           )}
//         </div>

//         {/* HOST EXPERIENCE / IDEA BOX */}
//         <div className="mt-8 border-t border-slate-100 pt-4">
//           <h4 className="text-sm font-semibold">
//             Have an idea for a local experience?
//           </h4>
//           <p className="text-xs text-slate-500 mb-3">
//             Share a quick idea (mock). In the real app we&apos;ll review and
//             publish verified community experiences here.
//           </p>

//           <form
//             onSubmit={handleSubmitIdea}
//             className="space-y-3 bg-slate-50 rounded-xl p-4"
//           >
//             <input
//               type="text"
//               value={ideaTitle}
//               onChange={(e) => setIdeaTitle(e.target.value)}
//               className="w-full text-xs md:text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
//               placeholder="Eg: Sunrise yoga on rooftop, village cooking demo..."
//             />
//             <textarea
//               value={ideaDetails}
//               onChange={(e) => setIdeaDetails(e.target.value)}
//               className="w-full text-xs md:text-sm px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500"
//               rows={3}
//               placeholder="Add quick details (group size, price idea, who can host, etc.)"
//             />
//             <div className="flex items-center justify-between">
//               <button
//                 type="submit"
//                 className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
//               >
//                 Submit idea (Mock)
//               </button>
//               <span className="text-[11px] text-slate-500">
//                 No real submissions yet – demo only.
//               </span>
//             </div>
//           </form>
//         </div>



// <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
//       {/* <section className="col-span-12 md:col-span-8 bg-white p-6 rounded-2xl shadow"> */}
//         {/* YOUR ORIGINAL MAIN CONTENT — UNCHANGED */}
//       {/* </section> */}

//       <aside className="col-span-12 md:col-span-4 space-y-4 mt-6 md:mt-0">
//         <button
//           onClick={() => setShowShopForm(true)}
//           className="w-full text-xs py-2 rounded bg-green-600 text-white"
//         >
//           ➕ Add Local Shop
//         </button>

//         <div className="mt-8">
//           <h4 className="text-sm font-semibold mb-3">🏪 Local Shops</h4>

//           <div className="grid gap-4 md:grid-cols-2">
//             {localShops.map((shop) => (
//               <div
//                 key={shop.id}
//                 className="border border-slate-100 rounded-xl p-4 bg-white"
//               >
//                 {shop.image && (
//                   <img
//                     src={shop.image}
//                     alt={shop.shopName}
//                     className="h-32 w-full object-cover rounded mb-2"
//                   />
//                 )}
//                 <h5 className="font-semibold">{shop.shopName}</h5>
//                 <p className="text-xs text-slate-500">{shop.category}</p>
//                 <p className="text-xs">📍 {shop.city}</p>
//                 <p className="text-xs">📞 {shop.contact}</p>
//                 {shop.mapLink && (
//                   <a
//                     href={shop.mapLink}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-xs text-green-600 underline"
//                   >
//                     View on Map
//                   </a>
//                 )}
//               </div>
//             ))}
//             {localShops.length === 0 && (
//               <p className="text-xs text-slate-500">
//                 No local shops added yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </aside>

//       {showShopForm && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//           <form
//             onSubmit={handleShopSubmit}
//             className="bg-white rounded-xl p-6 w-full max-w-md space-y-3"
//           >
//             <h3 className="font-semibold">Add Local Shop</h3>

//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Shop Name"
//               value={shopForm.shopName}
//               onChange={(e) =>
//                 setShopForm({ ...shopForm, shopName: e.target.value })
//               }
//               required
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Category"
//               value={shopForm.category}
//               onChange={(e) =>
//                 setShopForm({ ...shopForm, category: e.target.value })
//               }
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="City"
//               value={shopForm.city}
//               onChange={(e) =>
//                 setShopForm({ ...shopForm, city: e.target.value })
//               }
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Contact"
//               value={shopForm.contact}
//               onChange={(e) =>
//                 setShopForm({ ...shopForm, contact: e.target.value })
//               }
//             />
//             <input
//               className="w-full border p-2 rounded"
//               placeholder="Google Maps Link"
//               value={shopForm.mapLink}
//               onChange={(e) =>
//                 setShopForm({ ...shopForm, mapLink: e.target.value })
//               }
//             />
//             <input type="file" accept="image/*" onChange={handleShopImage} />

//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowShopForm(false)}
//                 className="px-4 py-1 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-1 bg-green-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//       </section>
//       {/* SIDEBAR */}
//       <aside className="col-span-12 md:col-span-4 space-y-4 mt-6 md:mt-0">
//         {/* Leaderboard */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium flex items-center justify-between">
//             <span>Leaderboard</span>
//             <span className="text-[11px] text-slate-400">
//               GreenCoins (GC)
//             </span>
//           </div>
//           <ul className="mt-2 space-y-2">
//             {leaderboard.map((p, i) => (
//               <li
//                 key={p.id}
//                 className={`flex items-center justify-between p-2 rounded ${
//                   p.name === "You" ? "bg-green-50" : "bg-slate-50/40"
//                 }`}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold">
//                     {p.name[0]}
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium">{p.name}</div>
//                     <div className="text-xs text-slate-500">{p.coins} GC</div>
//                   </div>
//                 </div>
//                 <div className="text-sm font-semibold">#{i + 1}</div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* Impact card */}

//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium">Your Travel Impact (Mock)</div>
//           <p className="text-xs text-slate-500 mt-1">
//             Every community booking earns GreenCoins. We convert them into
//             real-world impact like trees planted or local projects supported.
//           </p>

//           <div className="mt-3">
//             <div className="flex items-center justify-between text-xs mb-1">
//               <span>Progress to next impact milestone</span>
//               <span>{impactProgress}%</span>
//             </div>
//             <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
//               <div
//                 className="h-2 rounded-full bg-green-500"
//                 style={{ width: `${impactProgress}%` }}
//               />
//             </div>
//             <div className="mt-2 text-[11px] text-slate-500">
//               {yourCoins} GC ≈ mock contribution towards local projects. At 500
//               GC we trigger a &quot;Thank you&quot; badge.
//             </div>
//           </div>
//         </div>

//         {/* Local experiences info */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium">Local Experiences</div>
//           <div className="text-sm text-slate-600 mt-2">
//             Verified community events appear here after backend integration.
//             Until then, use the mock cards on the left to design your flow.
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }
// =============================NEW SECTION JUST DESIGN THAT ========================



return (
  <div className="
    max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
    bg-slate-100 dark:bg-slate-950
    text-slate-800 dark:text-slate-100
  ">
    {/* MAIN SECTION */}
    <section className="
      col-span-12 md:col-span-8
      bg-white dark:bg-slate-900
      p-6 rounded-2xl shadow
      border border-slate-200 dark:border-slate-700
    ">
      <h3 className="text-xl font-semibold">
        Community & Local Experiences
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Book local guides, community-run experiences and view verified listings (mock data).
      </p>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition
                ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
            >
              {cat === "All" ? "All types" : cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          placeholder="Search by area / host…"
          className="
            text-xs md:text-sm px-3 py-2 rounded-lg border
            bg-white dark:bg-slate-800
            border-slate-200 dark:border-slate-700
            focus:ring-2 focus:ring-green-500
          "
        />
      </div>

      {/* SIMPLE OPTIONS */}
      <div className="mt-4 space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
          Local Guide: Sita Devi — Cultural Walk — ₹500/day —
          <button className="ml-2 text-green-600 dark:text-green-400">
            Book
          </button>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded">
          Handicraft Workshop — Village Artisans — ₹300 —
          <button className="ml-2 text-green-600 dark:text-green-400">
            Reserve
          </button>
        </div>
      </div>

      {/* EXPERIENCE CARDS */}
      <div className="mt-6 grid gap-4">
        {filteredExperiences.map((exp) => (
          <div
            key={exp.id}
            className="
              rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4
              bg-white dark:bg-slate-900
              border border-slate-200 dark:border-slate-700
              hover:shadow-md transition
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{exp.title}</h4>
                {exp.badge && (
                  <span className="
                    text-[10px] px-2 py-0.5 rounded-full
                    bg-green-50 dark:bg-green-900
                    text-green-700 dark:text-green-300
                  ">
                    {exp.badge}
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {exp.host} • {exp.tag} • {exp.category}
              </div>

              <div className="mt-2 flex gap-3 text-xs">
                <span className="font-semibold">{exp.price}</span>
                <span>⭐ {exp.rating} ({exp.reviews})</span>
                <span className="text-amber-500">
                  {exp.slotsLeft} slots left
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBook(exp)}
                className="
                  px-4 py-2 rounded-lg text-xs font-medium text-white
                  bg-gradient-to-r from-green-600 to-blue-600
                "
              >
                Book Now
              </button>
              <button className="text-xs text-slate-500 dark:text-slate-400">
                View details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* IDEA BOX */}
      <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-4">
        <h4 className="text-sm font-semibold">
          Have an idea for a local experience?
        </h4>

        <form className="space-y-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mt-3">
          <input
            className="w-full p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            placeholder="Experience idea"
          />
          <textarea
            className="w-full p-2 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            rows={3}
            placeholder="Details"
          />
          <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded">
            Submit idea (Mock)
          </button>
        </form>
      </div>
    </section>

    {/* SIDEBAR */}
    <aside className="col-span-12 md:col-span-4 space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div className="font-medium">Leaderboard</div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div className="font-medium">Your Travel Impact</div>
      </div>
    </aside>
  </div>
);
};















// -------------------------NEW COMMUNITY PAGE DESIGN -------------------------------

// ---------------------------END OF COMMUNITY PAGE SECTION ----------------------------

// -------------------------suggestion page------------------------------------

export function SafetyPage() {
  const [alerts] = useState<Alert[]>(MOCK_ALERTS);
  const [tips, setTips] = useState<SuggestionTip[]>(MOCK_TIPS);
  const [newTip, setNewTip] = useState("");

  const [selectedArea, setSelectedArea] = useState("Ranchi");
  const areaData: Record<string, { safety: number; beauty: number; decision: number }> = {
    Ranchi: { safety: 82, beauty: 75, decision: 78 },
    Delhi: { safety: 55, beauty: 60, decision: 58 },
    Goa: { safety: 90, beauty: 94, decision: 92 },
    Shimla: { safety: 87, beauty: 96, decision: 92 },
    Mumbai: { safety: 62, beauty: 70, decision: 66 },
  };

  const weather = { place: "Ranchi", temp: 29, condition: "Partly cloudy", risk: "Low" };

  const handleAddTip = () => {
    if (!newTip.trim()) return;
    setTips(prev => [...prev, { id: Date.now(), user: "You", tip: newTip }]);
    setNewTip("");
  };

  const safetyScore = Math.max(50, 100 - alerts.length * 10);

//   return (
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">

//       {/* MAIN AREA */}
//       <section className="col-span-8 bg-white p-6 rounded-2xl shadow">
//         <h3 className="text-xl font-semibold">Smart Safety Hub</h3>
//         <p className="text-sm text-slate-500 mt-1">
//           Your safety matters. Review weather, alerts, and community safety tips before traveling.
//         </p>

//         {/* SMART SAFETY SCORE */}
//         <div className="mt-4 bg-green-50 border border-green-100 p-4 rounded-xl">
//           <div className="text-sm font-medium">Safety Score</div>
//           <div className="flex items-center gap-3 mt-2">
//             <div className="text-3xl font-bold text-green-700">{safetyScore}</div>
//             <p className="text-xs text-slate-600">
//               Score is based on weather and current travel alerts (mock).
//             </p>
//           </div>
//         </div>

//         {/* WEATHER */}
//         <div className="mt-4 grid grid-cols-2 gap-4">
//           <div className="bg-slate-50 p-4 rounded">
//             <div className="font-medium">Current Weather — {weather.place}</div>
//             <div className="text-2xl font-bold mt-2">{weather.temp}°C</div>
//             <div className="text-sm text-slate-500">{weather.condition}</div>
//             <div className="mt-2 text-xs text-green-700 font-semibold">
//               Risk Level: {weather.risk}
//             </div>
//             <div className="text-xs text-slate-400 mt-2">
//               (Live weather integration in progress)
//             </div>
//           </div>

//           {/* 5-DAY PLAN */}
//           <div className="bg-slate-50 p-4 rounded">
//             <div className="font-medium">Upcoming Weather (Mock)</div>
//             <ul className="text-sm mt-2 text-slate-600 space-y-1">
//               <li>Tue — 🌦️ Light Rain — 27°C</li>
//               <li>Wed — ☀️ Sunny — 30°C</li>
//               <li>Thu — ⛅ Cloudy — 29°C</li>
//               <li>Fri — 🌧️ Rain Chances — 26°C</li>
//               <li>Sat — 🌤️ Clear — 31°C</li>
//             </ul>
//           </div>
//         </div>

//         {/* ALERTS */}
//         <div className="mt-6 bg-orange-50 p-4 rounded-xl border border-orange-200">
//           <div className="font-medium">Latest Safety Alerts</div>
//           <ul className="mt-2 space-y-1 text-sm text-slate-700">
//             {alerts.map(a => (
//               <li key={a.id}>
//                 ⚠️ {a.message}
//                 <span className="text-[11px] text-slate-500 ml-1">({a.type})</span>
//               </li>
//             ))}
//           </ul>
//           <div className="text-xs text-slate-400 mt-2">
//             TODO: Pull live news via API feed
//           </div>
//         </div>

//         {/* COMMUNITY TIPS */}
//         <div className="mt-6">
//           <div className="font-medium">Community Safety Tips</div>
//           <ul className="mt-2 space-y-1 text-sm text-slate-700">
//             {tips.map(t => (
//               <li key={t.id}>🛡️ <strong>{t.user}</strong>: {t.tip}</li>
//             ))}
//           </ul>

//           <div className="flex items-center gap-2 mt-3">
//             <input
//               value={newTip}
//               onChange={(e) => setNewTip(e.target.value)}
//               placeholder="Share your travel safety tip..."
//               className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500"
//             />
//             <button
//               onClick={handleAddTip}
//               className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs"
//             >
//               Add
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* SIDEBAR */}
//       <aside className="col-span-4 space-y-4">

//         {/* EMERGENCY CONTACTS */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium">Emergency Quick Contacts</div>
//           <ul className="text-sm text-slate-600 mt-2 space-y-1">
//             <li>🚓 Police: 100</li>
//             <li>🚑 Ambulance: 108</li>
//             <li>📞 Women Helpline: 1091</li>
//           </ul>
//           <p className="text-xs text-slate-400 mt-2">
//             Will show nearest hospitals and stations via Maps API
//           </p>
//         </div>

//         {/* SAFETY CHECKLIST */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium">Before You Travel</div>
//           <ul className="mt-2 text-sm text-slate-600 space-y-1">
//             <li>✔ Check weather & alerts</li>
//             <li>✔ Download important tickets offline</li>
//             <li>✔ Share live location with trusted contact</li>
//             <li>✔ Carry power bank & emergency cash</li>
//           </ul>
//         </div>

//         {/* SMART DECISION HELPER */}
//         <div className="bg-white p-4 rounded shadow-sm">
//           <div className="font-medium">Smart Decision Helper</div>

//           <div className="text-xs text-slate-600 mt-2">Choose Destination:</div>
//           <select
//             value={selectedArea}
//             onChange={(e) => setSelectedArea(e.target.value)}
//             className="w-full text-sm mt-1 px-3 py-2 border border-slate-200 rounded-lg"
//           >
//             {Object.keys(areaData).map((area) => (
//               <option key={area} value={area}>{area}</option>
//             ))}
//           </select>

//           <div className="mt-4">
//             <div className="flex justify-between text-xs">
//               <span>Safety Score</span>
//               <span>{areaData[selectedArea].safety}%</span>
//             </div>
//             <div className="w-full h-2 bg-slate-100 rounded-full">
//               <div
//                 className="h-2 bg-green-500 rounded-full"
//                 style={{ width: `${areaData[selectedArea].safety}%` }}
//               />
//             </div>

//             <div className="flex justify-between text-xs mt-3">
//               <span>Beauty Score</span>
//               <span>{areaData[selectedArea].beauty}%</span>
//             </div>
//             <div className="w-full h-2 bg-slate-100 rounded-full">
//               <div
//                 className="h-2 bg-blue-500 rounded-full"
//                 style={{ width: `${areaData[selectedArea].beauty}%` }}
//               />
//             </div>
//           </div>

//           <div className="mt-4 bg-slate-50 p-3 rounded-lg text-center">
//             <div className="text-xs text-slate-500">Final Recommendation</div>
//             <div className="text-xl font-bold text-emerald-600">
//               {areaData[selectedArea].decision}%
//             </div>
//             <div className="text-[11px] text-slate-500">
//               {areaData[selectedArea].decision > 70
//                 ? "Highly Recommended"
//                 : areaData[selectedArea].decision > 50
//                 ? "Moderate — Check weather & alerts"
//                 : "Avoid for now"}
//             </div>
//           </div>
//         </div>
//       </aside>
//     </div>
//   );
// }

// =============================NEW DESIGN ===================
return (
  <div
    className="
      max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6
      bg-slate-100 dark:bg-slate-950
      text-slate-800 dark:text-slate-100
    "
  >
    {/* MAIN AREA */}
    <section
      className="
        col-span-12 md:col-span-8
        bg-white dark:bg-slate-900
        p-6 rounded-2xl shadow
        border border-slate-200 dark:border-slate-700
      "
    >
      <h3 className="text-xl font-semibold">Smart Safety Hub</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Your safety matters. Review weather, alerts, and community safety tips before traveling.
      </p>

      {/* SAFETY SCORE */}
      <div
        className="
          mt-4 p-4 rounded-xl
          bg-green-50 dark:bg-green-900/20
          border border-green-200 dark:border-green-700
        "
      >
        <div className="text-sm font-medium">Safety Score</div>
        <div className="flex items-center gap-3 mt-2">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400">
            {safetyScore}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Based on weather and current travel alerts (mock).
          </p>
        </div>
      </div>

      {/* WEATHER */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <div className="font-medium">Current Weather — {weather.place}</div>
          <div className="text-2xl font-bold mt-2">{weather.temp}°C</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {weather.condition}
          </div>
          <div className="mt-2 text-xs font-semibold text-green-600 dark:text-green-400">
            Risk Level: {weather.risk}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            (Live weather integration in progress)
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
          <div className="font-medium">Upcoming Weather (Mock)</div>
          <ul className="text-sm mt-2 text-slate-600 dark:text-slate-400 space-y-1">
            <li>Tue — 🌦️ Light Rain — 27°C</li>
            <li>Wed — ☀️ Sunny — 30°C</li>
            <li>Thu — ⛅ Cloudy — 29°C</li>
            <li>Fri — 🌧️ Rain Chances — 26°C</li>
            <li>Sat — 🌤️ Clear — 31°C</li>
          </ul>
        </div>
      </div>

      {/* ALERTS */}
      <div
        className="
          mt-6 p-4 rounded-xl
          bg-orange-50 dark:bg-orange-900/20
          border border-orange-200 dark:border-orange-700
        "
      >
        <div className="font-medium">Latest Safety Alerts</div>
        <ul className="mt-2 space-y-1 text-sm">
          {alerts.map((a) => (
            <li key={a.id}>
              ⚠️ {a.message}
              <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                ({a.type})
              </span>
            </li>
          ))}
        </ul>
        <div className="text-xs text-slate-400 mt-2">
          TODO: Pull live news via API feed
        </div>
      </div>

      {/* COMMUNITY TIPS */}
      <div className="mt-6">
        <div className="font-medium">Community Safety Tips</div>
        <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
          {tips.map((t) => (
            <li key={t.id}>
              🛡️ <strong>{t.user}</strong>: {t.tip}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-3">
          <input
            value={newTip}
            onChange={(e) => setNewTip(e.target.value)}
            placeholder="Share your travel safety tip..."
            className="
              flex-1 px-3 py-2 text-sm rounded-lg border
              bg-white dark:bg-slate-800
              border-slate-200 dark:border-slate-700
              focus:ring-2 focus:ring-green-500
            "
          />
          <button
            onClick={handleAddTip}
            className="
              bg-green-600 hover:bg-green-700
              text-white px-4 py-2 rounded-lg text-xs
            "
          >
            Add
          </button>
        </div>
      </div>
    </section>

    {/* SIDEBAR */}
    <aside className="col-span-12 md:col-span-4 space-y-4">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div className="font-medium">Emergency Quick Contacts</div>
        <ul className="text-sm text-slate-600 dark:text-slate-400 mt-2 space-y-1">
          <li>🚓 Police: 100</li>
          <li>🚑 Ambulance: 108</li>
          <li>📞 Women Helpline: 1091</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div className="font-medium">Before You Travel</div>
        <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li>✔ Check weather & alerts</li>
          <li>✔ Download tickets offline</li>
          <li>✔ Share live location</li>
          <li>✔ Carry power bank & cash</li>
        </ul>
      </div>
    </aside>
  </div>
);
};



// ___________________________________suggestion page end________________________________

type Suggestion = {
  id: number;
  title: string;
  description: string;
  category: string;
  bestMonths: string;
  priceLevel: string;
  image: string;
  activities: string[];
  price: { solo: number; couple: number; family: number };
  crowdLevel: "Low" | "Moderate" | "High";
  similar: string[];

  // New Features
  food: string[];
  transport: string;
  timeSlots: string[];
  services: { internet: boolean; atm: boolean; hospital: boolean };
  experiences: { title: string; price: number }[];
};

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 1,
    title: "Goa — Beach & Nightlife Escape",
    description: "Perfect for friends & couples. Ideal for water sports and nightlife vacations.",
    category: "Adventure",
    bestMonths: "Nov – Feb",
    priceLevel: "₹₹",
    image: "https://source.unsplash.com/featured/?goa,beach",
    activities: ["Scuba Diving", "Cruise Party", "Water Sports"],
    price: { solo: 14000, couple: 22000, family: 38000 },
    crowdLevel: "High",
    similar: ["Gokarna", "Puducherry, Kovalam"],
    food: ["Seafood Thali", "Vindaloo", "Bebinca"],
    transport: "Best way to travel: Rental Bike (₹300/day)",
    timeSlots: ["Sunrise Walk — 6 AM", "Water Sports — 11 AM", "Nightlife — 9 PM onwards"],
    services: { internet: true, atm: true, hospital: true },
    experiences: [
      { title: "Sunset Cruise", price: 499 },
      { title: "Parasailing", price: 1599 },
      { title: "Dolphin Ride", price: 699 },
    ],
  },
  {
    id: 2,
    title: "Ladakh — Snow & Mountain Road Trip",
    description: "Best for bikers, trekkers and road travelers with scenic Himalayan views.",
    category: "Adventure",
    bestMonths: "May – Aug",
    priceLevel: "₹₹₹",
    image: "https://source.unsplash.com/featured/?ladakh,mountains",
    activities: ["Mountain Biking", "Monastery Visit", "Trekking"],
    price: { solo: 18000, couple: 26000, family: 42000 },
    crowdLevel: "Moderate",
    similar: ["Spiti Valley", "Manali", "Srinagar"],
    food: ["Momos", "Thukpa", "Butter Tea"],
    transport: "Best travel: Rented Bike / SUV Car",
    timeSlots: ["Monasteries — 8 AM", "Scenic Photography — 4 PM", "Stargazing — 10 PM"],
    services: { internet: false, atm: false, hospital: true },
    experiences: [
      { title: "Camel Safari Nubra Valley", price: 799 },
      { title: "Frozen Lake Trek", price: 999 },
    ],
  },
  {
    id: 3,
    title: "Jaipur — Royal Heritage Tour",
    description: "Historical forts, palaces and markets perfect for families & cultural lovers.",
    category: "Family",
    bestMonths: "Oct – Mar",
    priceLevel: "₹₹",
    image: "https://images.unsplash.com/photo-1518081461904-9ac7f994cd7f",
    activities: ["Amber Fort", "City Palace", "Elephant Village"],
    price: { solo: 10000, couple: 16000, family: 28000 },
    crowdLevel: "Low",
    similar: ["Udaipur", "Jaisalmer", "Agra"],
    food: ["Dal Baati", "Ghewar", "Laal Maas"],
    transport: "Auto/City Bus/Metro — Best for travel inside Jaipur",
    timeSlots: ["Amber Fort — 9 AM", "Shopping — 5 PM", "Light Show — 8 PM"],
    services: { internet: true, atm: true, hospital: true },
    experiences: [
      { title: "Elephant Village Tour", price: 899 },
      { title: "Fort Night Light Show", price: 499 },
    ],
  },
];

export  function SuggestionsPage() {
  const [suggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("All");

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredSuggestions = filter === "All"
    ? suggestions
    : suggestions.filter(s => s.category === filter);

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h3 className="text-xl font-semibold">Smart Travel Suggestions</h3>
//       <p className="text-sm text-slate-500 mt-1">
//         Personalized travel ideas powered by season, data & real experiences.
//       </p>

//       {/* FILTER BAR */}
//       <div className="flex gap-2 mt-4">
//         {["All", "Adventure", "Family"].map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setFilter(cat)}
//             className={`px-3 py-1 text-xs rounded ${filter === cat ? "bg-blue-600 text-white" : "bg-slate-200"}`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       {/* DESTINATIONS */}
//       <div className="mt-6 grid grid-cols-2 gap-6">
//         {filteredSuggestions.map((s) => (
//           <div key={s.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

//             {/* IMAGE */}
//             <img src={s.image} className="w-full h-40 object-cover" alt={s.title} />

//             <div className="p-5">
//               <div className="flex justify-between items-center">
//                 <div className="text-lg font-semibold">{s.title}</div>
//                 <span className="text-[11px] px-2 py-1 bg-slate-100 rounded-lg text-slate-600">{s.category}</span>
//               </div>

//               <p className="text-sm text-slate-600 mt-2">{s.description}</p>

//               {/* BASIC */}
//               <div className="text-xs text-slate-500 mt-3"><strong>Best Months:</strong> {s.bestMonths}</div>
//               <div className="text-xs text-slate-500"><strong>Price Level:</strong> {s.priceLevel}</div>

//               {/* CROWD */}
//               <div className="text-xs mt-2">
//                 <strong>Crowd Prediction:</strong>{" "}
//                 <span className={s.crowdLevel === "High" ? "text-red-500" :
//                   s.crowdLevel === "Moderate" ? "text-orange-500" : "text-green-600"}>
//                   {s.crowdLevel}
//                 </span>
//               </div>

//               {/* PRICE ESTIMATOR */}
//               <div className="text-xs text-slate-600 mt-2">
//                 <strong>Estimated Trip Cost:</strong>
//                 <div>Solo — ₹{s.price.solo}</div>
//                 <div>Couple — ₹{s.price.couple}</div>
//                 <div>Family — ₹{s.price.family}</div>
//               </div>

//               {/* ACTIVITIES */}
//               <div className="text-xs text-slate-600 mt-3">
//                 <strong>Top Activities:</strong> {s.activities.join(", ")}
//               </div>

//               {/* SIMILAR */}
//               <div className="text-xs text-blue-600 mt-2">
//                 <strong>Similar Places:</strong> {s.similar.join(" ● ")}
//               </div>

//               {/* FOOD */}
//               <div className="text-xs text-slate-600 mt-2">
//                 <strong>Food Highlights:</strong> {s.food.join(", ")}
//               </div>

//               {/* EXPERIENCES */}
//               <div className="text-xs text-slate-600 mt-2">
//                 <strong>Local Experiences:</strong>
//                 <ul className="list-disc ml-4">
//                   {s.experiences.map((ex, i) => (
//                     <li key={i}>{ex.title} — ₹{ex.price}</li>
//                   ))}
//                 </ul>
//               </div>

//               {/* TRANSPORT */}
//               <div className="text-xs text-slate-600 mt-2">
//                 <strong>Public Transport:</strong> {s.transport}
//               </div>

//               {/* TIME SLOTS */}
//               <div className="text-xs text-slate-600 mt-2">
//                 <strong>Best Time Slots:</strong>
//                 <ul className="list-disc ml-4">
//                   {s.timeSlots.map((slot, i) => <li key={i}>{slot}</li>)}
//                 </ul>
//               </div>

//               {/* SERVICES */}
//               <div className="text-xs text-slate-600 mt-2 flex gap-3 flex-wrap">
//                 <strong>Services:</strong>
//                 <span>📶 Internet: {s.services.internet ? "Yes" : "No"}</span>
//                 <span>🏧 ATM: {s.services.atm ? "Yes" : "No"}</span>
//                 <span>🏥 Hospital: {s.services.hospital ? "Yes" : "No"}</span>
//               </div>

//               {/* BUTTONS */}
//               <div className="flex gap-2 mt-4">
//                 <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
//                   + Full Itinerary
//                 </button>
//                 <button
//                   onClick={() => toggleWishlist(s.id)}
//                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
//                 >
//                   {wishlist.includes(s.id) ? "❤️ Saved" : "🤍 Save"}
//                 </button>
//               </div>

//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

return (
  <div
    className="
      max-w-6xl mx-auto p-6
      bg-slate-100 dark:bg-slate-950
      text-slate-800 dark:text-slate-100
    "
  >
    <h3 className="text-xl font-semibold">Smart Travel Suggestions</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
      Personalized travel ideas powered by season, data & real experiences.
    </p>

    {/* FILTER BAR */}
    <div className="flex gap-2 mt-4 flex-wrap">
      {["All", "Adventure", "Family"].map((cat) => (
        <button
          key={cat}
          onClick={() => setFilter(cat)}
          className={`
            px-3 py-1 text-xs rounded-full border transition
            ${
              filter === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* DESTINATIONS */}
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {filteredSuggestions.map((s) => (
        <div
          key={s.id}
          className="
            bg-white dark:bg-slate-900
            rounded-2xl overflow-hidden
            border border-slate-200 dark:border-slate-700
            shadow hover:shadow-lg transition
          "
        >
          {/* IMAGE */}
          <img
            src={s.image}
            className="w-full h-40 object-cover"
            alt={s.title}
          />

          <div className="p-5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold">{s.title}</div>
              <span
                className="
                  text-[11px] px-2 py-1 rounded-full
                  bg-slate-100 dark:bg-slate-800
                  text-slate-600 dark:text-slate-400
                "
              >
                {s.category}
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {s.description}
            </p>

            {/* BASIC */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Best Months:</strong> {s.bestMonths}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Price Level:</strong> {s.priceLevel}
            </div>

            {/* CROWD */}
            <div className="text-xs mt-1">
              <strong>Crowd Prediction:</strong>{" "}
              <span
                className={
                  s.crowdLevel === "High"
                    ? "text-red-500"
                    : s.crowdLevel === "Moderate"
                    ? "text-orange-500"
                    : "text-green-500"
                }
              >
                {s.crowdLevel}
              </span>
            </div>

            {/* PRICE */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Estimated Trip Cost:</strong>
              <div>Solo — ₹{s.price.solo}</div>
              <div>Couple — ₹{s.price.couple}</div>
              <div>Family — ₹{s.price.family}</div>
            </div>

            {/* ACTIVITIES */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Top Activities:</strong> {s.activities.join(", ")}
            </div>

            {/* SIMILAR */}
            <div className="text-xs text-blue-600 dark:text-blue-400">
              <strong>Similar Places:</strong> {s.similar.join(" ● ")}
            </div>

            {/* FOOD */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Food Highlights:</strong> {s.food.join(", ")}
            </div>

            {/* EXPERIENCES */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Local Experiences:</strong>
              <ul className="list-disc ml-4">
                {s.experiences.map((ex, i) => (
                  <li key={i}>
                    {ex.title} — ₹{ex.price}
                  </li>
                ))}
              </ul>
            </div>

            {/* TRANSPORT */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Public Transport:</strong> {s.transport}
            </div>

            {/* TIME */}
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Best Time Slots:</strong>
              <ul className="list-disc ml-4">
                {s.timeSlots.map((slot, i) => (
                  <li key={i}>{slot}</li>
                ))}
              </ul>
            </div>

            {/* SERVICES */}
            <div className="text-xs flex gap-3 flex-wrap text-slate-600 dark:text-slate-400">
              <strong>Services:</strong>
              <span>📶 {s.services.internet ? "Internet" : "No Internet"}</span>
              <span>🏧 {s.services.atm ? "ATM" : "No ATM"}</span>
              <span>🏥 {s.services.hospital ? "Hospital" : "No Hospital"}</span>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
                + Full Itinerary
              </button>
              <button
                onClick={() => toggleWishlist(s.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
              >
                {wishlist.includes(s.id) ? "❤️ Saved" : "🤍 Save"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};












/* ------------------ Chatbot ------------------ */
type ChatMessage = {
  sender: "user" | "bot";
  text: string;
};

function GuideChatBot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hi 👋 I’m your Smart Yatra Guide. Ask me how to book a session or choose options."
    }
  ]);
  const [input, setInput] = useState("");

  const getReply = (msg: string) => {
    const text = msg.toLowerCase();

    if (text.includes("book")) {
      return `📌 How to book a session:
1️⃣ Open Planner Page
2️⃣ Select destination
3️⃣ Choose days
4️⃣ Enter budget
5️⃣ Click Book Session`;
    }

    if (text.includes("why") || text.includes("importance")) {
      return `🌍 Smart Yatra helps you plan budget-friendly and eco-friendly trips in one place.`;
    }

    if (text.includes("budget")) {
      return `💰 Budget guide:
• Low → nearby trips
• Medium → city trips
• High → long vacations`;
    }

    if (text.includes("eco")) {
      return `🌱 Eco-friendly choices reduce pollution and earn eco-coins.`;
    }

    return `❓ You can ask about:
• booking session
• budget
• eco options
• why Smart Yatra`;
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: getReply(input) }
    ]);
    setInput("");
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border flex flex-col z-50">
      
      {/* Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-2xl flex justify-between items-center">
        <span className="font-semibold">🤖 Smart Yatra Bot</span>
        <button onClick={onClose} className="text-white text-lg">✖</button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-lg max-w-[85%] whitespace-pre-line ${
              msg.sender === "user"
                ? "ml-auto bg-green-100 text-right"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 p-2 border-t">
        <input
          className="flex-1 border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-3 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
// ----------------------------PATH SECTION----------------------

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800">
        <TopNav />

        <main className="py-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/planner" element={<PlannerPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/suggestions" element={<SuggestionsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        {/* ✅ Chatbot Popup */}
        {isChatOpen && (
          <GuideChatBot onClose={() => setIsChatOpen(false)} />
        )}

        {/* ✅ Circular Chatbot Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-green-700 z-50"
          aria-label="Open Chatbot"
        >
          💬
        </button>

        {/* 🔻 Custom footer starts here */}
        <footer className="bg-slate-900 text-slate-200 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="text-lg font-semibold mb-3">SmartYatra</h3>
                <p className="text-slate-400">
                  Your smart companion for planning the perfect trip.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>Home</li>
                  <li>Destinations</li>
                  <li>Offers</li>
                  <li>Blog</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-slate-400">
                  <li>Contact</li>
                  <li>FAQ</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Contact</h3>
                <p className="text-slate-400">Delhi, India</p>
                <p className="text-slate-400">+91 98735 44866</p>
                <p className="text-slate-400">info@smartyatra.com</p>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-700 pt-4 text-xs text-center text-slate-500">
              © {new Date().getFullYear()} SMARTYATRA. All rights reserved.
            </div>
          </div>
        </footer>
        {/* 🔺 Custom footer ends here */}
      </div>
    </Router>
  );
}

