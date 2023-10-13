"use client";

import { Loader2 } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { supabaseClient } from "@/config/supabaseClient";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HeartButton from "@/components/heart-button";

const Icons = {
  spinner: Loader2,
  heart: Heart,
};

export default function Home() {
  const supabase = supabaseClient;
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [listOfPublicPosts, setListOfPublicPosts] = useState<any>([]);
  useEffect(() => {
    //Only fetch posts that are published
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false }); // Order by created_at in descending order

      if (error) {
        alert("Error fetching posts");
        setIsLoading(false);
        return;
      }
      setListOfPublicPosts(data);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="p-12 flex flex-col items-center">
        <h1 className="font-bold text-2xl underline text-fuchsia-500">
          Latest Posts
        </h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : (
        <div className="flex flex-col p-4 ">
          {listOfPublicPosts.map((post: any, index: any) => (
            <div key={index} className="mb-4">
              <Card style={{ height: "auto", minHeight: "300px" }}>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{post.subtitle}</p>
                  <textarea
                    disabled
                    className="text-xl w-full px-4 p-2 bg-[#f4f4f4] outline-none border-none resize-vertical"
                    style={{ minHeight: "350px", maxHeight: "auto" }}
                    value={post.poem_content}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-gray-400">
                    Posted by: {post.published_by_user}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-400">
                      Post Score: {post.score}
                    </p>
                    <HeartButton postId={post.id} />
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
