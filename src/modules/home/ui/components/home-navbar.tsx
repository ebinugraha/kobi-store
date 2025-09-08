import { Handbag } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { AuthButton } from "../../../auth/ui/components/auth-button";

export const HomeNavbar = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex w-full bg-white border-b px-4 pr-5 h-16">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={"/"} className="flex items-center gap-2">
            <Handbag size={22} />
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
  );
};
