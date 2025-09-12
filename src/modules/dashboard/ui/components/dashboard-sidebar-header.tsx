import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/modules/auth/ui/components/user-avatar";
import Link from "next/link";

export const DashboardSidebarHeader = () => {
  const { state } = useSidebar();
  const { data } = authClient.useSession();

  if (!data) {
    return (
      <SidebarHeader className="flex items-center justify-center">
        <Skeleton className="h-30 w-30 mt-2 rounded-full" />
        <Skeleton className="w-[70px] h-5" />
        <Skeleton className="w-[80px] h-4 " />
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    return (
      <SidebarHeader className="flex items-center">
        <Link href={`/store/${data.user.id}`}>
          <UserAvatar
            className="hover:opacity-80 transition-opacity1"
            size={"sm"}
          />
        </Link>
      </SidebarHeader>
    );
  }

  return (
    <SidebarHeader className="flex items-center pb-4">
      <Link href={`/store/${data.user.id}`}>
        <UserAvatar
          className="hover:opacity-80 transition-opacity1"
          size={"xxl"}
        />
      </Link>
      <div className="flex flex-col mt-2 gap-y-2 items-center">
        <p className="text-sm font-medium">Your store name</p>
        <p className="text-xs text-muted-foreground">{data.user.name}</p>
      </div>
    </SidebarHeader>
  );
};
