import React, { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import Reveal from "../components/Reveal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });

      setMessage({
        type: "success",
        text: "Message sent successfully! We'll get back to you soon."
      });

    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Something went wrong. Please try again."
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base px-4 py-12 sm:py-16">
      <div className="page-wrap max-w-5xl">
        <Reveal className="mb-10">
          <div className="badge mb-4">Get in Touch</div>
          <h1 className="section-title">Connect with AdroIT</h1>
          <p className="section-lead">
            Let's connect, collaborate, and build something amazing together.
          </p>
        </Reveal>

        {message.text && (
          <div
            className={`form-message-enter mb-6 p-4 rounded-xl border text-sm flex items-center justify-between ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span>{message.text}</span>
            <button
              type="button"
              onClick={() => setMessage({ type: "", text: "" })}
              className="inline-flex items-center justify-center w-11 h-11"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <Reveal delay={80}>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="card p-5 sm:p-8">
            <h2 className="text-xl font-bold text-text-primary mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="field-label">
                  Your Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="field-label">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="subject" className="field-label">
                  Subject <span className="text-red-600">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Workshop Inquiry"
                />
              </div>
              <div>
                <label htmlFor="message" className="field-label">
                  Message <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Tell us about your query..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-1">Base Location</h3>
              <p className="text-sm text-text-body">
                Computer Science Department<br />
                RNSIT, Bangalore, India
              </p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-1">Contact Details</h3>
              <p className="text-sm text-text-body">
                <a href="mailto:adroit.rnsit@gmail.com" className="hover:text-accent-primary">
                  adroit.rnsit@gmail.com
                </a>
              </p>
              <p className="text-text-muted text-xs mt-1">Phone: Coming Soon</p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-1">Social Network</h3>
              <p className="text-sm text-text-body mb-4">Follow us for updates and events</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/AdroIT-RNSIT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border-subtle text-text-body hover:text-accent-primary"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/adroit-rnsit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border-subtle text-text-body hover:text-accent-primary"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/adroit_rnsit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-border-subtle text-text-body hover:text-accent-primary"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="card p-5">
              <h4 className="text-sm font-semibold text-text-primary mb-1">Quick Response</h4>
              <p className="text-text-muted text-xs">
                We typically respond within 24-48 hours on weekdays.
              </p>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </div>
  );
}
