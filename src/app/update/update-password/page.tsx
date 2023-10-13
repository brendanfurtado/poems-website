"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";

export default function UpdatePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const supabase = useSupabaseClient();
  const router = useRouter();

  const updatePasswordSubmit = async (e: any) => {
    e.preventDefault();

    setIsLoading(true);
    const new_password = passwordRef.current?.value;
    const confirm_password = confirmPasswordRef.current?.value;
    console.log(new_password, confirm_password);
    if (new_password !== confirm_password) {
      alert("Passwords don't match");
      setIsLoading(false);
      return;
    }
    if (!new_password || !confirm_password) {
      alert("Please enter a password");
      setIsLoading(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: new_password,
      });
      if (error) {
        alert(error);
        setIsLoading(false);
        return;
      }
      alert("Password updated successfully");
      router.push("/");
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <h1>Update password helper</h1>
      <form className="signin-form" onSubmit={updatePasswordSubmit}>
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
      </form>
    </div>
  );
}
