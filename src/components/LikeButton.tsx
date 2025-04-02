import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
// import { useState } from "react";
interface Props {
  postId: number;
}

interface Like {
  id: number;
  post_id: number;
  user_id: string;
  like: number;
}

const like = async (likeValue: number, postId: number, userId: string) => {
  const { data: existingLike } = await supabase
    .from("Likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    if (existingLike.like === likeValue) {
      const { error } = await supabase
        .from("Likes")
        .delete()
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("Likes")
        .update({ like: likeValue })
        .eq("id", existingLike.id);

      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("Likes")
      .insert({ post_id: postId, user_id: userId, like: likeValue });
    if (error) throw new Error(error.message);
  }
};

export const LikeButton = ({ postId }: Props) => {
  // const [isLike, setLike] = useState(true);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const {
    data: Likes,
    isLoading,
    error,
  } = useQuery<Like[], Error>({
    queryKey: ["likes", postId],
    queryFn: () => fetchLikes(postId),
    refetchInterval: 5000,
  });
  const { mutate } = useMutation({
    mutationFn: (likeValue: number) => {
      if (!user) throw new Error("Login to like the post");
      return like(likeValue, postId, user!.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", postId] });
    },
  });

  const fetchLikes = async (postId: number): Promise<Like[]> => {
    const { data, error } = await supabase
      .from("Likes")
      .select("*")
      .eq("post_id", postId);
    if (error) throw new Error(error.message);
    return data as Like[];
  };

  if (isLoading) {
    return <div>Loading Likes...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const likes = Likes?.filter((l) => l.like === 1).length || 0;
  // const dislike = Likes?.filter((l) => l.like ===1).length || 0;
  const userVote = Likes?.find((l) => l.user_id === user?.id)?.like;
  return (
    <div className="flex items-center space-x-4 my-4">
      <button
        className={`text-lg flex items-center gap-1 transition-opacity duration-[.5s] ${userVote?"text-pink-800":"text-white"}`}
        onClick={() => {
          mutate(1);
        }}
      >
        {userVote ? <BiSolidHeart /> : <BiHeart />}
        <span className="text-white text-[18px] ">{likes}</span>
      </button>
      {/* ) : (
        <button
          className="transition-opacity duration-[0.5s]"
          onClick={() => {
            mutate(1);
            // setLike(!isLike);
          }}
        >
          <BiHeart />
        </button>
      )} */}
    </div>
  );
};
