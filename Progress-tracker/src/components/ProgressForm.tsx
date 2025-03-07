import { useState } from "react";

export default function ProgressForm({ onAdd }: { onAdd: (entry: string) => void }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(input);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите новую запись..."
      />
      <button type="submit">Добавить</button>
    </form>
  );
}
