import { create } from "zustand";

export type ModalType = "signin" | "signup" | "createPost";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  isSignInActive: boolean;
  isSignUpActive: boolean;
  onOpen: (
    type: ModalType,
    isSignInActive?: boolean,
    isSignUpActive?: boolean
  ) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  isSignInActive: false,
  isSignUpActive: false,
  onOpen: (type, isSignInActive = false, isSignUpActive = false) =>
    set({ isOpen: true, type, isSignInActive, isSignUpActive }),
  onClose: () =>
    set({
      type: null,
      isOpen: false,
      isSignInActive: false,
      isSignUpActive: false,
    }),
}));
