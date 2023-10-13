"use client";
import Image from "next/image";
import banner from "../../../public/framed180bladesofglory.jpg";

export default function About() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 items-center">
        About Our Website
      </h1>
      <Image src={banner} alt="Picture of the author" />
      <p className="text-lg mb-4">
        Welcome to our poetry community! Our website is a space for creative
        minds to come together, share their poetic expressions, and appreciate
        the art of words.
      </p>

      <h2 className="text-2xl font-bold mb-2">Features:</h2>
      <ul className="list-disc pl-8">
        <li>
          Create Poems: Share your thoughts, emotions, and stories through
          beautifully crafted poems.
        </li>
        <li>
          Upvote System: Show appreciation for fellow poets by upvoting their
          posts.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-6 mb-2">Join Us Today!</h2>
      <p className="text-lg mb-4">
        Whether you&apos;re an experienced poet or just starting your journey
        with words, our community welcomes everyone. Join us today to explore,
        create, and connect with like-minded individuals.
      </p>

      <p className="text-gray-600">Happy writing!</p>
    </div>
  );
}
