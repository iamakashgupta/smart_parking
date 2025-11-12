'use client';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, ParkingCircle, Loader2 } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { ParkingLot, Booking } from '@/lib/types';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  // Queries
  const lotsQuery = query(collection(firestore, 'parking_lots'));
  const allBookingsQuery = query(collection(firestore, 'bookings')); // Note: This is not scalable for a real app.
                                                                    // For a real app, you'd aggregate this data.
  const activeBookingsQuery = query(collection(firestore, 'bookings'), where('status', '==', 'Active'));
  const recentActivityQuery = query(collection(firestore, 'bookings'), orderBy('startTime', 'desc'), limit(4));
  
  // Hooks
  const { data: lots, isLoading: isLoadingLots } = useCollection<ParkingLot>(lotsQuery);
  const { data: allBookings, isLoading: isLoadingAllBookings } = useCollection<Booking>(allBookingsQuery);
  const { data: activeBookings, isLoading: isLoadingActive } = useCollection<Booking>(activeBookingsQuery);
  const { data: recentActivity, isLoading: isLoadingRecent } = useCollection<Booking>(recentActivityQuery);

  // Calculations
  const totalRevenue = allBookings?.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalCost, 0) ?? 0;
  const activeBookingsCount = activeBookings?.length ?? 0;

  const { totalOccupancy, totalSlots } = lots?.reduce((acc, lot) => {
    const occupied = lot.totalSlots - (lot.availableSlots || lot.totalSlots);
    acc.totalOccupancy += occupied;
    acc.totalSlots += lot.totalSlots;
    return acc;
  }, { totalOccupancy: 0, totalSlots: 0 }) || { totalOccupancy: 0, totalSlots: 0 };
  
  const occupancyPercentage = totalSlots > 0 ? (totalOccupancy / totalSlots) * 100 : 0;
  
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
              <Progress value={occupancyPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
             <CardHeader>
                <CardTitle>Weekly Revenue</CardTitle>
                <CardDescription>Chart not implemented yet.</CardDescription>
             </CardHeader>
             <CardContent className="pl-2 flex items-center justify-center h-[300px] text-muted-foreground">
                Coming soon...
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest check-ins and check-outs.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity?.map(activity => (
                     <TableRow key={activity.id}>
                        <TableCell className="truncate text-xs">{activity.userId}</TableCell>
                        <TableCell>{activity.lotName}</TableCell>
                        <TableCell>
                          <Badge variant={activity.status === 'Active' ? 'default' : 'secondary'}>
                            {activity.status === 'Active' ? 'Check-in' : activity.status}
                          </Badge>
                        </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      }
    </div>
  );
}
