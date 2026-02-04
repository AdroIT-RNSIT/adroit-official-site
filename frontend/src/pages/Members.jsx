import useMembers from "../hooks/useMembers";
import MemberForm from "../components/MemberForm";
import MemberCard from "../components/MemberCard";

export default function Members() {
  const { members, create, remove } = useMembers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Club Members</h1>
      <MemberForm onSubmit={create} />

      <div className="grid grid-cols-3 gap-4 mt-4">
        {members.map(m => (
          <MemberCard
            key={m._id}
            member={m}
            onDelete={remove}
          />
        ))}
      </div>
    </div>
  );
}
