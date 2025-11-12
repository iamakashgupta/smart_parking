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
import { demoLots, demoBookings } from '@/lib/data';
import { DollarSign, Users, ParkingCircle } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

export default function AdminDashboardPage() {
  const totalRevenue = demoBookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.totalCost, 0) + 532;
  const activeBookings = demoBookings.filter(b => b.status === 'Active').length;
  const totalOccupancy = demoLots.reduce((sum, lot) => sum + (lot.totalSlots - lot.availableSlots), 0);
  const totalSlots = demoLots.reduce((sum, lot) => sum + lot.totalSlots, 0);
  const occupancyPercentage = (totalOccupancy / totalSlots) * 100;

  const chartData = [
    { date: "Mon", revenue: 550 }, { date: "Tue", revenue: 480 },
    { date: "Wed", revenue: 620 }, { date: "Thu", revenue: 780 },
    { date: "Fri", revenue: 950 }, { date: "Sat", revenue: 1100 },
    { date: "Sun", revenue: 850 },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
  } satisfies ChartConfig;

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Admin Dashboard"
        description="Real-time overview of your parking operations."
      />
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{activeBookings}</div>
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
                <CardDescription>Showing revenue for the last 7 days.</CardDescription>
             </CardHeader>
             <CardContent className="pl-2">
                 <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                    <Area dataKey="revenue" type="natural" fill="var(--color-revenue)" fillOpacity={0.4} stroke="var(--color-revenue)" />
                  </AreaChart>
                </ChartContainer>
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
                    <TableHead>User</TableHead>
                    <TableHead>Lot</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Alex Johnson</TableCell>
                    <TableCell>Downtown Central</TableCell>
                    <TableCell><Badge>Check-in</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maria Garcia</TableCell>
                    <TableCell>Uptown Open Lot</TableCell>
                    <TableCell><Badge variant="secondary">Check-out</Badge></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Sam Wilson</TableCell>
                    <TableCell>Riverfront Complex</TableCell>
                    <TableCell><Badge>Check-in</Badge></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell>Jane Doe</TableCell>
                    <TableCell>Downtown Central</TableCell>
                    <TableCell><Badge variant="secondary">Check-out</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
