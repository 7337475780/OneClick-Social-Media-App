import { PostList } from "../components/PostList";
export const Home = () => {
  return (
    <div className="p-10">
      <h2 className="text-6xl font-poppins font-medium m-2 bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-600 text-center   bg-clip-text text-transparent ">
        Recent Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};
