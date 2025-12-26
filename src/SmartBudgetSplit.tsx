import React, { useState, useEffect } from "react";
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

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

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem("budgetData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPreset(parsed.preset);
      setBudgetInput(parsed.budgetInput);
      setDaysInput(parsed.daysInput);
    }
  }, []);

  const computeBreakdown = (p: BudgetPreset): BudgetBreakdown =>
    p === "Backpacker"
      ? { accommodation: 30, food: 30, transport: 25, experiences: 15 }
      : p === "Premium"
      ? { accommodation: 55, food: 15, transport: 15, experiences: 15 }
      : { accommodation: 45, food: 20, transport: 20, experiences: 15 };

  const breakdown = computeBreakdown(preset);
  const totalBudget = Math.max(0, Number(budgetInput) || 0);
  const days = Math.max(0, Number(daysInput) || 0);

  const calculateAmount = (percent: number) =>
    totalBudget ? Math.round((totalBudget * percent) / 100) : 0;

  const amounts = {
    accommodation: calculateAmount(breakdown.accommodation),
    food: calculateAmount(breakdown.food),
    transport: calculateAmount(breakdown.transport),
    experiences: calculateAmount(breakdown.experiences),
  };

  const perDay = totalBudget > 0 && days > 0 ? Math.round(totalBudget / days) : 0;

  // Save Data
  const saveBudget = () => {
    localStorage.setItem(
      "budgetData",
      JSON.stringify({ preset, budgetInput, daysInput })
    );
    alert("Budget saved ✔");
  };

  // PDF export
  const exportPDF = async () => {
    const report = document.getElementById("budget-report");
    if (!report) return;
    const canvas = await html2canvas(report);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 5, 5, 200, 285);
    pdf.save("Budget_Report.pdf");
  };

  const barData = {
    labels: ["Accommodation", "Food", "Transport", "Experiences"],
    datasets: [
      {
        label: "Budget Split (₹)",
        data: Object.values(amounts),
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const pieData = {
    labels: ["Accommodation", "Food", "Transport", "Experiences"],
    datasets: [
      {
        data: Object.values(breakdown),
        backgroundColor: ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  return (
    <div id="budget-report" className="max-w-6xl mx-auto p-6 space-y-6">
      <h3 className="text-2xl font-semibold">💰 Smart Budget Planner</h3>

      {/* Inputs */}
      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Total budget (₹)"
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
          className="p-2 border rounded"
        />

        <input
          type="number"
          placeholder="Trip days (optional)"
          value={daysInput}
          onChange={(e) => setDaysInput(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={preset}
          onChange={(e) => setPreset(e.target.value as BudgetPreset)}
          className="p-2 border rounded"
        >
          <option value="Backpacker">Backpacker</option>
          <option value="Comfort">Comfort</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-medium mb-2">Pie Chart</h4>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h4 className="text-lg font-medium mb-2">Bar Chart</h4>
          <Bar data={barData} />
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded p-4 shadow">
        <h4 className="font-medium mb-3">Budget Split (₹)</h4>
        <div className="space-y-2 text-sm">
          {Object.entries(amounts).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span>₹ {value}</span>
            </div>
          ))}
        </div>

        {perDay > 0 && (
          <p className="mt-3 font-semibold">Approx per day: ₹ {perDay}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={saveBudget}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Plan
        </button>

        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default BudgetPage;
