import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id: number | null;
}
export interface comment {
  id: number;
  post_is: number;
  parent_comment_id: number | null;
  content: string;
  user_id: string;
  created_at: string;
  author: string;
}
const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("Login to comment on the post");
  }

  const { error } = await supabase.from("Comments").insert({
    post_id: postId,
    content: newComment.content,
    user_id: userId,
    author: author,
    parent_comment_id: newComment.parent_comment_id || null,
  });

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<comment[]> => {
  const { data, error } = await supabase
    .from("Comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data as comment[];
};
export const Comment = ({ postId }: Props) => {
  const [newComment, setNewComment] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment) return;
    mutate({ content: newComment, parent_comment_id: null });
    setNewComment("");
  };

  {
  }

  //   Map of Comments
  const buildCommentTree = (
    flatComments: comment[]
  ): (comment & { children?: comment[] })[] => {
    const map = new Map<number, comment & { children?: comment[] }>();
    const roots: (comment & { children?: comment[] })[] = [];
    flatComments.forEach((comments) => {
      map.set(comments.id, { ...comments, children: [] });
    });
    flatComments.forEach((comments) => {
      if (comments.parent_comment_id) {
        const parent = map.get(comments.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comments.id)!);
        }
      } else {
        roots.push(map.get(comments.id)!);
      }
    });

    return roots;
  };

  if (isLoading) {
    return <div>Loading Comments...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6 ">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      {/* Create Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full resize-none border border-white/10 bg-transparent  p-2 rounded  overflow-y-scroll no-sroll"
            value={newComment}
            rows={6}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Comment on the post..."
          />
          <button
            type="submit"
            className="px-3 py-2 bg-gradient-to-br rounded cursor-pointer mt-2 text-white from-orange-800 via-amber-400 to-yellow-400 "
            disabled={!newComment}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && <p className="text-red-500 mt-2 ">Error Posting Comment</p>}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">Login to comment on the post</p>
      )}

      {/* Comments Display */}
      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
