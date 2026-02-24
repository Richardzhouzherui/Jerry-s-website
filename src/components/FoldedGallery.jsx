import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import { EffectCreative, Mousewheel } from 'swiper/modules';

export default function FoldedGallery({ items }) {
    // Process items into spreads (pairs of 2)
    const spreads = [];
    for (let i = 0; i < items.length; i += 2) {
        spreads.push({
            left: items[i],
            right: items[i + 1] || null
        });
    }

    return (
        <div className="w-full h-screen flex items-center justify-center bg-transparent perspective-[2000px] overflow-hidden">
            <Swiper
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                mousewheel={true}
                effect={'creative'}
                creativeEffect={{
                    limitProgress: 20,
                    prev: {
                        translate: ['-100%', 0, -400],
                        rotate: [0, 0, -10],
                        scale: 0.8,
                    },
                    next: {
                        translate: ['100%', 0, 0], // Continuous strip
                        rotate: [0, 0, 0],
                        shadow: false,
                    },
                }}
                modules={[EffectCreative, Mousewheel]}
                className="w-full h-full py-0 !overflow-visible"
            >
                {spreads.map((spread, index) => (
                    <SwiperSlide
                        key={index}
                        // Enforce 2:1 Aspect Ratio (2 squares side-by-side)
                        // w-[80vw] means h must be [40vw]
                        // On mobile: w-[90vw] h-[45vw]
                        className="!w-[90vw] !h-[45vw] md:!w-[80vw] md:!h-[40vw] flex justify-center items-center"
                        style={{
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {/* Wrapper for the Fold Effect */}
                        <div className="relative w-full h-full flex transform-style-3d">

                            {/* Left Page */}
                            <div
                                className="w-1/2 h-full origin-right transition-transform duration-500 bg-white shadow-xl"
                                style={{ transform: 'rotateY(10deg)' }} // Fold forward (Spine is back)
                            >
                                <div className="w-full h-full overflow-hidden relative">
                                    <img
                                        src={spread.left.src}
                                        alt={spread.left.alt}
                                        className="w-full h-full object-cover block"
                                    />
                                    {/* Inner shadow for fold depth */}
                                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>

                            {/* Right Page */}
                            <div
                                className="w-1/2 h-full origin-left transition-transform duration-500 bg-white shadow-xl"
                                style={{ transform: 'rotateY(-10deg)' }} // Fold forward
                            >
                                <div className="w-full h-full overflow-hidden relative">
                                    {spread.right ? (
                                        <img
                                            src={spread.right.src}
                                            alt={spread.right.alt}
                                            className="w-full h-full object-cover block"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white flex items-center justify-center">
                                            <span className="font-mono text-xs text-gray-300">[END]</span>
                                        </div>
                                    )}
                                    {/* Inner shadow for fold depth */}
                                    <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                                </div>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
