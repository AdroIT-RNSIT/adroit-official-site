import { useCallback, useEffect, useState } from "react";
import { registrationDomains } from "../data/domainRegistration";

const defaults = Object.fromEntries(registrationDomains.map((d) => [d.slug, Boolean(d.closed)]));
let latest = defaults;
let pending = null;

function load() {
  pending ||= fetch("/api/registration-status")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data?.closed) latest = { ...defaults, ...data.closed };
      return latest;
    })
    .catch(() => latest)
    .finally(() => {
      pending = null;
    });
  return pending;
}

export function useRegistrationClosed() {
  const [closed, setClosed] = useState(latest);

  useEffect(() => {
    let alive = true;
    load().then((next) => {
      if (alive) setClosed(next);
    });
    return () => {
      alive = false;
    };
  }, []);

  return useCallback((slug) => Boolean(closed[slug]), [closed]);
}
