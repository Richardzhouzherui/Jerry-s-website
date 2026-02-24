import { motion } from "framer-motion";

export default function PhotoCard({ photo, onClick }) {
  return (
    <motion.div
      className="overflow-hidden rounded-lg shadow-lg cursor-pointer group bg-white"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={() => onClick?.(photo)}
    >
      <img
        src={photo.src}
        alt={photo.title}
        className="w-full h-64 object-cover group-hover:opacity-90 transition"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{photo.title}</h3>
      </div>
    </motion.div>
  );
}