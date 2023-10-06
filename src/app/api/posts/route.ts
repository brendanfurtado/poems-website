import { supabaseClient } from "../../../config/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Initialize the Supabase client
  const supabase = supabaseClient;
  console.log("inside post");
  try {
    // Get the poem data from the request body
    const { title, subTitle, content, picture, isPublished, username } =
      await req.json();
    const { data, error } = await supabase.from("posts").insert(
      {
        title: title,
        subtitle: subTitle,
        poem_content: content,
        image_url: picture,
        is_published: isPublished,
        published_by_user: username,
      },
      { returning: "minimal" } as any
    );
    console.log(data, error);
    // Check for errors
    if (error) {
      console.log("Error creating poem:", error);
      return new NextResponse("Error in creating poem", { status: 500 });
    }

    console.log("Poem successfully created:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
