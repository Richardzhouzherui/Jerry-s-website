import React from "react";
import "./TiltedCarouselBackground.css";

const designImages = [
    "11 2.webp",
    "5ab280deeff2311fd1697f4d89dc218f 1.webp",
    "5e80f39f8e2ef76b4273325624848b9 1.webp",
    "8b3708cdbf19c156c1faabc499bc75cc 1.webp",
    "Group 1171276870.webp",
    "Group 1171276872.webp",
    "Group 1171276876.webp",
    "Group 1739332821.webp",
    "IMG_8065 1.webp",
    "ee70adb97a5fc697f294e9da45e99844 1.webp",
    "image 551.webp",
    "image 553.webp",
    "系统设计.webp"
];

const TiltedCarouselBackground = () => {
    return (
        <div className="tilted-background-container">
            {/* Background Layer 1: Images */}
            <div className="marquee-layer images-layer">
                <div className="marquee-content">
                    {[...designImages, ...designImages].map((img, idx) => (
                        <img key={idx} src={`/design/${img}`} alt="" className="marquee-img" />
                    ))}
                </div>
            </div>

            {/* Background Layer 2: Text Overlay */}
            <div className="marquee-layer text-layer">
                <div className="marquee-content text-marquee">
                    {Array(20).fill("Design·Design·").map((text, idx) => (
                        <span key={idx} className="marquee-text">{text}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TiltedCarouselBackground;
