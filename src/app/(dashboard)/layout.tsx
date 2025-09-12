import { auth } from "@/lib/auth";
import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default Layout;
