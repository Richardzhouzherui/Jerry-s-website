import React from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Portfolio from "./pages/Portfolio";

function AnimatedRoutes() {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  // We keep track of the last visited path that wasn't "/about" 
  // to keep it as a static background.
  const prevPathRef = React.useRef("/");

  React.useEffect(() => {
    if (location.pathname !== "/about") {
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  // If we are on about page, we "freeze" the routes to the previous path
  const backgroundLocation = isAboutPage ? { ...location, pathname: prevPathRef.current } : location;

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout">
        <Routes location={backgroundLocation} key={backgroundLocation.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/videos" element={<LandingPage />} />
          <Route path="/ideas" element={<LandingPage />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {isAboutPage && <About key="about-overlay" backgroundPath={prevPathRef.current} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}