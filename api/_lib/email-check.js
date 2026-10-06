import { Resolver } from "node:dns/promises";

const DISPOSABLE = new Set([
  "10minutemail.com",
  "10minutemail.net",
  "1secmail.com",
  "1secmail.net",
  "burnermail.io",
  "crazymailing.com",
  "discard.email",
  "dispostable.com",
  "emailfake.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getairmail.com",
  "getnada.com",
  "grr.la",
  "guerrillamail.com",
  "guerrillamail.net",
  "guerrillamailblock.com",
  "inboxkitten.com",
  "mail.tm",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mailpoof.com",
  "mintemail.com",
  "moakt.com",
  "mohmal.com",
  "mytemp.email",
  "nada.email",
  "sharklasers.com",
  "spamgourmet.com",
  "temp-mail.io",
  "temp-mail.org",
  "tempinbox.com",
  "tempmail.com",
  "tempmail.net",
  "tempmailo.com",
  "tempr.email",
  "throwawaymail.com",
  "trashmail.com",
  "trashmail.de",
  "yopmail.com",
  "yopmail.net",
]);

// Answers that prove the domain doesn't exist or has no mail servers. Anything else
// (timeouts, resolver outages) lets the message through so real people are never blocked by DNS trouble.
const NO_MAIL_CODES = new Set(["ENOTFOUND", "ENODATA"]);
const CACHE_LIMIT = 500;

const resolver = new Resolver({ timeout: 2500, tries: 1 });
const cache = new Map();

const isDisposable = (domain) => {
  const parts = domain.split(".");
  return parts.some((_, i) => DISPOSABLE.has(parts.slice(i).join(".")));
};

async function acceptsMail(domain) {
  if (cache.has(domain)) return cache.get(domain);
  let accepts;
  try {
    const records = await resolver.resolveMx(domain);
    // A lone "." MX record (RFC 7505) means the domain explicitly refuses mail.
    accepts = records.some((r) => r.exchange && r.exchange !== ".");
  } catch (err) {
    if (!NO_MAIL_CODES.has(err?.code)) return true;
    accepts = false;
  }
  if (cache.size >= CACHE_LIMIT) cache.clear();
  cache.set(domain, accepts);
  return accepts;
}

// Returns a message explaining why the address can't be used, or null if it looks deliverable.
export async function checkEmail(email) {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  if (isDisposable(domain)) {
    return "Please use your regular email address. We can't reply to temporary inboxes.";
  }
  if (!(await acceptsMail(domain))) {
    return `“${domain}” can't receive email. Check your address for typos.`;
  }
  return null;
}
