import React, { useState, useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (message) {
      setProgress(100);
      const interval = 10; // update frequency
      const step = (interval / duration) * 100;
      
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - step;
        });
      }, interval);

      const closeTimer = setTimeout(() => {
        onClose();
      }, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`shop-toast ${type}`}>
      <span className="toast-icon">
        {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      </span>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
      <div className="toast-progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
