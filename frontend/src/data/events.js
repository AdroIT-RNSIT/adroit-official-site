export const sharedEvents = [
  {
    _id: "1",
    title: "Capture The Flag",
    description: "Operation Code Heist is an inter-collegiate cybersecurity competition built around a cyber-heist theme. Teams navigate six rounds, racing to crack the heist on a live scoring leaderboard.",
    date: "2026-09-17T05:00:00Z",
    location: "Main Auditorium",
    registrationCost: { ieee: 250, nonIeee: 300 },
    rules: [
      "Teams of 4; two structured 3-hour sessions with a lunch break in between (total event duration 8.5 hours).",
      "Levels unlock sequentially - a level becomes accessible only after the previous one is solved. No separate time limit per level, only the overall event duration.",
      "No flag-sharing between teams, and no attacking other teams' systems or the competition infrastructure - testing is authorised only within the provided environment.",
      "Standard cybersecurity tools and public documentation are permitted (e.g. Wireshark, Burp Suite, Ghidra, CyberChef, Hydra, Nmap - full suggested list shared at the briefing).",
      "Flags must be submitted through the official CTF platform before the scheduled end time - no extensions will be given.",
      "Final rankings are based on the official leaderboard: flags solved and time taken. Organisers'/judges' decisions on violations and scoring are final."
    ]
  },
  {
    _id: "2",
    title: "Tech Auction",
    description: "Tech Auction is a team-based technical strategy event that combines bidding, decision-making, and innovation. Teams start with a fixed amount of virtual currency (CHIPS) and bid for technologies - AI systems, frameworks, databases, hardware, and more. After the auction, teams must build a working prototype using only the technologies they've acquired, based on a problem statement revealed before bidding begins.",
    date:"2026-09-18T05:00:00Z",
    location: "IT Block Edusat Hall",
    registrationCost: { ieee: 200, nonIeee: 250 },
    rules: [
      "Every team starts with an equal amount of CHIPS - no borrowing or transferring CHIPS between teams.",
      "A team may bid only if it has sufficient CHIPS; only two teams can be in a bidding war at once.",
      "Once a bid is accepted, it cannot be withdrawn. No communication with other teams during active bidding.",
      "The auctioneer's decision on bid validity is final.",
      "The final solution must meaningfully use the technologies acquired during the auction.",
      "AI/vibe-coding tools (ChatGPT, Gemini, Claude, Perplexity, or others) are allowed while building.",
      "No plagiarism and no pre-built/previously developed projects as the final submission.",
      "Only registered team members may work on the solution; no outside technical assistance."
    ]
  },
  {
    _id: "3",
    title: "AI Film Making",
    description: "The AI Film Making Challenge is a creative event where teams use Artificial Intelligence tools to script, generate, and edit a short film based on a theme revealed only after the event begins - so every team starts on equal footing. The event is presented in association with Who VR and is designed to test creativity, storytelling, teamwork, and effective use of AI tools under time pressure.",
    date:"2026-09-18T05:00:00Z",
    location: "IT Block",
    registrationCost: { all: 100 },
    rules: [
      "Teams of 3 participants each.",
      "The theme is revealed only after the event starts - no pre-made or pre-prepared footage related to the theme may be used.",
      "Teams get a 2-hour window to script, generate, and edit their film using AI and/or conventional tools.",
      "Final films must be submitted within the given submission window (10-20 minutes); late submissions may be penalised or disqualified.",
      "The submission must be an original piece of work created during the event - no plagiarism or reuse of pre-existing content.",
      "Content must not be obscene, anti-religious, anti-national, or discriminatory in any way; violations lead to immediate disqualification.",
      "Judged on creativity & originality, interpretation of theme, storytelling, execution, and overall impact."
    ]
  }
];
