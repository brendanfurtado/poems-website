"use client";
import { supabaseClient } from "@/config/supabaseClient";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const Icons = {
  spinner: Loader2,
};

export default function Posts() {
  const supabase = supabaseClient;
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [listOfPosts, setListOfPosts] = useState<any>([]);

  //TODO: Fix location
  if (!user) {
    redirect("/");
  }
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("published_by_user", user?.user_metadata.username);

      setListOfPosts(data);
      setIsLoading(false);
      // console.log(data);
    };
    fetchPosts();
  }, []);

  //TODO: Add a delete post function

  return (
    <div className="min-h-screen flex flex-col items-center  py-8">
      <h1 className="text-3xl font-bold mb-4">My Posts:</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 shadow-lg">
          {listOfPosts.map((post: any, index: any) => (
            <div key={index} className="py-2 flex items-center justify-between">
              <Link href={`/post/edit/${post.id}`}>
                <p>
                  Post {index + 1}: {post.title} - Published?{" "}
                  {post.is_published ? "Yes" : "No"}{" "}
                </p>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Trash2 className="w-6 h-6 text-red-500 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Are you sure you want to Delete?
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>No</DropdownMenuItem>
                  <DropdownMenuItem>Delete!</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
