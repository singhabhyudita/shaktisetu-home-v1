import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../components/HomePage/HomePage";
import AckPage from "../components/AckPage/AckPage";
import AboutPage from "../components/Pages/AboutPage";
import PrivacyPage from "../components/Pages/PrivacyPage";
import TermsPage from "../components/Pages/TermsPage";
import OnboardingPage from "../components/Pages/OnboardingPage";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ack" element={<AckPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
