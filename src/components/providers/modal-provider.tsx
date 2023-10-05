"use client";

import { useEffect, useState } from "react";
import { SignInModal } from "../modals/signin-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SignInModal />
    </>
  );
};
