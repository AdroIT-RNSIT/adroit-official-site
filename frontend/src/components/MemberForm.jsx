import { useState } from "react";

export default function MemberForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name });
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10"
    >
      <input
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
        placeholder="Enter member name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 rounded-lg transition">
        Add
      </button>
    </form>
  );
}
