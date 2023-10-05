// import Navbar from "@/components/navigation/navbar";
import { ReactNode } from "react";
const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative grow overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
