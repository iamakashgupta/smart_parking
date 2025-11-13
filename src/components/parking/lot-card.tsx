'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ParkingLot } from '@/lib/types';
import { MapPin, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface LotCardProps {
  lot: ParkingLot;
}

export function LotCard({ lot }: LotCardProps) {
  const availableCount = lot.availableSlots ?? 0;
  const occupancy = lot.totalSlots > 0 ? ((lot.totalSlots - availableCount) / lot.totalSlots) * 100 : 0;

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={lot.images[0]}
            alt={`Image of ${lot.name}`}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="parking garage"
          />
          <div className="absolute top-2 right-2">
             <Badge className="bg-background text-foreground border-transparent">
              {lot.distance}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold mb-2">{lot.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 mr-1.5" />
          <span>{lot.address}</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="font-medium text-foreground">Availability</span>
            <span className="font-semibold text-primary">
              {availableCount} / {lot.totalSlots}
            </span>
          </div>
          <Progress value={occupancy} className="h-2" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {lot.slotTypes && lot.slotTypes.slice(0, 3).map((type) => (
            <Badge key={type} variant="secondary">{type}</Badge>
          ))}
          {lot.slotTypes && lot.slotTypes.length > 3 && <Badge variant="secondary">+{lot.slotTypes.length - 3}</Badge>}
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
        <div>
          <span className="text-xl font-bold">₹{lot.rates.perHour.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>
        <Button asChild size="sm">
          <Link href={`/dashboard/lots/${lot.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3 p-4 border rounded-lg">
            <Skeleton className="h-[190px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <div className="flex justify-between items-center pt-4">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-1/3" />
            </div>
        </div>
    )
}
