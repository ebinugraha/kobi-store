import { Handbag } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { AuthButton } from "../../../auth/ui/components/auth-button";
import Image from "next/image";

export const HomeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full bg-white border-b h-16">
      <div className="flex w-full items-center justify-center">
        <div className="max-w-6xl flex-1 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={"/"} className="flex items-center gap-2">
              <Image src={"/logo.svg"} height={32} width={32} alt="Logo" />
              <h1 className="text-lg font-semibold text-primary">Kobi Store</h1>
            </Link>
          </div>
          <div className="justify-center flex-1 max-w-7xl mx-auto flex items-center">
            <SearchInput />
          </div>
          <div className="flex">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};
