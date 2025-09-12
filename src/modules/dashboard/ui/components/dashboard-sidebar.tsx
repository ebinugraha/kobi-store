"use client";

import { CreditCard, LogOut, Package, Store } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../../components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";

const sidebar_item = [
  {
    label: "Produk",
    icon: Package,
    href: "/dashboard/product",
  },
  {
    label: "Store",
    icon: Store,
    href: "/dashboard/store",
  },
  {
    label: "Transaksi",
    icon: CreditCard,
    href: "/dashboard/transaction",
  },
  {
    label: "exit dashboard",
    icon: LogOut,
    href: "/",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="pt-16" collapsible="icon">
      <SidebarContent className="bg-background">
        <DashboardSidebarHeader />
        <SidebarGroup>
          <SidebarMenu>
            {sidebar_item.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  variant={"outline"}
                  isActive={item.href === pathname}
                >
                  <Link href={item.href} className="flex gap-4">
                    <item.icon />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
