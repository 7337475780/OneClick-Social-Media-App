import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import { PostItem } from "./PostItem";
import { useQuery } from "@tanstack/react-query";

interface Props {
  communityId: number;
}
interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("Posts")
    .select("*,Communities!Posts_community_id_fkey1(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as PostWithCommunity[];
};
export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });
  if (isLoading)
    return <div className="text-center py-4">Loading communities...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-4">Error:{error.message}</div>
    );
  return (
    <div className="text-6xl mb-6 font-semibold text-center bg-gradient-to-br from-orange-600 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
      <h2>{data && data[0].title} Community Posts</h2>
      {data && data.length > 0 ? (
        <div className="flex flex-wrap gap-6 my-10 justify-center">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 ">No Posts in Community</p>
      )}
    </div>
  );
};
