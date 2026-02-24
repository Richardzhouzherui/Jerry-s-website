// src/components/DecryptedTitle.jsx
import { useEffect, useState } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

export default function DecryptedTitle({ text, duration = 50 }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      const scrambled = text
        .split("")
        .map((char, index) => {
          if (index < i) return text[index];
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("");

      setDisplayedText(scrambled);

      if (i >= text.length) clearInterval(interval);
      i++;
    }, duration);

    return () => clearInterval(interval);
  }, [text, duration]);

  return (
    <h1 className="text-4xl md:text-6xl font-bold text-center text-gray-800">
      {displayedText}
    </h1>
  );
}