import { supabaseClient } from "../../../config/supabaseClient";
import { NextResponse } from "next/server";
const supabase = supabaseClient;

export async function POST(req: Request) {
  // Initialize the Supabase client
  try {
    // Get the poem data from the request body
    const { title, subTitle, content, picture, isPublished, username, uuid } =
      await req.json();
    const { data, error } = await supabase.from("posts").insert(
      {
        title: title,
        subtitle: subTitle,
        poem_content: content,
        image_url: picture,
        is_published: isPublished,
        published_by_user: username,
        published_by_uuid: uuid,
      },
      { returning: "minimal" } as any
    );
    // console.log(data, error);
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

export async function PATCH(req: Request) {
  try {
    const {
      title,
      subTitle,
      content,
      picture,
      isPublished,
      username,
      postId,
      uuid,
    } = await req.json();
    // console.log(
    //   title,
    //   subTitle,
    //   content,
    //   picture,
    //   isPublished,
    //   username,
    //   postId,
    //   uuid
    // );

    // Check if the user has permission to update this post (add your own logic)
    const { data: selectData, error: selectError } = await supabase
      .from("posts")
      .select()
      .eq("id", postId)
      .eq("published_by_user", username); // You should adjust this to your specific logic

    if (selectError || selectData.length === 0) {
      // Handle the case where the user doesn't have permission to update the post
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabase
      .from("posts")
      .update(
        {
          title: title,
          subtitle: subTitle,
          poem_content: content,
          image_url: picture,
          is_published: isPublished,
        },
        { returning: "minimal" } as any
      )
      .eq("id", postId)
      .eq("published_by_uuid", uuid)
      .select();

    // Check for errors
    if (error) {
      console.log("Error creating poem:", error);
      return new NextResponse("Error in creating poem", { status: 500 });
    }

    console.log("Poem successfully created:");
    return NextResponse.json(data);
  } catch (error) {
    console.log("Server error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
