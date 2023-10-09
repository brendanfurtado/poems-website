"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabaseClient } from "@/config/supabaseClient";
import { Loader2 } from "lucide-react";

import axios from "axios";
import qs from "query-string";
const Icons = {
  spinner: Loader2,
};

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ID, setID] = useState<string | string[]>("");
  const supabase = supabaseClient;
  const { user } = useUser();
  const { postId } = useParams();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      if (!user) {
        redirect("/");
      }
      //Check if poster user is the same as logged in user, otherwise exit because you cannot edit another user's post
      //If user is the same, then show the edit form
      const getPostData = async () => {
        try {
          const { data: postData, error } = await supabase
            .from("posts")
            .select()
            .eq("id", postId)
            .eq("published_by_user", user?.user_metadata.username);

          if (error) {
            alert("Error fetching post data");
            return;
          }

          // Check if postData is not empty (post found)
          if (postData && postData.length > 0) {
            const post = postData[0]; // Assuming there's only one post with the same ID
            // console.log(post);
            // Set your state variables with the post data
            setID(post.id);
            setTitle(post.title);
            setSubTitle(post.subtitle);
            setContent(post.poem_content);
            setPicture(post.image_url);
            setIsPublished(post.is_published);
          } else {
            alert("Post not found or you don't have permission to edit it.");
            redirect("/");
          }
        } catch (error) {
          console.error("Error fetching post data", error);
          alert("Something went wrong while fetching post data");
        } finally {
          setIsLoading(false);
        }
      };

      getPostData();
    }, 2000);

    return () => clearTimeout(timer);
  }, [postId]);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    // You can implement your custom context menu logic here
    alert("Custom Context Menu");
  };

  //Use a patch endpoint instead here

  const handleUpdate = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const username = user?.user_metadata.username;
    const uuid = user?.id;

    //Is published is false because saving for later
    const values = {
      title,
      subTitle,
      content,
      picture,
      isPublished: false,
      username,
      postId,
      uuid,
    };
    console.log(values);

    try {
      const url = qs.stringifyUrl({
        url: "/api/posts",
        query: {
          id: params?.postsId,
        },
      });

      await axios.patch(url, values);
      setIsLoading(false);
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
      alert("Something went wrong, post was not successfully saved");
      router.refresh();
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center m-16">
      <div className="w-3/4 h-screen ml-20">
        {isLoading ? (
          // Render loading message when isLoading is true
          <div className="flex justify-center items-center h-screen">
            <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
          </div>
        ) : (
          <form className="flex flex-col h-full">
            <div className="mb-6 flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="hover:text-pink-500"
                onClick={handleUpdate}
              >
                {isLoading ? "Saving for later..." : "Save for Later"}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                variant="ghost"
                className="hover:text-pink-500 outline"
              >
                {isLoading ? "Saving..." : "Save and Publish"}
              </Button>
            </div>

            <div className="mb-8">
              {/* Enter Title */}
              <input
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-5xl bg-[#f4f4f4] border-none focus:outline-none cursor-blink h-16 px-4"
              />
            </div>

            {/* Enter Subtitle */}
            <div className="mb-4">
              <input
                placeholder="Enter Subtitle"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="text-lg bg-[#f4f4f4] border-none focus:outline-none cursor-blink h-16 px-4"
              />
            </div>

            {/* Picture Preview */}
            <div className="px-4 mb-4">
              {picture && <div>There is a picture</div>}
              {!picture && <div>There is no picture</div>}
            </div>

            {/* Image Upload */}
            <div className="grid w-full max-w-sm items-center gap-1.5 px-4 mb-12">
              <Label htmlFor="picture" className="text-lg">
                Upload Cover
              </Label>
              <Input
                id="picture"
                type="file"
                onChange={(e) => setPicture(e.target.value)}
              />
            </div>

            {/* Main Text Area Input */}
            <div className="h-full">
              <textarea
                placeholder="Start writing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onContextMenu={handleContextMenu}
                className="text-xl w-full h-full px-4 p-2 bg-[#f4f4f4] outline-none border-none resize-none"
                style={{
                  height: "100%",
                  overflowY: "hidden",
                }}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
