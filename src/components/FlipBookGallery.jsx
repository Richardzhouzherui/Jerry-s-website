import React, { useRef } from "react";
import HTMLFlipBook from "react-pageflip";

const Page = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage bg-[#FDFBF7] shadow-inner border border-gray-200" ref={ref}>
            <div className="h-full w-full p-4 md:p-8 flex flex-col items-center justify-center">
                {props.children}
            </div>
        </div>
    );
});

const Cover = React.forwardRef((props, ref) => {
    return (
        <div className="demoPage bg-[#1a1a1a] text-white shadow-2xl border-r border-[#333]" ref={ref}>
            <div className="h-full w-full p-8 flex flex-col items-center justify-center border-[12px] border-[#333]">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center mb-4">
                    {props.title}
                </h1>
                <div className="w-16 h-1 bg-white mb-8"></div>
                <p className="font-mono text-xs tracking-[0.2em]">{props.subtitle}</p>
            </div>
        </div>
    );
});

export default function FlipBookGallery({ items }) {
    const bookRef = useRef();

    return (
        <div className="w-full flex justify-center items-center py-12 bg-gray-100/50">
            <HTMLFlipBook
                width={400}
                height={550}
                size="stretch"
                minWidth={300}
                maxWidth={600}
                minHeight={400}
                maxHeight={800}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl"
                ref={bookRef}
            >
                <Cover title="2025" subtitle="YEAR_END_ARCHIVE" />

                {items.map((item, index) => (
                    <Page key={index} number={index + 1}>
                        <div className="relative w-full h-[70%] mb-4 overflow-hidden border border-gray-100 shadow-sm bg-white p-2">
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover grayscale brightness-90 contrast-125 hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="text-center font-mono text-xs text-gray-500">
                            <p className="mb-1 uppercase tracking-widest">Memories</p>
                            <p>IMG_{String(index + 1).padStart(3, '0')}</p>
                        </div>
                    </Page>
                ))}

                <Page>
                    <div className="h-full flex flex-col justify-center items-center text-center opacity-50">
                        <p className="font-mono text-xs mb-2">END_OF_VOLUME</p>
                        <div className="w-8 h-8 rounded-full border border-black/20"></div>
                    </div>
                </Page>
                <Cover title="FIN" subtitle="THANK_YOU" />
            </HTMLFlipBook>
        </div>
    );
}
