"use client";

import React, { useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export default function UpdatePage() {
  const [email, setEmail] = useState("");
  const supabase = useSupabaseClient();
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update/update-password/",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the password reset link");
    }
  };
  return (
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
