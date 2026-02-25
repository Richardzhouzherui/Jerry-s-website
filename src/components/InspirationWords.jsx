import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { getAssetPath } from '../utils/paths';

const InspirationWords = ({
    containerHeight = 600,
    visible = true
}) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const runnerRef = useRef(null);
    const renderRef = useRef(null);

    const [activeWords, setActiveWords] = useState([]);
    const hoveredWordIdRef = useRef(null);
    const [hoveredWordId, setHoveredWordId] = useState(null);

    // Manual Dragging State
    const draggingRef = useRef(null); // { body, offset: {x, y} }

    // Helper: Create a body for a word item
    const createItemBody = (item, width, height) => {
        const { Bodies, Body } = Matter;
        let itemWidth, itemHeight;

        if (item.type === 'image') {
            itemWidth = 180; // Increased base size
            itemHeight = 120;
        } else {
            const fontSize = item.fontSize || (37 + Math.random() * (160 - 37));
            itemWidth = item.content.length * (fontSize * 0.6) + 30;
            itemHeight = fontSize * 1.1;
            item.fontSize = fontSize; // Save it back
        }

        const body = Bodies.rectangle(
            Math.random() * width,
            Math.random() * height,
            itemWidth,
            itemHeight,
            {
                restitution: 0.8,
                friction: 0.05,
                frictionAir: 0.01,
                render: { fillStyle: 'transparent' }
            }
        );

        Body.setVelocity(body, {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

        return {
            ...item,
            id: item.id || Math.random().toString(36).substr(2, 9),
            body,
            opacity: item.type === 'image'
                ? (0.7 + Math.random() * 0.25) // Images: 0.7 - 0.95
                : (item.opacity || (0.3 + Math.random() * (0.64 - 0.3))) // Text: original range
        };
    };

    // 1. Initialize Matter.js & Load Items
    useEffect(() => {
        const { Engine, Render, Runner, World, Bodies } = Matter;
        const width = containerRef.current.clientWidth;
        const height = containerHeight;

        const engine = Engine.create();
        engineRef.current = engine;
        engine.world.gravity.y = 0;

        const render = Render.create({
            element: containerRef.current,
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width,
                height,
                background: 'transparent',
                wireframes: false,
            }
        });
        renderRef.current = render;

        // Boundaries
        const wallThickness = 100;
        const wallOptions = { isStatic: true, render: { visible: false } };
        const floor = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -wallThickness / 2, width * 2, wallThickness, wallOptions);
        const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions);
        const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, wallOptions);

        World.add(engine.world, [floor, ceiling, leftWall, rightWall]);

        // Load from LocalStorage or use defaults
        const savedItems = localStorage.getItem('inspiration_items');
        let initialData = [];
        if (savedItems) {
            initialData = JSON.parse(savedItems);
            // Ensure the new PINTR image is included if it's missing (one-time migration)
            if (!initialData.some(item => item.content === getAssetPath('/photos/pintr-1.webp'))) {
                initialData.push({ type: 'image', content: getAssetPath('/photos/pintr-1.webp') });
                localStorage.setItem('inspiration_items', JSON.stringify(initialData));
            }
        } else {
            const defaultWords = [
                "Write a book?", "Pixel", "Video", "GREEN", "我是一个外星人",
                "为什么我们开始接受不好看的设计？", "Design", "Pixel",
                "about song???", "ios又更新啦？", "Design", "Design", "RED", "Design"
            ];
            initialData = [
                ...defaultWords.map(w => ({ type: 'text', content: w })),
                { type: 'image', content: getAssetPath('/photos/pintr-1.webp') }
            ];
        }

        const wordItems = initialData.map(item => createItemBody(item, width, height));

        World.add(engine.world, wordItems.map(w => w.body));
        setActiveWords(wordItems);

        const runner = Runner.create();
        runnerRef.current = runner;
        Runner.run(runner, engine);
        Render.run(render);

        // Sync Loop
        let animationFrameId;
        const updateLoop = () => {
            if (draggingRef.current) {
                const { body, offset, currentPos } = draggingRef.current;
                Matter.Body.setPosition(body, {
                    x: currentPos.x - offset.x,
                    y: currentPos.y - offset.y
                });
                Matter.Body.setVelocity(body, { x: 0, y: 0 });
            }

            setActiveWords(prev => prev.map(w => ({
                ...w,
                x: w.body.position.x,
                y: w.body.position.y,
                angle: w.body.angle
            })));
            animationFrameId = requestAnimationFrame(updateLoop);
        };
        animationFrameId = requestAnimationFrame(updateLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            Runner.stop(runner);
            Render.stop(render);
            World.clear(engine.world);
            Engine.clear(engine);
        };
    }, []);

    // Save to LocalStorage helper
    useEffect(() => {
        if (activeWords.length > 0) {
            const dataToSave = activeWords.map(w => ({
                type: w.type,
                content: w.content,
                fontSize: w.fontSize,
                opacity: w.opacity,
                id: w.id
            }));
            localStorage.setItem('inspiration_items', JSON.stringify(dataToSave));
        }
    }, [activeWords.length]);

    // Expose addItem to window for simpler integration from LandingPage
    useEffect(() => {
        window.addInspirationItem = (type, content) => {
            if (!engineRef.current || !containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerHeight;
            const newItem = createItemBody({ type, content }, width, height);

            Matter.World.add(engineRef.current.world, newItem.body);
            setActiveWords(prev => [...prev, newItem]);
        };
        return () => { delete window.addInspirationItem; };
    }, [activeWords]);

    const deleteWord = (id) => {
        setActiveWords(prev => {
            const word = prev.find(w => w.id === id);
            if (word && engineRef.current) {
                Matter.World.remove(engineRef.current.world, word.body);
            }
            const filtered = prev.filter(w => w.id !== id);
            if (filtered.length === 0) {
                localStorage.setItem('inspiration_items', JSON.stringify([]));
            }
            return filtered;
        });
    };

    // 2. Slow Drift Logic
    useEffect(() => {
        if (!engineRef.current) return;

        const driftInterval = setInterval(() => {
            const bodies = Matter.Composite.allBodies(engineRef.current.world);
            bodies.forEach(body => {
                if (!body.isStatic && (!draggingRef.current || draggingRef.current.body !== body)) {
                    Matter.Body.applyForce(body, body.position, {
                        x: (Math.random() - 0.5) * 0.0005 * body.mass,
                        y: (Math.random() - 0.5) * 0.0005 * body.mass
                    });
                }
            });
        }, 100);

        return () => clearInterval(driftInterval);
    }, [activeWords.length]);

    const handlePointerDown = (e, word) => {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        draggingRef.current = {
            body: word.body,
            offset: {
                x: mouseX - word.body.position.x,
                y: mouseY - word.body.position.y
            },
            prevPos: { x: mouseX, y: mouseY },
            currentPos: { x: mouseX, y: mouseY }
        };

        // Disable air friction temporarily for better "throw" feel if we implement it
        // word.body.frictionAir = 0;
    };

    const handlePointerMove = (e) => {
        if (!draggingRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        draggingRef.current.prevPos = draggingRef.current.currentPos;
        draggingRef.current.currentPos = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handlePointerUp = () => {
        if (!draggingRef.current) return;

        // Optional: Apply velocity on release for "throwing" effect
        const dx = draggingRef.current.currentPos.x - draggingRef.current.prevPos.x;
        const dy = draggingRef.current.currentPos.y - draggingRef.current.prevPos.y;
        Matter.Body.setVelocity(draggingRef.current.body, { x: dx, y: dy });

        draggingRef.current = null;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full overflow-hidden pointer-events-none"
            style={{ height: containerHeight }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

            {activeWords.map(item => (
                <div
                    key={item.id}
                    className="absolute flex items-center justify-center group pointer-events-auto transition-opacity"
                    style={{
                        left: item.x,
                        top: item.y,
                        transform: `translate(-50%, -50%) rotate(${item.angle}rad)`,
                        opacity: hoveredWordId === item.id ? 1 : item.opacity,
                        cursor: 'grab',
                        userSelect: 'none',
                        touchAction: 'none'
                    }}
                    onPointerDown={(e) => handlePointerDown(e, item)}
                    onMouseEnter={() => setHoveredWordId(item.id)}
                    onMouseLeave={() => setHoveredWordId(null)}
                >
                    {item.type === 'text' ? (
                        <div style={{
                            fontFamily: "'DiandianPixel', sans-serif",
                            fontSize: `${item.fontSize}px`,
                            color: '#111',
                            whiteSpace: 'nowrap',
                        }}>
                            {item.content}
                        </div>
                    ) : (
                        <img
                            src={getAssetPath(item.content)}
                            alt="inspiration"
                            style={{ maxWidth: '120px', maxHeight: '100px', objectFit: 'contain' }}
                            draggable={false}
                        />
                    )}

                    {/* Trash Icon Overlay */}
                    <div
                        className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto cursor-pointer border border-[#111] bg-white group/trash hover:bg-[#111] flex items-center justify-center`}
                        style={{ width: '24px', height: '24px', zIndex: 10 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteWord(item.id);
                        }}
                    >
                        <img
                            src={getAssetPath("/icons/trash.webp")}
                            alt="Delete"
                            className="w-3 h-3 group-hover/trash:invert transition-all"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InspirationWords;
