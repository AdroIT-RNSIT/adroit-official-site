import { Brain, Cloud, Shield, BarChart3, User, Megaphone } from "lucide-react";
import { cloudinaryUrl } from "../lib/cloudinaryUrl";
import { memberGroups } from "../data/members";

export default function Members() {
  const getCloudinaryUrl = (publicId, width = 100, height = 100) =>
    cloudinaryUrl(publicId, { width, height }) ||
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

  return (
    <div className="min-h-dvh bg-[#ffffff] text-slate-900 font-sans overflow-x-clip pt-8 pb-16 dark:bg-[#000000] dark:text-slate-100">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="fluid-h1 font-extrabold mb-4">
            <span className="text-sky-800">All Members</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with everyone in the AdroIT community
          </p>
        </div>

        <div className="space-y-12">
          {memberGroups.map((group) => (
            <section key={group.id}>
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">{group.name}</h2>
                <p className="text-sm text-slate-500">{group.members.length} members</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {group.members.map((member) => (
                  <MemberCard
                    key={`${group.id}-${member.name}`}
                    member={{ ...member, domain: group.id }}
                    getCloudinaryUrl={getCloudinaryUrl}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

// ============================================
// MEMBER CARD COMPONENT - COMPACT DIRECTORY STYLE
// ============================================
function MemberCard({ member, getCloudinaryUrl }) {
  const domainColors = {
    ml: 'from-cyan-500 to-cyan-600',
    cc: 'from-purple-500 to-purple-600',
    cy: 'from-pink-500 to-pink-600',
    da: 'from-green-500 to-green-600',
    nt: 'from-amber-500 to-amber-600',
  };

  const domainIcons = {
    ml: Brain,
    cc: Cloud,
    cy: Shield,
    da: BarChart3,
    nt: Megaphone,
  };

  const domain = member.domain || 'ml';
  const color = domainColors[domain] || 'from-gray-500 to-gray-600';
  const DomainIcon = domainIcons[domain] || User;

  // Role badge color
  const getRoleBadgeColor = (role) => {
    if (role === 'President' || role === 'Vice President') return 'bg-yellow-500/20 text-yellow-400';
    if (role === 'Domain Lead') return 'bg-sky-600/15 text-sky-700';
    if (role === 'Core Member') return 'bg-blue-500/20 text-blue-400';
    if (role === 'Member') return 'bg-gray-500/20 text-slate-600';
    return 'bg-gray-500/20 text-slate-600';
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-lg p-3 md:transition-transform md:duration-200 md:hover:-translate-y-1 md:hover:border-sky-600/30">
      
      <div className="relative">
        
        {/* Avatar */}
        <div className="relative w-14 h-14 mx-auto mb-2">
          <div className={`absolute inset-0 hidden rounded-lg bg-gradient-to-br ${color} opacity-50 blur-md md:block`}></div>
          
          {member.imagePublicId ? (
            <img
              src={getCloudinaryUrl(member.imagePublicId, 80, 80)}
              alt={member.name}
              className="relative w-full h-full object-cover rounded-lg border border-slate-900/10"
            />
          ) : (
            <div className={`relative w-full h-full rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-slate-900 font-bold text-xl border border-slate-900/10`}>
              {member.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Domain Icon Badge */}
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white border-2 border-black`}>
            <DomainIcon size={10} strokeWidth={2.5} />
          </div>
        </div>

        {/* Member Info */}
        <div className="text-center">
          <h3 className="text-sm font-medium leading-tight text-slate-900 group-hover:text-sky-600">
            {member.name}
          </h3>
          
          <div className="mt-1 inline-flex items-center px-1.5 py-0.5 bg-slate-900/5 rounded">
            <span className={`text-[9px] font-medium ${getRoleBadgeColor(member.role)}`}>
              {member.role === 'Domain Lead' ? 'Lead' : 
               member.role === 'Core Member' ? 'Core' : 
               member.role || 'Member'}
            </span>
          </div>

          {member.year && (
            <p className="text-[9px] text-gray-600 mt-1">
              {member.year} Year
            </p>
          )}
        </div>
      </div>
    </div>
  );
}