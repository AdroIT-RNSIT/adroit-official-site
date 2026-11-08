import { useCallback } from "react";
import { registrationDomains } from "../data/domainRegistration";

const closed = Object.fromEntries(registrationDomains.map((d) => [d.slug, Boolean(d.closed)]));

export function useRegistrationClosed() {
  return useCallback((slug) => Boolean(closed[slug]), []);
}
