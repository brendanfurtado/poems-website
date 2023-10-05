"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useModal } from "@/hooks/use-modal-store";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SignInModal = () => {
  const { isOpen, onClose, type, isSignInActive, isSignUpActive } = useModal();
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const isModalOpen = isOpen && type === "signin";

  //Toggle between SignIn and Sign up forms
  const [isSignInFormActive, setIsSignInFormActive] = useState(isSignInActive);
  const [isSignUpFormActive, setIsSignUpFormActive] = useState(isSignUpActive);
  const [isLoading, setIsLoading] = useState(false);

  //User setup/signup
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const [message, setMessage] = useState<string | null>("");

  //Sign in
  const signInEmailRef = useRef<HTMLInputElement>(null);
  const signInPasswordRef = useRef<HTMLInputElement>(null);

  //When props change, update state of signup form activity
  useEffect(() => {
    if (isSignInActive) {
      setIsSignInFormActive(true);
      setIsSignUpFormActive(false);
    } else if (isSignUpActive) {
      setIsSignUpFormActive(true);
      setIsSignInFormActive(false);
    }
  }, [isSignInActive, isSignUpActive, user, router, supabase.auth]);

  async function handleSignIn(event: any) {
    console.log("start of sign in");
    event.preventDefault();

    const email = signInEmailRef.current?.value;
    const password = signInPasswordRef.current?.value;

    if (email && password) {
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Successfully signed in.");
      onClose(); // Close the modal
      router.refresh();
      router.push("/");
    } else {
      // Handle the case where email or password is undefined
      console.error("Email and/or password is undefined.");
    }
  }

  async function handleSignUp(event: any) {
    console.log("start of sign up");
    event.preventDefault();

    //  Reset error and message
    setErrorMsg(null);
    setMessage(null);
    setIsLoading(true);
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    // Check if all fields have values
    if (!username || !email || !password) {
      setErrorMsg("All fields are required");
      setIsLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailRef.current?.value,
        password: passwordRef.current?.value,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            username: usernameRef.current?.value,
            email: emailRef.current?.value,
          },
        },
      });
      console.log("Successfully signed up.");
      setMessage(
        "Successfully signed up. Please check your email to confirm your account."
      );
      onClose(); // Close the modal
      router.refresh();
      router.push("/");
      setIsLoading(false);

      if (error) {
        setErrorMsg(error.message);
        router.push("/");
        setIsLoading(false);
      }
    } catch {
      setErrorMsg("Failed to create an account");
      console.log(errorMsg);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white flex flex-col h-[50%] w-[50%] bg-secondary md:h-[600px] md:max-h-[75vh] md:w-full md:max-w-[600px]  text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            <Button
              onClick={() => {
                setIsSignInFormActive(true);
                setIsSignUpFormActive(false);
              }}
              variant="ghost"
              className={`text-xl text-zinc-500 ${
                isSignInFormActive ? "underline" : ""
              }`}
            >
              Sign In
            </Button>
            <Button
              onClick={() => {
                setIsSignInFormActive(false);
                setIsSignUpFormActive(true);
              }}
              variant="ghost"
              className={`text-xl text-zinc-500 ${
                isSignUpFormActive ? "underline" : ""
              }`}
            >
              Sign Up
            </Button>
          </DialogTitle>
        </DialogHeader>
        {isSignInFormActive && (
          // Render the Sign In form here
          <form className="signin-form" onSubmit={handleSignIn}>
            <div className="p-6">
              <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Login to your Account
              </Label>
              <div className="flex flex-col mt-4 gap-2">
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Email
                </Label>
                <Input
                  ref={signInEmailRef}
                  placeholder="Your email"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Password
                </Label>
                <Input
                  ref={signInPasswordRef}
                  placeholder="Your password"
                  type="password"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 rounded shadow"
                >
                  {isLoading ? <span>Loading</span> : <span>Sign In</span>}
                </Button>
                <Button
                  onClick={() => {}}
                  disabled={isLoading}
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-500 underline"
                >
                  Forgot your password?
                </Button>
                <Button
                  onClick={() => {
                    setIsSignInFormActive(false);
                    setIsSignUpFormActive(true);
                  }}
                  disabled={isLoading}
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-500 underline"
                >
                  {`Don't have an account? Sign Up`}
                </Button>
              </div>
            </div>
          </form>
        )}
        {isSignUpFormActive && (
          // Render the Sign Up form here
          <form className="signup-form" onSubmit={handleSignUp}>
            <div className="p-6">
              <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                Create your Account
              </Label>
              <div className="flex flex-col mt-4 gap-2">
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Username
                </Label>
                <Input
                  ref={usernameRef}
                  placeholder="Your username"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Email
                </Label>
                <Input
                  ref={emailRef}
                  placeholder="Your email"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Password
                </Label>
                <Input
                  ref={passwordRef}
                  placeholder="Your password"
                  type="password"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Confirm Password
                </Label>
                <Input
                  ref={confirmPasswordRef}
                  placeholder="Confirm your password"
                  type="password"
                  disabled={isLoading}
                  className="bg-zinc-300/50 border-0 focus:ring-2 focus:ring-teal-500 text-black focus-visible:ring-offset-0 px-4 py-2 rounded"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 rounded shadow"
                >
                  {isLoading ? <span>Loading</span> : <span>Sign Up</span>}
                </Button>
                <Button
                  onClick={() => {
                    setIsSignInFormActive(true);
                    setIsSignUpFormActive(false);
                  }}
                  disabled={isLoading}
                  variant="link"
                  size="sm"
                  className="text-xs text-zinc-500 mt-4 underline"
                >
                  {`Already have an account? Sign In`}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
