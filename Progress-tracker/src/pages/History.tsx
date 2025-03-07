import { useState, useEffect } from "react";

export default function History() {
  const [deletedEntries, setDeletedEntries] = useState<string[]>([]);
  const [entries, setEntries] = useState<string[]>([]);

  useEffect(() => {
    const savedDeleted = localStorage.getItem("deletedProgress");
    if (savedDeleted) {
      setDeletedEntries(JSON.parse(savedDeleted));
    }

    const savedEntries = localStorage.getItem("progress");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const restoreEntry = (index: number) => {
    const entryToRestore = deletedEntries[index];
    const updatedDeletedEntries = deletedEntries.filter((_, i) => i !== index);
    
    setEntries([entryToRestore, ...entries]);
    setDeletedEntries(updatedDeletedEntries);

    localStorage.setItem("progress", JSON.stringify([entryToRestore, ...entries]));
    localStorage.setItem("deletedProgress", JSON.stringify(updatedDeletedEntries));
  };

  const clearHistory = () => {
    setDeletedEntries([]); 
    localStorage.removeItem("deletedProgress"); 
  };

  return (
    <div>
      <h1>История удалённых записей</h1>
      {deletedEntries.length === 0 ? (
        <p>Нет удалённых записей.</p>
      ) : (
        <>
          <button className="clear-history" onClick={clearHistory}>
            🗑 Очистить Историю
          </button>
          <ul>
  {deletedEntries.map((entry, index) => (
    <li key={index}>
      {entry}
      <button className="restore" onClick={() => restoreEntry(index)}>♻️ Восстановить</button>
    </li>
  ))}
</ul>
        </>
      )}
    </div>
  );
}
