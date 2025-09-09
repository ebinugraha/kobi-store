"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "./user-avatar";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { LogOut, Store } from "lucide-react";

export const UserButton = () => {
  const { data, isPending } = authClient.useSession();

  if (!data || !data.user || isPending) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <UserAvatar size={"lg"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-row gap-2">
            <UserAvatar size={"lg"} />
            <div className="flex flex-col">
              <span className="font-medium text-sm">{data.user.name}</span>
              <span className="text-sm text-muted-foreground font-normal truncate">
                {data.user.email}
              </span>
              <Link
                href={`/users/${data.user.id}`}
                className="text-blue-500 mt-2"
              >
                View Profile
              </Link>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex cursor-pointer pl-4 text-muted-foreground hover:text-black">
          <Store className="h-4 w-4 text-blue-500" />
          <span className="ml-4">Buka toko</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer pl-4 text-muted-foreground hover:text-black">
          <LogOut className="h-4 w-4 text-destructive" />
          <span className="ml-4">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
