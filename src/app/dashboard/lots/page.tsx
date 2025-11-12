'use client';
import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { LotCard } from '@/components/parking/lot-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { ParkingLot, SlotType } from '@/lib/types';
import { Search, ListFilter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FindLotsPage() {
  const firestore = useFirestore();
  const lotsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'parking_lots')) : null, [firestore]);
  const { data: lots, isLoading: isLoadingLots } = useCollection<ParkingLot>(lotsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlotTypes, setSelectedSlotTypes] = useState<Record<SlotType, boolean>>({
    Compact: false,
    Regular: false,
    Large: false,
    EV: false,
    Disabled: false
  });

  const handleFilterChange = (type: SlotType, checked: boolean) => {
    setSelectedSlotTypes(prev => ({ ...prev, [type]: checked }));
  }

  const filteredLots = useMemo(() => {
    const activeFilters = Object.entries(selectedSlotTypes)
      .filter(([, checked]) => checked)
      .map(([type]) => type as SlotType);

    if (!lots) return [];

    return lots.filter(lot => {
      const matchesSearch = lot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            lot.address.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = activeFilters.length === 0 ||
                             (lot.slotTypes && activeFilters.every(type => lot.slotTypes.includes(type)));

      return matchesSearch && matchesFilters;
    });
  }, [lots, searchTerm, selectedSlotTypes]);

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Find Parking"
        description="Browse all available parking lots."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search lots..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Slot Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(Object.keys(selectedSlotTypes) as SlotType[]).map(type => (
                   <DropdownMenuCheckboxItem 
                     key={type}
                     checked={selectedSlotTypes[type]}
                     onCheckedChange={(checked) => handleFilterChange(type, !!checked)}
                   >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </PageHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {isLoadingLots ? (
          Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
        ) : filteredLots.length > 0 ? (
          filteredLots.map((lot) => (
            <LotCard key={lot.id} lot={lot} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No parking lots found that match your criteria.
          </p>
        )}
      </div>
    </div>
  );
}

function CardSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
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
