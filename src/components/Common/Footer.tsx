import React from "react";
import { Link } from "react-router-dom";
import { SITE_INFO } from "../../data/siteContent";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4 className="text-gradient">Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
        <div className="footer-col">
          <h4 className="text-gradient">Support</h4>
          <p>{SITE_INFO.email}</p>
          <p>{SITE_INFO.phone}</p>
          <p>Maharashtra, India</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} {SITE_INFO.companyName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
