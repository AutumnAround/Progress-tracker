import { useState, useEffect, useRef } from "react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [entries, setEntries] = useState<{ text: string; category: string }[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Общее");
  const [filter, setFilter] = useState("Все");

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
    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));
    setInput(""); 

    if (inputRef.current) {
      inputRef.current.focus(); 
    }
  };

  const deleteEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    const deletedItem = entries[index];

    setEntries(updatedEntries);
    localStorage.setItem("progress", JSON.stringify(updatedEntries));

    const deletedHistory = JSON.parse(localStorage.getItem("deleted") || "[]");
    deletedHistory.push(deletedItem);
    localStorage.setItem("deleted", JSON.stringify(deletedHistory));
  };

  const filteredEntries = filter === "Все" ? entries : entries.filter(entry => entry.category === filter);

  const categoryCounts = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container">  

        <motion.h1
          initial={{ opacity: 0, y: -20 }}  
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.8 }}  
        >
          📌 Progress Tracker
        </motion.h1>

      <div className="input-container">
        <input
          ref={inputRef} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Добавить запись..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Общее</option>
          <option>Учёба</option>
          <option>Работа</option>
          <option>Личное</option>
        </select>
        <motion.button
          onClick={addEntry}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}  >
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

      <motion.ul layout>
        <AnimatePresence>
          {filteredEntries.map((entry, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <strong>[{entry.category}]</strong> {entry.text}
              <motion.button
                className="delete"
                onClick={() => deleteEntry(index)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                ❌
              </motion.button>

            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
