"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Users,
  TrendingUpIcon,
  TrendingDownIcon,
  FileText,
} from "lucide-react";
import { Suspense } from "react";

// Main Stats Cards Component
const MainStatsCards = () => {
  const { data: stats, isLoading } = api.overview.getOverviewStats.useQuery();

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const mainStats = [
    {
      title: "Total Users",
      value: stats.userCount || "0",
      icon: Users,
      description: `this month`,
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {mainStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-white shadow-none border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="flex items-center mt-1">
                {stat.trend === "up" ? (
                  <TrendingUpIcon className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="h-3 w-3 text-red-500 mr-1" />
                )}
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};



// Main Dashboard Component
export default function DashboardPage() {
  return (
    <div>
      <div className="m-6">
        <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-600 mt-2">
          Monitor your agency performance and key metrics
        </p>
      </div>

      <div className="space-y-8">
        {/* Main Stats Cards */}
        <Suspense fallback={<div>Loading main stats...</div>}>
          <MainStatsCards />
        </Suspense>
      </div>
    </div>
  );
}
