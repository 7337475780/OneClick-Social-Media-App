import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { Comment } from "./Comment";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("Posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);

  return data as Post;
};
export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["Posts", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return <div>Loading Posts...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-6xl font-bold  mb-6 text-center bg-gradient-to-br from-amber-400 to-yellow-200 bg-clip-text text-transparent">
        {data?.title}
      </h2>
      {data?.img_url && (
        <img
          src={data?.img_url}
          alt={data?.title}
          className="mt-4 rounded object-cover w-full h-64 "
        />
      )}
      <p className="text-gray-400 ">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} />
      <Comment postId={postId} />
    </div>
  );
};
