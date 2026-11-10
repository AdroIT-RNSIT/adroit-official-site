# AdroIT recruitment registration

Public page: `/recruitment`. Admin: `/dashboard/admin69` → **Recruitment** (uses the existing admin login).

## Policies (decided defaults)

- **One active registration per USN, and one per phone number.** Both are enforced by unique MongoDB indexes
  on active (`REGISTERED`) records, so concurrent submissions can't both succeed. A second attempt with the same
  USN gets "A registration already exists for this USN". A reused phone number gets a generic message that
  doesn't confirm whose number it is.
- **Corrections go through admins**, not a second registration: admin69 → Recruitment → Registrations → open a
  record → Edit. Edits are validated with the same rules and written to the audit log.
- **Withdrawing**: set the status to *Withdrawn*. The record is kept but no longer counted, and it no longer
  blocks that USN or phone from registering again.
- **Technical route**: exactly two different technical domains (1st and 2nd, both required). The optional 3rd
  preference can only be Non-Tech.
- **Non-Tech only route**: stored as `registrationType: "NON_TECH_ONLY"` with no preferences, and never counted
  as a technical applicant or included in technical exports. A student can't be on both routes (one USN).
- **Eligibility**: CSE only (enforced on the server), First Year (semesters 1–2) or Second Year (3–4). Years,
  sections, domain names, descriptions and targets are editable in Settings; domain IDs live in
  `api/_lib/recruitment-config.js` and must not be renamed once registrations exist.
- **Nobody's choices are changed automatically.** Low-interest domains are only highlighted for admins.

## How registration availability works

Registration is open only when the admin switch is on **and** the server time is on or after the opening time
(if set) **and** before the closing time (if set). This is checked on every submission, so calling the API
directly doesn't bypass it. Admins enter times in IST; they're stored as UTC instants and shown in IST
(`Asia/Kolkata`). Closing registration never deletes records.

The public config (`GET /api/recruitment/config`) can be cached by Vercel's CDN for 5 seconds; browsers always
revalidate. Submissions always read the current settings.

## API

| Method | Path | Who |
|---|---|---|
| GET | `/api/recruitment/config` | Public: safe settings and availability |
| POST | `/api/recruitment/register` | Public: create a registration |
| GET | `/api/admin69/recruitment/analytics` | Admin |
| GET | `/api/admin69/recruitment/registrations?…filters` | Admin, paginated |
| GET / PATCH / DELETE | `/api/admin69/recruitment/registrations/:registrationId` | Admin (DELETE needs `{ "confirm": "<id>" }`) |
| GET / PATCH | `/api/admin69/recruitment/settings` | Admin |
| GET | `/api/admin69/recruitment/export?report=…` | Admin, returns a `.docx` |
| GET | `/api/admin69/recruitment/audit-logs?page=` | Admin |

All of these are served by **one** Vercel function, `api/recruitment.js`, through rewrites in `vercel.json`.
The project now has 12 functions, which is the Hobby plan limit; add new endpoints to an existing function
(or upgrade) rather than adding files under `api/`.

Admin requests need the `adroit_admin` cookie (HttpOnly, SameSite=Strict, scoped to `/api/admin69`). Writes
also need `Content-Type: application/json` and a same-origin `Origin`, which blocks cross-site requests.

### Export reports (`report=`)

`all` (includes withdrawn), `technical`, `non-tech-only`, `first-year`, `second-year`, `non-tech-optional`,
`domain&domain=<ID>` (1st or 2nd preference, each student once), `first-preference&domain=<ID>`,
`second-preference&domain=<ID>`, and `filtered` with the same filters as the registrations list. Every report
except `all` and `filtered` covers active registrations only. Files are named like
`AdroIT_Cloud_Computing_Applicants_2026-10-21.docx`, and the `X-Record-Count` response header gives the row count.

## Data (MongoDB, database `MONGODB_DB`, default `adroit`)

- `recruitment_registrations`: one document per registration (`registrationId`, `fullName`, `usn`, `branch`,
  `academicYear`, `semester`, `section`, `phoneNumber`, `githubProfile`, `registrationType`,
  `preferences { first, second, third }`, `status`, `createdAt`, `updatedAt`). The collection has a
  `$jsonSchema` validator (additional properties rejected) and unique indexes `usn_active_unique`,
  `phone_active_unique` (both partial on `status: "REGISTERED"`) and `registration_id_unique`, plus indexes for
  the filters. These are created automatically on the first request after each deploy; registration fails
  closed if they can't be created. Updating the validator on an existing collection needs the `collMod`
  privilege (Atlas `dbAdmin`); without it the server-side validation still applies.
- `recruitment_settings`: a single document `_id: "current"`.
- `recruitment_audit`: admin actions (`at`, `action`, `session`, `target`, `changes`). Phone numbers are masked.
- `recruitment_rate`: hashed client IPs and timestamps for rate limiting, deleted automatically after 24 hours.

## Spam and abuse controls

- Server-side validation and normalisation of every field; unknown fields are rejected.
- Unique indexes for duplicates (not just front-end checks).
- Rate limits shared across serverless instances through MongoDB: at most 10 submissions per IP per 10 minutes,
  and 15 failed submissions per IP per hour; then `429` with `Retry-After`. IPs are stored only as keyed hashes.
- Honeypot field (`website`): filled-in submissions are rejected and logged without personal data.
- Optional Cloudflare Turnstile: set both `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` and the widget appears
  on the review step; tokens are verified on the server.
- 4 KB request limit for submissions (32 KB for admin writes). Errors never include stack traces or database
  details.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI`, `MONGODB_DB` | yes | Already used by the site. |
| `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` | yes, for admin | Already used; generate with `npm run admin:password`. |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | optional | Both needed to turn CAPTCHA on. Server-only; never prefix with `VITE_`. |
| `RECRUITMENT_RATE_SECRET` | optional | Key for hashing IPs; falls back to `ADMIN_SESSION_SECRET`. |

## Deploying

1. Add any optional variables in Vercel → Settings → Environment Variables (Production and Preview).
2. Deploy. `npm install` at the repo root installs `docx` for the export function.
3. Sign in to admin69 → Recruitment → Settings: set the deadline, recruitment date, venue, sections and targets,
   then **Open registration**.
4. Open `/recruitment` on the deployed site and check the status, then submit one real test registration and
   delete it from the admin table afterwards.

## Retention and deletion

Keep records only for the recruitment cycle. After results are announced, export what the team needs, then delete
the records (admin table → open a record → Delete, or ask a maintainer to clear the collection). Every deletion is
audit-logged. Rate-limit entries delete themselves after 24 hours. Don't copy exports to public drives; they
contain phone numbers.

## Tests

```bash
npm run test:recruitment                     # unit tests only
RECRUITMENT_TEST_MONGODB_URI=mongodb://127.0.0.1:27099 npm run test:recruitment   # plus API integration tests
```

The integration tests refuse to run against anything but a local `mongodb://127.0.0.1` or `localhost` URI, use
a throwaway database and drop it afterwards. A quick way to get one: `docker run --rm -d -p 127.0.0.1:27099:27017 mongo:7`.
