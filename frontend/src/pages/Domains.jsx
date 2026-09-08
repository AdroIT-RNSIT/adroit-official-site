import React, { useState } from 'react';
import { useSession } from '../lib/auth-client';
import { Brain, Cloud, ShieldCheck, BarChart3 } from 'lucide-react';

export default function Domains() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [activeDomain, setActiveDomain] = useState('ml');

  const domains = [
    {
      id: 'ml',
      name: 'Machine Learning',
      shortName: 'ML',
      icon: <Brain size={22} />,
      description: 'Build intelligent systems that learn, adapt, and make decisions from data.',
      longDescription: 'This domain focuses on learning the fundamentals of Machine Learning, including data preprocessing, feature engineering, and building predictive models. Members gain hands-on experience working with algorithms, training models, and evaluating their performance.',
      careerPaths: ['AI Engineer', 'ML Engineer', 'Data Scientist', 'Research Scientist', 'Computer Vision Engineer'],
      skills: ["Python", "NumPy", "Pandas", "TensorFlow", "PyTorch", "Scikit-learn", "Neural Networks", "Deep Learning", "Computer Vision", "Natural Language Processing (NLP)", "Reinforcement Learning", "Data Preprocessing"],
      tools: ["Jupyter Notebook", "Google Colab", "TensorFlow", "PyTorch", "Scikit-learn", "Kaggle", "MLflow", "Weights & Biases"],
      projects: [
        { name: 'Image Classifier', difficulty: 'Beginner' },
        { name: 'Sentiment Analysis', difficulty: 'Intermediate' },
        { name: 'Object Detection', difficulty: 'Advanced' },
        { name: 'Recommendation System', difficulty: 'Intermediate' }
      ],
      resources: [
        { title: 'ML Crash Course', type: 'Course', provider: 'Google' },
        { title: 'Deep Learning Specialization', type: 'Course', provider: 'Andrew Ng' },
        { title: 'Fast.ai', type: 'Course', provider: 'Jeremy Howard' }
      ],
      stats: { members: 17, projects: 4, events: 6, resources: 3 },
      leads: ['Prajwal Jagadeesh'],
      roadmap: ["Python", "Math for ML", "Data Preprocessing", "ML Algorithms", "Model Evaluation", "Deep Learning", "Computer Vision", "NLP"]
    },
    {
      id: 'cc',
      name: 'Cloud Computing',
      shortName: 'Cloud',
      icon: <Cloud size={22} />,
      description: 'Design, deploy, and scale applications on world-class cloud infrastructure.',
      longDescription: 'This domain focuses on understanding how networking works and the fundamentals of cloud computing. Members then progress to deploying applications in production environments and working with virtual machines (VMs) to gain practical, real-world experience',
      careerPaths: ['Cloud Architect', 'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Developer', 'Platform Engineer'],
      skills: ['Linux', 'Networking', 'AWS', 'Azure', 'GCP', 'Docker', 'Virtual machine', 'Terraform', 'CI/CD', 'Serverless'],
      tools: ['AWS Console', 'Azure Portal', 'Google Cloud Console', 'Docker', 'Kubernetes', 'GitHub Actions', 'NGINX', 'Apache', 'Amazon S3', 'Firebase'],
      projects: [
        { name: 'Club website', difficulty: 'Intermediate' },
      ],
      resources: [
        { title: 'AWS Training', type: 'Certification', provider: 'Amazon' },
        { title: 'Kubernetes Basics', type: 'Course', provider: 'Google' },
        { title: 'DevOps Roadmap', type: 'Guide', provider: 'Community' }
      ],
      stats: { members: 13, projects: 1, events: 0, resources: 2 },
      leads: ['Praveen Kumar M'],
      roadmap: ['Networking Fundamentals', 'Linux Essentials', 'One Cloud Platform (AWS/GCP)', 'Docker', 'Deployment', 'Terraform', 'CI/CD', 'Monitoring & Scaling']
    },
    {
      id: 'cy',
      name: 'Cybersecurity',
      shortName: 'Cyber',
      icon: <ShieldCheck size={22} />,
      description: 'Protect systems, networks, and data from evolving cyber threats.',
      longDescription: 'This domain focuses on understanding how systems, networks, and applications can be secured against cyber threats. Members learn the fundamentals of cybersecurity, including ethical hacking concepts, cryptography basics, and security practices used to protect digital systems and data.',
      careerPaths: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'SOC Analyst', 'Cryptographer'],
      skills: ['Network Security', 'Ethical Hacking', 'Cryptography', 'Incident Response', 'Risk Assessment', 'Forensics'],
      tools: ['Kali Linux', 'Wireshark', 'Metasploit', 'Burp Suite', 'Nmap', 'John the Ripper', "Hashcat", "OWASP ZAP"],
      projects: [
        { name: 'Network Scanner', difficulty: 'Beginner' },
        { name: 'Password Cracker', difficulty: 'Intermediate' },
        { name: 'Web App Pentest', difficulty: 'Advanced' },
        { name: 'Security Audit', difficulty: 'Intermediate' }
      ],
      resources: [
        { title: 'TryHackMe', type: 'Platform', provider: 'Community' },
        { title: 'Cybersecurity Basics', type: 'Course', provider: 'Coursera' },
        { title: 'OWASP Top 10', type: 'Guide', provider: 'OWASP' }
      ],
      stats: { members: 12, projects: 4, events: 3, resources: 3 },
      leads: ['Sanjay N'],
      roadmap: ['Networking', 'Operating Systems', 'Security Fundamentals', 'Ethical Hacking', 'Specialization']
    },
    {
      id: 'da',
      name: 'Data Analytics',
      shortName: 'DA',
      icon: <BarChart3 size={22} />,
      description: 'Extract actionable insights from complex datasets to drive decisions.',
      longDescription: 'Data Analytics transforms raw data into meaningful insights. Master data visualization, statistical analysis, and business intelligence to become a data-driven decision maker.',
      careerPaths: ['Data Analyst', 'Business Intelligence Analyst', 'Data Engineer', 'Analytics Manager', 'BI Developer'],
      skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Data Visualization'],
      tools: ['PostgreSQL', 'MySQL', 'Tableau', 'Power BI', 'Pandas', 'Matplotlib', 'Looker'],
      projects: [
        { name: 'Sales Dashboard', difficulty: 'Beginner' },
        { name: 'Customer Segmentation', difficulty: 'Intermediate' },
        { name: 'Predictive Analytics', difficulty: 'Advanced' },
        { name: 'ETL Pipeline', difficulty: 'Intermediate' }
      ],
      resources: [
        { title: 'SQL for Data Science', type: 'Course', provider: 'Coursera' },
        { title: 'Python Data Analysis', type: 'Course', provider: 'DataCamp' },
        { title: 'Tableau Public', type: 'Tool', provider: 'Salesforce' }
      ],
      stats: { members: 15, projects: 4, events: 5, resources: 3 },
      leads: ['Jaishnav'],
      roadmap: ['Excel Basics', 'SQL Mastery', 'Python/R', 'Visualization', 'Advanced Analytics']
    }
  ];

  const currentDomain = domains.find(d => d.id === activeDomain) || domains[0];

  return (
    <div className="min-h-screen bg-bg-base py-10 sm:py-14">
      <div className="page-wrap">
        <div className="mb-10">
          <div className="badge mb-4">AdroIT Knowledge Hub</div>
          <h1 className="section-title">Technical Domains</h1>
          <p className="section-lead">
            Master the four pillars of modern technology with our comprehensive learning paths,
            <span className="text-text-primary"> hands-on projects</span>, and
            <span className="text-text-primary"> expert mentorship</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-8 max-w-full">
            <div className="badge">4 Core Domains</div>
            <div className="badge">10+ Projects</div>
            <div className="badge">100+ Members in community</div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
          {domains.map((domain) => (
            <button
              key={domain.id}
              type="button"
              onClick={() => setActiveDomain(domain.id)}
              className={`btn shrink-0 ${
                activeDomain === domain.id ? "btn-primary" : "btn-secondary"
              }`}
            >
              {domain.icon}
              {domain.name}
            </button>
          ))}
        </div>

        <div className="card p-5 sm:p-8 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-accent-primary">{currentDomain.icon}</span>
                <h2 className="text-2xl font-bold text-text-primary">{currentDomain.name}</h2>
                <span className="badge">{currentDomain.shortName}</span>
              </div>
              <p className="text-text-body">{currentDomain.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-bg-base border border-border-subtle p-3">
                <div className="text-xl font-bold text-accent-primary">{currentDomain.stats.members}</div>
                <div className="text-xs text-text-muted">Members</div>
              </div>
              <div className="rounded-lg bg-bg-base border border-border-subtle p-3">
                <div className="text-xl font-bold text-accent-primary">{currentDomain.stats.projects}</div>
                <div className="text-xs text-text-muted">Projects</div>
              </div>
              <div className="rounded-lg bg-bg-base border border-border-subtle p-3">
                <div className="text-xl font-bold text-accent-primary">{currentDomain.stats.resources}</div>
                <div className="text-xs text-text-muted">Resources</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-2">About This Domain</h3>
              <p className="text-sm text-text-body leading-relaxed">{currentDomain.longDescription}</p>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Career Paths</h3>
              <ul className="space-y-2 text-sm text-text-body">
                {currentDomain.careerPaths.map((career) => (
                  <li key={career}>{career}</li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Domain Lead</h3>
              {currentDomain.leads.map((lead) => (
                <p key={lead} className="text-sm font-medium text-text-primary">{lead}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Skills to Master</h3>
              <div className="flex flex-wrap gap-2">
                {currentDomain.skills.map((skill) => (
                  <span key={skill} className="badge">{skill}</span>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Popular Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {currentDomain.tools.map((tool) => (
                  <span key={tool} className="text-xs text-text-body p-2 rounded-lg bg-bg-base">{tool}</span>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Sample Projects</h3>
              <ul className="space-y-3">
                {currentDomain.projects.map((project) => (
                  <li key={project.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-text-primary">{project.name}</span>
                    <span className="badge text-xs">{project.difficulty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-4">Learning Roadmap</h3>
              <ol className="space-y-3">
                {currentDomain.roadmap.map((step, idx) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="font-mono text-accent-primary">{idx + 1}</span>
                    <span className="text-text-primary font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-text-primary mb-3">Recommended Resources</h3>
              <div className="space-y-3">
                {currentDomain.resources.map((resource) => (
                  <div key={resource.title} className="p-3 rounded-lg bg-bg-base">
                    <div className="text-sm font-medium text-text-primary">{resource.title}</div>
                    <div className="text-xs text-text-muted mt-1">{resource.type} • {resource.provider}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-sm text-text-muted border border-border-subtle rounded-xl px-4 py-3">
                Become a member to get access to more resources
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5 overflow-x-auto">
          <h3 className="font-semibold text-text-primary mb-4">Domain Comparison</h3>
          <table className="w-full text-sm min-w-[32rem]">
            <thead>
              <tr className="border-b border-border-subtle text-left text-text-muted">
                <th className="py-3 pr-3 font-medium">Domain</th>
                <th className="py-3 pr-3 font-medium">Members</th>
                <th className="py-3 pr-3 font-medium">Projects</th>
                <th className="py-3 pr-3 font-medium">Resources</th>
                <th className="py-3 font-medium">Lead</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((domain) => (
                <tr
                  key={domain.id}
                  className={`border-b border-border-subtle cursor-pointer ${activeDomain === domain.id ? "bg-accent-primary-tint" : ""}`}
                  onClick={() => setActiveDomain(domain.id)}
                >
                  <td className="py-3 pr-3 font-medium text-text-primary">{domain.name}</td>
                  <td className="py-3 pr-3 text-text-body">{domain.stats.members}</td>
                  <td className="py-3 pr-3 text-text-body">{domain.stats.projects}</td>
                  <td className="py-3 pr-3 text-text-body">{domain.stats.resources}</td>
                  <td className="py-3 text-text-body">{domain.leads[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
