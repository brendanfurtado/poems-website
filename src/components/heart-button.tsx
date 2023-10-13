"use client";

import { useEffect, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { useUser } from "@/hooks/useUser";
import { useModal } from "@/hooks/use-modal-store";

interface LikeButtonProps {
  postId: string;
}

const HeartButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const router = useRouter();
  const { supabaseClient } = useSessionContext();
  const { onOpen } = useModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from("post_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [postId, supabaseClient, user?.id]);

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  const handleLike = async () => {
    //if not logged in, open auth modal
    if (!user) {
      return onOpen("signin", true, false);
    }
    //if already liked, unlike
    if (isLiked) {
      const { error } = await supabaseClient
        .from("post_likes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) {
        alert(error.message);
      }

      //decrement post score
      const { error: likeError } = await supabaseClient.rpc("decrement", {
        x: 1,
        row_id: postId,
      });

      if (likeError) {
        alert(likeError.message);
      } else {
        setIsLiked(false);
      }
      //if not liked, like
    } else {
      const { error } = await supabaseClient.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

      if (error) {
        alert(error.message);
      }

      //increment post score
      const { error: likeError } = await supabaseClient.rpc("increment", {
        x: 1,
        row_id: postId,
      });

      if (likeError) {
        alert(likeError.message);
      } else {
        setIsLiked(true);
      }
    }

    router.refresh();
  };

  return (
    <button
      className="
      cursor-pointer 
      hover:opacity-75 
      transition-opacity
  "
      onClick={handleLike}
    >
      <Icon color={isLiked ? "#FFC0CB" : "black"} size={25} />
    </button>
  );
};

export default HeartButton;
