import { useState } from "react";
import { Mail, MapPin, Send, Clock, ExternalLink } from "lucide-react";

const CONTACT_EMAIL = "adroit.rnsit@gmail.com";
const CAMPUS_MAP =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3519.4201134668556!2d77.51600707454556!3d12.902195416397204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3fa747acf84b%3A0x97a5cf1952c2fe3a!2sRNSIT%20CSE%20Department!5e1!3m2!1sen!2sin!4v1770548920832!5m2!1sen!2sin";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.website) {
      setLoading(false);
      setMessage({ type: "success", text: "Message sent. We'll get back to you soon." });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      _replyto: formData.email.trim(),
      _subject: `AdroIT contact: ${formData.subject.trim()}`,
      _template: "table",
      _captcha: "false",
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false" || data.success === false) {
        throw new Error(data.message || "Failed to send message");
      }

      setFormData({ name: "", email: "", subject: "", message: "", website: "" });
      setMessage({
        type: "success",
        text: "Message sent. We'll get back to you soon.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-x-clip px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-sm tracking-widest uppercase text-sky-800">
            Contact
          </span>
          <h1 className="fluid-h2 mt-3 mb-3 font-bold text-slate-900">
            Get in touch
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Questions about events, domains, or joining the club — send a note and we’ll reply on weekdays.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-6 flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            <p>{message.text}</p>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="shrink-0 text-current/60 hover:text-current"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <section className="rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
            <h2 className="mb-6 text-lg font-semibold text-slate-900">Send a message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="Workshop, membership, collaboration…"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={`${fieldClass} resize-y min-h-[8.5rem]`}
                  placeholder="How can we help?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-sky-900/15 transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[10.5rem]"
              >
                {loading ? (
                  "Sending…"
                ) : (
                  <>
                    Send message
                    <Send size={16} strokeWidth={2} />
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm shadow-slate-900/5">
              <div className="relative h-52 sm:h-60">
                <iframe
                  src={CAMPUS_MAP}
                  title="RNSIT CSE Department"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.google.com/?q=RNSIT+CSE+Department+Bangalore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 border-t border-slate-200/80 px-5 py-3 text-sm font-medium text-sky-800 hover:bg-slate-50"
              >
                Open campus map
                <ExternalLink size={14} strokeWidth={2} />
              </a>
            </div>

            <ul className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm shadow-slate-900/5">
              <li className="flex gap-3 border-b border-slate-100 pb-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Campus</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                    Department of CSE, RNS Institute of Technology, Bengaluru
                  </p>
                </div>
              </li>
              <li className="flex gap-3 border-b border-slate-100 py-4">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Email</p>
                  <a
                    href="mailto:adroit.rnsit@gmail.com"
                    className="mt-0.5 block text-sm text-sky-800 hover:underline"
                  >
                    adroit.rnsit@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-3 pt-4">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" strokeWidth={2} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Reply time</p>
                  <p className="mt-0.5 text-sm text-slate-600">Weekdays, usually within 24–48 hours</p>
                </div>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
