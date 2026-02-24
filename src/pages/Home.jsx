// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6">
      <h1 className="text-5xl font-bold mb-6">Welcome to My Photo Portfolio</h1>
      <p className="text-lg mb-10">
        这里是我的个人摄影作品展示平台。 点击下方按钮进入摄影集，探索我的旅拍作品与故事。
      </p>

      <Link
        to="/gallery"
        className="px-6 py-3 bg-white text-purple-700 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 font-medium"
      >
        进入摄影集
      </Link>
    </div>
  );
}