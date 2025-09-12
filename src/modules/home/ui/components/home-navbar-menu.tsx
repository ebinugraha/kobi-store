import { Button } from "@/components/ui/button";
import { UserButton } from "@/modules/auth/ui/components/user-button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface HomeNavbarMenuProps {
  name: string;
}

export const HomeNavbarMenu = ({ name }: HomeNavbarMenuProps) => {
  return (
    <div className="flex gap-x-10 items-center">
      <Link href={"/cart"}>
        <Button variant={"secondary"} size={"sm"}>
          <ShoppingCart />
          <span className="text-xs">Keranjang</span>
        </Button>
      </Link>
      <div className="flex gap-x-4 items-center">
        <span className="text-xs font-medium">{name}</span>
        <UserButton />
      </div>
    </div>
  );
};
