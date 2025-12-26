import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");       // 🔹 new: name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = () => {
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // 🔹 set Firebase displayName (optional but good)
        try {
          await updateProfile(userCredential.user, { displayName: name });
        } catch (e) {
          console.log("Profile update error:", e);
        }

        setSuccess("Account created successfully!");

        // 🔹 store name + email in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
          })
        );

        setTimeout(() => navigate("/"), 800);
      })
      .catch((err: any) => {
        console.log(err.code, err.message); // see exact Firebase error in console

        if (err.code === "auth/email-already-in-use") {
          setError("Email already exists. Try logging in instead.");
        } else if (err.code === "auth/weak-password") {
          setError("Password should be at least 6 characters.");
        } else if (err.code === "auth/operation-not-allowed") {
          setError(
            "Email/password sign-in is disabled in Firebase (enable it in Firebase Console)."
          );
        } else {
          setError(err.message); // fallback: show Firebase message
        }

        setSuccess(""); // clear success if an error happens
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Create Account
        </h2>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mb-2">{success}</div>
        )}

        {/* 🔹 Name input */}
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?
          <a href="/login" className="text-green-600 ml-1 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
