import { SidebarTrigger } from "@/components/ui/sidebar";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { Handbag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardNavbarMenu } from "./dashboard-navbar-menu";
import { authClient } from "@/lib/auth-client";

export const DashboardNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 flex w-full bg-white border-b h-16 px-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <Image src={"/logo.svg"} height={32} width={32} alt="Logo" />
            <h1 className="text-lg font-semibold text-primary">Dashboard</h1>
          </Link>
        </div>
        <div className="flex">
          <DashboardNavbarMenu />
        </div>
      </div>
    </nav>
  );
};
