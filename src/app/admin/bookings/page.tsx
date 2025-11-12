'use client';
import { PageHeader } from '@/components/dashboard/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function AdminBookingsPage() {
  const firestore = useFirestore();

  // Query top-level bookings collection
  const bookingsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, `bookings`), orderBy('startTime', 'desc')) : null, 
    [firestore]
  );
  const { data: bookings, isLoading: isLoadingBookings } = useCollection<Booking>(bookingsQuery);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'Confirmed':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const renderContent = () => {
    if (isLoadingBookings) {
      return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </TableCell>
        </TableRow>
      );
    }
    
    if (bookings && bookings.length > 0) {
      return bookings.map((booking) => (
        <TableRow key={booking.id}>
           <TableCell className="font-medium truncate text-xs max-w-[100px]">{booking.userId}</TableCell>
          <TableCell>
            <div className="font-medium">{booking.lotName}</div>
            <div className="text-sm text-muted-foreground hidden md:inline">
              Slot ID: {booking.slotId.substring(0, 8)}...
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {booking.startTime ? format(booking.startTime.toDate(), 'MMM d, h:mm a') : 'N/A'}
          </TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(booking.status) as any}>
              {booking.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            ₹{(booking.totalCost || 0).toFixed(2)}
          </TableCell>
        </TableRow>
      ));
    }
    
    return (
        <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
                No bookings found in the system.
            </TableCell>
        </TableRow>
    );
  };

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="All Bookings"
        description="A comprehensive list of all user bookings in the system."
      />
      <Card>
        <CardHeader>
          <CardTitle>System-Wide Booking History</CardTitle>
          <CardDescription>Monitor all recent and ongoing parking activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Parking Lot</TableHead>
                <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
