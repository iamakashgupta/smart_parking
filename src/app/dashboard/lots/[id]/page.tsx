'use client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { PageHeader } from '@/components/dashboard/page-header';
import { BookingForm } from '@/components/parking/booking-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Users, Zap, Car, Accessibility, Wifi, Camera } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ParkingLot, ParkingSlot, SlotType } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function LotDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  const lotRef = doc(firestore, 'parking_lots', params.id);
  const { data: lot, isLoading: isLoadingLot } = useDoc<ParkingLot>(lotRef);
  
  const slotsQuery = query(collection(firestore, `parking_lots/${params.id}/slots`));
  const { data: slots, isLoading: isLoadingSlots } = useCollection<ParkingSlot>(slotsQuery);
  
  const availableSlotsCount = slots?.filter(s => !s.isOccupied).length ?? 0;
  
  if (isLoadingLot || isLoadingSlots) {
    return <PageSkeleton />;
  }

  if (!lot) {
    notFound();
  }
  
  const lotWithSlots = { ...lot, availableSlots: availableSlotsCount, slots: slots || [] };

  const handleBookingSuccess = (bookingId: string) => {
    setCurrentBookingId(bookingId);
    setShowSuccessDialog(true);
  }

  const occupancy = lot.totalSlots > 0 ? ((lot.totalSlots - availableSlotsCount) / lot.totalSlots) * 100 : 0;

  const slotTypeIcons: Record<SlotType, React.ReactNode> = {
    Compact: <Car className="h-5 w-5" />,
    Regular: <Car className="h-5 w-5" />,
    Large: <Car className="h-5 w-5" />,
    EV: <Zap className="h-5 w-5" />,
    Disabled: <Accessibility className="h-5 w-5" />,
  };
  
  const slotTypeData = (Object.keys(slotTypeIcons) as SlotType[]).map(type => {
      const total = slots?.filter(s => s.type === type).length ?? 0;
      const available = slots?.filter(s => s.type === type && !s.isOccupied).length ?? 0;
      return { type, total, available };
  }).filter(d => d.total > 0);


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
             <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm"><Wifi className="mr-2 h-4 w-4 text-green-500" /> Free WiFi</Badge>
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm"><Camera className="mr-2 h-4 w-4 text-blue-500" /> CCTV</Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Availability</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{availableSlotsCount}</div>
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
                    {lotWithSlots.slots.filter(s => s.type === 'EV').length > 0 ? 'Available' : 'N/A'}
                    </div>
                  <p className="text-xs text-muted-foreground">
                    {lotWithSlots.slots.filter(s => s.type === 'EV' && !s.isOccupied).length} spots open
                    </p>
                </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Live Availability by Slot Type</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {slotTypeData.map(item => (
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
            <BookingForm lot={lotWithSlots} onBookingSuccess={handleBookingSuccess} />
          </div>
        </div>
      </div>
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Booking Successful!</DialogTitle>
                <DialogDescription>
                    Your parking spot is confirmed. Use this QR code at the entry gate.
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
               {currentBookingId && <QRCode value={currentBookingId} size={256} />}
            </div>
             <Button asChild onClick={() => setShowSuccessDialog(false)}>
                <Link href="/dashboard/bookings">View My Bookings</Link>
            </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PageSkeleton() {
    return (
        <div className="container mx-auto px-0">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-5 w-80" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Skeleton className="h-96 w-full rounded-lg" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                    </div>
                    <Skeleton className="h-48 w-full" />
                </div>
                <div className="lg:col-span-1">
                     <Skeleton className="h-[500px] w-full" />
                </div>
            </div>
        </div>
    )
}