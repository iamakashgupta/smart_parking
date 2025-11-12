'use client';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ParkingLot } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface MapViewProps {
    lots: ParkingLot[];
}

export function MapView({ lots }: MapViewProps) {
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map-placeholder');

  if (!mapImage) {
      return (
          <Card className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Skeleton className="w-full h-full" />
          </Card>
      )
  }

  return (
    <Card className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg relative">
        <Image
          src={mapImage.imageUrl}
          alt={mapImage.description}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          data-ai-hint={mapImage.imageHint}
        />
       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
       {/* Future: Add map markers for lots */}
    </Card>
  );
}
