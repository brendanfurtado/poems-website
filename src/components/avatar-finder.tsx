"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface LikeButtonProps {
  userId: string;
  avatar_url: string;
}

const AvatarFinder: React.FC<LikeButtonProps> = ({ userId, avatar_url }) => {
  const { supabaseClient } = useSessionContext();
  const supabase = supabaseClient;
  const { user } = useUser();

  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: imageData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(avatar_url);

      setImageURL(imageData.publicUrl);

      if (!imageData) {
        console.log("No data for fetching avatars in post ");
      }
    };

    fetchData();
    //eslint-disable-next-line
  }, [user]);

  return (
    <Avatar className="ml-2">
      <AvatarImage
        src={imageURL || ""} // Provide a default value if imageURL is null
      />
      <AvatarFallback>User</AvatarFallback>
    </Avatar>
  );
};

export default AvatarFinder;
