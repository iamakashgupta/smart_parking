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
import { Button } from '@/components/ui/button';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Booking } from '@/lib/types';
import { format } from 'date-fns';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MyBookingsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    // Removed orderBy to prevent complex query issues with security rules
    return query(collection(firestore, 'bookings'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: bookings, isLoading: isLoadingBookings } = useCollection<Booking>(bookingsQuery);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
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
    if (isUserLoading || (user && isLoadingBookings)) {
       return (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </TableCell>
        </TableRow>
      );
    }

    if (!user) {
       return (
        <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
                Please log in to see your bookings.
            </TableCell>
        </TableRow>
    );
    }
    
    if (bookings && bookings.length > 0) {
      // Sort client-side
      const sortedBookings = [...bookings].sort((a, b) => {
        const timeA = a.startTime?.toMillis() || 0;
        const timeB = b.startTime?.toMillis() || 0;
        return timeB - timeA;
      });

      return sortedBookings.map((booking) => (
        <TableRow key={booking.id}>
          <TableCell>
            <div className="font-medium">{booking.lotName}</div>
            <div className="text-sm text-muted-foreground hidden md:inline">
              Slot ID: {booking.slotId.substring(0, 8)}...
            </div>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {booking.startTime ? format(booking.startTime.toDate(), 'MMM d, yyyy, h:mm a') : 'N/A'}
          </TableCell>
          <TableCell>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </TableCell>
          <TableCell className="text-right">
            ₹{(booking.totalCost || 0).toFixed(2)}
          </TableCell>
          <TableCell className="text-right">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Receipt</DropdownMenuItem>
                {booking.status === 'Confirmed' && <DropdownMenuItem>Cancel Booking</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ));
    }
    
    return (
        <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
                You haven't made any bookings yet.
            </TableCell>
        </TableRow>
    );
  };

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="My Bookings"
        description="View your active, upcoming, and past bookings."
      />
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
           <CardDescription>
            A list of all your parking sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parking Lot</TableHead>
                <TableHead className="hidden md:table-cell">Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
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
