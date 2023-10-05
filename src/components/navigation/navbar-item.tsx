// NavbarItem.tsx

import { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavbarItemProps {
  icon?: IconType | null;
  label: string;
  href: string;
  isActive?: boolean; // Add isActive prop
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  icon: Icon,
  label,
  isActive, // Destructure isActive prop
  href,
}) => {
  return (
    <Link
      href={href}
      className={cn(
        `
  font-bold
  items-center
  lg:inline-block 
  lg:mt-0 
  hover:text-fuchsia-600
  text-neutral-400
  transition
  py-2
  `,
        isActive ? "text-fuchsia-500" : "text-white"
      )}
    >
      {Icon && <Icon size={26} className="mr-2" />}
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};

export default NavbarItem;
