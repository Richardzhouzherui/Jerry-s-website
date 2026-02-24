import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isSubmenuHovered, setIsSubmenuHovered] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isAboutActive, setIsAboutActive] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Phoalbum", path: "/gallery" },
    { name: "Videos", path: "/videos" },
    { name: "My Works", path: "/portfolio", hasSubmenu: true },
    { name: "Some Idea", path: "/ideas" },
    { name: "About meee^", path: "/about" },
  ];

  // Listen for active section changes from LandingPage
  useEffect(() => {
    const handleSectionChange = (e) => {
      setActiveSection(e.detail);
    };
    window.addEventListener("activeSectionChanged", handleSectionChange);

    // Listen for About page overlay status
    const handleAboutPageChange = (e) => {
      setIsAboutActive(e.detail.isActive);
    };
    window.addEventListener("aboutPageStateChange", handleAboutPageChange);

    return () => {
      window.removeEventListener("activeSectionChanged", handleSectionChange);
      window.removeEventListener("aboutPageStateChange", handleAboutPageChange);
    };
  }, []);

  // Clear active section when moving away from home
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null);
    }
  }, [location.pathname]);

  const isDark = activeSection === "Videos" || isAboutActive;
  const isGlass = activeSection === "My Works" || activeSection === "Some Idea";

  return (
    <nav className={`fixed top-0 left-0 w-full z-[10001] py-4 px-8 flex justify-between items-center transition-colors duration-300 ${isDark
      ? "bg-[#222222]"
      : isGlass
        ? "bg-transparent backdrop-blur-md border-b border-transparent"
        : "bg-[#F2F2F2]/95 border-b border-transparent"
      }`}>
      {/* Left: Brand/Title with Avatar and Navigation Links */}
      <div className="flex items-center gap-8">
        {/* Brand with Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative">
            <img
              src="/avatar.png"
              alt="icon"
              className={`absolute top-1/2 left-[-25px] -translate-y-1/2 w-14 h-14 max-w-none object-contain transition-all ${isDark ? "invert" : ""}`}
            />
          </div>
          <Link
            to="/"
            onClick={() => window.dispatchEvent(new CustomEvent("resetHome"))}
            className={`font-['HYPixel'] hover:opacity-70 transition-all ${isDark ? "text-white" : "text-[#000000]"}`}
            style={{ fontSize: '18.74px' }}
          >
            Jerry'z Inspiration Archive
          </Link>
        </div>

        {/* Navigation Links */}
        <div className={`hidden md:flex items-center space-x-1 font-['HYPixel'] transition-colors ${isDark ? "text-white" : "text-[#000000]"}`} style={{ fontSize: '18.74px' }}>
          {navLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <div
                className="relative flex items-center"
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => {
                  setHoveredLink(null);
                  if (link.hasSubmenu) setIsSubmenuHovered(false);
                }}
              >
                <Link
                  to={link.path}
                  className={`px-2 py-[2px] transition-all duration-75 block ${hoveredLink === link.name
                    ? (isDark ? 'border border-white' : 'border border-black')
                    : 'border border-transparent'
                    }`}
                >
                  {link.name}
                </Link>

                {/* Dynamic Underline Indicator */}
                {((activeSection === link.name && location.pathname === "/") || (location.pathname === link.path)) && (
                  <motion.div
                    key={activeSection + location.pathname}
                    className={`absolute bottom-[-1px] left-0 w-full h-[2px] ${isDark ? "bg-white" : "bg-black"}`}
                    initial={{ scaleX: 0.01 }}
                    animate={{ scaleX: 1 }}
                    style={{ originX: 0.5 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}
                  />
                )}

                {/* Submenu for My Works */}
                {link.hasSubmenu && hoveredLink === "My Works" && (
                  <div className="absolute top-[calc(100%-1px)] left-0 z-50">
                    <Link
                      to="/portfolio/selected"
                      onMouseEnter={() => setIsSubmenuHovered(true)}
                      onMouseLeave={() => setIsSubmenuHovered(false)}
                      className={`block px-2 py-[2px] border min-w-max transition-colors duration-75 flex items-center justify-between gap-2 ${isDark
                        ? (isSubmenuHovered ? 'bg-white text-black border-white' : 'bg-[#111] text-white border-white')
                        : (isSubmenuHovered ? 'bg-black text-white border-black' : 'bg-[#F2F2F2] text-black border-black')
                        }`}
                      style={{ marginTop: '-1px' }}
                    >
                      <span className="whitespace-nowrap">Selected Works</span>
                      <img
                        src="/icons/vector-arrow.svg"
                        alt=""
                        className={`w-3 h-3 transition-transform duration-200 ${isSubmenuHovered ? 'rotate-0' : '-rotate-90'} ${(isSubmenuHovered && !isDark) || (!isSubmenuHovered && isDark) ? 'invert' : ''
                          }`}
                      />
                    </Link>
                  </div>
                )}
              </div>
              {index < navLinks.length - 1 && <span className="px-1">/</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right: Contact */}
      <div>
        <a href="mailto:3134499362@qq.com" className={`font-['HYPixel'] hover:opacity-70 transition-all ${isDark ? "text-white" : "text-[#000000]"}`} style={{ fontSize: '18.74px' }}>
          Contact
        </a>
      </div>
    </nav>
  );
}