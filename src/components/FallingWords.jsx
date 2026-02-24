import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const FallingWords = React.memo(({
  trigger,
  floorY,
  words = ["Video", "Idea", "Life", "Sketch", "Journey", "Illustration", "Myself", "Design", "Photography"],
  leftSpawnX = 100,
  rightSpawnX = 500,
  spawnY = 50,
  color = '#8A8A8A',
  rightWallOffset = 0,
  isFloating = false,
  obstacle = null, // { x, y, width, height }
  visible = true   // New prop to control visibility of the whole layer
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);

  // Persistent boundary refs to allow updates without world clearing
  const floorRef = useRef(null);
  const leftWallRef = useRef(null);
  const rightWallRef = useRef(null);
  const topWallRef = useRef(null);
  const bottomWallRef = useRef(null);
  const obstacleBodyRef = useRef(null);

  const [activeWords, setActiveWords] = useState([]);
  const hasFallenRef = useRef(false);

  // Use refs to avoid closure stale values in updateLoop
  const floorYRef = useRef(floorY);
  const isFloatingRef = useRef(isFloating);
  const mousePosRef = useRef({ x: -1000, y: -1000 }); // Off-screen initially
  const visibleRef = useRef(visible);

  useEffect(() => {
    floorYRef.current = floorY;
  }, [floorY]);

  useEffect(() => {
    isFloatingRef.current = isFloating;
  }, [isFloating]);

  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // 1. Initialize Engine, Render, and Runner once on mount
  useEffect(() => {
    const { Engine, Render, Runner, World, Mouse, MouseConstraint } = Matter;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 2.2;

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

    // Mouse constraint for interaction
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    World.add(engine.world, [mouseConstraint]);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    // Synchronize React state with Matter.js positions
    let animationFrameId;
    const updateLoop = () => {
      // Optimization: Only update positions if visible
      if (visibleRef.current) {
        setActiveWords(prev => prev.map(item => {
          const { body, fontSize } = item;
          const wordHeight = fontSize + 8;

          // 2. Mouse Avoidance Force: Repel words from cursor
          const mx = mousePosRef.current.x;
          const my = mousePosRef.current.y;
          if (mx > 0 && my > 0) {
            const dx = body.position.x - mx;
            const dy = body.position.y - my;
            const distSq = dx * dx + dy * dy;
            const radius = 220; // Repulsion range
            if (distSq < radius * radius) {
              const dist = Math.sqrt(distSq);
              // Stronger force when closer
              const forceMag = (0.002 * (radius - dist) / radius) * body.mass;
              Matter.Body.applyForce(body, body.position, {
                x: (dx / dist) * forceMag,
                y: (dy / dist) * forceMag
              });
            }
          }

          // 3. Safety Catch: Prevent words from falling through the floor
          if (!isFloatingRef.current && body.position.y > floorYRef.current - wordHeight / 2 + 5) {
            Matter.Body.setPosition(body, { x: body.position.x, y: floorYRef.current - wordHeight / 2 });
            Matter.Body.setVelocity(body, { x: body.velocity.x, y: 0 });
          }

          return {
            ...item,
            x: body.position.x,
            y: body.position.y,
            angle: body.angle
          };
        }));
      }
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
  }, []); // Run ONLY once on mount

  // 2. Update Boundaries and Obstacles
  useEffect(() => {
    if (!engineRef.current) return;
    const { Bodies, World, Composite } = Matter;
    const world = engineRef.current.world;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Remove old boundaries
    const oldBodies = [
      floorRef.current,
      leftWallRef.current,
      rightWallRef.current,
      topWallRef.current,
      bottomWallRef.current,
      obstacleBodyRef.current
    ].filter(Boolean);
    Composite.remove(world, oldBodies);

    // Create new boundaries
    floorRef.current = Bodies.rectangle(width / 2, floorY + 25, width * 2, 50, { isStatic: true, render: { visible: false } });
    leftWallRef.current = Bodies.rectangle(-25, height / 2, 50, height * 2, { isStatic: true, render: { visible: false } });
    rightWallRef.current = Bodies.rectangle(width + 25 - rightWallOffset, height / 2, 50, height * 2, { isStatic: true, render: { visible: false } });

    // Top and Bottom walls - tight when floating, loose when falling
    const topY = isFloating ? -50 : -1000;
    const bottomY = isFloating ? height + 50 : height + 1000;

    topWallRef.current = Bodies.rectangle(width / 2, topY, width * 2, 100, { isStatic: true, render: { visible: false } });
    bottomWallRef.current = Bodies.rectangle(width / 2, bottomY, width * 2, 100, { isStatic: true, render: { visible: false } });

    const persistentBoundaries = [leftWallRef.current, rightWallRef.current, topWallRef.current, bottomWallRef.current];

    // Add persistent walls
    World.add(world, persistentBoundaries);

    // Handle floor and obstacle - only add if NOT floating
    if (!isFloating) {
      if (floorRef.current) World.add(world, floorRef.current);
      if (obstacle) {
        obstacleBodyRef.current = Bodies.rectangle(
          obstacle.x, obstacle.y, obstacle.width, obstacle.height,
          { isStatic: true, render: { visible: false } }
        );
        World.add(world, obstacleBodyRef.current);
      }
    }
  }, [floorY, rightWallOffset, obstacle, isFloating]);

  // 3. Handle floating vs falling state
  useEffect(() => {
    if (!engineRef.current) return;
    const { Body, Composite, World } = Matter;
    const world = engineRef.current.world;

    if (isFloating) {
      // Small NEGATIVE gravity to make them drift UP
      engineRef.current.world.gravity.y = -0.05;
      // Remove obstacles
      if (floorRef.current) Composite.remove(world, floorRef.current);
      if (obstacleBodyRef.current) Composite.remove(world, obstacleBodyRef.current);

      // ALL WORDS get drift and moderate friction for a lively drift
      activeWords.forEach(item => {
        item.body.frictionAir = 0.015; // Lower friction for more movement

        const pos = item.body.position;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // 1. Gather ONLY if truly off-screen
        if (pos.y > height + 50 || pos.y < -50 || pos.x < -50 || pos.x > width + 50) {
          Body.setPosition(item.body, {
            x: width * 0.2 + Math.random() * (width * 0.6),
            y: height * 0.2 + Math.random() * (height * 0.4)
          });
        }

        // 2. Stronger initial upward pulse
        Body.setVelocity(item.body, {
          x: (Math.random() - 0.5) * 3,
          y: -2 - Math.random() * 2 // Force stronger upward push
        });
        Body.setAngularVelocity(item.body, (Math.random() - 0.5) * 0.1);
      });
    } else {
      // Restore strong gravity for second page
      engineRef.current.world.gravity.y = 2.2;
      activeWords.forEach(item => {
        item.body.frictionAir = 0.02;
        // If word drifted way below floor while floating, bring it back
        const wordHeight = item.fontSize + 8;
        if (item.body.position.y > floorY - wordHeight / 2 + 5) {
          Body.setPosition(item.body, { x: item.body.position.x, y: floorY - wordHeight / 2 });
          Body.setVelocity(item.body, { x: 0, y: 0 });
        }
      });
    }
  }, [isFloating]);

  // 4. Handle Spawning (Trigger)
  useEffect(() => {
    if (trigger && engineRef.current && !hasFallenRef.current) {
      hasFallenRef.current = true;
      const { Bodies, World, Body } = Matter;

      const generateRandom = (count, min, max) => {
        const arr = [];
        if (count >= 1) arr.push(min);
        if (count >= 2) arr.push(max);
        for (let i = 2; i < count; i++) arr.push(Math.random() * (max - min) + min);
        return arr.sort(() => Math.random() - 0.5);
      };

      const sizes = generateRandom(words.length, 88, 130);
      const opacities = generateRandom(words.length, 0.5, 1.0);

      const newWordItems = words.map((word, index) => {
        const wordFontSize = sizes[index];
        const wordOpacity = opacities[index];
        const wordWidth = word.length * (wordFontSize * 0.6) + 20;
        const wordHeight = wordFontSize + 8;

        const baseSpawnX = index % 2 === 0 ? leftSpawnX : rightSpawnX;
        const x = baseSpawnX + (Math.random() - 0.5) * 100;
        const y = spawnY - Math.floor(index / 2) * (wordHeight + 30);

        const body = Bodies.rectangle(x, y, wordWidth, wordHeight, {
          restitution: 0.6,
          friction: 0.1,
          frictionAir: 0.02,
          render: { fillStyle: 'transparent' }
        });

        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.2);

        return {
          text: word,
          body,
          id: Math.random(),
          fontSize: wordFontSize,
          opacity: wordOpacity
        };
      });

      World.add(engineRef.current.world, newWordItems.map(item => item.body));
      setActiveWords(prev => [...prev, ...newWordItems]);
    }
  }, [trigger, words, leftSpawnX, rightSpawnX, spawnY]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[8000]"
      style={{
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        pointerEvents: 'none', // Keep container click-through
        transition: 'opacity 0.8s ease-in-out'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {activeWords.map((item) => (
        <div
          key={item.id}
          className="absolute pointer-events-auto cursor-grab active:cursor-grabbing select-none"
          style={{
            left: item.x,
            top: item.y,
            transform: `translate(-50%, -50%) rotate(${item.angle}rad)`,
            fontFamily: "'DiandianPixel', sans-serif",
            fontSize: `${item.fontSize}px`,
            color: color,
            opacity: item.opacity,
            whiteSpace: 'nowrap',
            backgroundColor: 'transparent',
            padding: '4px 8px',
            textAlign: 'center'
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
});

export default FallingWords;
