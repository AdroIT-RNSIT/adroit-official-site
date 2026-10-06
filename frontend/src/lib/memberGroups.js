import { useEffect, useState } from "react";
import { memberGroups as bundled } from "../data/members";

let latest = bundled;
let pending = null;

function load() {
  pending ||= fetch("/api/members")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (Array.isArray(data?.groups) && data.groups.length) latest = data.groups;
      return latest;
    })
    .catch(() => latest);
  return pending;
}

// Starts from the list bundled in code so the page renders instantly, then swaps in the admin-edited list.
export function useMemberGroups() {
  const [groups, setGroups] = useState(latest);

  useEffect(() => {
    let alive = true;
    load().then((next) => {
      if (alive) setGroups(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return groups;
}
