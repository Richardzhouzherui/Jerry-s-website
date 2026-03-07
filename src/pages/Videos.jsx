import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetPath } from "../utils/paths";

const videoData = [
    {
        id: 1,
        title: "【Gaudi in Zootopia】-疯狂动物城的“蛇姥姥”原来是高迪！？",
        description: "Last week I finally caught Zootopia 2. When Snake Town appeared, I nearly leapt out of my seat: “Blimey, isn’t that Casa Batlló?” Crawling Valley strongly echoes Gaudí’s style, so I decided to explore the animators’ inspirations through the official art book while introducing Gaudí’s legacy. Join me as we revisit Zootopia and take a virtual tour of Casa Batlló!\n---上周终于有时间去看疯狂动物城2了，看到蛇镇我突然跃起（）：欸，这不是巴特罗之家吗？整个爬行谷太像高迪的风格了，于是很想做一期视频，从官方设定集里去解读一下迪士尼动画设计师的设计以及带大家了解一下高迪，欢迎大家和我一起重新回到动物城也去巴特罗之家云旅游一下～",
        cover: getAssetPath("/video-cover-1.png"),
        previewVideo: getAssetPath("/zootopia-preview.mp4"),
        bvid: "BV1DrqnBvE1X",
        embedUrl: "https://www.xiaohongshu.com/discovery/item/6943ad95000000001b031bd2?source=webshare&xhsshare=pc_web&xsec_token=ABtH-tVaW8XrBAikx0KlPBQA5SgxoKa1twuASBoYD1Jhg=&xsec_source=pc_share",
        bilibiliUrl: "https://www.bilibili.com/video/BV1DrqnBvE1X/",
        stats: {
            recordingMode: "ACTIVE",
            frameRate: "60FPS",
            source: "XIAOHONGSHU / BILIBILI"
        }
    },
    {
        id: 2,
        title: "【Evolution of iOS UI】-iOS19即将发布？你还记得它以前的样子吗",
        description: "Whilst browsing online recently, I discovered that iOS 19 is about to be released. On a whim, I decided to take a look at the evolution of Apple's UI over the years, which led to this video. I hope you all enjoy it!\n---最近在网上冲浪发现iOS19即将发布，突发奇想看看苹果UI这些年的发展历程，于是有了这期视频，希望大家能够喜欢～",
        cover: getAssetPath("/ios-cover.png"),
        previewVideo: getAssetPath("/ios-clip.mp4"),
        bvid: "BV1xbRXYKEkv",
        embedUrl: "https://www.xiaohongshu.com/discovery/item/67ea723b000000001a0065c2?source=webshare&xhsshare=pc_web&xsec_token=ABtLCo0JXEQcgDabm2DLz_-ixM3HhFdb-CoGLdqZbknX4=&xsec_source=pc_share",
        bilibiliUrl: "https://www.bilibili.com/video/BV1xbRXYKEkv/",
        stats: {
            recordingMode: "ACTIVE",
            frameRate: "60FPS",
            source: "XIAOHONGSHU / BILIBILI"
        }
    },
    {
        id: 3,
        title: "【Red Dot Award Experience】-什么！我们去到红点奖现场了？！",
        description: "Thank you all for watching! Moving forward, I plan to create more engaging videos, primarily organised into two series: the “Origin” series and the “Source” series. “Origin” will delve into design concepts and the stories behind them; “Source” will explore the inner self through travel and gather inspiration.\n---感谢大家的观看～～ 未来计划我也计划做更多有意思的视频，主要分为两个系列：“启”系列和“源”系列。“启”即讲解设计及背后的故事；“源”即通过旅行探寻内心本源&积累灵感",
        cover: getAssetPath("/reddot-cover.jpg"),
        previewVideo: getAssetPath("/reddot-clip.mp4"),
        bvid: null,
        embedUrl: "https://www.xiaohongshu.com/discovery/item/6768ad7b000000000b00dc14?source=webshare&xhsshare=pc_web&xsec_token=ABHwjQasaLm1eeuBgZQocEVzvzoFf5tAGCmZUpKd0KlIk=&xsec_source=pc_share",
        stats: {
            recordingMode: "ARCHIVE",
            frameRate: "30FPS",
            source: "XIAOHONGSHU / BILIBILI"
        }
    }
];

