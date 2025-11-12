import { PageHeader } from '@/components/dashboard/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { demoBookings, demoLots } from '@/lib/data';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function MyBookingsPage() {
  const getLotName = (lotId: string) => {
    return demoLots.find((lot) => lot.id === lotId)?.name || 'Unknown Lot';
  };

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

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="My Bookings"
        description="View your active, upcoming, and past bookings."
      />
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parking Lot</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{getLotName(booking.lotId)}</div>
                    <div className="text-sm text-muted-foreground hidden md:inline">
                      Slot {booking.slotId}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(booking.startTime, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.status) as any}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${booking.totalCost.toFixed(2)}
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
