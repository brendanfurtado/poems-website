"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useUser } from "@/hooks/useUser";

export default function Post() {
  const [content, setContent] = useState("");
  const { isOpen, onClose, type, isSignInActive, isSignUpActive } = useModal();

  const isModalOpen = isOpen && type === "signin";

  const { user } = useUser();

  useEffect(() => {
    console.log(user);
    if (!user) {
      redirect("/");
    }
  }, [user]);

  const handleContextMenu = (e: any) => {
    e.preventDefault();
    // You can implement your custom context menu logic here
    alert("Custom Context Menu");
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/5 p-8 border border-gray-300 rounded shadow-md">
        <textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onContextMenu={handleContextMenu}
          className="w-full h-40 border-none outline-none resize-none text-lg mb-4"
        />

        <label className="block mb-2 text-gray-700">Add Picture</label>
        <input type="file" className="w-full border border-gray-300 p-2 mb-4" />

        <div className="flex items-center mb-4">
          <label className="mr-2">Convert to Header:</label>
          <input type="checkbox" className="border border-gray-300 p-2" />
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Publish
        </button>
      </div>
    </div>
  );
}
