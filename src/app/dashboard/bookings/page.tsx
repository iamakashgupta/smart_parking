'use client';
import { useState } from 'react';
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
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { Booking } from '@/lib/types';
import { format, differenceInHours } from 'date-fns';
import { MoreHorizontal, Loader2, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function MyBookingsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
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
  
  const handleViewReceipt = (booking: Booking) => {
    setSelectedBooking(booking);
  };
  
  const handleCheckIn = async (bookingId: string) => {
    if (!firestore) return;
    try {
      const bookingRef = doc(firestore, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: 'Active' });
      toast({
        title: 'Check-in Successful',
        description: 'Your booking is now active.',
      });
    } catch (error) {
      console.error('Check-in failed:', error);
      toast({
        variant: 'destructive',
        title: 'Check-in Failed',
        description: 'Could not update your booking status.',
      });
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
                <DropdownMenuItem onClick={() => handleViewReceipt(booking)}>View Receipt</DropdownMenuItem>
                {booking.status === 'Confirmed' && (
                  <DropdownMenuItem onClick={() => handleCheckIn(booking.id)}>Check-in</DropdownMenuItem>
                )}
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
  
  const renderReceiptDialog = () => {
    if (!selectedBooking) return null;

    const startTime = selectedBooking.startTime.toDate();
    const endTime = selectedBooking.endTime.toDate();
    const duration = differenceInHours(endTime, startTime);
    const durationText = duration > 0 ? `${duration} hour${duration > 1 ? 's' : ''}` : 'Less than an hour';

    return (
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Parking Receipt</DialogTitle>
            <DialogDescription>
              A summary of your parking session at {selectedBooking.lotName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Lot</span>
              <span className="font-medium">{selectedBooking.lotName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{format(startTime, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-medium">{format(startTime, 'h:mm a')}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={getStatusVariant(selectedBooking.status)}>{selectedBooking.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Vehicle Reg.</span>
              <span className="font-medium">{selectedBooking.vehicleReg}</span>
            </div>
             <div className="flex justify-between items-center text-lg font-semibold text-primary border-t pt-4 mt-4">
              <span>Total Cost</span>
              <span>₹{(selectedBooking.totalCost || 0).toFixed(2)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

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
      {renderReceiptDialog()}
    </div>
  );
}
