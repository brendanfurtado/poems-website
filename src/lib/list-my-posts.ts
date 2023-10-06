import { SupabaseClient } from "@supabase/supabase-js";

export const getPosts = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .filter("id", "eq", user.user_metadata.id);
    console.log(data);
    return data;
  } catch (error) {
    alert("Error fetching posts");
    return null;
  }
};
