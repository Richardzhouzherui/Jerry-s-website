import React from "react";
import "./TiltedCarouselBackground.css";

const designImages = [
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
