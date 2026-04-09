import React, { useEffect, useState } from "react";
import styles from "./Toast.module.scss";

let addToast;

const icons = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

// Push toast globally
export const pushToast = (type, message) => {
  if (addToast) addToast(type, message);
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToast = (type, message) => {
      const id = Date.now();

      const newToast = { id, type, message, icon: icons[type], hide: false };
      setToasts((prev) => [...prev, newToast]);

      // Auto hide after 5s
      setTimeout(() => removeToast(id), 5000);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hide: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 500); // match exit animation
  };

  return (
    <div className={styles.wrapper}>
      {toasts.map(({ id, type, message, icon, hide }) => (
        <div
          key={id}
          className={`${styles.toast} ${styles[type]} ${
            hide ? styles.hide : styles.show
          }`}
        >
          <div className={styles.content}>
            <span className={styles.icon}>{icon}</span>
            <p>{message}</p>
          </div>
          <button onClick={() => removeToast(id)}>×</button>
          <span className={styles.progress}></span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
