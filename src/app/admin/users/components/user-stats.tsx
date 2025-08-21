"use client";

import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { api } from '~/trpc/react';
import { Skeleton } from '~/components/ui/skeleton';
import { 
  UsersIcon, 
  UserCheckIcon, 
  UserXIcon, 
  CrownIcon,
  ShieldIcon,
  ShoppingBagIcon,
  UserIcon,
  TrendingUpIcon,
  CalendarIcon,
  ActivityIcon
} from 'lucide-react';

const UserStats = () => {
  const { data: stats, isLoading } = api.user.getStats.useQuery();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="gap-2 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }



  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="gap-2 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Total Users</CardTitle>
          <UsersIcon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total || 0}</div>
          <p className="text-xs text-muted-foreground">All registered users</p>
        </CardContent>
      </Card>

      <Card className="gap-2 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Active Users</CardTitle>
          <UserCheckIcon className="h-6 w-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats?.active || 0}
          </div>
          <p className="text-xs text-muted-foreground">Email verified users</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStats;
