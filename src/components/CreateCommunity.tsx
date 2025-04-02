import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  desc: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase
    .from("Communities")
    .insert([community])
    .select();

  if (error) throw new Error(error.message);
  return data;
};
export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, desc });
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl h-[70px] font-semibold text-center bg-gradient-to-br from-red-600 via-pink-700 to-purple-800 bg-clip-text text-transparent">
        Create New Community
      </h2>
      <div className="">
        <label htmlFor="name" className="block mb-2 font-semibold">
          Community Name
        </label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          id="name"
          value={name}
          className="w-full border border-white/10  bg-transparent rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="desc" className="block mb-2 font-semibold">
          Description
        </label>
        <textarea
          value={desc}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setDesc(e.target.value)}
          id="desc"
          rows={3}
          required
        />
      </div>
      <button
        disabled={isPending}
        className="bg-gradient-to-br from-purple-400 via-violet-800 to-fuchsia-700 px-3 py-2 rounded  cursor-pointer"
        type="submit"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
      {isError && <p className="text-red-500">Error creating community</p>}
    </form>
  );
};