// Sub-component for individual video cards
const VideoCard = ({ item, isActive, onClick, position, total }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (isActive && isHovered && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Video play failed", e));
        } else if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [isActive, isHovered]);

    const CARD_WIDTH = window.innerWidth < 768 ? 300 : 440;
    const CARD_GAP = window.innerWidth < 768 ? 20 : 60;
    const CURVE_OFFSET = 40;
    const TILT_ANGLE = 6;

    return (
        <motion.div
            layout
            className={`absolute cursor-pointer transition-opacity duration-500 ${!isActive ? "opacity-60" : "z-20"} `}
            style={{ width: CARD_WIDTH }}
            initial={false}
            animate={{
                x: position * (CARD_WIDTH + CARD_GAP),
                y: isActive ? -20 : CURVE_OFFSET,
                scale: isActive ? 1.15 : 0.85,
                rotate: position < 0 ? -TILT_ANGLE : position > 0 ? TILT_ANGLE : 0,
                zIndex: isActive ? 30 : 10
            }}
            transition={{ type: "spring", stiffness: 200, damping: 30, mass: 1 }}
            onMouseEnter={() => isActive && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="relative aspect-[4/3] bg-black shadow-2xl rounded-sm border border-white/5">
                {/* Cover image — fades out on hover when the 20s clip plays */}
                <AnimatePresence>
                    {!isHovered && (
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            src={item.cover}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>

                {/* 20s preview clip — plays on hover on both local and GH Pages */}
                {isActive && (
                    <video
                        ref={videoRef}
                        src={item.previewVideo}
                        loop
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} `}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default function Videos() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % videoData.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + videoData.length) % videoData.length);

    const OVERLAY_BLUR = "5px";

    // Notify LandingPage when Videos page is active
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("videosPageStateChange", { detail: { isActive: true } }));
        return () => {
            window.dispatchEvent(new CustomEvent("videosPageStateChange", { detail: { isActive: false } }));
        };
    }, []);

    return (
        <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-[#222222] text-white overflow-hidden flex flex-col justify-between pt-20 pb-6 box-border z-[100]"
        >
            {/* 全局固定 Click 提示 - 恢复 mode="wait" 以确保 100->0->100 的透明度变化可见 */}
            <AnimatePresence mode="wait">
                {!selectedVideo && (
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 z-[50] pointer-events-none"
                    >
                        <div className="relative w-full max-w-[1200px] h-full mx-auto">
                            {/* 文字固定位置 - 使用相对于全屏的 top 值 */}
                            <span
                                className="font-['Xiaodou'] text-[#CE6452]"
                                style={{
                                    position: 'absolute',
                                    display: 'block',
                                    top: '19%',
                                    left: '11%',
                                    fontSize: '18px',
                                    transform: "rotate(-14.02deg)",
                                    WebkitTransform: "rotate(-14.02deg)",
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Click to watch the video
                            </span>

                            <img
                                src={getAssetPath("/video-arrow.png")}
                                alt=""
                                style={{
                                    position: 'absolute',
                                    top: '20%',
                                    left: '23%',
                                    width: '50px',
                                    height: 'auto'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Carousel Section */}
            <div className="relative flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full h-[60vh] flex items-center justify-center">

                    <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-[#222222] to-transparent z-[25] pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#222222] to-transparent z-[25] pointer-events-none" />


                    <div className="relative w-full flex items-center justify-center">
                        {videoData.map((item, index) => {
                            let diff = index - currentIndex;
                            if (diff > Math.floor(videoData.length / 2)) diff -= videoData.length;
                            if (diff < -Math.floor(videoData.length / 2)) diff += videoData.length;

                            return (
                                <VideoCard
                                    key={item.id}
                                    item={item}
                                    isActive={index === currentIndex}
                                    position={diff}
                                    total={videoData.length}
                                    onClick={() => index === currentIndex ? setSelectedVideo(item) : setCurrentIndex(index)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* 左右切换按钮 - 绝对定位，不影响下方文字布局 */}
                {/* 调位置：改 bottom / right 的数值即可 */}
                <div className="flex gap-4 -mt-14 relative z-[50]">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePrev}
                        className="group border border-white px-8 py-1 font-['HYPixel'] text-base hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <span className="transition-transform group-hover:-translate-x-1">&lt;&lt;&lt;</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="group border border-white px-8 py-1 font-['HYPixel'] text-base hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <span className="transition-transform group-hover:translate-x-1">&gt;&gt;&gt;</span>
                    </motion.button>
                </div>
            </div>

            {/* 2. Page Info Section - 恢复 Flex 布局并添加下边距锁定位置 */}
            <div className="w-full max-w-[90%] lg:max-w-[1440px] mx-auto px-10 lg:px-24 mb-2 z-[40]">
                <div className="w-full h-[180px] flex flex-col">
                    <h2 className="font-['HYPixel'] text-[20px] mb-2 tracking-tight">
                        {videoData[currentIndex].title}
                    </h2>

                    <div className="w-full h-[1px] bg-white/20 mb-4" />

                    <div className="flex flex-col md:flex-row justify-between gap-8 opacity-70">
                        <p className="font-['DotPixel'] text-[14px] leading-relaxed flex-1 w-full text-justify whitespace-pre-line overflow-hidden">
                            {videoData[currentIndex].description}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Video Detail Overlay (Using Portal to cover Navbar) */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 flex items-center justify-center bg-black/60 overflow-hidden"
                            style={{
                                backdropFilter: `blur(${OVERLAY_BLUR})`,
                                zIndex: 20000
                            }}
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.98, opacity: 0 }}
                                className="relative w-[95vw] max-w-[1280px] flex flex-col md:flex-row gap-12 bg-transparent items-end"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ y: -6 }}
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute -top-20 left-0 z-[21000] cursor-pointer"
                                >
                                    <img
                                        src={getAssetPath("/video-close.png")}
                                        alt="close"
                                        className="w-8 h-8 md:w-10 md:h-10"
                                    />
                                </motion.button>

                                {/* Video Player */}
                                <div className="flex-[2.5] aspect-video bg-black shadow-2xl border border-white/10 relative overflow-hidden">
                                    {/* Production (GH Pages): use Bilibili iframe if bvid available */}
                                    {/* Development (local): always use local video file */}
                                    {import.meta.env.PROD && selectedVideo.bvid ? (
                                        <iframe
                                            src={`//player.bilibili.com/player.html?bvid=${selectedVideo.bvid}&page=1&high_quality=1&danmaku=0&autoplay=1`}
                                            scrolling="no"
                                            border="0"
                                            frameborder="no"
                                            framespacing="0"
                                            allowfullscreen="true"
                                            style={{ width: '100%', height: '100%' }}
                                        ></iframe>
                                    ) : (
                                        <video
                                            src={selectedVideo.previewVideo}
                                            controls
                                            autoPlay
                                            className="w-full h-full object-contain"
                                        />
                                    )}
                                </div>

                                {/* Stats Column (Single column, no extra title/description as requested) */}
                                <div className="flex-1 flex flex-col justify-end pb-4">
                                    <div className="font-['DotPixel'] text-white/50 space-y-4 uppercase tracking-[0.2em] text-[14px]">
                                        <p>RECORDING_MODE: {selectedVideo.stats.recordingMode}</p>
                                        <p>FRAME_RATE: {selectedVideo.stats.frameRate}</p>
                                        <p>SOURCE: {selectedVideo.stats.source}</p>
                                        <a
                                            href={selectedVideo.embedUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block pt-4 text-[#CE6452] hover:underline normal-case tracking-normal font-['Xiaodou'] text-[18px]"
                                        >
                                            View on Xiaohongshu →
                                        </a>
                                        {selectedVideo.bilibiliUrl && (
                                            <a
                                                href={selectedVideo.bilibiliUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block pt-2 text-[#CE6452] hover:underline normal-case tracking-normal font-['Xiaodou'] text-[18px]"
                                            >
                                                View on Bilibili →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </motion.div>
    );
}
