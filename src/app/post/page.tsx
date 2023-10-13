"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";

export default function Post() {
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [content, setContent] = useState("");
  const [picture, setPicture] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // In case the user is not logged in, redirect after 2000 milliseconds (2 seconds)
    const timer = setTimeout(() => {
      if (user === null) {
        router.push("/");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, router]);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    // You can implement your custom context menu logic here
    alert("Custom Context Menu");
  };

  const handleSaveForLater = async (event: any) => {
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
      uuid,
    };

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

  const handlePublish = async (event: any) => {
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
      isPublished: true,
      username,
      uuid,
    };

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
    <div className="flex flex-col items-center p-4 justify-center space-y-4">
      <div className="w-full h-screen">
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
              onClick={handlePublish}
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

          {/* Main Text Area Input */}
          <div className="h-full mb-32">
            <textarea
              placeholder="Start writing..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onContextMenu={handleContextMenu}
              className="text-xl w-full h-full px-4 p-2 bg-[#f4f4f4] outline-none border-none resize-none"
              style={{
                height: "100%",
                overflowY: "auto",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
