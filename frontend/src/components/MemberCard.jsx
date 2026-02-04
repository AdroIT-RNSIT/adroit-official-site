export default function MemberCard({ member, onDelete }) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 hover:border-cyan-400 transition flex justify-between items-center">
      <span className="font-semibold text-cyan-200">
        {member.name}
      </span>

      <button
        onClick={() => onDelete(member._id)}
        className="text-red-400 hover:text-red-300 transition"
      >
        ✕
      </button>
    </div>
  );
}
