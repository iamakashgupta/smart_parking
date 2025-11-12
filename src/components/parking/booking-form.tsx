'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Car } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { ParkingLot } from '@/lib/types';
import { demoUsers } from '@/lib/data';

interface BookingFormProps {
  lot: ParkingLot;
}

export function BookingForm({ lot }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const user = demoUsers[0];

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${String(displayHour).padStart(2, '0')}:${minute} ${ampm}`;
  });

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
                <Select defaultValue={user.vehicles[0].id}>
                  <SelectTrigger id="vehicle-now">
                    <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select your vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {user.vehicles.map(v => (
                       <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</SelectItem>
                    ))}
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
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Confirm & Get QR Code</Button>
          </CardFooter>
        </TabsContent>
        <TabsContent value="reserve">
           <CardContent className="pt-6 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicle-reserve">Vehicle</Label>
              <Select defaultValue={user.vehicles[0].id}>
                <SelectTrigger id="vehicle-reserve">
                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {user.vehicles.map(v => (
                     <SelectItem key={v.id} value={v.id}>{v.make} {v.model} ({v.registrationNumber})</SelectItem>
                  ))}
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
                <Select>
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
                <Select>
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
                <p className="text-2xl font-bold text-primary">₹350.00</p>
                <p className="text-xs text-muted-foreground mt-1">For a 2-hour reservation.</p>
              </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Reserve Spot</Button>
          </CardFooter>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
