import React from "react";
import Hero from "./sections/Hero";
import Mission from "./sections/Mission";
import Features from "./sections/Features";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Clients from "./sections/Clients";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-page-content">
      <Hero />
      <Clients />
      <Mission />
      <Features />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;
