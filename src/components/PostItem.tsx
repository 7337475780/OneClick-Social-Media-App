import { Link } from "react-router";
import { Post } from "./PostList";
import { BiSolidCommentDetail, BiSolidHeart } from "react-icons/bi";

interface Props {
  post: Post;
}
export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative group">
      {/* <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-br from-pink-400 via-orange-400  to-white blur-xl opacity-0 group-hover:opacity-50 transition-colors duration-300 pointer-events-none"></div> */}
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[8px] text-white flex flex-col p-5 overflow-hidden  transition-colors duration-300 group-hover:bg-gray-800">
          {/* Header: Avatar & Title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px]  rounded-full  object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-br from-[#8A2BE2] to-[#491F70]"></div>
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2 ">
                {post.title}
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="mt-2 flex-1">
            <img
              className="w-full rounded-[4px] object-cover max-h-[180px] mx-auto"
              src={post.img_url}
              alt={post.title}
            />
          </div>
          <div className="flex mt-2 items-center justify-around gap-1 text-lg">
            <span className="flex cursor-pointer h-10 w-10 px-1 font-semibold hover:text-pink-800 hover:scale-110 transition-transform ease-in-out  justify-center gap-[2px] items-center">
              <BiSolidHeart />
              {post.like_count ?? 0}
            </span>
            <span className="flex cursor-pointer h-10 w-10 px-1 font-semibold hover:text-green-400 hover:scale-110 transition-transform ease-in-out  justify-center gap-[2px] items-center">
              <BiSolidCommentDetail />
              {post.comment_count ?? 0}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
