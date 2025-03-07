import { useState, useEffect } from "react";
import ProgressForm from "../components/ProgressForm";

export default function Home() {
  const [entries, setEntries] = useState<string[]>([]);
  const [deletedEntries, setDeletedEntries] = useState<string[]>([]);

  useEffect(() => {
    const savedEntries = localStorage.getItem("progress");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    const savedDeleted = localStorage.getItem("deletedProgress");
    if (savedDeleted) {
      setDeletedEntries(JSON.parse(savedDeleted));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("progress", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("deletedProgress", JSON.stringify(deletedEntries));
  }, [deletedEntries]);

  const addEntry = (newEntry: string) => {
    setEntries([newEntry, ...entries]);
  };

  const deleteEntry = (index: number) => {
    const entryToDelete = entries[index];
    setDeletedEntries([entryToDelete, ...deletedEntries]);
    setEntries(entries.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h1>Прогресс-трекер</h1>
      <ProgressForm onAdd={addEntry} />
      <ul>
  {entries.map((entry, index) => (
    <li key={index}>
      {entry}
      <button className="delete" onClick={() => deleteEntry(index)}>❌</button>
    </li>
  ))}
</ul>
    </div>
  );
}
