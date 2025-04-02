import { CommunityList } from "../components/CommunityList";
export const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-br from-amber-400 via-red-800 to-violet-600  bg-clip-text text-transparent">
        Communities
      </h2>
      <CommunityList />
    </div>
  );
};
