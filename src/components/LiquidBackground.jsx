// src/components/LiquidBackground.jsx
import React from "react";
import LiquidEther from "./reactbits/LiquidEther";

export default function LiquidBackground() {
  return (
    // 固定在视口底层，贯穿所有 Section
    <div className="pointer-events-none fixed inset-0 -z-10">
      <LiquidEther
        colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
        resolution={0.7}
        autoDemo={true}
        autoSpeed={0.8}
        autoIntensity={2.0}
        // 不改组件内部，实现全屏就靠这里
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}