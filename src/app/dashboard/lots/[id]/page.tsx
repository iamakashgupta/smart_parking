import Image from 'next/image';
import { notFound } from 'next/navigation';
import { demoLots } from '@/lib/data';
import { PageHeader } from '@/components/dashboard/page-header';
import { BookingForm } from '@/components/parking/booking-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Zap, Car, Accessibility } from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { SlotType } from '@/lib/types';

export default function LotDetailPage({ params }: { params: { id: string } }) {
  const lot = demoLots.find((l) => l.id === params.id);

  if (!lot) {
    notFound();
  }

  const chartData = [
    { type: "Compact", total: lot.slots.filter(s=> s.type === 'Compact').length, available: lot.slots.filter(s=> s.type === 'Compact' && !s.isOccupied).length },
    { type: "Regular", total: lot.slots.filter(s=> s.type === 'Regular').length, available: lot.slots.filter(s=> s.type === 'Regular' && !s.isOccupied).length },
    { type: "Large", total: lot.slots.filter(s=> s.type === 'Large').length, available: lot.slots.filter(s=> s.type === 'Large' && !s.isOccupied).length },
    { type: "EV", total: lot.slots.filter(s=> s.type === 'EV').length, available: lot.slots.filter(s=> s.type === 'EV' && !s.isOccupied).length },
    { type: "Disabled", total: lot.slots.filter(s=> s.type === 'Disabled').length, available: lot.slots.filter(s=> s.type === 'Disabled' && !s.isOccupied).length },
  ].filter(d => d.total > 0);

  const chartConfig = {
    available: {
      label: 'Available',
      color: 'hsl(var(--accent))',
    },
    total: {
      label: 'Total',
      color: 'hsl(var(--primary))',
    },
  } satisfies ChartConfig;

  const slotTypeIcons: Record<SlotType, React.ReactNode> = {
    Compact: <Car className="h-5 w-5" />,
    Regular: <Car className="h-5 w-5" />,
    Large: <Car className="h-5 w-5" />,
    EV: <Zap className="h-5 w-5" />,
    Disabled: <Accessibility className="h-5 w-5" />,
  };

  const occupancy = ((lot.totalSlots - lot.availableSlots) / lot.totalSlots) * 100;

  return (
    <div className="container mx-auto px-0">
      <PageHeader title={lot.name} description={lot.address}>
         <Button variant="outline" asChild>
          <Link href="/dashboard/lots">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lots
          </Link>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={lot.images[0]}
              alt={`Hero image for ${lot.name}`}
              fill
              objectFit="cover"
              data-ai-hint="parking garage"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="text-base py-1 px-3">{lot.operatingHours}</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Availability</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{lot.availableSlots}</div>
                  <p className="text-xs text-muted-foreground">of {lot.totalSlots} slots</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
                  <span className="h-4 w-4 text-muted-foreground">₹</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{lot.rates.perHour.toFixed(2)}</div>
                   <p className="text-xs text-muted-foreground">Daily rate ₹{lot.rates.perDay}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{occupancy.toFixed(0)}%</div>
                   <Progress value={occupancy} className="h-1 mt-2" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">EV Charging</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">
                    {lot.slots.filter(s => s.type === 'EV').length > 0 ? 'Available' : 'N/A'}
                    </div>
                  <p className="text-xs text-muted-foreground">
                    {lot.slots.filter(s => s.type === 'EV' && !s.isOccupied).length} spots open
                    </p>
                </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live Availability by Slot Type</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chartData.map(item => (
                     <div key={item.type} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                        <div className="text-primary">{slotTypeIcons[item.type as SlotType]}</div>
                        <div>
                            <div className="font-semibold">{item.type}</div>
                            <div className="text-sm text-muted-foreground">
                                <span className="font-bold text-foreground">{item.available}</span> / {item.total} free
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <BookingForm lot={lot} />
          </div>
        </div>
      </div>
    </div>
  );
}
