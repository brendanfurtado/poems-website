"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaEllipsisV } from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";
import NavbarItem from "./navbar-item";
import logo from "../../../public/ink-pen-silhouette-of-poetry-vector-47204979-removebg-preview.png";
import { useModal } from "@/hooks/use-modal-store";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { onOpen } = useModal();
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [isSSR, setIsSSR] = useState(true);
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }
    const fetchImageURL = async () => {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user.id);

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      const userData = data[0];
      if (!userData || !userData.avatar_url) {
        return;
      }

      const { data: imageData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(userData.avatar_url);

      setImageURL(imageData.publicUrl);
    };

    fetchImageURL();
  }, [user, supabase, imageURL]);

  const pathname = usePathname(); // Get the current pathname

  const routes = useMemo(
    () => [
      {
        label: "Browse",
        href: "/",
        icon: null,
      },
      {
        label: "About",
        href: "/about",
        icon: FaEllipsisV,
      },
    ],
    []
  );

  const handleLogout = () => {
    supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const goToPostPage = () => {
    router.push("/post");
  };

  const goToMyPosts = () => {
    router.push("/my-posts");
  };

  const goToMyProfile = () => {
    router.push("/my-profile");
  };

  return (
    <nav className="bg-pink-200 border-secondary-lighter bg-secondary-lighter py-4">
      <div className="main-navbar z-[100]">
        <div className="flex items-center justify-between md:pr-2 w-full">
          <div className="flex-shrink-0 flex items-center space-x-4 mb-4 lg:mb-0">
            <Link href="/">
              <Image src={logo} alt="Logo" className="h-16 w-16 mr-4" />
            </Link>
            <span className="space-x-4">
              {routes.map((route) => (
                <NavbarItem
                  key={route.label}
                  label={route.label}
                  href={route.href}
                  isActive={pathname === route.href} // Pass isActive prop
                />
              ))}
            </span>
          </div>

          <div className="relative flex w-full items-center justify-end gap-3 px-2 md:justify-center lg:px-3">
            <h1 className="font-bold text-4xl text-fuchsia-900">
              Poems in You Blog
            </h1>
          </div>

          {/* This is the menu when the user is logged in */}
          <div className="md:flex flex flex-shrink-0 items-center justify-end px-2 md:w-fit lg:px-3">
            {user ? (
              <div className="flex flex-col md:flex-row items-center md:space-x-4 relative">
                <button
                  onClick={goToPostPage}
                  className="font-bold inline-block text-sm px-4 py-2 leading-none border rounded text-black border-teal-700 hover:border-transparent hover:text-teal-700 hover:bg-white mt-4 lg:mt-0"
                >
                  Create Post
                </button>

                <span className="sr-only">Open user menu</span>
                <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage
                          src={imageURL || ""} // Provide a default value if imageURL is null
                        />
                        <AvatarFallback>CN</AvatarFallback>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>My Account</DropdownMenuLabel>
                          <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <div>{user.email}</div>
                          </div>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={goToMyProfile}>
                            Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={goToMyPosts}>
                            Posts Created
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <button
                              onClick={handleLogout}
                              className={`font-bold inline-block text-sm px-4 py-2 leading-none border rounded text-black border-teal-700 hover:border-transparent hover:text-teal-700 hover:bg-white mt-4 lg:mt-0`}
                            >
                              Sign Out
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </Avatar>
                    </DropdownMenuTrigger>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <>
                <div className="md:flex md:items-center space-x-4 md:space-x-0">
                  <div className="mr-5">
                    <button
                      onClick={() => {
                        onOpen("signin", true, false); // Open Sign In modal and set isSignInActive to true
                      }}
                      className={`font-bold inline-block text-sm px-4 py-2 leading-none border rounded text-purple-500 border-black hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0 mr-4`}
                    >
                      Login
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        onOpen("signin", false, true); // Open Sign Up modal and set isSignUpActive to true
                      }}
                      className={`font-bold inline-block text-sm px-4 py-2 leading-none border rounded text-fuchsia-700 border-black hover:border-transparent hover:text-teal-700 hover:bg-white mt-4 lg:mt-0`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
