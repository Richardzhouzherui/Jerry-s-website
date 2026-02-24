import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function GeometricBackground() {
    // Generate static random shapes to avoid re-render flickering
    const shapes = useMemo(() => {
        const items = [];
        // Grid Points
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (Math.random() > 0.7) {
                    items.push({
                        type: "circle",
                        cx: `${i * 10 + 5}%`,
                        cy: `${j * 10 + 5}%`,
                        r: Math.random() * 2 + 1,
                        fill: "currentColor",
                        opacity: Math.random() * 0.3 + 0.1,
                    });
                }
            }
        }

        // Random Lines
        for (let i = 0; i < 5; i++) {
            items.push({
                type: "line",
                x1: `${Math.random() * 100}%`,
                y1: `${Math.random() * 100}%`,
                x2: `${Math.random() * 100}%`,
                y2: `${Math.random() * 100}%`,
                strokeWidth: Math.random() + 0.5,
                opacity: 0.2
            });
        }

        // Random Rects (Planes)
        for (let i = 0; i < 3; i++) {
            items.push({
                type: "rect",
                x: `${Math.random() * 90}%`,
                y: `${Math.random() * 90}%`,
                width: `${Math.random() * 10 + 5}%`,
                height: `${Math.random() * 10 + 5}%`,
                fill: Math.random() > 0.5 ? "currentColor" : "none",
                stroke: "currentColor",
                opacity: 0.1
            })
        }

        return items;
    }, []);

    return (
        <div className="fixed inset-0 -z-10 text-gray-900 pointer-events-none overflow-hidden bg-[#F0F0F0]">
            <svg className="w-full h-full opacity-40">
                {shapes.map((s, i) => {
                    if (s.type === "circle") {
                        return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} opacity={s.opacity} />;
                    }
                    if (s.type === "line") {
                        return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth={s.strokeWidth} opacity={s.opacity} />;
                    }
                    if (s.type === "rect") {
                        return <rect key={i} x={s.x} y={s.y} width={s.width} height={s.height} fill={s.fill} stroke={s.stroke} opacity={s.opacity} />;
                    }
                    return null;
                })}
            </svg>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
        </div>
    );
}
