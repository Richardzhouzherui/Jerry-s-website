import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./phoalbum-book.css";

export default function PhoalbumBook({
  items = [],
  isInitialClosed = true,
  showControls = false,
  locked = false,         // 锁定模式：纯装饰，禁止点击打开和翻页
  hintX = -320,
  hintY = "45%",
  hintScale = 1,
  coverGroupScale = 1.1,
  coverGroupShadow = "0 15px 45px rgba(0, 0, 0, 0.4)",
  overlayScale = 1.0,
  spineShadowWidth = "60px",
  spineShadowHeight = "100%",
  spineShadowOpacity = 0.7,
  navBtnWidth = "90px",
  navBtnHeight = "35px",
  onStateChange = null,
  onTurnChange = null,    // 👈 翻页状态回调
  onIndexChange = null,   // 👈 新增：页码索引回调
  targetIndex = null,     // 👈 新增：外部控制跳转的页码
  className = ""           // 👈 允许外部传入自定义类名以隔离样式
}) {
  const spreads = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const s = [];
    for (let i = 0; i < items.length; i += 2) {
      s.push([items[i] || null, items[i + 1] || null]);
    }
    return s;
  }, [items]);

  const [isOpen, setIsOpen] = useState(!isInitialClosed);
  const [index, setIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [dir, setDir] = useState(null);

  // 👈 处理外部跳转逻辑
  useEffect(() => {
    if (targetIndex !== null && targetIndex !== undefined) {
      setIndex(targetIndex);
      setIsOpen(true);
      if (onStateChange) onStateChange(true);
    }
  }, [targetIndex, onStateChange]);

  const bookWrapRef = React.useRef(null);

  const currentSpread = spreads[index] || [null, null];
  const left = currentSpread[0];
  const right = currentSpread[1];

  const canPrev = index > 0;
  const canNext = index < spreads.length - 1;

  const handleOpen = () => {
    if (locked) return; // 锁定状态下禁止打开
    if (!isOpen) {
      setIsOpen(true);
      if (onStateChange) onStateChange(true);
    }
  };

  const turn = (way) => {
    if (locked) return; // 锁定状态下禁止翻页
    if (isTurning || !isOpen) return;
    if (way === "next" && !canNext) return;
    if (way === "prev" && !canPrev) return;
    setIsTurning(true);
    setDir(way);
    if (onTurnChange) onTurnChange(true); // 👈 开始翻页
  };

  const onAnimationComplete = (definition) => {
    if (definition === "animate") {
      setIndex((i) => {
        const newIndex = dir === "next" ? Math.min(spreads.length - 1, i + 1) :
          dir === "prev" ? Math.max(0, i - 1) : i;
        if (onIndexChange) onIndexChange(newIndex); // 👈 翻页完成后通知新索引
        return newIndex;
      });
      setIsTurning(false);
      setDir(null);
      if (onTurnChange) onTurnChange(false); // 👈 翻页结束
    }
  };

  const handlePointerMove = (e) => {
    if (isOpen || !bookWrapRef.current) return;
    const rect = bookWrapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xProgress = (x / rect.width) * 2 - 1;
    const yProgress = (y / rect.height) * 2 - 1;
    const fanProgress = Math.max(0, Math.min(1, x / rect.width));
    bookWrapRef.current.style.setProperty("--mouse-x", xProgress.toFixed(3));
    bookWrapRef.current.style.setProperty("--mouse-y", yProgress.toFixed(3));
    bookWrapRef.current.style.setProperty("--book-progress", fanProgress.toFixed(3));
  };

  const handlePointerLeave = () => {
    if (bookWrapRef.current) {
      bookWrapRef.current.style.setProperty("--mouse-x", "0");
      bookWrapRef.current.style.setProperty("--mouse-y", "0");
      bookWrapRef.current.style.setProperty("--book-progress", "0");
    }
  };

  if (spreads.length === 0) {
    return <div className="p-8 text-center font-mono">NO_DATA</div>;
  }

  return (
    <>
      <div
        className={`book-wrap ${isOpen ? 'is-open' : 'is-closed book-closed-view'} ${className}`}
        ref={bookWrapRef}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        style={{
          "--spine-shadow-width": spineShadowWidth,
          "--spine-shadow-height": spineShadowHeight,
          "--spine-shadow-opacity": spineShadowOpacity,
          "--nav-btn-width": navBtnWidth,
          "--nav-btn-height": navBtnHeight,
          cursor: "default"
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="click-hint-wrap"
              onClick={handleOpen}
              style={{ left: hintX, top: hintY, scale: hintScale, rotate: -5 }}
            >
              <img src="/cover_arrow.png" alt="Click the book" className="click-hint-img" />
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`book ${!isOpen ? "book-closed-view" : ""}`}
          onClick={!isOpen ? handleOpen : undefined}
          style={{ pointerEvents: isTurning ? "none" : "auto" }}
        >
          {!isOpen && (
            <div className="side-pages-stack closed-stack">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="side-page-layer"
                  style={{
                    zIndex: -(i + 1),
                    transform: `translateZ(${-i * 1.8}px) rotateY(calc(var(--book-progress, 0) * ${-3 - i * 1.6}deg)) translateX(${i * 0.7}px)`
                  }}
                />
              ))}
            </div>
          )}

          <div className="spine" />

          <AnimatePresence>
            {!isOpen && (
              <motion.div
                className="book-cover-layer"
                initial={{ x: 0, opacity: 1, rotateY: 0 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.4, ease: "easeOut" }
                }}
                style={{ transformOrigin: "center" }}
              >
                <div
                  className="cover-group"
                  style={{ boxShadow: coverGroupShadow }}
                >
                  <div className="cover-visual-content">
                    <img
                      src="/phoalbum-cover.png"
                      alt="Phoalbum Cover"
                      className="cover-img"
                      style={{ objectFit: "cover", background: "#fff" }}
                    />
                    <div className="cover-glare" />
                  </div>
                  <img
                    src="/frame-194.png"
                    alt="Cover Overlay"
                    className="cover-overlay-img"
                    style={{ transform: `scale(${overlayScale})` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isOpen && (
            <>
              <div className="side-pages-stack" style={{ left: 0, width: '50%' }}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`left-${i}`}
                    className="side-page-layer"
                    style={{
                      transform: `translate(${(i + 1) * -3}px, 0px)`,
                      zIndex: -(i + 1),
                      boxShadow: "-2px 2px 8px rgba(0, 0, 0, 0.18)"
                    }}
                  />
                ))}
              </div>
              <div className="side-pages-stack" style={{ right: 0, left: 'auto', width: '50%' }}>
                {[...Array(9)].map((_, i) => (
                  <div
                    key={`right-${i}`}
                    className="side-page-layer"
                    style={{ transform: `translate(0px, 0px)`, zIndex: -(i + 1) }}
                  />
                ))}
              </div>
            </>
          )}

          <div
            className={`page page-left main-page ${!isTurning ? 'interactive-page' : ''}`}
            style={{ cursor: isOpen && canPrev ? 'pointer' : 'default' }}
            onClick={() => !isTurning && isOpen && canPrev && turn("prev")}
          >
            <div className="page-spine-shadow shadow-left" />
            {((isTurning && dir === "prev" ? spreads[index - 1]?.[0] : left)) ? (
              <img
                src={(isTurning && dir === "prev" ? spreads[index - 1]?.[0] : left).src}
                alt="page"
                draggable="false"
                style={{ objectFit: "cover", background: "#fff" }}
              />
            ) : (
              <div className="page-placeholder">EMPTY</div>
            )}
            <div className="page-gloss" />
          </div>

          <div
            className={`page page-right main-page ${!isTurning ? 'interactive-page' : ''}`}
            style={{ cursor: isOpen && canNext ? 'pointer' : 'default' }}
            onClick={() => !isTurning && isOpen && canNext && turn("next")}
          >
            <div className="page-spine-shadow shadow-right" />
            {((isTurning && dir === "next" ? spreads[index + 1]?.[1] : right)) ? (
              <img
                src={(isTurning && dir === "next" ? spreads[index + 1]?.[1] : right).src}
                alt="page"
                draggable="false"
                style={{ objectFit: "cover", background: "#fff" }}
              />
            ) : (
              <div className="page-placeholder">EMPTY</div>
            )}
            <div className="page-gloss" />
          </div>

          <AnimatePresence>
            {isTurning && dir === "next" && right && (
              <TurnLeaf
                key="next"
                side="right"
                frontSrc={right.src}
                backSrc={spreads[index + 1]?.[0]?.src}
                onComplete={onAnimationComplete}
              />
            )}
            {isTurning && dir === "prev" && left && (
              <TurnLeaf
                key="prev"
                side="left"
                frontSrc={left.src}
                backSrc={spreads[index - 1]?.[1]?.src}
                onComplete={onAnimationComplete}
              />
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: "none" }}>
          {spreads[index - 1] && (
            <>
              <img src={spreads[index - 1][0]?.src} alt="preload" />
              <img src={spreads[index - 1][1]?.src} alt="preload" />
            </>
          )}
          {spreads[index + 1] && (
            <>
              <img src={spreads[index + 1][0]?.src} alt="preload" />
              <img src={spreads[index + 1][1]?.src} alt="preload" />
            </>
          )}
        </div>

        {showControls && isOpen && (
          <>
            {/* 顶部的进入章节提示与箭头 */}
            {/* size/position adjustment provided directly inline for the user to tweak easily */}
            <div
              style={{
                position: 'absolute',
                top: '-24px', /* ▲ 调整这里控制整体上下位置 */
                left: '15%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px', /* ▲ 调整字和箭头的间距 */
                cursor: 'pointer',
                zIndex: 200,
                pointerEvents: 'auto' /* 👈 确保可以点击 */
              }}
            >
              <span style={{
                color: '#CE6452',
                fontSize: '18px', /* ▲ 调整文字大小 */
                textDecoration: 'underline',
                textDecorationColor: '#CE6452',
                textUnderlineOffset: '6px',
                fontFamily: "'Xiaodou', sans-serif"
              }}>
                Click here to enter this chapter (^o^)
              </span>
              <img
                src="/enter-arrow.png"
                alt="Enter"
                style={{
                  height: '35px', /* ▲ 调整箭头图片大小 */
                  width: 'auto',
                  transform: 'translateY(1px)' /* ▲ 微调箭头的垂直对齐 */
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* 左右两侧的翻页箭头：移出 book-wrap 以确保 position: fixed 相对于屏幕视口生效 */}
      {
        showControls && isOpen && (
          <>
            <button
              className="book-btn fixed-left"
              onClick={() => turn("prev")}
              disabled={!canPrev}
              style={{ pointerEvents: 'auto', zIndex: 200 }}
            >
              &lt;&lt;&lt;
            </button>
            <button
              className="book-btn fixed-right"
              onClick={() => turn("next")}
              disabled={!canNext}
              style={{ pointerEvents: 'auto', zIndex: 200 }}
            >
              &gt;&gt;&gt;
            </button>
          </>
        )
      }
    </>
  );
}

function TurnLeaf({ side = "right", frontSrc, backSrc, onComplete }) {
  const isRight = side === "right";
  const variants = {
    initial: { rotateY: 0, zIndex: 20 },
    animate: {
      rotateY: isRight ? -180 : 180,
      transition: { duration: 1.0, ease: [0.645, 0.045, 0.355, 1.0] }
    },
    exit: { opacity: 0, transition: { duration: 0 } }
  };

  return (
    <motion.div
      className={`leaf ${isRight ? "leaf-right" : "leaf-left"}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      onAnimationComplete={onComplete}
      style={{ transformOrigin: isRight ? "left center" : "right center" }}
    >
      <div className="leaf-face leaf-front">
        <img src={frontSrc} alt="" draggable="false" style={{ objectFit: "cover", background: "#fff", width: "100%", height: "100%" }} />
        <div className={`page-spine-shadow ${isRight ? 'shadow-right' : 'shadow-left'}`} />
        <div className="page-gloss" />
      </div>
      <div className="leaf-face leaf-back with-tint">
        {backSrc && <img src={backSrc} alt="" draggable="false" style={{ objectFit: "cover", background: "#fff", width: "100%", height: "100%" }} />}
        <div className={`page-spine-shadow ${isRight ? 'shadow-left' : 'shadow-right'}`} />
        <div className="page-gloss" />
      </div>
    </motion.div>
  );
}