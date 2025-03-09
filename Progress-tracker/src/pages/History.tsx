import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function History() {
  const [deletedEntries, setDeletedEntries] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false); 

  useEffect(() => {
    const savedDeletedEntries = localStorage.getItem("deleted");
    if (savedDeletedEntries) {
      setDeletedEntries(JSON.parse(savedDeletedEntries));
    }
  }, []);

  const restoreEntry = (index: number) => {
    const restoredItem = deletedEntries[index];

    const updatedDeletedEntries = deletedEntries.filter((_, i) => i !== index);
    setDeletedEntries(updatedDeletedEntries);
    localStorage.setItem("deleted", JSON.stringify(updatedDeletedEntries));

    const progressEntries = JSON.parse(localStorage.getItem("progress") || "[]");
    progressEntries.push(restoredItem);
    localStorage.setItem("progress", JSON.stringify(progressEntries));
  };

  const clearHistory = () => {
    setShowConfirm(true); 
  };

  const confirmClearHistory = () => {
    setDeletedEntries([]);
    localStorage.removeItem("deleted");
    setShowConfirm(false); 
  };

  return (
    <div>
      <h2>🗑 История удалённых</h2>

      <motion.ul layout>
        <AnimatePresence>
          {deletedEntries.map((entry, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {entry}
              <button className="restore" onClick={() => restoreEntry(index)}>♻️ Восстановить</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {deletedEntries.length > 0 && (
        <button className="clear-history" onClick={clearHistory}>🗑 Очистить историю</button>
      )}

      {showConfirm && (
        <div className="modal">
          <p>Вы уверены, что хотите очистить историю?</p>
          <button onClick={confirmClearHistory}>✅ Да, очистить</button>
          <button onClick={() => setShowConfirm(false)}>❌ Отмена</button>
        </div>
      )}
    </div>
  );
}
