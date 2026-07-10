import AppSidebar from "@/components/Dashboard/AppSidebar";
import PrivateHeader from "@/components/Header/PrivateHeader";
import { SidebarInset, SidebarProvider } from "@/components/shadcnui/sidebar";
import { auth } from "@/lib/auth";
import { LayoutChildrenProps } from "@/lib/type";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const PrivetLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider>
      <AppSidebar userId={session.user.id} />
      <SidebarInset>
        <PrivateHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PrivetLayout;
