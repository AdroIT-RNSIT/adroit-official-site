import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { registrationDomains } from "../data/domainRegistration";

const defaults = Object.fromEntries(registrationDomains.map((d) => [d.slug, Boolean(d.closed)]));
let latest = defaults;
let pending = null;

function load() {
  if (!supabase) return Promise.resolve(defaults);
  pending ||= supabase
    .from("registration_settings")
    .select("slug, closed")
    .then(({ data, error }) => {
      if (!error && data) {
        latest = { ...defaults, ...Object.fromEntries(data.map((row) => [row.slug, Boolean(row.closed)])) };
      }
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
