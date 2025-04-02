import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  desc: string;
  created_at: string;
}
export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("Communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading, isError } = useQuery<Community[], Error>({
    queryKey: ["Communities"],
    queryFn: fetchCommunities,
  });
  if (isLoading) {
    return <div className="text-center py-4">Loading Communities...</div>;
  }
  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto space-y-4 ">
      {data?.map((community, key) => (
        <div
          className="border border-white/10  p-4 rounded hover:-translate-y-1 transition transform"
          key={key}
        >
          <Link
            className="text-2xl font-semibold text-purple-600"
            to={`/community/${community.id}`}
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.desc}</p>
        </div>
      ))}
    </div>
  );
};
