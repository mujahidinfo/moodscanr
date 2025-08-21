"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";
import { useBreadcrumbs } from "~/hooks/use-breadcrumbs";
import Link from "next/link";

export default function WrapBreadcrumb() {
  const breadcrumbs = useBreadcrumbs();
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, i) => (
            <React.Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isCurrent ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isCurrent && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
