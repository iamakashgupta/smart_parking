'use client';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { ParkingLot } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface MapViewProps {
    lots: ParkingLot[];
    isLoading: boolean;
}

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
          src="https://picsum.photos/seed/city-map/1280/720"
          alt="A stylized map of a city showing streets and locations"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          data-ai-hint="city map"
        />
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
       {/* Future: Add map markers for lots */}
    </Card>
  );
}
