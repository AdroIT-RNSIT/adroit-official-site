export const registrationDomains = [
  {
    slug: "machine-learning",
    title: "Machine Learning",
    label: "Technical",
    description: "Build intelligent systems that learn from data. Dive into neural networks, computer vision, and NLP.",
    whatsapp: "https://chat.whatsapp.com/EadapPb17111goHGOtWCEK",
  },
  {
    slug: "cloud-computing",
    title: "Cloud Computing",
    label: "Technical",
    description: "Design and deploy scalable applications on AWS, Azure, and GCP. Master Docker and Kubernetes.",
    whatsapp: "https://chat.whatsapp.com/ER8Gziquf8v2EvAXmiFDbt",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    label: "Technical",
    description: "Protect systems from threats. Learn ethical hacking, network security, and cryptography.",
    whatsapp: "https://chat.whatsapp.com/KqKSXPEhPQk0YHVYpjOE2F",
  },
  {
    slug: "data-analytics",
    title: "Data Analytics",
    label: "Technical",
    description: "Extract insights from data. Master visualization, SQL, Python, and business intelligence.",
    closed: true,
  },
  {
    slug: "non-tech",
    title: "Non-Tech",
    label: "Non-Tech",
    description: "Events, social media, marketing, and outreach that keep the club visible and moving.",
  },
];

export function findRegistrationDomain(slug) {
  return registrationDomains.find((domain) => domain.slug === slug) || null;
}
