const KEY = "club_members";

export function getAll() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveAll(members) {
  localStorage.setItem(KEY, JSON.stringify(members));
}
