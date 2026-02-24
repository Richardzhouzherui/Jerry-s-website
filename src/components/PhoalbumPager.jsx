import React, { useMemo, useState, useRef, useEffect } from "react";
import "./phoalbum.css";

export default function PhoalbumPager({
  items = [],
  perPage = 6,
  gap = "gap-6",
}) {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const containerRef = useRef(null);

  const pageItems = useMemo(() => {
    const start = page * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  const canPrev = page > 0;
  const canNext = page < pages - 1;

  const goPrev = () => {
    if (!canPrev) return;
    setDir(-1);
    setPage((p) => Math.max(0, p - 1));
  };
  const goNext = () => {
    if (!canNext) return;
    setDir(1);
    setPage((p) => Math.min(pages - 1, p + 1));
  };

  // 键盘左右翻页
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canPrev, canNext]);

  // 触摸滑动翻页
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0, startY = 0;

    const onTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dy) > Math.abs(dx)) return; // 避免和页面滚动冲突
      if (dx < -40) goNext();
      if (dx > 40) goPrev();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [canPrev, canNext]);

  return (
    <div className="w-full" ref={containerRef}>
      {/* 顶部控制条 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          第 <span className="font-medium">{page + 1}</span> / {pages} 页 · 共 {total} 张
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            disabled={!canPrev}
            className={`px-3 py-1 rounded border transition ${
              canPrev
                ? "bg-white hover:bg-gray-50 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            ← 上一页
          </button>
          <button
            onClick={goNext}
            disabled={!canNext}
            className={`px-3 py-1 rounded border transition ${
              canNext
                ? "bg-white hover:bg-gray-50 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            下一页 →
          </button>
        </div>
      </div>

      {/* 页容器：根据方向应用进入动画 */}
      <div key={`${page}-${dir}`} className={`phoalbum-page ${dir === 1 ? "slide-in-right" : "slide-in-left"}`}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gap}`}>
          {pageItems.map((it, idx) => (
            <figure key={idx} className="relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm">
              <img
                src={it.src}
                alt={it.alt || `photo-${idx}`}
                className="w-full h-64 object-cover select-none"
                draggable="false"
                loading="lazy"
              />
              {it.caption && (
                <figcaption className="p-3 text-sm text-gray-700">
                  {it.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      {/* 页码点 */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to page ${i + 1}`}
            onClick={() => {
              if (i === page) return;
              setDir(i > page ? 1 : -1);
              setPage(i);
            }}
            className={`h-2 w-2 rounded-full transition ${
              i === page ? "bg-gray-900 w-6" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}