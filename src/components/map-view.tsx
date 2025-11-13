'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ParkingLot } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapViewProps {
    lots: ParkingLot[];
    isLoading: boolean;
}

const lotMarkers = [
    { id: '1', top: '35%', left: '25%' },
    { id: '2', top: '50%', left: '60%' },
    { id: '3', top: '65%', left: '30%' },
    { id: '4', top: '20%', left: '75%' },
    { id: '5', top: '75%', left: '70%' },
]

export function MapView({ lots, isLoading }: MapViewProps) {
  if (isLoading) {
    return (
        <Card className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
            <Skeleton className="w-full h-full" />
        </Card>
    )
  }

  return (
    <Card className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg relative">
        <Image
          src="https://picsum.photos/seed/renaissance-map/1280/720"
          alt="A stylized map from the renaissance period"
          fill
          style={{objectFit: "cover"}}
          className="rounded-lg"
          data-ai-hint="renaissance map"
        />
       <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
       
       {lots.map((lot, index) => {
         const marker = lotMarkers[index % lotMarkers.length];
         if (!marker) return null;
         
         return (
            <Popover key={lot.id}>
                <PopoverTrigger asChild>
                    <button
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                        style={{ top: marker.top, left: marker.left }}
                    >
                        <MapPin className="h-8 w-8 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] transition-transform hover:scale-110" />
                        <span 
                            className={cn(
                                "absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full animate-pulse",
                                (lot.availableSlots ?? 0) > 10 ? 'bg-green-400' : (lot.availableSlots ?? 0) > 0 ? 'bg-yellow-400' : 'bg-red-500'
                            )}
                        ></span>
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">{lot.name}</h4>
                            <p className="text-sm text-muted-foreground">{lot.address}</p>
                        </div>
                        <div className="grid gap-2">
                            <div className="grid grid-cols-2 items-center">
                                <span className="font-semibold">Available Slots:</span>
                                <span className="font-bold text-lg text-primary">{lot.availableSlots ?? 'N/A'}</span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                                <span className="font-semibold">Hourly Rate:</span>
                                <span>₹{lot.rates.perHour.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button asChild className="w-full">
                           <Link href={`/dashboard/lots/${lot.id}`}>View Details</Link>
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
         )
       })}
    </Card>
  );
}
