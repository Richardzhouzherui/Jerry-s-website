import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

export default function DeckGallery({ items }) {
    const [cards, setCards] = useState(items);
    const [history, setHistory] = useState([]);

    // If empty, show a reset button
    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-[#111] font-mono">
                <p className="mb-4 text-sm">[END_OF_ARCHIVE]</p>
                <button
                    onClick={() => {
                        setCards([...history].reverse());
                        setHistory([]);
                    }}
                    className="px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors uppercase text-xs tracking-widest"
                >
                    Reload_Stack
                </button>
            </div>
        );
    }

    // We only render the top few cards for performance and visual stacking
    const visibleCards = cards.slice(0, 3).reverse();

    return (
        <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="relative w-[300px] md:w-[400px] aspect-[3/4]">
                <AnimatePresence>
                    {visibleCards.map((item, index) => {
                        const isTop = index === visibleCards.length - 1;
                        return (
                            <Card
                                key={item.src || index}
                                item={item}
                                index={index}
                                isTop={isTop}
                                total={visibleCards.length}
                                onRemove={() => {
                                    setHistory((prev) => [item, ...prev]);
                                    setCards((prev) => prev.slice(1));
                                }}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-gray-400 pointer-events-none">
                DRAG_TO_DISCARD // CLICK_TO_VIEW
            </div>
        </div>
    );
}

function Card({ item, index, isTop, total, onRemove }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Random rotation for the "messy stack" look, but stable per index
    const randomRotate = (index % 2 === 0 ? 1 : -1) * (index * 2);

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : randomRotate,
                zIndex: index,
                scale: 1 - (total - 1 - index) * 0.05,
                y: (total - 1 - index) * 10,
                opacity: isTop ? opacity : 1 - (total - 1 - index) * 0.2,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 100) {
                    onRemove();
                }
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1 - (total - 1 - index) * 0.05, opacity: 1 - (total - 1 - index) * 0.2, y: (total - 1 - index) * 10 }}
            exit={{ x: x.get() < 0 ? -300 : 300, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-0 left-0 w-full h-full bg-white p-3 shadow-xl border border-gray-200 cursor-grab active:cursor-grabbing"
        >
            <div className="w-full h-[85%] bg-gray-100 overflow-hidden relative">
                <img src={item.src} alt={item.alt} className="w-full h-full object-cover pointer-events-none select-none" draggable="false" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </div>
            <div className="h-[15%] flex items-center justify-between px-2 font-mono text-xs text-gray-500">
                <span>IMG_{item.alt || "000"}</span>
                <span>[RAW]</span>
            </div>
        </motion.div>
    );
}
