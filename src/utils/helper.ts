import { BookOpen, LayoutDashboard, Users } from "lucide-react";

export const getNavItems = () => {
  
    const items = [
      {
        title: "Dashboard",
        url: "/admin/overview",
        icon: LayoutDashboard,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "/admin/overview",
          },
        ],
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: Users,
        items: [
          {
            title: "All Users",
            url: "/admin/users",
            isActive: true,
          },
        ],
      },
    ];
   return items;
 };