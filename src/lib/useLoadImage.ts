import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { SupabaseClient } from "@supabase/supabase-js";

const useLoadImage = async (user: any, supabase: SupabaseClient) => {
  if (!user) {
    return null;
  }

  console.log(user);
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", user.id);

  console.log(data);

  if (!data || data.length === 0) {
    return null;
  }

  const { data: imageData } = supabase.storage
    .from("avatars")
    .getPublicUrl(data[0].avatar_url);

  console.log(imageData);
  return imageData.publicUrl;
};

export default useLoadImage;
