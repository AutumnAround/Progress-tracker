import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [entries, setEntries] = useState<{ text: string; category: string }[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Общее");
  const [filter, setFilter] = useState("Все");

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const [deletedEntry, setDeletedEntry] = useState<{ text: string; category: string } | null>(null);
  const [deletedIndex, setDeletedIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const savedEntries = localStorage.getItem("progress");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const addEntry = () => {
    if (input.trim() === "") return;
  
    const newEntry = { text: input, category };
  
    if (editIndex !== null) {
      const updated = [...entries];
      updated[editIndex] = newEntry;
      setEntries(updated);
      localStorage.setItem("progress", JSON.stringify(updated));
      setEditIndex(null); // Сбрасываем
    } else {
      const updated = [newEntry, ...entries];
      setEntries(updated);
      localStorage.setItem("progress", JSON.stringify(updated));
    }
  
    setInput(""); 
    if (inputRef.current) inputRef.current.focus();
  };
  

  const deleteEntry = (index: number) => {
    const entryToDelete = entries[index];

    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));

    setDeletedEntry(entryToDelete);
    setDeletedIndex(index);
  };

  const undoDelete = () => {
    if (deletedEntry && deletedIndex !== null) {
      const updatedEntries = [...entries];
      updatedEntries.splice(deletedIndex, 0, deletedEntry); // Вставляем запись обратно
      setEntries(updatedEntries);
      localStorage.setItem("progress", JSON.stringify(updatedEntries));
    }

    setDeletedEntry(null);
    setDeletedIndex(null);
  };

  const startEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = (index: number) => {
    if (editText.trim() === "") return;
    const updatedEntries = [...entries];
    updatedEntries[index].text = editText;
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));
    setEditIndex(null);
  };

  const filteredEntries = filter === "Все" ? entries : entries.filter(entry => entry.category === filter);

  const categoryCounts = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        📌 Progress Tracker
      </motion.h1>
      {editIndex !== null && (
          <div className="edit-indicator">
            ✏️ <strong>Редактирование записи #{editIndex + 1}</strong>
          </div>
        )}

      <div className="input-container">
        <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Добавить запись..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Общее</option>
          <option>Учёба</option>
          <option>Работа</option>
          <option>Личное</option>
        </select>
        <motion.button onClick={addEntry} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          ➕ Добавить
        </motion.button>
      </div>

      <div className="filter-section">
        <label>Фильтр:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Все ({entries.length})</option>
          <option>Общее ({categoryCounts["Общее"] || 0})</option>
          <option>Учёба ({categoryCounts["Учёба"] || 0})</option>
          <option>Работа ({categoryCounts["Работа"] || 0})</option>
          <option>Личное ({categoryCounts["Личное"] || 0})</option>
        </select>
      </div>

      {deletedEntry && (
        <motion.div 
          className="undo-container"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <span>Удалена запись: [{deletedEntry.category}] {deletedEntry.text}</span>
          <motion.button onClick={undoDelete} className="undo-button">↩ Отмена удаления</motion.button>
        </motion.div>
      )}

      <motion.ul layout>
        <AnimatePresence>
          {filteredEntries.map((entry, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
              transition={{ duration: 0.3 }}
            >
              {editIndex === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(index)}
                  autoFocus
                />
              ) : (
                <>
                  <strong>[{entry.category}]</strong> {entry.text}
                  <motion.button className="edit" onClick={() => startEdit(index, entry.text)}>✏</motion.button>
                  <motion.button className="delete" onClick={() => deleteEntry(index)}>❌</motion.button>
                  <motion.button
                    className="edit"
                    onClick={() => {
                      setInput(entry.text);
                      setCategory(entry.category);
                      setEditIndex(index);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                  >
                    ✏️
                  </motion.button>
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
    
  );
  
}
