import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

// import required modules
import { EffectCoverflow, Mousewheel } from 'swiper/modules';

export default function CoverflowGallery({ items }) {
    // Process items into spreads (pairs of 2)
    // If odd number, last one will be a single page
    const spreads = [];
    for (let i = 0; i < items.length; i += 2) {
        spreads.push({
            left: items[i],
            right: items[i + 1] || null // Handle potential single last item
        });
    }

    return (
        <div className="w-full h-[80vh] flex items-center justify-center bg-[#EAEAEA]">
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }}
                mousewheel={true}
                loop={true}
                modules={[EffectCoverflow, Mousewheel]}
                className="w-full h-full py-12"
            >
                {spreads.map((spread, index) => (
                    <SwiperSlide
                        key={index}
                        className="!w-[60vh] !h-[60vh] bg-white shadow-2xl flex"
                    >
                        {/* Left Page */}
                        <div className="w-1/2 h-full relative overflow-hidden">
                            <img
                                src={spread.left.src}
                                alt={spread.left.alt}
                                className="w-full h-full object-cover block"
                            />
                        </div>

                        {/* Right Page */}
                        <div className="w-1/2 h-full relative overflow-hidden">
                            {spread.right ? (
                                <img
                                    src={spread.right.src}
                                    alt={spread.right.alt}
                                    className="w-full h-full object-cover block"
                                />
                            ) : (
                                <div className="w-full h-full bg-white flex items-center justify-center">
                                    <span className="font-mono text-xs text-gray-300">[EMPTY_PAGE]</span>
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Hint only visible when hovering/inactive could be nice, but user asked for NO text. 
                Leaving purely visual. */}
        </div>
    );
}
