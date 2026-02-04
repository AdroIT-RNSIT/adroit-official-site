import { useEffect, useState } from "react";
import { getAll, saveAll } from "../assets/memberStore"

export default function useMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers(getAll());
  }, []);

  const create = (data) => {
    const newMember = {
      _id: crypto.randomUUID(),
      ...data
    };

    const updated = [...members, newMember];
    setMembers(updated);
    saveAll(updated);
  };

  const remove = (id) => {
    const updated = members.filter(m => m._id !== id);
    setMembers(updated);
    saveAll(updated);
  };

  const update = (id, data) => {
    const updated = members.map(m =>
      m._id === id ? { ...m, ...data } : m
    );
    setMembers(updated);
    saveAll(updated);
  };

  return { members, create, remove, update };
}
