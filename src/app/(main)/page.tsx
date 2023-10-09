"use client";

import { supabaseClient } from "@/config/supabaseClient";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const Icons = {
  spinner: Loader2,
};

export default function Home() {
  const supabase = supabaseClient;
  const [isLoading, setIsLoading] = useState(true);
  const [listOfPublicPosts, setListOfPublicPosts] = useState<any>([]);

  useEffect(() => {
    //Only fetch posts that are published
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true);

      setListOfPublicPosts(data);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Home page</h1>
      {isLoading ? (
        <div className="flex justify-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : (
        <div>
          {listOfPublicPosts.map((post: any, index: any) => (
            <div key={index} className="py-2">
              <div className="border border-gray-300 p-4 rounded shadow">
                <h1 className="text-xl font-bold">{post.title}</h1>
                <p className="text-lg">{post.subtitle}</p>
                <p className="text-base">{post.poem_content}</p>
                {/* You can add additional content or styling for each post here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
