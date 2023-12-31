import Navbar from "@/components/navigation/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UserProvider from "@/components/providers/user-provider";
import { ModalProvider } from "@/components/providers/modal-provider";
import SupabaseProvider from "@/components/providers/supabase-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poems in You",
  description: "created by Brendan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <SupabaseProvider>
          <UserProvider>
            <Navbar />
            <ModalProvider />
            {children}
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
