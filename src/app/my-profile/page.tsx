"use client";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "@/components/ui/label";

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

export default function Profile() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>([]);
  const [updatedUserData, setUpdatedUserData] = useState<any>({
    avatar: null,
  });

  useEffect(() => {
    if (!user) {
      redirect("/");
    }

    setTimeout(() => {
      const fetchUser = async () => {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("id", user?.id);

        if (error) {
          alert("Error fetching user");
          setIsLoading(false);
          router.push("/");
        }
        setUserData(data);
        setIsLoading(false);
      };
      fetchUser();
    }, 2000);
    //eslint-disable-next-line
  }, [user]);

  const deleteUser = async () => {
    const userId = user?.id;
    if (!userId) {
      alert("Error fetching user for deletion");
      return;
    }
    supabase.auth.signOut();
    supabase.auth.setSession({ access_token: "", refresh_token: "" });
    router.push("/");
    router.refresh();

    // Delete the user avatar from storage
    const { data: imageData } = await supabase.storage
      .from("avatars")
      .remove([`avatar-${userId}*`]);

    // Perform a database operation to delete the post
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
      return;
    }
    alert("User deleted successfully");
  };

  const updateUserProfile = async (e: any) => {
    e.preventDefault();

    const uniqueID = uniqid();

    try {
      // Upload the user avatar to the storage bucket
      const { data: imageData, error: imageError } = await supabase.storage
        .from("avatars")
        .upload(`avatar-${user?.id}-${uniqueID}`, updatedUserData.avatar, {
          cacheControl: "3600",
          upsert: true,
        });

      if (imageError) {
        setIsLoading(false);
        return console.error("Failed image upload");
      }

      // Update record in the database
      const { data, error } = await supabase
        .from("users")
        .update({
          avatar_url: imageData.path,
        })
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating user profile:", error);
        return;
      }

      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (file) {
      // const imageUrl = URL.createObjectURL(file);
      // console.log(imageUrl);
      setUpdatedUserData({ ...updatedUserData, avatar: file });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-4">My Profile:</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Icons.spinner className="animate-spin w-12 h-12 text-pink-500" />
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-4 shadow-lg">
          <div className="mb-4">
            <Label className="block text-gray-600 text-sm font-medium mb-2">
              Select an Avatar
            </Label>
            <Input
              type="file"
              accept="image/*"
              id="image"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-4">
            <Image
              src={updatedUserData.avatar || userData.avatar || ""}
              alt="Avatar"
              className="w-20 h-20 rounded-full mx-auto"
              width={100} // Specify the width
              height={100} // Specify the height
            />
          </div>
          <div className="mb-4">
            <Button onClick={updateUserProfile}>Update Profile</Button>
          </div>
        </div>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>Delete Profile</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Are you sure you want to Delete? All of your posts will be deleted
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>No, do not delete!</DropdownMenuItem>
          <DropdownMenuItem onClick={deleteUser}>Delete!</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
