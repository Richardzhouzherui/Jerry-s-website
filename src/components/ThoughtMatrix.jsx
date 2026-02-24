import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

// Individual Item Component - Manages its own physics
const ThoughtItem = ({ item, containerRef }) => {
    const x = useMotionValue(item.x);
    const y = useMotionValue(item.y);

    // Physics state (refs to avoid re-renders)
    const vx = useRef(item.vx);
    const vy = useRef(item.vy);
    const isDragging = useRef(false);

    useEffect(() => {
        let rafId;

        const update = () => {
            // Stop physics if dragging or container missing
            if (!containerRef.current || isDragging.current) {
                rafId = requestAnimationFrame(update);
                return;
            }

            const { width, height } = containerRef.current.getBoundingClientRect();

            // Safety check for zero-size container
            if (width === 0 || height === 0) {
                rafId = requestAnimationFrame(update);
                return;
            }

            // Get current values
            let currentX = x.get();
            let currentY = y.get();

            // Apply velocity
            currentX += vx.current;
            currentY += vy.current;

            // Bounce logic
            const itemWidth = item.type === "image" ? 200 : 180;
            const itemHeight = item.type === "image" ? 240 : 180; // Approx height

            // Right/Left walls
            if (currentX <= 0) {
                currentX = 0;
                vx.current *= -1;
            } else if (currentX >= width - itemWidth) {
                currentX = width - itemWidth;
                vx.current *= -1;
            }

            // Top/Bottom walls
            if (currentY <= 0) {
                currentY = 0;
                vy.current *= -1;
            } else if (currentY >= height - itemHeight) {
                currentY = height - itemHeight;
                vy.current *= -1;
            }

            // Update MotionValues (does not trigger React render)
            x.set(currentX);
            y.set(currentY);

            rafId = requestAnimationFrame(update);
        };

        rafId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafId);
    }, [containerRef, item.type, x, y]);

    return (
        <motion.div
            drag
            dragMomentum={false}
            onDragStart={() => { isDragging.current = true; }}
            onDragEnd={(e, info) => {
                isDragging.current = false;
                // Fling effect
                vx.current = info.velocity.x * 0.05;
                vy.current = info.velocity.y * 0.05;
            }}
            style={{ x, y, width: item.type === "image" ? 200 : 180 }}
            className="absolute cursor-grab active:cursor-grabbing shadow-xl hover:z-10"
        >
            {item.type === "text" ? (
                <div
                    className="p-4 font-bold text-black min-h-[180px] flex items-center justify-center text-center break-words relative shadow-sm border border-black/5"
                    style={{ backgroundColor: item.color }}
                >
                    <div className="absolute top-1 left-2 text-[10px] font-mono opacity-50">NOTE_{item.id}</div>
                    <textarea
                        className="bg-transparent w-full h-full resize-none outline-none text-center font-bold uppercase placeholder-black/50"
                        defaultValue={item.content}
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="bg-white p-2 pb-8 border border-gray-200 shadow-sm">
                    <img src={item.content} alt="Thought" className="w-full aspect-square object-cover bg-gray-100 pointer-events-none" />
                    <div className="mt-2 font-mono text-[10px] text-gray-500 text-center">IMG_{item.id}</div>
                </div>
            )}
        </motion.div>
    );
};

export default function ThoughtMatrix() {
    const containerRef = useRef(null);
    const [items, setItems] = useState([
        { id: 1, type: "text", content: "INSPIRATION", x: 50, y: 50, vx: 1, vy: 0.5, color: "#FFD700" },
        { id: 2, type: "text", content: "CHAOS", x: 200, y: 150, vx: -0.8, vy: 0.8, color: "#FF6B6B" },
        { id: 3, type: "image", content: "https://source.unsplash.com/random/200x200?abstract", x: 400, y: 100, vx: 0.5, vy: -0.5 },
    ]);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const addItem = (type) => {
        const newItem = {
            id: Date.now(),
            type,
            content: type === "text" ? "NEW_IDEA" : "https://source.unsplash.com/random/200x200?texture",
            x: Math.random() * 200, // Start near top-left
            y: Math.random() * 200,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: type === "text" ? ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFE66D"][Math.floor(Math.random() * 4)] : null,
        };
        setItems((prev) => [...prev, newItem]);
    };

    return (
        <div
            ref={containerRef}
            className={`relative transition-all duration-500 bg-[#F2F2F2] border border-black overflow-hidden ${isFullScreen ? "fixed inset-0 z-50 rounded-none" : "w-full h-[600px] rounded-[2rem]"
                }`}
        >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* Controls */}
            <div className="absolute top-6 left-6 z-20 flex gap-4">
                <button onClick={() => addItem("text")} className="px-4 py-2 bg-black text-white font-mono text-xs hover:bg-gray-800 transition">
                    [+ NOTE]
                </button>
                <button onClick={() => addItem("image")} className="px-4 py-2 bg-black text-white font-mono text-xs hover:bg-gray-800 transition">
                    [+ PHOTO]
                </button>
            </div>

            <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="absolute top-6 right-6 z-20 px-4 py-2 border border-black bg-white font-mono text-xs hover:bg-black hover:text-white transition"
            >
                {isFullScreen ? "[MINIMIZE]" : "[EXPAND]"}
            </button>

            {/* Items */}
            {items.map((item) => (
                <ThoughtItem key={item.id} item={item} containerRef={containerRef} />
            ))}

            {/* Watermark */}
            <div className="absolute bottom-6 right-6 font-mono text-4xl font-black text-black/5 pointer-events-none select-none">
                THOUGHT_MATRIX // V1.0
            </div>
        </div>
    );
}
