
"use client";

import { usePathname } from "next/navigation";
import { breadcrumbLabels } from "~/utils/breadcrumbs/breadcrumbs";

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      breadcrumbLabels[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return {
      label,
      href,
      isCurrent: index === segments.length - 1,
    };
  });
}
