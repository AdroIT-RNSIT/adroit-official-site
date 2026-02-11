import useMembers from "../hooks/useMembers";
import MemberForm from "../components/MemberForm";
import MemberCard from "../components/MemberCard";

export default function Members() {
  const { members, create, remove, loading } = useMembers(); // Add loading state

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-8">
          Club Members
        </h1>
        
        <MemberForm onSubmit={create} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {members.map((m) => (
            <MemberCard key={m._id} member={m} onDelete={remove} />
          ))}
        </div>
      </div>
    </div>
  );
}