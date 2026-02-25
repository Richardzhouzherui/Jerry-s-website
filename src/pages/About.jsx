import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAssetPath } from "../utils/paths";

export default function About({ backgroundPath }) {
    const navigate = useNavigate();
    const containerRef = React.useRef(null);

    // --- ADJUSTABLE SEPARATOR LINE STYLES ---
    const separatorLineThickness = "2px"; // e.g. "2px", "4px", "8px"
    const separatorLineOpacity = 0.5;       // 0 to 1 (e.g. 0.5 for 50%)
    const separatorLineMarginTop = "-50px";   // Spacing from the text above (Reduced to move section up)

    // --- ADJUSTABLE CONTACT BOX STYLES ---
    const contactBoxFontSize = "20px";
    const contactBoxOffsetFromLine = "18px"; // Spacing between the line and the box

    // --- BIO TEXT & LAYOUT STYLES ---
    const bioTextMaxWidth = "1300px";        // Wider to make text shorter vertically
    const bioLineHeight = "1.5";             // Slightly more compact line height
    const bioParagraphSpacing = "1rem";      // More compact paragraph spacing
    const bioContentTopPadding = "120px";    // Vertical position of text inside background

    // --- BIO BACKGROUND & FRAME STYLES ---
    const bioBackgroundUrl = getAssetPath("/pixel-bg.png");
    const bioBackgroundSize = "auto 100%";   // Matches height exactly, scales width to maintain ratio
    const bioBackgroundPosition = "center -70px"; // User's preferred position
    const bioBackgroundRotate = "180deg";
    const bioBackgroundTop = "-10px";         // User's preferred container position
    const bioBackgroundHeight = "calc(100% + 40px)";  // Reduced from 80px to make frame smaller
    const bioBackgroundShadowY = "10px";     // Increased from 60px to move it further down
    const bioBackgroundShadow = `drop-shadow(0 ${bioBackgroundShadowY} 40px rgba(0,0,0,0.3))`; // Lighter (alpha reduced to 0.5)

    // --- PAGE LENGTH & SECTION POSITION ---
    const bioSectionMinHeight = "60vh";     // Length of the "new page"
    const bioSectionOverlap = "15vh";       // How much the bio page floats up into hero
    const bioPagePaddingBottom = "0px";      // Space at the very bottom (Reduced to 0)
    const bioBottomSectionHeight = "80px";  // Height of the area containing the line and thank you image

    // --- BIO OVERLAY STYLES ---
    const bioOverlayBgColor = "rgba(0,0,0,0.5)";
    const bioOverlayPadding = "40px";        // Internal space between text and background edges
    const bioOverlayMarginLeftRight = "-40px"; // Horizontal spread of the background
    const bioOverlayMarginTopBottom = "-30px"; // Vertical spread of the background
    const bioOverlayBorderRadius = "8px";

    // --- HERO BACKGROUND CONFIGURATION (New) ---
    const heroBgImg = '/居中背景图.png';
    const heroBgSize = '45%';         // This controls the size of the background image
    const heroBgPos = 'center 45%';   // This controls the position (horizontal vertical)

    // --- HERO IMAGE CONFIGURATION (New) ---
    // 1. Designer Image (Left)
    const imgDesignerPos = { top: "43%", left: "22%" };
    const imgDesignerSize = "w-48 md:w-64";
    const imgDesignerScale = "scale-[1.4]";

    // 2. Group 38 (Right)
    const imgGroup38Pos = { top: "75%", right: "68%" };
    const imgGroup38Size = "w-40 md:w-56";
    const imgGroup38Scale = "scale-[1.5]";

    // 3. Group 1739332834 (Bottom Left)
    const imgGroupNewPos = { bottom: "5%", left: "65%" };
    const imgGroupNewSize = "w-44 md:w-60";
    const imgGroupNewScale = "scale-[2.4]";

    // --- FLOATING PHOTOS CONFIGURATION ---
    // Photo 1 (Top Left)
    const photo1Pos = { top: "95%", left: "65%" };
    const photo1Size = "w-40 md:w-56";
    const photo1Rotate = 6;
    const photo1Scale = 1.6;

    // Photo 2 (Top Right)
    const photo2Pos = { top: "28%", right: "20%" };
    const photo2Size = "w-36 md:w-52";
    const photo2Rotate = 3;
    const photo2Scale = 1.7;

    // Photo 3 (Bottom Left)
    const photo3Pos = { bottom: "-25%", left: "8%" };
    const photo3Size = "w-44 md:w-60";
    const photo3Rotate = -5;
    const photo3Scale = 0.9;

    // Photo 4 (Bottom Right)
    const photo4Pos = { bottom: "20%", right: "60%" };
    const photo4Size = "w-38 md:w-54";
    const photo4Rotate = -6;
    const photo4Scale = 0.35;

    // --- PHOTO INTERACTION CONFIG (Refined) ---
    const photoFloatAmplitude = 8;  // Reduced for subtlety
    const photoFloatDuration = 4;   // Seconds for one float cycle
    const photoHoverScaleAdd = 0.05; // Extra scale on hover
    const photoHoverDuration = 0.3; // Transition speed for hover effect
    const photoBorder = "4px solid #6C6C6C"; // Unified border width

    // Notify LandingPage when About page is active
    React.useEffect(() => {
        window.dispatchEvent(new CustomEvent("aboutPageStateChange", { detail: { isActive: true } }));
        return () => {
            window.dispatchEvent(new CustomEvent("aboutPageStateChange", { detail: { isActive: false } }));
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                zIndex: 10000,
                backgroundColor: "#222222",
                overflowY: "auto",
                overflowX: "hidden"
            }}
            className="text-white font-['DotPixel'] selection:bg-white selection:text-[#222]"
        >
            {/* About Page Navigation Bar */}
            <nav className="fixed top-0 left-0 w-full bg-[#222222]/95 backdrop-blur-sm z-[250] py-4 px-8 flex justify-between items-center border-b border-transparent">
                {/* Left: Brand with Avatar */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 relative">
                        <img
                            src={getAssetPath("/avatar.png")}
                            alt="icon"
                            className="absolute top-1/2 left-[-25px] -translate-y-1/2 w-14 h-14 max-w-none object-contain invert"
                        />
                    </div>
                    <Link
                        to="/"
                        onClick={() => window.dispatchEvent(new CustomEvent("resetHome"))}
                        className="text-white font-['HYPixel'] hover:opacity-70 transition-opacity"
                        style={{ fontSize: '18.74px' }}
                    >
                        Jerry'z Inspiration Archive
                    </Link>
                </div>

                {/* Right: Contact */}
                <div>
                    <a href="mailto:3134499362@qq.com" className="font-['HYPixel'] text-white hover:opacity-70 transition-opacity" style={{ fontSize: '18.74px' }}>
                        Contact
                    </a>
                </div>
            </nav>

            {/* Background Image Layer - Simple background image replacement */}
            <div
                className="absolute inset-x-0 top-0 h-full z-[5] pointer-events-none"
                style={{
                    backgroundImage: `url(${heroBgImg})`,
                    backgroundSize: heroBgSize,
                    backgroundPosition: heroBgPos,
                    backgroundRepeat: 'no-repeat',
                }}
            />

            {/* Decorative Images - In Hero Section Only */}

            {/* 1. Hero Section (Images & Floating Text) */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
                {/* Mirrored Back Link */}
                <button
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent("aboutPageStateChange", { detail: { isActive: false } }));
                        navigate(backgroundPath || "/");
                    }}
                    className="fixed left-4 md:left-8 top-[calc(35%+35px)] z-[110] hover:opacity-70 transition-opacity"
                >
                    <img src={getAssetPath("/arrow-left.png")} alt="Back" className="w-8 h-auto scale-x-[-1] invert" />
                </button>

                <div className="relative w-full max-w-6xl mx-auto h-full flex items-center justify-center">
                    {/* Decorative Images - Absolute positioned in hero section, above other photos */}
                    <img
                        src={getAssetPath("/designer.png")}
                        alt=""
                        className={`absolute z-30 pointer-events-none ${imgDesignerScale} ${imgDesignerSize}`}
                        style={{ top: imgDesignerPos.top, left: imgDesignerPos.left }}
                    />
                    <img
                        src={getAssetPath("/group-38.png")}
                        alt=""
                        className={`absolute z-30 pointer-events-none ${imgGroup38Scale} ${imgGroup38Size}`}
                        style={{ top: imgGroup38Pos.top, right: imgGroup38Pos.right }}
                    />
                    <img
                        src={getAssetPath("/group-1739332834.png")}
                        alt=""
                        className={`absolute z-30 pointer-events-none ${imgGroupNewScale} ${imgGroupNewSize}`}
                        style={{ bottom: imgGroupNewPos.bottom, left: imgGroupNewPos.left }}
                    />


                    {/* Floating Photos Around Portrait - With Parallax */}
                    <motion.div
                        className={`absolute z-20 ${photo1Size}`}
                        style={{
                            top: photo1Pos.top,
                            left: photo1Pos.left,
                            opacity: 0.65,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -photoFloatAmplitude] }}
                            transition={{
                                duration: photoFloatDuration,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                            whileHover={{
                                scale: photo1Scale * (1 + photoHoverScaleAdd),
                                transition: { duration: photoHoverDuration }
                            }}
                            style={{
                                border: photoBorder,
                                rotate: photo1Rotate,
                                scale: photo1Scale,
                            }}
                        >
                            <img src={getAssetPath("/photos/hero-1.png")} alt="" className="w-full h-auto" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={`absolute z-20 ${photo2Size}`}
                        style={{
                            top: photo2Pos.top,
                            right: photo2Pos.right,
                            opacity: 0.65,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -photoFloatAmplitude] }}
                            transition={{
                                duration: photoFloatDuration * 1.1,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 0.5
                            }}
                            whileHover={{
                                scale: photo2Scale * (1 + photoHoverScaleAdd),
                                transition: { duration: photoHoverDuration }
                            }}
                            style={{
                                border: photoBorder,
                                rotate: photo2Rotate,
                                scale: photo2Scale,
                            }}
                        >
                            <img src={getAssetPath("/photos/hero-2.png")} alt="" className="w-full h-auto" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={`absolute z-20 ${photo3Size}`}
                        style={{
                            bottom: photo3Pos.bottom,
                            left: photo3Pos.left,
                            opacity: 0.65,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, photoFloatAmplitude] }}
                            transition={{
                                duration: photoFloatDuration * 0.9,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 1
                            }}
                            whileHover={{
                                scale: photo3Scale * (1 + photoHoverScaleAdd),
                                transition: { duration: photoHoverDuration }
                            }}
                            style={{
                                border: photoBorder,
                                rotate: photo3Rotate,
                                scale: photo3Scale,
                            }}
                        >
                            <img src={getAssetPath("/photos/hero-3.png")} alt="" className="w-full h-auto" />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={`absolute z-20 ${photo4Size}`}
                        style={{
                            bottom: photo4Pos.bottom,
                            right: photo4Pos.right,
                            opacity: 0.65,
                            cursor: 'pointer'
                        }}
                    >
                        <motion.div
                            animate={{ y: [0, -photoFloatAmplitude] }}
                            transition={{
                                duration: photoFloatDuration * 1.2,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 0.2
                            }}
                            whileHover={{
                                scale: photo4Scale * (1 + photoHoverScaleAdd),
                                transition: { duration: photoHoverDuration }
                            }}
                            style={{
                                border: photoBorder,
                                rotate: photo4Rotate,
                                scale: photo4Scale,
                            }}
                        >
                            <img src={getAssetPath("/photos/hero-4.png")} alt="" className="w-full h-auto" />
                        </motion.div>
                    </motion.div>
                </div>

            </section>

            {/* 2. Content Section - Floating New Page with Overlap */}
            <section className="relative bg-[#222222] text-white" style={{ marginTop: bioSectionOverlap, minHeight: bioSectionMinHeight, paddingBottom: bioPagePaddingBottom, overflow: "visible" }}>
                {/* Pixel Background (Adjustable via variables at the top) */}
                <div
                    className="absolute left-0 right-0 z-0"
                    style={{
                        top: bioBackgroundTop,
                        height: bioBackgroundHeight,
                        backgroundImage: `url('${bioBackgroundUrl}')`,
                        backgroundSize: bioBackgroundSize,
                        backgroundPosition: bioBackgroundPosition,
                        backgroundRepeat: "no-repeat",
                        imageRendering: 'pixelated',
                        transform: `rotate(${bioBackgroundRotate})`,
                        filter: bioBackgroundShadow,
                    }}
                />

                <div className="relative z-10 w-full" style={{ padding: `${bioContentTopPadding} 5% 40px 5%` }}>

                    {/* 1. Staggered Heading - Automatic Float Up on Entry */}
                    <motion.div
                        className="mb-16"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <h3 className="font-['HYPixel'] mb-6 tracking-tight text-white/100" style={{ fontSize: "40px" }}>
                            // About meeeeee^
                        </h3>
                    </motion.div>

                    {/* 2. Main Content - Bio Text - Scroll Triggered Float Up */}
                    <motion.div
                        className="relative z-10"
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    >
                        <div className="relative mb-16 overflow-hidden">
                            {/* Semi-transparent Overlay */}
                            <div
                                className="absolute inset-0 z-0 backdrop-blur-sm"
                                style={{
                                    backgroundColor: bioOverlayBgColor,
                                    margin: `${bioOverlayMarginTopBottom} ${bioOverlayMarginLeftRight}`,
                                    borderRadius: bioOverlayBorderRadius
                                }}
                            />

                            <div className="relative z-10 space-y-6 font-['iekietongzhenti'] text-white/90" style={{ fontSize: "20px", lineHeight: bioLineHeight, padding: bioOverlayPadding }}>
                                <p className="text-3xl font-bold">&gt;&gt;&gt;</p>

                                {/* Greeting - Font size unified with paragraphs */}
                                <p className="font-bold text-white" style={{ fontSize: "20px" }}>
                                    Hiiiiii，欢迎你打开我的网页哇！(^-^)
                                </p>

                                <div className="space-y-[var(--p-spacing)]" style={{ "--p-spacing": bioParagraphSpacing }}>
                                    <p>如果你只是想快速知道我在做什么，</p>
                                    <p>那大概可以概括为：<span className="text-white px-3 py-1 font-bold">设计、记录、偶尔偏航。</span></p>
                                    <p>
                                        我目前在同济大学学习人工智能与数据设计，在这之前学的是产品设计。比起一个明确的职业标签，我更习惯用"正在学习如何把想法变成形式的人"来形容自己。我的工作与兴趣横跨产品、交互、视觉、影像和一些尚未被清楚命名的实践，它们往往不是从"需求"出发，而是从一个让我停下来多看两眼的瞬间开始。
                                    </p>
                                    <p>
                                        我对设计史、视觉文化和技术如何悄悄改变审美结构有长期兴趣。像素、界面、工具限制、时代情绪，这些看似边角的东西，经常成为我项目的起点。近几年，我也逐渐把 AI 当作一种新的设计材料，而不是单纯的效率工具，尝试用它去放大人的直觉，而不是替代判断。
                                    </p>
                                    <p>
                                        除了设计实践，我也通过视频的方式整理和输出这些观察与思考。视频内容通常从一个看似微小的设计细节或视觉现象切入，延展到它背后的历史、技术条件或文化语境。对我来说，视频不是对作品的重复展示，而是另一种"思考被看见"的形式。
                                    </p>
                                    <p>
                                        这个网站更像是一份持续生长的档案，而不是一个完成态的作品集。这里会存放我做过的项目、尚未成型的想法、视觉实验、视频内容，以及一些来自日常与旅行的记录。它不追求完整叙事，也不保证更新频率，只对我当下的状态负责。
                                    </p>
                                    <p>
                                        比起抵达某个结论，我更在意过程本身是否真实、是否留下了痕迹。
                                    </p>
                                    <p>
                                        如果这些内容刚好对你有一点启发，那就已经超出它原本的目的了。
                                    </p>
                                    <p>
                                        除此之外，我喜欢在陌生城市走很远的路，喜欢拍照，喜欢整理旧文件夹，也相信很多设计并不发生在屏幕上。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    {/* Separator Line & Contact Information */}
                    <div className="relative w-full" style={{ height: bioBottomSectionHeight }}>
                        {/* The Line */}
                        <div
                            className="absolute left-0 w-full bg-white"
                            style={{
                                top: separatorLineMarginTop,
                                height: separatorLineThickness,
                                opacity: separatorLineOpacity,
                                zIndex: 10
                            }}
                        />

                        {/* Contact Box - Positioned relative to the line via contactBoxOffsetFromLine */}
                        <div
                            className="absolute right-0 flex flex-col items-end pt-4 font-['iekietongzhenti'] text-white"
                            style={{
                                top: `calc(${separatorLineMarginTop} + ${contactBoxOffsetFromLine})`,
                                fontSize: contactBoxFontSize,
                                zIndex: 20
                            }}
                        >
                            <div className="border border-white px-6 py-2 space-y-0 text-right bg-[#222]/50 backdrop-blur-sm">
                                <p>小红书 &gt;&gt;&gt; @粥杰瑞</p>
                                <p>Bilibili &gt;&gt;&gt; @粥杰瑞</p>
                                <p>Mail &gt;&gt;&gt; 3134499362@qq.com</p>
                            </div>
                        </div>

                        {/* Thank You Image - Bottom Left within the same area */}
                        <div className="absolute bottom-0 left-0 w-72 md:w-[900px] translate-y-[20%]">
                            <img src={getAssetPath("/thank-you-group.png")} alt="Thank you" className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>
        </motion.div >
    );
}
