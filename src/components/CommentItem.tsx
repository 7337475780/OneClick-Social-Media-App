import { useState } from "react";
import { comment } from "./Comment";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
interface Props {
  comment: comment & {
    children?: comment[];
  };
  postId: number;
}
const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("Login to reply");
  }

  const { error } = await supabase.from("Comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};
export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText) return;
    mutate(replyText);
  };
  return (
    <div className="pl-4 border-l border-white/10 ">
      <div className="mb-2 ">
        <div className="flex items-center space-x-2">
          {/* Commenters Username */}
          <span className="text-sm font-bold text-amber-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          className="text-purple-400 text-sm mt-1"
          onClick={() => setShowReply((prev) => !prev)}
        >
          {showReply ? "Hide" : "Reply"}
        </button>
      </div>
      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-2">
          <textarea
            className="w-full border border-white/10 bg-transparent rounded p-2 resize-none overflow-y-scroll no-sroll"
            value={replyText}
            rows={2}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button
            type="submit"
            className="px-3 py-2 mt-1 bg-gradient-to-br from-orange-800  via-amber-400 rounded cursor-pointer to-yellow-400 "
            disabled={!replyText}
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="text-red-400">Error Posting Reply</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            title={isOpen ? "Hide Replies" : "Show Replies"}
          >
            {isOpen ? (
              <BiChevronUp />
            ) : (
              <BiChevronDown />
              
            )}
          </button>
          {!isOpen && (
            <div className="space-y-2">
              {comment.children.map((child, key) => (
                <CommentItem key={key} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
