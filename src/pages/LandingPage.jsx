import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import FallingWords from "../components/FallingWords";
import PhoalbumBook from "../components/PhoalbumBook";
import InspirationWords from "../components/InspirationWords";
import BackgroundSlider from "../components/BackgroundSlider";
import { getAssetPath } from "../utils/paths";

export default function LandingPage() {
    const heroRef = useRef(null);
    const section4Ref = useRef(null);
    const location = useLocation();
    const prevLocationRef = useRef(location.pathname);
    const lastSwitchRef = useRef(0);
    const fromAboutCooldownRef = useRef(0);
    const SWITCH_COOLDOWN = 800;

    const [virtualScroll, setVirtualScroll] = useState(0);
    const virtualScrollRef = useRef(0); // Track latest value for handles without stale closures
    const [maxVirtualScroll, setMaxVirtualScroll] = useState(220);
    const [isPhoalbumActive, setIsPhoalbumActive] = useState(false);
    const [isVideosActive, setIsVideosActive] = useState(false);
    const [whiteHeight, setWhiteHeight] = useState(window.innerHeight);
    const [showHint, setShowHint] = useState(true);
    const [isWordsFalling, setIsWordsFalling] = useState(false);
    const [isAboutPageActive, setIsAboutPageActive] = useState(false);
    const isAboutPageActiveRef = useRef(false); // 👈 Use Ref to avoid stale closures in handleWheel
    const [isWorksActive, setIsWorksActive] = useState(false);
    const [isWorksEntering, setIsWorksEntering] = useState(false);
    const [isIdeaActive, setIsIdeaActive] = useState(false);
    const [showEditOverlay, setShowEditOverlay] = useState(false);
    const [newItemText, setNewItemText] = useState("");
    const [newItemImage, setNewItemImage] = useState("");
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target.result;
                window.addInspirationItem?.('image', dataUrl);
                setShowEditOverlay(false);
            };
            reader.readAsDataURL(imageFile);
        }
    };

    // --- PHASE TRANSITION LOGIC (Moved up to prevent ReferenceError in hooks) ---
    const page1Max = maxVirtualScroll / 2.2;
    const p1 = Math.min(virtualScroll / page1Max, 1);
    const p2 = Math.max((virtualScroll - page1Max) / (maxVirtualScroll - page1Max), 0);

    const moveThreshold = Math.max(Math.round(maxVirtualScroll * 0.16), 12);
    const fadeRange = Math.max(maxVirtualScroll - moveThreshold, 1);
    const moveT = Math.min(virtualScroll / moveThreshold, 1);
    const moveY = -Math.round(Math.min(50, maxVirtualScroll * 0.32)) * moveT;
    const afterMove = Math.max(virtualScroll - moveThreshold, 0);
    const reveal = Math.min(afterMove / fadeRange, 1);

    const revealStart = 0.4;
    const revealEnd = 0.5;
    const revealProgress = Math.min(Math.max((p1 - revealStart) / (revealEnd - revealStart), 0), 1);
    const revealOffsetY = -80;
    const revealY = (1 - revealProgress) * 150;

    const fadeOut = 1 - Math.min(Math.max((p1 - 0.5) / 0.5, 0), 1);
    const page1ExitY = -p2 * 1000;
    const page2EnterY = (1 - p2) * 1000;

    // --- LAYOUT ADJUSTMENT PARAMETERS ---
    const bottomTextOffsetY = 270;
    const lineTopOffset = -65;
    const lineTop = Math.round(whiteHeight * 0.5 + revealOffsetY + bottomTextOffsetY + lineTopOffset);
    const fallingWordsColor = "#8A8A8A";

    const obstacleConfig = React.useMemo(() => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.45,
        width: window.innerWidth > 768 ? 228 : 168,
        height: window.innerWidth > 768 ? 300 : 220
    }), [whiteHeight]);

    const isFloating = isWordsFalling && p1 < 0.2;
    const topTextOffsetX = 0;
    const heroSectionOffsetY = 0;

    const soTextTop = -118;
    const soTextLeft = "24.5%";
    const whoTextTop = -53;
    const whoTextLeft = "23.8%";
    const underlineTop = -150;
    const underlineLeft = "1.6%";
    const underlineRotate = 5;

    const bottomTextOffsetX = 0;
    const aboutSectionMaxWidth = "120%";
    const aboutSectionPadding = "5%";
    const aboutTextMaxWidth = "800px";
    const aboutTextLineHeight = "1.6";
    const asideBoxMaxWidth = "420px";
    const asideBoxPadding = "10px 25px 24px";
    const asideTextMaxWidth = "340px";

    const arrowOpacity = 1;

    // --- PHASE 2 LAYOUT PARAMETERS ---
    const phase2ContentMaxWidth = "1310px";
    const phase2ContentPadding = "2rem";
    const phase2ContentMarginTop = "-60px";
    const phase2TextMaxWidth = "580px";
    const phase2BookMaxW = "800px";
    const phase2BookScale = 1.08;
    const phase2BookScaleMobile = 0.85;
    const phase2BookOffsetX = 80;
    const phase2BookOffsetY = -5;
    const phase2BtnArrowOffsetX = 0;
    const phase2BtnArrowOffsetY = 0;
    const phase2BtnTextOffsetX = 0;
    const phase2BtnTextOffsetY = 10;

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        if (isWorksActive && !isWorksEntering) {
            document.body.style.overflow = "auto";
            window.scrollTo(0, 0); // Ensure we start at top
        } else {
            document.body.style.overflow = "hidden";
        }
        const updateMax = () => {
            const nav = document.querySelector("nav");
            const navHeight = nav ? nav.getBoundingClientRect().height : 0;
            const viewportHeight = Math.max(window.innerHeight - navHeight, 0);
            const baseMax = Math.max(Math.round(viewportHeight * 0.28), 120);
            setMaxVirtualScroll(baseMax * 2.2); // Extended for Phase 2 (Phoalbum)
            setWhiteHeight(viewportHeight);
        };
        updateMax();
        window.addEventListener("resize", updateMax);

        const section = heroRef.current;
        const handleWheel = (event) => {
            // Check GLOBAL window location (HashRouter compatible) or Ref to block events
            if (window.location.hash.includes("/about") || isAboutPageActiveRef.current) return;

            const now = Date.now();
            if (now < fromAboutCooldownRef.current) return;
            const page1Max = maxVirtualScroll / 2.2;

            // Removed isWorksSnap logic block

            if (isVideosActive) {
                // If we are in natural scroll mode, handle return to snap
                if (isWorksActive) {
                    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

                    // STRICT RETURN LOGIC:
                    // 1. Must not be entering (animation finished)
                    // 2. Must be at the very top (scrollTop <= 5 tolerance)
                    // 3. Must be a STRONG scroll up (deltaY < -100) to prevent accidental triggers (Increased force)
                    if (!isWorksEntering && scrollTop <= 5 && event.deltaY < -100) {
                        if (now - lastSwitchRef.current < SWITCH_COOLDOWN) return;
                        event.preventDefault();
                        setIsWorksEntering(true); // Lock for exit animation
                        setIsWorksActive(false);
                        // Removed isWorksSnap set
                        document.body.style.overflow = "hidden";
                        lastSwitchRef.current = now;
                    }
                    return; // Let native scroll handle it otherwise
                }

                if (now - lastSwitchRef.current < SWITCH_COOLDOWN) return;
                // Tier 4 -> Tier 3 (Videos -> Phoalbum)
                if (event.deltaY < -30) { // Increased threshold for back-scroll to avoid double jump
                    event.preventDefault();
                    setIsVideosActive(false);
                    document.body.style.overflow = "hidden";
                    lastSwitchRef.current = now;
                }
                // Tier 4 -> Tier 6 (Videos -> Works Active DIRECTLY)
                else if (event.deltaY > 15) {
                    event.preventDefault();
                    setIsWorksEntering(true);
                    setIsWorksActive(true);
                    // Overflow remains hidden until animation completes
                    lastSwitchRef.current = now;
                }
                return;
            }

            if (isPhoalbumActive) {
                event.preventDefault();
                if (now - lastSwitchRef.current < SWITCH_COOLDOWN) return;
                // Tier 3 -> Tier 4 (Phoalbum -> Videos)
                if (event.deltaY > 15) {
                    setIsVideosActive(true);
                    lastSwitchRef.current = now;
                }
                // Tier 3 -> Tier 2 (Phoalbum -> Arrow Page)
                else if (event.deltaY < -15) {
                    setIsPhoalbumActive(false);
                    // Update both state and ref
                    setVirtualScroll(page1Max);
                    virtualScrollRef.current = page1Max;
                    lastSwitchRef.current = now;
                }
                return;
            }

            // Hero Section Logic
            // Tier 2 -> Tier 3 (Arrow Page -> Phoalbum)
            if (virtualScrollRef.current >= page1Max && event.deltaY > 15) {
                event.preventDefault();
                if (now - lastSwitchRef.current < SWITCH_COOLDOWN) return;
                setIsPhoalbumActive(true);
                lastSwitchRef.current = now;
                return;
            }

            // Continuous Sliding (Home <-> Arrow Page)
            event.preventDefault();
            const prev = virtualScrollRef.current;
            const next = Math.min(Math.max(prev + event.deltaY, 0), page1Max);

            if (next !== prev) {
                setVirtualScroll(next);
                virtualScrollRef.current = next;

                // Add "Brake" at boundaries (0 or page1Max) to enforce hierarchy
                if (next === 0 || next === page1Max) {
                    lastSwitchRef.current = now;
                }
            }
        };
        window.addEventListener("wheel", handleWheel, { passive: false });

        // --- MOBILE TOUCH SUPPORT ---
        // Touch events mirror the wheel handler so mobile users can swipe between sections.
        let touchStartY = 0;
        const handleTouchStart = (e) => {
            touchStartY = e.touches[0].clientY;
        };
        const handleTouchMove = (e) => {
            if (window.location.hash.includes("/about") || isAboutPageActiveRef.current) return;
            // Simulate deltaY from swipe direction (inverted: swipe up = scroll down)
            const deltaY = touchStartY - e.touches[0].clientY;
            if (Math.abs(deltaY) < 5) return; // ignore tiny movements
            handleWheel({ deltaY, preventDefault: () => { try { e.preventDefault(); } catch (err) { } } });
            touchStartY = e.touches[0].clientY; // update so continuous swipe feels smooth
        };
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            document.body.style.overflow = previousOverflow || "";
            window.removeEventListener("resize", updateMax);
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [maxVirtualScroll, isPhoalbumActive, isVideosActive, isWorksActive, location.pathname, isWorksEntering]);

    // Handle direct navigation to /videos
    useEffect(() => {
        const fromAbout = prevLocationRef.current === "/about";
        if (fromAbout && location.pathname === "/") {
            fromAboutCooldownRef.current = Date.now() + 1000;
        }

        if (location.pathname === "/videos") {
            setIsVideosActive(true);
            setIsPhoalbumActive(true);
        } else if (location.pathname === "/ideas") {
            setIsWorksActive(true);
            setIsVideosActive(true);
            setIsPhoalbumActive(true);
            setIsWorksEntering(false); // 👈 立即标记为进入完成，解锁滚动
        } else if (location.pathname === "/about") {
            // Do nothing, preserve current state when about overlay is open
        } else if (location.pathname === "/") {
            // Always reset if we are back at the absolute root and NOT specifically coming back to a scrolled state
            // (If coming from about, fromAbout is true, but we still want to reset if we are functionally at the start)
            if (virtualScrollRef.current < 50 || !fromAbout) {
                setIsVideosActive(false);
                setIsPhoalbumActive(false);
                setIsWorksActive(false);
            }
        }

        prevLocationRef.current = location.pathname;
    }, [location.pathname]);

    // Listen for Home reset
    useEffect(() => {
        const handleReset = () => {
            setVirtualScroll(0);
            virtualScrollRef.current = 0;
            setIsPhoalbumActive(false);
            setIsVideosActive(false);
            setIsVideosActive(false);
            // Removed isWorksSnap
            setIsWorksActive(false);
            setIsIdeaActive(false);
            document.body.style.overflow = "hidden";
        };
        window.addEventListener("resetHome", handleReset);
        return () => window.removeEventListener("resetHome", handleReset);
    }, []);

    // Notify Navbar of active section
    useEffect(() => {
        let section = "Home";
        if (isAboutPageActive) section = "About meee^"; // Match Navbar name
        else if (isIdeaActive) section = "Some Idea";
        else if (isWorksActive) section = "My Works";
        // Removed isWorksSnap check
        else if (isVideosActive) section = "Videos";
        else if (isPhoalbumActive) section = "Phoalbum";

        const event = new CustomEvent("activeSectionChanged", { detail: section });
        window.dispatchEvent(event);
    }, [isPhoalbumActive, isVideosActive, isWorksActive, isIdeaActive, isAboutPageActive]);

    // Detect Section 04 with IntersectionObserver
    useEffect(() => {
        if (!isWorksActive || !section4Ref.current) {
            setIsIdeaActive(false);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Activate when Section 04 is intersecting with top 30% of viewport
                if (entry.isIntersecting) {
                    setIsIdeaActive(true);
                } else {
                    setIsIdeaActive(false);
                }
            },
            {
                threshold: 0,
                rootMargin: "-25% 0px -70% 0px" // Trigger when entering top 25% of viewport
            }
        );

        observer.observe(section4Ref.current);
        return () => observer.disconnect();
    }, [isWorksActive]);

    // Handle scroll to Section 04 when /ideas is matched
    useEffect(() => {
        if (location.pathname === "/ideas") {
            // No delay needed now as animation is zero-duration 
            if (section4Ref.current) {
                section4Ref.current.scrollIntoView({ behavior: "auto" });
            }
        }
    }, [location.pathname, isWorksActive]);

    // Listen for About page state changes & Trigger Cooldown
    useEffect(() => {
        const handleAboutPageChange = (e) => {
            const isActive = e.detail.isActive;
            setIsAboutPageActive(isActive);
            isAboutPageActiveRef.current = isActive; // 👈 Sync Ref

            if (!isActive) {
                // About page just closed, set cooldown to prevent phantom scroll
                fromAboutCooldownRef.current = Date.now() + 1000;
            }
        };
        window.addEventListener("aboutPageStateChange", handleAboutPageChange);
        return () => window.removeEventListener("aboutPageStateChange", handleAboutPageChange);
    }, []);

    // Phoalbum Data for Preview
    const phoalbumItems = [
        { src: getAssetPath("/photography/page_1_01.webp"), alt: "01-1" },
        { src: getAssetPath("/photography/page_1_02.webp"), alt: "01-2" },
        { src: getAssetPath("/photography/page_2_01.webp"), alt: "02-1" },
        { src: getAssetPath("/photography/page_2_02.webp"), alt: "02-2" },
    ];

    return (
        <motion.div
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="relative min-h-[100dvh] bg-[#F2F2F2] text-[#111] overflow-x-hidden pt-16"
        >
            {/* Add Inspiration Overlay - Moved to top-level for consistent centering */}
            <AnimatePresence>
                {showEditOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
                        onClick={() => setShowEditOverlay(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className={`bg-white border transition-all duration-300 ${isDraggingOver ? "border-dashed border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-[#111] bg-white"} px-6 md:px-10 py-10 max-w-[480px] w-[95%] shadow-2xl font-['DotPixel'] relative mx-auto flex flex-col box-border`}
                            onClick={e => e.stopPropagation()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <button
                                onClick={() => setShowEditOverlay(false)}
                                className="absolute top-4 right-4 hover:opacity-50 text-2xl p-2"
                                aria-label="Close"
                            >
                                ×
                            </button>

                            <h3 className="text-xl mb-10 text-center border-b border-[#eee] pb-6">
                                {isDraggingOver ? "Drop to Add!" : "Add Inspiration"}
                            </h3>

                            <div className={`space-y-10 w-full transition-opacity ${isDraggingOver ? "opacity-20 pointer-events-none" : "opacity-100"}`}>
                                <div className="w-full">
                                    <label className="block text-xs mb-4 opacity-50 uppercase tracking-widest text-center">Text Idea</label>
                                    <div className="flex gap-3 w-full">
                                        <input
                                            type="text"
                                            value={newItemText}
                                            onChange={e => setNewItemText(e.target.value)}
                                            placeholder="Type a word or phrase..."
                                            className="flex-1 min-w-0 border border-[#111] p-3 outline-none focus:bg-[#f5f5f5] transition-colors"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    window.addInspirationItem?.('text', newItemText);
                                                    setNewItemText("");
                                                    setShowEditOverlay(false);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                if (newItemText) {
                                                    window.addInspirationItem?.('text', newItemText);
                                                    setNewItemText("");
                                                    setShowEditOverlay(false);
                                                }
                                            }}
                                            className="px-8 py-2 border border-[#111] hover:bg-[#111] hover:text-white transition-all whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#eee] w-full">
                                    <label className="block text-xs mb-4 opacity-50 uppercase tracking-widest text-center">Image URL / Drag Image</label>
                                    <div className="flex gap-3 w-full">
                                        <input
                                            type="text"
                                            value={newItemImage}
                                            onChange={e => setNewItemImage(e.target.value)}
                                            placeholder="Paste link or drag file here..."
                                            className="flex-1 min-w-0 border border-[#111] p-3 outline-none focus:bg-[#f5f5f5] transition-colors"
                                        />
                                        <button
                                            onClick={() => {
                                                if (newItemImage) {
                                                    window.addInspirationItem?.('image', newItemImage);
                                                    setNewItemImage("");
                                                    setShowEditOverlay(false);
                                                }
                                            }}
                                            className="px-8 py-2 border border-[#111] hover:bg-[#111] hover:text-white transition-all whitespace-nowrap"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-10 text-[10px] opacity-40 leading-relaxed italic text-center">
                                * Drag images directly here or use links. They will float and persist!
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* GLOBAL FIXED LINKS - Moved here for maximum isolation and visibility */}
            <motion.div
                className="fixed top-[35%] right-4 md:right-8 z-[10010]"
                animate={{
                    opacity: (isPhoalbumActive || isAboutPageActive || isVideosActive) ? 0 : 1,
                    pointerEvents: (isPhoalbumActive || isAboutPageActive || isVideosActive) ? "none" : "auto"
                }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
                <Link
                    to="/about"
                    className="font-['Xiaodou'] text-[#545454] hover:opacity-70 transition-opacity inline-block"
                    style={{ fontSize: "21.83px", transform: "rotate(-20.33deg)", fontWeight: "normal" }}
                >
                    About meee~
                </Link>
            </motion.div>

            {/* Left-pointing arrow - Fixed on Screen */}
            <motion.div
                className="fixed top-[calc(35%+35px)] right-4 md:right-8 z-[10010]"
                animate={{
                    opacity: (isPhoalbumActive || isAboutPageActive || isVideosActive) ? 0 : 1,
                    pointerEvents: (isPhoalbumActive || isAboutPageActive || isVideosActive) ? "none" : "auto"
                }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            >
                <Link
                    to="/about"
                    className="hover:opacity-70 transition-opacity block"
                >
                    <img src={getAssetPath("/arrow-left.webp")} alt="" className="w-8 h-auto" />
                </Link>
            </motion.div>

            {/* Top-Left Hint - MOVED TO TOP-LEVEL FOR Z-INDEX PROTECTION */}
            <style>
                {`
          @keyframes hintBounce {
            0%, 80%, 100% { transform: translateY(0) rotate(-5deg); }
            85%, 95% { transform: translateY(10px) rotate(-5deg); }
            90% { transform: translateY(0) rotate(-5deg); }
          }
          .hint-bounce-animation {
            animation: hintBounce 3s infinite;
          }
        `}
            </style>
            <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 200 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                    if (info.offset.y > 50) {
                        setIsWordsFalling(true);
                        setShowHint(false);
                    }
                }}
                className="fixed top-[-10px] left-8 md:top-[-20px] md:left-12 z-[10010] hint-bounce-animation cursor-grab active:cursor-grabbing"
                style={{
                    opacity: (showHint && !isPhoalbumActive && !isAboutPageActive && !isVideosActive) ? revealProgress : 0,
                    pointerEvents: (showHint && !isPhoalbumActive && !isAboutPageActive && !isVideosActive && revealProgress > 0.1) ? "auto" : "none",
                    transition: 'opacity 0.5s ease-in-out'
                }}
            >
                <div className="relative flex items-start gap-4">
                    <img src={getAssetPath("/arrow-top-left.webp")} alt="" className="w-10 h-auto pointer-events-none" />
                    <div className="font-['Xiaodou'] text-[#545454] space-y-0 pointer-events-none" style={{ fontSize: "19px", lineHeight: "1.2", marginTop: "120px" }}>
                        <p>Pull down a bit</p>
                        <p className="ml-4">about this website...</p>
                    </div>
                </div>
            </motion.div>

            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-[100dvh] px-4 pt-0 overflow-hidden">
                {/* --- PHASE 1 CONTAINER --- */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    animate={{
                        y: isPhoalbumActive ? -1000 : 0,
                        opacity: isPhoalbumActive ? 0 : 1
                    }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                >
                    {/* Original Hero Content - Drifting Unchanged */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="relative w-full max-w-xl mx-auto pointer-events-auto"
                            style={{ transform: `translateY(${heroSectionOffsetY}px)` }}
                        >
                            <div style={{ transform: `translateY(${moveY}px)` }}>
                                {/* SO, text */}
                                <div
                                    className="absolute z-20 font-['Xiaodou'] text-[#000000]"
                                    style={{
                                        top: `${soTextTop}px`,
                                        left: `calc(5% + ${topTextOffsetX}px)`,
                                        transform: "rotate(-5.36deg)",
                                        fontSize: window.innerWidth < 768 ? "42px" : "65px"
                                    }}
                                >
                                    <div className="hidden md:block absolute" style={{ left: soTextLeft }} />
                                    {/* Since we want to support the md:left property, we'll use a wrapper or just rely on inline style for the desktop value and className for mobile if needed, but the user asked for "adjustable code", so I'll simplify the JSX to use the variables directly. */}
                                    SO,
                                </div>

                                {/* Who the hell is this guy??? text */}
                                <div
                                    className="absolute top-[-55px] left-[5%] md:left-[4.3%] z-10 font-['Xiaodou'] text-[#000000]"
                                    style={{ transform: "rotate(-5.36deg)", fontSize: "36px", fontWeight: "normal", whiteSpace: "nowrap" }}
                                >
                                    Who the hell is this guy???
                                </div>

                                {/* Underline image */}
                                <div
                                    className="absolute top-[-120px] left-[5%] md:left-[-8.5%] z-9"
                                    style={{ transform: "rotate(-5.36deg)" }}
                                >
                                    <img
                                        src={getAssetPath("/underline.webp")}
                                        alt=""
                                        className="w-full"
                                        style={{ marginTop: "51px", transform: "rotate(5deg) scale(0.85)" }}
                                    />
                                </div>

                                {/* Central Portrait Image */}
                                <div
                                    className="relative mx-auto w-[168px] md:w-[228px] mt-8 md:mt-0"
                                    style={{ marginTop: "-10px" }}
                                >
                                    <img src={getAssetPath("/myImage.webp")} alt="Portrait" className="w-full h-auto" />

                                    {/* Jerry.Z Tag - Hidden on mobile to avoid overflow */}
                                    <div
                                        className="absolute top-[62%] left-[100%] ml-4 z-30 pointer-events-none hidden md:block"
                                        style={{ opacity: revealProgress }}
                                    >
                                        <div className="relative">
                                            <p className="font-['Xiaodou'] text-[#CE6452] whitespace-nowrap" style={{ fontSize: "25px", transform: "rotate(21.4deg) translateX(-1px)", fontWeight: "bold" }}>
                                                Yes... This is Jerry.Z
                                            </p>
                                            <img
                                                src={getAssetPath("/arrow-jerry.webp")}
                                                alt=""
                                                className="w-12 h-auto mt-2"
                                                style={{ transform: "rotate(0deg) scaleX(1) scale(1.6) translateX(12px)" }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom description (TOP TEXT GROUP) */}
                                <div
                                    className="mt-12 md:mt-10 max-w-3xl ml-[5%] md:ml-[-3.5%] text-left font-['Xiaodou'] text-[#545454]"
                                    style={{
                                        fontSize: window.innerWidth < 768 ? "15px" : "18px",
                                        transform: `rotate(-2.35deg) translateX(${topTextOffsetX}px)`,
                                        fontWeight: "normal",
                                        opacity: fadeOut
                                    }}
                                >
                                    <div className="space-y-1">
                                        <p className="leading-relaxed md:whitespace-nowrap">
                                            A personal archive of design thinking, visual experiments and unfinished ideas.
                                        </p>
                                        <p className="leading-relaxed">Not a portfolio. Not a blog. A growing space.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>




                    {/* Layer 2: Separator Line */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 h-px bg-[#111]/70"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: (p1 > 0.4 && !isPhoalbumActive) ? 1 : 0
                        }}
                        transition={{ duration: 0.8 }}
                        style={{
                            width: "1300px",
                            maxWidth: "100%",
                            top: lineTop
                        }}
                    />

                    {/* Falling Words Physics Component */}
                    <FallingWords
                        trigger={isWordsFalling && !isPhoalbumActive && !isAboutPageActive && !isVideosActive}
                        visible={!isAboutPageActive && !isVideosActive}
                        floorY={lineTop}
                        leftSpawnX={window.innerWidth * 0.2}
                        rightSpawnX={window.innerWidth * 0.8}
                        spawnY={80}
                        color={fallingWordsColor}
                        rightWallOffset={200}
                        isFloating={isFloating}
                        obstacle={obstacleConfig}
                    />

                    {/* Layer 3: Rising description (BOTTOM TEXT GROUP) */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0, y: (revealOffsetY + bottomTextOffsetY + 100) }}
                        animate={{
                            y: p1 > 0.4 ? (revealOffsetY + bottomTextOffsetY) : (revealOffsetY + bottomTextOffsetY + 100),
                            opacity: (p1 > 0.4 && !isPhoalbumActive) ? 1 : 0
                        }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div
                            className="mt-0 w-full text-left pointer-events-auto"
                            style={{
                                maxWidth: aboutSectionMaxWidth,
                                padding: `0 ${aboutSectionPadding}`
                            }}
                        >
                            <div className="relative">
                                <p className="mb-2 text-[#000000] font-['HYPixel']" style={{ fontSize: window.innerWidth < 768 ? '26px' : '40px' }}>
                  // And__what is this website about??
                                </p>
                            </div>
                            <div
                                className="flex flex-col md:flex-row md:items-stretch justify-between text-[#545454] font-['HYPixel']"
                                style={{ fontSize: window.innerWidth < 768 ? '15px' : '20px', gap: window.innerWidth < 768 ? '20px' : '60px' }}
                            >
                                <p
                                    className="text-left whitespace-normal shrink-0 relative"
                                    style={{ width: aboutTextMaxWidth, maxWidth: "100%", lineHeight: aboutTextLineHeight }}
                                >
                                    &gt;&gt;&gt; This is a place where I document my design endeavours alongside a few minor
                                    reflections and inspirations. I hope it can be accessed from any device, anywhere
                                    in the world!
                                    {/* Red Cross Image - Now overlapping this text */}
                                    <img
                                        src={getAssetPath("/red-cross.webp")}
                                        alt=""
                                        className="absolute bottom-[-50%] right-[-5%] md:right-[-5%] w-32 md:w-48 h-auto pointer-events-none z-50"
                                        style={{ transform: "rotate(5deg) scale(1.3)" }}
                                    />
                                </p>
                                <div
                                    className="shrink-0 border text-center text-[#545454]"
                                    style={{
                                        width: asideBoxMaxWidth,
                                        maxWidth: "100%",
                                        padding: asideBoxPadding,
                                        borderColor: "#111",
                                        borderStyle: "solid",
                                        borderWidth: "1px"
                                    }}
                                >
                                    <p
                                        className="whitespace-normal mx-auto"
                                        style={{ width: asideTextMaxWidth, maxWidth: "100%", lineHeight: aboutTextLineHeight }}
                                    >
                                        &gt;&gt;&gt; I just wanna design a website for myself.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Down arrow */}
                    <div
                        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-[200]"
                        style={{
                            opacity: (isPhoalbumActive || isAboutPageActive || isVideosActive) ? 0 : arrowOpacity,
                            transition: 'opacity 0.5s ease-in-out'
                        }}
                    >
                        <img
                            src={getAssetPath("/arrow-down.webp")}
                            alt=""
                            className="w-8 h-auto animate-bounce opacity-70"
                            style={{
                                filter:
                                    "brightness(0) saturate(100%) invert(33%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)"
                            }}
                        />
                    </div>
                </motion.div>

                {/* --- PHASE 2 CONTAINER (Phoalbum) --- */}
                <motion.div
                    className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                    initial={{ y: 1000, opacity: 0 }}
                    animate={{
                        y: isPhoalbumActive ? 0 : (isVideosActive || isWorksActive ? -1000 : 1000),
                        opacity: isPhoalbumActive ? 1 : 0
                    }}
                    transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }} // 调整此行加快过渡速度
                >
                    <div
                        className="w-full flex flex-col md:flex-row items-center justify-between pointer-events-auto"
                        style={{
                            maxWidth: phase2ContentMaxWidth,
                            padding: phase2ContentPadding,
                            marginTop: phase2ContentMarginTop
                        }}
                    >
                        {/* Left Side: Text & Button */}
                        <div className="flex-1 text-left" style={{ maxWidth: phase2TextMaxWidth }}>
                            <motion.h2
                                className="font-['HYPixel'] text-[#111] mb-10 tracking-tight"
                                style={{ fontSize: "36px" }}
                                animate={{ opacity: isPhoalbumActive ? 1 : 0, y: isPhoalbumActive ? 0 : 10 }}
                                transition={{ delay: 0.5, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                            >
                                // 01 Phoalbum
                            </motion.h2>

                            <motion.div
                                className="font-['DotPixel'] text-[#545454]"
                                style={{ fontSize: "16px", lineHeight: "1.6" }}
                                animate={{ opacity: isPhoalbumActive ? 1 : 0, y: isPhoalbumActive ? 0 : 10 }}
                                transition={{ delay: 0.6, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <p>
                                    This is a term I coined myself, combining 'Photo' and 'album'.
                                    The original intention behind creating this photobook stems from a point in time when I began to lose my sense of joy.
                                    I found myself becoming inexplicably serious in daily life, and it seemed that as I grew older,
                                    my ability to perceive life was gradually diminishing...
                                    Photography, however, became a way for me to rediscover joy and reconnect with life
                                    (alongside painting, of course). Thus, I urgently wished for my observations,
                                    my joys, and my small insights to manifest tangibly before me,
                                    constantly reminding me: Be Happy, Do Not Worry~.
                                </p>
                            </motion.div>

                            <motion.div
                                className="mt-16"
                                animate={{ opacity: isPhoalbumActive ? 1 : 0, y: isPhoalbumActive ? 0 : 10 }}
                                transition={{ delay: 0.7, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <Link to="/gallery" className="group block w-full md:w-[420px]">
                                    <motion.div
                                        whileHover="hover"
                                        className="relative border border-[#111] h-[124px] bg-transparent group-hover:bg-[#111] transition-colors duration-300 p-6 flex flex-col justify-between"
                                    >
                                        <motion.div
                                            className="flex justify-end pointer-events-none"
                                            style={{ transform: `translate(${phase2BtnArrowOffsetX}px, ${phase2BtnArrowOffsetY}px)` }}
                                            variants={{
                                                hover: { x: phase2BtnArrowOffsetX + 8 }
                                            }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                            <span className="font-['DotPixel'] text-[#111] group-hover:text-white text-[20px] transition-colors duration-300">
                                                &gt;&gt;&gt;
                                            </span>
                                        </motion.div>
                                        <div
                                            className="flex justify-start"
                                            style={{ transform: `translate(${phase2BtnTextOffsetX}px, ${phase2BtnTextOffsetY}px)` }}
                                        >
                                            <span className="font-['DotPixel'] text-[20px] tracking-widest uppercase text-[#111] group-hover:text-white transition-colors duration-300">
                                                ENTER GALLERY
                                            </span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Right Side: Book Preview (Canvas Area) */}
                        <motion.div
                            className="flex-1 flex flex-col justify-start items-center h-full mt-12 md:mt-0"
                            style={{
                                maxWidth: phase2BookMaxW
                            }}
                            animate={{
                                opacity: isPhoalbumActive ? 1 : 0,
                                x: phase2BookOffsetX, // Constant offset
                                y: phase2BookOffsetY, // Constant offset
                                scale: window.innerWidth > 768 ? phase2BookScale : phase2BookScaleMobile, // Constant scale
                                rotate: 0 // No rotation
                            }}
                            transition={{ delay: 0.8, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                        >
                            <div className="w-full transform origin-center">
                                <PhoalbumBook
                                    items={phoalbumItems}
                                    isInitialClosed={false}
                                    locked={true}
                                    className="landing-section-01-book"
                                />
                            </div>

                        </motion.div>
                    </div>
                </motion.div>

                {/* --- PHASE 3 CONTAINER (Videos) --- */}
                <motion.div
                    className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                    initial={{ y: 1000 }}
                    animate={{ y: isVideosActive ? (isWorksActive ? "-100vh" : 0) : 1000 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    style={{ backgroundColor: "#222222", zIndex: 100 }}
                >
                    <div
                        className="w-full text-white pointer-events-auto"
                        style={{
                            maxWidth: phase2ContentMaxWidth,
                            padding: phase2ContentPadding,
                            marginTop: "160px" // Compensate for manual upward offsets of children
                        }}
                    >
                        <motion.h2 className="font-['HYPixel'] mb-8 text-white" style={{ fontSize: "36px" }} animate={{ opacity: isVideosActive ? 1 : 0, y: isVideosActive ? 0 : 10 }} transition={{ delay: 0.5 }}>// 02 Videos</motion.h2>
                        <motion.div className="font-['DotPixel'] text-white/80 mb-12 max-w-8xl" style={{ fontSize: "16px", lineHeight: "1.6" }} animate={{ opacity: isVideosActive ? 1 : 0, y: isVideosActive ? 0 : 10 }} transition={{ delay: 0.6 }}>
                            <p>These videos represent my attempt to leave something behind in this world. The content largely revolves around design education and design history, starting from a minute design detail or visual phenomenon to trace its origins and how it shapes our contemporary perceptions and usage. Beyond relatively systematic research, I also engage in lighter, more offbeat experiments—drawn from daily life, travels, or moments that make me pause for a second look. Regardless of form, they all point to the same thing: preserving the thoughts and curiosities unfolding in the present.</p>
                        </motion.div>
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            {/* Left Side: Smaller Image */}
                            <motion.div
                                className="w-full md:w-[35%]"
                                animate={{
                                    opacity: isVideosActive ? 1 : 0,
                                    scale: window.innerWidth >= 768 ? 0.8 : 1,
                                    x: window.innerWidth >= 768 ? 676 : 0,
                                    y: window.innerWidth >= 768 ? -40 : 0
                                }}
                                transition={{ delay: 0.7, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                            >
                                <img src={getAssetPath("/videos-section-img.webp")} alt="" className="w-full h-auto" />
                            </motion.div>

                            {/* Right Side: Larger Video Area */}
                            <div className="w-full md:w-[55%] flex flex-col gap-10">
                                <motion.div
                                    className="aspect-video bg-black/40 border border-white/20 group overflow-hidden relative"
                                    animate={{
                                        opacity: isVideosActive ? 1 : 0,
                                        x: window.innerWidth >= 768 ? -484 : 0,
                                        y: window.innerWidth >= 768 ? -10 : 0
                                    }}
                                    transition={{ delay: 0.8, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                                >
                                    <video
                                        src={getAssetPath("/video-intro.mp4")}
                                        className="w-full h-full object-cover"
                                        playsInline
                                        onMouseEnter={(e) => {
                                            const video = e.target;
                                            video.currentTime = 0;
                                            video.play();
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
                                        <div className="bg-black/50 backdrop-blur-sm px-4 py-2 text-xs border border-white/20 text-white font-['DotPixel'] uppercase tracking-widest">
                                            HOVER TO PLAY
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="mt-16 self-end"
                                    animate={{
                                        opacity: isVideosActive ? 1 : 0,
                                        x: window.innerWidth >= 768 ? (isVideosActive ? 86 : 96) : 0,
                                        y: window.innerWidth >= 768 ? (isVideosActive ? -240 : -230) : 0
                                    }}
                                    transition={{ delay: 0.9, duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                                >
                                    <Link to="/videos" className="group block w-full md:w-[535px]">
                                        <div className="relative border border-white h-[124px] bg-transparent group-hover:bg-white transition-colors duration-300 p-6 flex flex-col justify-between">
                                            <div className="flex justify-end transition-all duration-300 group-hover:translate-x-2">
                                                <span className="font-['DotPixel'] text-white group-hover:text-[#222] text-[20px] transition-colors duration-300">
                                                    &gt;&gt;&gt;
                                                </span>
                                            </div>
                                            <div className="flex justify-start">
                                                <span className="font-['DotPixel'] text-[20px] tracking-widest uppercase text-white group-hover:text-[#222] transition-colors duration-300">
                                                    EXPLORE MORE
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- PHASE 4 CONTAINER REMOVED --- */}
            </section>

            {/* Sections 03 & 04 Container - Normal Scroll Area */}
            <AnimatePresence>
                {isWorksActive && (
                    <motion.div
                        key="works-container"
                        className="relative w-full bg-[#f2f2f2] z-[200]"
                        initial={{ y: "100vh" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100vh" }}
                        transition={{
                            duration: location.pathname === "/ideas" ? 0 : 0.8, // 👈 如果是跳转，动画时长设为 0
                            ease: [0.76, 0, 0.24, 1]
                        }}
                        onAnimationComplete={() => {
                            if (location.pathname !== "/ideas") {
                                setIsWorksEntering(false);
                            }
                        }}
                        style={{ marginTop: "-100vh" }}
                    >
                        {/* Sections 03 & 04 Container */}
                        <div className="relative">

                            {/* --- Background Layer (Independent) --- */}
                            <div
                                className="absolute z-0 pointer-events-none overflow-hidden"
                                style={{
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: "350px" // 调整背景容器的底部缩进 (数值越大背景越短)
                                }}
                            >
                                <BackgroundSlider />
                            </div>

                            {/* --- Content Layer --- */}
                            <div className="relative z-10">

                                {/* Section 03 - My Works */}
                                <section className="relative min-h-screen z-10 flex flex-col justify-center">
                                    <div
                                        className="w-full mx-auto"
                                        style={{
                                            maxWidth: phase2ContentMaxWidth,
                                            padding: phase2ContentPadding,
                                            marginTop: "-70px" // 调整参数在此行：整体上移
                                        }}
                                    >
                                        {/* Unified Section 03 Container - All in One Border */}
                                        <div className="border border-[#111]" style={{ marginLeft: "-48px", marginRight: "-48px" }}>
                                            {/* Row 1: My Works + Selected Works */}
                                            <div className="flex border-b border-[#111]">
                                                {/* My Works - Left Side */}
                                                <div className="bg-white/[0.03] backdrop-blur-md flex-1" style={{ paddingLeft: "48px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "35px" }}>
                                                    <h2 className="font-['HYPixel'] text-[#111] mb-6" style={{ fontSize: "36px" }}>// 03 My Works</h2>
                                                    <div className="font-['DotPixel'] text-[#545454] space-y-4" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                                                        <p>This section encompasses my past and ongoing design projects, alongside illustrations, watercolours, and sketches. The content spans product, interaction, visual, and motion design, while also preserving numerous fragments that lean more towards personal practice and intuitive expression.</p>
                                                        <p>Rather than categorising my work into distinct sections, I prefer to place it along a single timeline. For me, these pieces collectively document the evolving understanding of form, tools, and modes of expression that I've developed across different stages of my career.</p>
                                                    </div>
                                                </div>

                                                {/* Selected Works - Right Side */}
                                                <div className="bg-white/[0.03] backdrop-blur-md border-l border-[#111] hover:bg-black hover:text-white transition-colors duration-300 flex flex-col justify-end items-stretch" style={{ width: "280px" }}>
                                                    <div className="flex justify-between items-center h-full" style={{ padding: "16px 24px" }}>
                                                        <span className="font-['HYPixel'] text-xl">SELECTED WORKS</span>
                                                        <span className="font-['DotPixel'] text-xl">&gt;&gt;&gt;</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2-5: Category Options */}
                                            {[
                                                { title: "OVERVIEW", dark: false },
                                                { title: "PRODUCT_DESIGN", dark: false },
                                                { title: "GRAPHIC_DESIGN", dark: false },
                                                { title: "ILLUSTRATION / SKETCH", dark: false }
                                            ].map((cat, idx) => (
                                                <div key={idx} className={`group cursor-pointer transition-all duration-300 flex justify-between items-center bg-white/80 hover:bg-[#111] hover:text-white ${idx !== 3 ? 'border-b border-[#111]' : ''}`} style={{ paddingLeft: "48px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "12px" }}>
                                                    <span className="font-['HYPixel'] tracking-wider" style={{ fontSize: cat.title === 'OVERVIEW' ? '40px' : '24px' }}>{cat.title}</span>
                                                    <span className="font-['DotPixel'] text-2xl group-hover:translate-x-2 transition-transform">&gt;&gt;&gt;</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>



                                {/* Section 04 - Some Ideas */}
                                <section ref={section4Ref} className="relative min-h-screen z-10 flex flex-col justify-center">
                                    <div className="w-full mx-auto" style={{ maxWidth: phase2ContentMaxWidth, padding: phase2ContentPadding, paddingBottom: 0 }}>
                                        <h2 className="font-['HYPixel'] text-[#111] mb-10 tracking-tight" style={{ fontSize: "36px" }}>
                                    // 04 Some Ideas
                                        </h2>
                                        <div className="font-['DotPixel'] text-[#545454]" style={{ fontSize: "16px", lineHeight: "1.6", maxWidth: "40vw" }}>
                                            <p>Ever have those whimsical ideas and things you'd like to do but never quite get round to? Well, I've decided to chuck my inspirations over here. This spot holds all sorts of odds and ends about my attempts and musings - feel free to scribble and doodle away here...</p>
                                        </div>
                                    </div>

                                    {/* Chalkboard / Brainstorming Area */}
                                    <div className="relative w-full mt-8">
                                        {/* Write down image above the line (Independent positioning) */}
                                        <div className="absolute top-0 left-0 right-0 mx-auto" style={{ transform: "translateY(-60%) translateX(320px)", marginTop: "90px", maxWidth: phase2ContentMaxWidth, padding: phase2ContentPadding, pointerEvents: "none", zIndex: 1 }}>
                                            <img src={getAssetPath("/writedown.webp")} alt="Write down" className="w-auto h-auto max-w-full origin-top" style={{ scale: 0.32 }} />
                                        </div>

                                        {/* Centered Divider Line (40% opacity) */}
                                        <div className="relative w-full mx-auto" style={{ maxWidth: phase2ContentMaxWidth, paddingLeft: phase2ContentPadding, paddingRight: phase2ContentPadding, paddingTop: 0, paddingBottom: 0 }}>
                                            <div className="h-px bg-[#000] opacity-40" />
                                        </div>

                                        {/* Edit Logo (Pencil) - BELOW the line and right-aligned */}
                                        <div className="relative w-full mx-auto" style={{ maxWidth: phase2ContentMaxWidth, paddingLeft: phase2ContentPadding, paddingRight: phase2ContentPadding, paddingTop: 0, paddingBottom: 0, zIndex: 10 }}>
                                            <div
                                                className="absolute top-[12px] right-0 w-8 h-8 border border-[#111] bg-[#F2F2F2] group/pencil hover:bg-[#111] transition-colors cursor-pointer flex items-center justify-center mr-[48px]"
                                                onClick={() => setShowEditOverlay(true)}
                                            >
                                                <img src={getAssetPath("/icons/pencil.webp")} alt="Edit" className="w-5 h-5 group-hover/pencil:invert transition-all" />
                                            </div>
                                        </div>


                                        <div className="relative w-full" style={{ marginTop: "0px" }}>
                                            <InspirationWords containerHeight={800} />
                                        </div>


                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="relative z-10 px-8 md:px-20 py-12 border-t border-[#111] flex flex-col md:flex-row justify-between items-center font-['DotPixel'] text-sm text-[#111]">
                            <div className="mb-4 md:mb-0">
                                <p>Contact: <a href="mailto:3134499362@qq.com" className="underline hover:opacity-70">3134499362@qq.com</a></p>
                            </div>
                            <div className="text-center md:text-right">
                                <p>© 2026 Jerry's Archive · All Rights Reserved</p>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
