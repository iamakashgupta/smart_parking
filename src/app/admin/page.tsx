'use client';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, ParkingCircle, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { ParkingLot, Booking } from '@/lib/types';
import { format, subDays, startOfDay } from 'date-fns';
import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Queries
  const lotsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'parking_lots')) : null, [firestore]);
  const allBookingsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bookings')) : null, [firestore]);
  const activeBookingsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bookings'), where('status', '==', 'Active')) : null, [firestore]);
  const recentActivityQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'bookings'), orderBy('startTime', 'desc'), limit(5)) : null, [firestore]);
  
  // Hooks
  const { data: lots, isLoading: isLoadingLots } = useCollection<ParkingLot>(lotsQuery);
  const { data: allBookings, isLoading: isLoadingAllBookings } = useCollection<Booking>(allBookingsQuery);
  const { data: activeBookings, isLoading: isLoadingActive } = useCollection<Booking>(activeBookingsQuery);
  const { data: recentActivity, isLoading: isLoadingRecent } = useCollection<Booking>(recentActivityQuery);

  // Calculations
  const totalRevenue = allBookings?.filter(b => b.status === 'Completed').reduce((sum, b) => sum + (b.totalCost || 0), 0) ?? 0;
  const activeBookingsCount = activeBookings?.length ?? 0;
  
  const { totalOccupancy, totalSlots } = lots?.reduce((acc, lot) => {
    const occupied = lot.totalSlots - (lot.availableSlots ?? 0);
    acc.totalOccupancy += occupied;
    acc.totalSlots += lot.totalSlots;
    return acc;
  }, { totalOccupancy: 0, totalSlots: 0 }) || { totalOccupancy: 0, totalSlots: 0 };
  
  const occupancyPercentage = totalSlots > 0 ? (totalOccupancy / totalSlots) * 100 : 0;

  const chartData = useMemo(() => {
    const data = [];
    const today = startOfDay(new Date());

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const formattedDate = format(date, 'MMM d');
      
      const dailyRevenue = allBookings
        ?.filter(b => b.status === 'Completed' && b.startTime && startOfDay(b.startTime.toDate()).getTime() === date.getTime())
        .reduce((sum, b) => sum + (b.totalCost || 0), 0) || 0;

      data.push({ date: formattedDate, revenue: dailyRevenue });
    }
    return data;
  }, [allBookings]);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
  };
  
  const isLoading = isLoadingLots || isLoadingAllBookings || isLoadingActive || isLoadingRecent;

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Admin Dashboard"
        description="Real-time overview of your parking operations."
      />
      {isLoading ? <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div> :
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="h-4 w-4 text-muted-foreground">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month (demo)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{activeBookingsCount}</div>
              <p className="text-xs text-muted-foreground">Currently parked users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System-Wide Occupancy</CardTitle>
              <ParkingCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{occupancyPercentage.toFixed(1)}%</div>
              <Progress value={occupancyPercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
             <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>Latest bookings and check-ins across all lots.</CardDescription>
             </CardHeader>
             <CardContent className="pl-2">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity?.map(activity => (
                     <TableRow key={activity.id}>
                        <TableCell className="truncate text-xs max-w-[100px]">{activity.userId}</TableCell>
                        <TableCell>{activity.lotName}</TableCell>
                         <TableCell>{activity.startTime ? format(activity.startTime.toDate(), 'h:mm a') : 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={activity.status === 'Active' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Last 7 days of revenue from completed bookings.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
                   <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    content={<ChartTooltipContent
                      formatter={(value) => `₹${value.toLocaleString()}`}
                      indicator="dot"
                    />}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      }
    </div>
  );
}
