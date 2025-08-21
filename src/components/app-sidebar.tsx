import * as React from "react";
import { NavMain } from "~/components/nav-main";
import { NavUser } from "~/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import Image from "next/image";
import Link from "next/link";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();

  if (!session?.user) return null;

  const user = {
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: session.user.image || "/images/user.png",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 mb-2">
          <Image
            src={"/logo.png"}
            width={300}
            height={300}
            alt="Taja soday Logo"
            className="w-10"
          />
          <span className="text-lg font-bold">MoodScanr Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain/>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
