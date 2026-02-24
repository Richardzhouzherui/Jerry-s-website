import React from 'react';

/**
 * BackgroundSlider Component
 * Creates a tilted marquee background with project images and repeating text.
 * Optimized for Sections 03 and 04.
 */

// --- CONFIGURATION PARAMETERS ---
const ROTATION_DEG = 12;
const TEXT_FONT_SIZE = 78;
const TEXT_CONTENT = "Design·Design·";
const TEXT_FONT_FAMILY = "HYPixel";

// Layout & Spacing
const TEXT_START_Y = 110;
const TEXT_ROW_GAP = 8;
const IMAGE_START_Y = 300;   // Increased from 180 to move images down
const IMAGE_ROW_GAP = 60;
const IMAGE_HORIZONTAL_GAP = 64; // Horizontal gap between images (px)

// Animation Speeds (Lower = Faster)
const TEXT_SPEED_NORMAL = 120; // Increased from 60 (Slower)
const TEXT_SPEED_SLOW = 70;   // Increased from 80 (Slower)
const IMAGE_SPEED = 60;

// Images List (Project Works)
const PROJECT_IMAGES = [
    "11 2.png",
    "5ab280deeff2311fd1697f4d89dc218f 1.png",
    "5e80f39f8e2ef76b4273325624848b9 1.png",
    "8b3708cdbf19c156c1faabc499bc75cc 1.png",
    "Group 1171276870.png",
    "Group 1171276872.png",
    "Group 1171276876.png",
    "Group 1739332821.png",
    "IMG_8065 1.png",
    "ee70adb97a5fc697f294e9da45e99844 1.png",
    "image 551.png",
    "image 553.png",
    "系统设计.png"
].map(name => `/design/${encodeURIComponent(name)}`);

const BackgroundSlider = React.memo(({ opacity = 1 }) => {
    // Generate content for seamless loop
    const textRowContent = React.useMemo(() => Array(15).fill(TEXT_CONTENT).join(""), []);

    // Stabilize randomized image orders for each row to prevent jump on re-renders
    const rowsImages = React.useMemo(() => {
        return [...Array(3)].map(() => [...PROJECT_IMAGES].sort(() => 0.5 - Math.random()));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none diagonal-fade-in"
            style={{
                transform: `rotate(${ROTATION_DEG}deg) scale(1.8) translateZ(0)`,
                transformOrigin: 'center center',
                opacity: opacity,
                willChange: 'transform, opacity'
            }}>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .marquee-container {
                    display: flex;
                    white-space: nowrap;
                    width: max-content;
                }
                .animate-marquee-left {
                    animation: marquee-left ${IMAGE_SPEED}s linear infinite;
                }
                .animate-marquee-right {
                    animation: marquee-right ${TEXT_SPEED_NORMAL}s linear infinite;
                }
                .animate-marquee-left-slow {
                    animation: marquee-left ${TEXT_SPEED_SLOW}s linear infinite;
                }
            `}} />

            <div className="relative w-full h-full">
                {/* 1. Text Layer (UNDER Images) - 6 Rows */}
                <div className="absolute inset-0 flex flex-col w-full z-0 pointer-events-none" style={{ paddingTop: `${TEXT_START_Y}px`, gap: `${TEXT_ROW_GAP}px` }}>
                    {[...Array(6)].map((_, rowIdx) => (
                        <div key={`text-row-${rowIdx}`} className="marquee-container overflow-hidden w-full">
                            <div className={`flex ${rowIdx % 2 === 0 ? 'animate-marquee-left-slow' : 'animate-marquee-right'}`}>
                                {[...Array(2)].map((_, i) => (
                                    <div key={i} className="flex flex-nowrap items-center">
                                        <span
                                            className="whitespace-nowrap"
                                            style={{
                                                fontFamily: TEXT_FONT_FAMILY,
                                                fontSize: `${TEXT_FONT_SIZE}px`,
                                                color: '#111'
                                            }}>
                                            {textRowContent}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Image Layer (OVER Text) - 3 Rows */}
                <div className="absolute inset-0 flex flex-col w-full z-10 pointer-events-none" style={{ paddingTop: `${IMAGE_START_Y}px`, gap: `${IMAGE_ROW_GAP}px` }}>
                    {rowsImages.map((rowImages, rowIdx) => {
                        return (
                            <div key={`img-row-${rowIdx}`} className="marquee-container overflow-hidden w-full">
                                <div
                                    className={`flex ${rowIdx % 2 === 0 ? 'animate-marquee-left' : 'animate-marquee-right'}`}
                                    style={{ animationDelay: `${-rowIdx * 12}s` }}
                                >
                                    {[...Array(2)].map((_, groupIdx) => (
                                        <div key={groupIdx} className="flex items-center flex-nowrap" style={{ gap: `${IMAGE_HORIZONTAL_GAP}px`, paddingRight: `${IMAGE_HORIZONTAL_GAP}px` }}>
                                            {rowImages.map((img, idx) => (
                                                <img
                                                    key={`${idx}-${groupIdx}`}
                                                    src={img}
                                                    alt=""
                                                    className="h-32 w-auto object-contain pixelated opacity-100 transition-opacity"
                                                    decoding="async"
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

BackgroundSlider.displayName = 'BackgroundSlider';

export default BackgroundSlider;
