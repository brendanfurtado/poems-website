"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { supabaseClient } from "@/config/supabaseClient";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <div className="flex flex-wrap justify-center p-4">
          {listOfPublicPosts.map((post: any, index: any) => (
            <div key={index} className="w-full md:w-1/2 lg:w-1/3 p-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-bold">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base">{post.subtitle}</p>
                  <p className="text-sm">{post.poem_content}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-400">
                    Posted by: {post.published_by_user}
                  </p>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
