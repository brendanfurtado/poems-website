"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

export default function Post() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    //In case user is logged in
    const timer = setTimeout(() => {
      if (!user) {
        redirect("/");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    // You can implement your custom context menu logic here
    alert("Custom Context Menu");
  };

  const handleSaveForLater = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);

    console.log(user?.user_metadata.username);
    const username = user?.user_metadata.username;
    //Is published is false because saving for later
    const values = {
      title,
      subTitle,
      content,
      picture,
      isPublished: false,
      username,
    };
    console.log(values);

    try {
      const url = qs.stringifyUrl({
        url: "/api/posts",
        query: {
          id: params?.postsId,
        },
      });
      await axios.post(url, values);
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
        <form className="flex flex-col h-full">
          <div className="mb-6 flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="hover:text-pink-500"
              onClick={handleSaveForLater}
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
              className="text-lg bg-[#f4f4f4] border-none focus:outline-none cursor-blink h-12 px-4"
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
      </div>
    </div>
  );
}
