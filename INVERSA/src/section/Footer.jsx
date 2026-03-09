import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiCompass, FiEdit, FiUsers, FiCommand } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { isDark } = useTheme();

  return (
    <footer className="bg-light-surface dark:bg-dark-surface border-t border-light-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <img
                src="/INVERSA.png"
                alt="INVERSA Logo"
                className={`w-16 ${isDark ? "brightness-0 invert" : ""}`}
              />
            </div>

            <p className="text-sm text-light-secondary dark:text-dark-secondary mb-4">
              INVERSA is a collaborative creative writing platform where writers
              connect, build stories together, and publish ideas as a community.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3">

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1877F2] text-white hover:scale-110 transition"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#E4405F] text-white hover:scale-110 transition"
              >
                <FaInstagram size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#25D366] text-white hover:scale-110 transition"
              >
                <FaWhatsapp size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white hover:scale-110 transition"
              >
                <FaTwitter size={14} />
              </a>

              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0A66C2] text-white hover:scale-110 transition"
              >
                <FaLinkedinIn size={14} />
              </a>

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-3 text-light-primary dark:text-dark-primary">
              Navigation
            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <Link
                  to="/Home"
                  className="flex items-center space-x-2 hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <FiHome className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="flex items-center space-x-2 hover:text-light-primary dark:hover:text-dark-primary"
                >
                  <FiCompass className="w-4 h-4" />
                  <span>Explore</span>
                </Link>
              </li>

            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-3 text-light-primary dark:text-dark-primary">
              Platform
            </h3>

            <ul className="space-y-2 text-sm">

              {isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/dashboard/initiator"
                      className="flex items-center space-x-2 hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      <FiEdit className="w-4 h-4" />
                      <span>Projects</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/collaborator"
                      className="flex items-center space-x-2 hover:text-light-primary dark:hover:text-dark-primary"
                    >
                      <FiUsers className="w-4 h-4" />
                      <span>Collaborations</span>
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>

          {/* System */}
          <div>
            <h3 className="font-semibold mb-3 text-light-primary dark:text-dark-primary">
              System
            </h3>

            <ul className="space-y-2 text-sm">

              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 hover:text-light-primary dark:hover:text-dark-primary"
                  >
                    <FiCommand className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                </li>
              )}

              <li>
                <Link to="/about" className="hover:text-light-primary dark:hover:text-dark-primary">
                  About
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-light-primary dark:hover:text-dark-primary">
                  Contact
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-light-border dark:border-dark-border mt-10 pt-6 text-center text-sm text-light-secondary dark:text-dark-secondary">
          © {new Date().getFullYear()} INVERSA. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;