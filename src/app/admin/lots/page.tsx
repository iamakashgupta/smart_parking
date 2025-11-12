import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { demoLots } from '@/lib/data';
import { Input } from '@/components/ui/input';

export default function AdminLotsPage() {
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Lot Management"
        description="Create, edit, and manage all parking lots in the system."
      >
        <div className="flex items-center gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lots..." className="pl-9" />
            </div>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Lot
            </Button>
        </div>
      </PageHeader>
       <Card>
        <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lot Name</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead className="hidden md:table-cell">Total Slots</TableHead>
            <TableHead className="hidden md:table-cell">Hourly Rate</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demoLots.map((lot) => {
            const occupied = lot.totalSlots - lot.availableSlots;
            const occupancy = (occupied / lot.totalSlots) * 100;
            return (
              <TableRow key={lot.id}>
                <TableCell>
                  <div className="font-medium">{lot.name}</div>
                  <div className="text-sm text-muted-foreground">{lot.address}</div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Progress value={occupancy} className="h-2 w-24" />
                    <span className="text-xs text-muted-foreground">{occupied} / {lot.totalSlots} ({occupancy.toFixed(0)}%)</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{lot.totalSlots}</TableCell>
                <TableCell className="hidden md:table-cell">${lot.rates.perHour.toFixed(2)}</TableCell>
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
                      <DropdownMenuItem>Edit Lot Details</DropdownMenuItem>
                      <DropdownMenuItem>Manage Slots</DropdownMenuItem>
                      <DropdownMenuItem>Set Pricing</DropdownMenuItem>
                       <DropdownMenuItem className="text-destructive">Delete Lot</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      </CardContent>
      </Card>
    </div>
  );
}
