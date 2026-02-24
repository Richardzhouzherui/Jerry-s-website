import React from "react";
import { motion } from "framer-motion";

const chapters = [
    { left: { name: "PROLOGUE_序章", slug: "introduce" }, right: { name: "JAPAN_日本", slug: "japan" } },
    { left: { name: "BEIJING_北京", slug: "beijing" }, right: { name: "GANSU_甘肃", slug: "gansu" } },
    { left: { name: "WUXI_无锡", slug: "wuxi" }, right: { name: "JINGDEZHEN_景德镇", slug: "jingdezhen" } },
    { left: { name: "HANGZHOU_杭州", slug: "hangzhou" }, right: { name: "CHANGSHU_常熟", slug: "changshu" } },
    { left: { name: "SHANGHAI_上海", slug: "shanghai" }, right: { name: "XIAMEN_厦门", slug: "xiamen" } },
    { left: { name: "WUHAN_武汉", slug: "wuhan" }, right: { name: "YUNNAN_云南", slug: "yunnan" } },
    { left: { name: "SHENNONGJIA_神农架", slug: "shennongjia" }, right: { name: "FENGDU_丰都", slug: "fengdu" } },
    { left: { name: "SINGAPORE_新加坡", slug: "singapore" }, right: { name: "NANJING_南京", slug: "nanjing" } },
    { left: { name: "HUZHOU_湖州", slug: "zhejiang" }, right: { name: "GRADUATION_毕业", slug: "graduation" } },
];

function ChapterBtn({ chapter, onSelect, delay = 0 }) {
    if (!chapter || !chapter.name) return <div className="px-6 py-6 border-b border-black" />;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.3, ease: "easeOut" }}
            className="flex items-center justify-between px-6 border-b border-black hover:bg-black hover:text-white transition cursor-pointer"
            style={{ fontSize: "24px", paddingTop: "6px", paddingBottom: "6px" }}
            onClick={() => onSelect && onSelect(chapter.slug)}
        >
            <span className="font-['HYPixel'] tracking-widest flex-1">{chapter.name}</span>
            <span className="font-['HYPixel']" style={{ transform: 'translateX(-310px)', display: 'inline-block' }}>&gt;&gt;&gt;</span>
        </motion.div>
    );
}

// isOpen → 书摊开后隐藏网格
export default function PhoalbumGrid({ isOpen = false, onSelect }) {
    if (isOpen) return null;

    return (
        <div className="w-full font-mono" style={{ fontFamily: "'HYPixel', monospace" }}>
            {/* 网格：只保留上下线 + 中间分隔线，去掉左右竖线 */}
            <div className="relative">
                {/* 顶部的第一根线 */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ transformOrigin: "left" }}
                    className="border-t border-black w-full"
                />
                {chapters.map((row, i) => (
                    <div key={i} className="grid grid-cols-2 relative">
                        {/* 左列：右边是中间分隔线 */}
                        <div className="border-r border-black overflow-hidden">
                            <ChapterBtn chapter={row.left} onSelect={onSelect} delay={i * 0.05} />
                        </div>
                        {/* 右列 */}
                        <div style={{ transform: 'translateX(310px)' }} className="overflow-hidden">
                            <ChapterBtn chapter={row.right} onSelect={onSelect} delay={i * 0.05 + 0.1} />
                        </div>

                        {/* 每一行下面的横线 */}
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.8, delay: i * 0.05, ease: "easeInOut" }}
                            style={{ transformOrigin: "left", position: "absolute", bottom: 0, left: 0, right: 0 }}
                            className="border-b border-black w-full"
                        />
                    </div>
                ))}
            </div>

            {/* OVERVIEW 项 */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="flex items-center justify-between px-6 border-b border-black hover:bg-black hover:text-white transition cursor-pointer"
                style={{ fontSize: "40px", paddingTop: "20px", paddingBottom: "20px" }}
                onClick={() => onSelect && onSelect("introduce")}
            >
                <span className="font-['HYPixel'] tracking-widest font-bold">OVERVIEW</span>
                <span className="font-['HYPixel']" style={{ transform: 'translateX(-20px)', display: 'inline-block' }}>&gt;&gt;&gt;</span>
            </motion.div>
        </div>
    );
}
