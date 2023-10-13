"use client";
import { supabaseClient } from "@/config/supabaseClient";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [listOfPosts, setListOfPosts] = useState<any>([]);

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("published_by_user", user?.user_metadata.username);

      if (error) {
        alert("Error fetching user");
        setIsLoading(false);
        router.push("/");
      }
      setListOfPosts(data);
      setIsLoading(false);
    };
    fetchPosts();
    //eslint-disable-next-line
  }, []);

  const deletePost = async (postId: number) => {
    // Perform a database operation to delete the post
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("published_by_user", user?.user_metadata.username);

    if (error) {
      alert("Error fetching user");
      setIsLoading(false);
      router.push("/");
    }

    // Remove the deleted post from the list
    setListOfPosts((prevList: any) =>
      prevList.filter((post: any) => post.id !== postId)
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center  py-8">
      <h1 className="text-3xl font-bold mb-4">My Posts:</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : listOfPosts.length === 0 ? ( // Check if listOfPosts is empty
        <h1 className="text-2xl">No posts created yet!</h1>
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
                  <Trash2 className="w-6 h-6 ml-2 text-red-500 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    Are you sure you want to Delete?
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>No</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deletePost(post.id)}>
                    Delete!
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
