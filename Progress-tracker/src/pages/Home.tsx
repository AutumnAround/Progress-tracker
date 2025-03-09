import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [entries, setEntries] = useState<{ text: string; category: string }[]>([]);
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Общее");
  const [filter, setFilter] = useState("Все");

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
    <div>
      <h1>📌 Progress Tracker</h1>

      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Добавить запись..." />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Общее</option>
        <option>Учёба</option>
        <option>Работа</option>
        <option>Личное</option>
      </select>
      <button onClick={addEntry}>➕ Добавить</button>

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
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <strong>[{entry.category}]</strong> {entry.text}
              <button className="delete" onClick={() => deleteEntry(index)}>❌</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
}
