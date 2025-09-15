"use client";

import { Button } from "@/components/ui/button";
import { Bell, PackagePlus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { UserButton } from "../../../auth/ui/components/user-button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardNavbarMenu = () => {
  const { data } = authClient.useSession();

  return (
    <div className="flex gap-x-10 items-center">
      <div className="relative">
        {/* Todo Update functionality */}
        <Bell className="size-4" />
        <div className="h-2 w-2 bg-red-500 rounded-full absolute top-[-3px] right-[-3px]" />
      </div>
      <Link href={"/dashboard/create"}>
        <Button variant={"secondary"} size={"sm"}>
          <PackagePlus />
          <span className="text-xs">Jual produk</span>
        </Button>
      </Link>
      <div className="flex gap-x-4 items-center">
        {!data ? (
          <Skeleton className="h-4 w-[118px]" />
        ) : (
          <span className="text-xs font-medium">Hi, {data?.user.name}</span>
        )}

        <UserButton />
      </div>
    </div>
  );
};
