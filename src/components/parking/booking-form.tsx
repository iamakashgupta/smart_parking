'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Car, AlertTriangle, Loader2 } from 'lucide-react';
import { format, addHours, differenceInHours, parse } from 'date-fns';
import { Timestamp, addDoc, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ParkingLot, User } from '@/lib/types';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  lot: ParkingLot & { slots: any[] };
  onBookingSuccess: (bookingId: string) => void;
}

export function BookingForm({ lot, onBookingSuccess }: BookingFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  
  const userDocRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<User>(userDocRef);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState<string>('09:00 AM');
  const [endTime, setEndTime] = useState<string>('11:00 AM');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const vehicles = userData?.vehicles || [];

  useEffect(() => {
    if (vehicles.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${String(displayHour).padStart(2, '0')}:${minute} ${ampm}`;
  });
  
  const parseTime = (timeStr: string) => parse(timeStr, 'hh:mm a', new Date());

  const estimatedCost = useMemo(() => {
    if (!date) return 0;
    
    const startDateTime = parseTime(startTime);
    const endDateTime = parseTime(endTime);

    if (startDateTime >= endDateTime) return 0;
    
    const hours = differenceInHours(endDateTime, startDateTime);
    return Math.max(1, hours) * lot.rates.perHour;
  }, [startTime, endTime, lot.rates.perHour]);

  const handleCreateBooking = async (isReservation: boolean) => {
    if (!date || !selectedVehicleId || !firestore || !user) {
        toast({ variant: 'destructive', title: 'Missing Information', description: 'Please select a vehicle, date, and time.' });
        return;
    }

    setIsSubmitting(true);

    const availableSlot = lot.slots.find(s => !s.isOccupied);
    if (!availableSlot) {
        toast({ variant: 'destructive', title: 'No Slots Available', description: 'This parking lot is currently full.' });
        setIsSubmitting(false);
        return;
    }

    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!selectedVehicle) {
        toast({ variant: 'destructive', title: 'Vehicle not found.' });
        setIsSubmitting(false);
        return;
    }

    try {
        const startDateTime = isReservation ? new Date(`${format(date, 'MM/dd/yyyy')} ${startTime}`) : new Date();
        const endDateTime = isReservation ? new Date(`${format(date, 'MM/dd/yyyy')} ${endTime}`) : addHours(startDateTime, 2);

        const bookingData = {
            userId: user.uid,
            lotId: lot.id,
            lotName: lot.name,
            slotId: availableSlot.id,
            vehicleReg: selectedVehicle.registrationNumber,
            startTime: Timestamp.fromDate(startDateTime),
            endTime: Timestamp.fromDate(endDateTime),
            status: isReservation ? 'Confirmed' : 'Active',
            totalCost: isReservation ? estimatedCost : lot.rates.perHour * 2, // Dummy cost for now
        };
        
        const batch = writeBatch(firestore);

        const bookingRef = doc(collection(firestore, 'bookings'));
        batch.set(bookingRef, { ...bookingData, id: bookingRef.id });

        const slotDocRef = doc(firestore, `parking_lots/${lot.id}/slots/${availableSlot.id}`);
        batch.update(slotDocRef, { isOccupied: true });

        await batch.commit();

        onBookingSuccess(bookingRef.id);
        toast({ title: 'Booking Successful!', description: 'Your spot is confirmed.' });
    } catch (error) {
        console.error("Error creating booking:", error);
        toast({ variant: 'destructive', title: 'Booking Failed', description: 'Could not create your booking. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (isUserLoading || isUserDataLoading) {
      return <Card className="shadow-lg flex items-center justify-center h-[500px]"><Loader2 className="h-8 w-8 animate-spin" /></Card>
  }

  if (!user) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Login to Book</CardTitle>
          <CardDescription>You need to be logged in to book a parking spot.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please log in or create an account to proceed with your booking.
              </AlertDescription>
            </Alert>
        </CardContent>
        <CardFooter className="flex-col gap-2">
           <Button className="w-full" asChild><Link href="/auth/login">Login</Link></Button>
           <Button variant="outline" className="w-full" asChild><Link href="/auth/signup">Sign Up</Link></Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg">
       <CardHeader>
        <CardTitle>Book a Spot</CardTitle>
        <CardDescription>Secure your parking spot at {lot.name}.</CardDescription>
      </CardHeader>
      <Tabs defaultValue="now" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="now">Book Now</TabsTrigger>
          <TabsTrigger value="reserve">Reserve</TabsTrigger>
        </TabsList>
        <TabsContent value="now">
           <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="vehicle-now">Vehicle</Label>
                <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                  <SelectTrigger id="vehicle-now">
                    <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.length > 0 ? vehicles.map(v => (
                       <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</SelectItem>
                    )) : <SelectItem value="none" disabled>No vehicles added. Please add one in your profile.</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-center p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-primary">₹{lot.rates.perHour.toFixed(2)}<span className="text-base font-normal text-muted-foreground">/hour</span></p>
                <p className="text-xs text-muted-foreground mt-1">You will be charged based on duration upon checkout.</p>
              </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleCreateBooking(false)} disabled={isSubmitting || !selectedVehicleId}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm & Get QR Code
            </Button>
          </CardFooter>
        </TabsContent>
        <TabsContent value="reserve">
           <CardContent className="pt-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicle-reserve">Vehicle</Label>
              <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                <SelectTrigger id="vehicle-reserve">
                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.length > 0 ? vehicles.map(v => (
                     <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</SelectItem>
                  )) : <SelectItem value="none" disabled>No vehicles added. Please add one in your profile.</SelectItem>}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger id="start-time">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => <SelectItem key={`start-${time}`} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger id="end-time">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => <SelectItem key={`end-${time}`} value={time}>{time}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <p className="text-2xl font-bold text-primary">₹{estimatedCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">For your reservation.</p>
              </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleCreateBooking(true)} disabled={isSubmitting || !selectedVehicleId || estimatedCost <= 0}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reserve Spot
            </Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
