"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { supabaseClient } from "@/config/supabaseClient";

import {
  Card,
  CardContent,
  CardDescription,
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
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-lg text-bold">Latest Posts</h1>
      </div>
      {isLoading ? (
        <div className="flex justify-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {listOfPublicPosts.map((post: any, index: any) => (
            <Card key={index} className="py-2">
              {/* <div className="border border-gray-300 p-4 rounded shadow"> */}
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{post.subtitle}</p>
                <p className="text-base">{post.poem_content}</p>
              </CardContent>
              {/* You can add additional content or styling for each post here */}
              {/* </div> */}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
