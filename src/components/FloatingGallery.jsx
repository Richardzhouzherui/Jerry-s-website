import React, { useRef } from "react";
import { motion, useScroll, useTransform, useTime } from "framer-motion";

// Use new assets path for 1 - 15
const works = Array.from({ length: 15 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    img: `/projects/${String(id).padStart(2, '0')}.jpg`,
    title: `Project ${id}`,
    desc: ["Design", "Art", "Code", "Concept", "Installation"][i % 5],
  };
});

export default function FloatingGallery() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Auto-drift time
  const time = useTime();

  // Drift transforms (idle animation)
  // Slowly move continuously upwards.
  // We use a large input range for time to keep the speed constant.
  // 10000ms = 10s.
  // Drift Speeds:
  // Column 1: -100px per 10s 
  // Column 2: -150px per 10s (faster)
  // Column 3: -120px per 10s (medium)
  const drift1 = useTransform(time, [0, 100000], [0, -1000]);
  const drift2 = useTransform(time, [0, 100000], [0, -1500]);
  const drift3 = useTransform(time, [0, 100000], [0, -1200]);

  // Parallax transforms (scroll interaction)
  // "Faster than scroll" - shift upwards significantly as we scroll down.
  const parallax1 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const parallax2 = useTransform(scrollYProgress, [0, 1], [0, -900]); // Much faster
  const parallax3 = useTransform(scrollYProgress, [0, 1], [0, -650]);

  // Combined motion: y = parallax + drift
  // Note: We need to combine these values. Since useTransform returns a motion value,
  // we can create a new MotionValue that sums them up, but Framer Motion v5+
  // allows passing a function to useTransform that reads other motion values.
  const y1 = useTransform(() => parallax1.get() + drift1.get());
  const y2 = useTransform(() => parallax2.get() + drift2.get());
  const y3 = useTransform(() => parallax3.get() + drift3.get());

  // Split works into 3 columns
  const col1 = works.filter((_, i) => i % 3 === 0);
  const col2 = works.filter((_, i) => i % 3 === 1);
  const col3 = works.filter((_, i) => i % 3 === 2);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[150vh] bg-transparent overflow-hidden my-24 px-4 md:px-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto items-start">

        {/* Column 1 */}
        <motion.div style={{ y: y1 }} className="flex flex-col gap-16 mt-0">
          {col1.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Column 2 */}
        <motion.div style={{ y: y2 }} className="flex flex-col gap-16 mt-24 md:mt-48">
          {col2.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Column 3 */}
        <motion.div style={{ y: y3 }} className="flex flex-col gap-16 mt-12 md:mt-24">
          {col3.map((item) => (
            <GalleryItem key={item.id} item={item} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

function GalleryItem({ item }) {
  return (
    <motion.div
      className="group w-full"
    >
      <div className="w-full overflow-hidden">
        {/* Native aspect ratio */}
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 block"
        />
      </div>
    </motion.div>
  );
}
