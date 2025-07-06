import { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavbarProps = ComponentProps<"nav">;

export function NavBar({ className, ...props }: NavbarProps) {
  return (
    <nav className={cn("w-full flex flex-row items-center px-8 justify-between", className)} {...props}>
      <Link
        href="/"
        className="text-2xl font-extrabold text-center mb-4"
      >
        eyusd.
      </Link>
      <div className="flex flex-row items-center space-x-4">

        <Link
          href="/tracks"
          className="text-lg text-center mb-2 hover:underline"
        >
          Tracks
        </Link>
        <Link
          href="/music-box"
          className="text-lg text-center mb-2 hover:underline"
        >
          Music Box
        </Link>
      </div>
    </nav>
  );
}
