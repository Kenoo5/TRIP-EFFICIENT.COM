import { useState } from "react";
import { useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";

const BookingPage: React.FC = () => {
  const { search } = useLocation();
  const experienceTitle =
    new URLSearchParams(search).get("exp") || "Community Experience";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
    experience: experienceTitle, // 🔥 this is the “experience title”
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMail = (e: React.FormEvent) => {
    e.preventDefault();

    // These keys must match your EmailJS template vars:
    // {{name}}, {{email}}, {{phone}}, {{date}}, {{message}}, {{experience}}
    emailjs
      .send(
        "service_tour17",
        "template_smart17",
        form,
        "szYh_nMzvjz_PICQm"
      )
      .then(() => {
        alert("Booking request sent successfully ✔");
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to send booking. Please try again ❌");
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold">Book Community Experience</h2>
      <p className="text-sm text-slate-500">
        Fill the details below. The host / guide will contact you soon.
      </p>

      <form onSubmit={sendMail} className="space-y-3">
        <div>
          <label className="text-xs text-slate-600">Experience</label>
          <input
            type="text"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm bg-slate-50"
            readOnly
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">Your Name</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">Your Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
            required
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">Phone Number</label>
          <input
            type="text"
            name="phone"
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">Preferred Date</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-slate-600">Message / Notes</label>
          <textarea
            name="message"
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
            rows={3}
            placeholder="Tell us about timing, group size, language preference, etc."
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
        >
          Send Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
