import React from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white px-6 md:px-16 py-16 relative overflow-hidden">

      {/* Animated Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-cyan-500/10 blur-[140px] animate-float"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-96 h-96 bg-purple-500/10 blur-[140px] animate-float2"></div>

      {/* Heading */}
      <div className="text-center mb-14 opacity-0 animate-fadeIn">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Connect with AdroIT
        </h1>

        <p className="mt-4 text-gray-300 text-lg animate-slideIn">
          Let’s connect, collaborate, and build something amazing together.
        </p>
      </div>

      {/* Layout */}
      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

        {/* LEFT — FORM */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 transition-all duration-500 opacity-0 animate-riseUp">

          <h2 className="text-2xl font-semibold mb-6 text-cyan-400">
            Get in Touch
          </h2>

          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-cyan-400 focus:shadow-cyan-500/30 focus:shadow-md outline-none transition"
            />

            <input
              type="email"
              placeholder="Email ID"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-cyan-400 focus:shadow-cyan-500/30 focus:shadow-md outline-none transition"
            />

            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-cyan-400 focus:shadow-cyan-500/30 focus:shadow-md outline-none transition"
            />

            <textarea
              placeholder="Message"
              rows="4"
              className="w-full p-3 rounded-lg bg-white/10 border border-white/10 focus:border-cyan-400 focus:shadow-cyan-500/30 focus:shadow-md outline-none transition"
            ></textarea>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 font-semibold"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-500 opacity-0 animate-riseUp delay-200">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">
              Base Location
            </h3>
            <p className="text-gray-300">
              Computer Science Department <br />
              RNSIT, Bangalore, India
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-500 opacity-0 animate-riseUp delay-300">
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
              Contact Details
            </h3>
            <p className="text-gray-300">Email: adroit.rnsit@gmail.com</p>
            <p className="text-gray-300">Phone: Coming Soon</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-500 opacity-0 animate-riseUp delay-500">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">
              Social Network
            </h3>

            <div className="flex gap-6 text-2xl">
              <a href="https://github.com/AdroIT-RNSIT" target="_blank" rel="noreferrer" className="hover:text-cyan-400 hover:scale-125 transition">
                <FaGithub />
              </a>

              <a href="https://www.linkedin.com/company/adroit-rnsit/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 hover:scale-125 transition">
                <FaLinkedin />
              </a>

              <a href="https://www.instagram.com/adroit_rnsit/" target="_blank" rel="noreferrer" className="hover:text-pink-400 hover:scale-125 transition">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 1s ease forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        .animate-riseUp {
          animation: riseUp 0.9s ease forwards;
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-80px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes riseUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(25px); }
        }
        @keyframes float2 {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-25px); }
        }
      `}</style>
    </div>
  );
}
