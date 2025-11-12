'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { ParkingCircle, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { collection, query, doc, updateDoc } from 'firebase/firestore';
import { ParkingLot, ParkingSlot } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminSimulatorPage() {
  const firestore = useFirestore();

  const lotsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'parking_lots')) : null, [firestore]);
  const { data: lots, isLoading: isLoadingLots } = useCollection<ParkingLot>(lotsQuery);

  const [selectedLotId, setSelectedLotId] = useState<string | undefined>();
  const [selectedSlotId, setSelectedSlotId] = useState<string | undefined>();
  
  const slotsQuery = useMemoFirebase(() => (firestore && selectedLotId) ? query(collection(firestore, `parking_lots/${selectedLotId}/slots`)) : null, [firestore, selectedLotId]);
  const { data: slots, isLoading: isLoadingSlots } = useCollection<ParkingSlot>(slotsQuery);

  const slotDocRef = useMemoFirebase(() => (firestore && selectedLotId && selectedSlotId) ? doc(firestore, `parking_lots/${selectedLotId}/slots/${selectedSlotId}`) : null, [firestore, selectedLotId, selectedSlotId]);
  const { data: selectedSlot, isLoading: isLoadingSlot } = useDoc<ParkingSlot>(slotDocRef);

  useEffect(() => {
    if (lots && lots.length > 0 && !selectedLotId) {
      setSelectedLotId(lots[0].id);
    }
  }, [lots, selectedLotId]);

  useEffect(() => {
    if (selectedLotId && slots && slots.length > 0) {
      if (!selectedSlotId || !slots.find(s => s.id === selectedSlotId)) {
        setSelectedSlotId(slots[0].id);
      }
    } else {
      setSelectedSlotId(undefined);
    }
  }, [selectedLotId, slots, selectedSlotId]);

  const handleLotChange = (lotId: string) => {
    setSelectedLotId(lotId);
    setSelectedSlotId(undefined);
  };

  const handleStatusChange = async (isOccupied: boolean) => {
    if (!slotDocRef) return;
    try {
      await updateDoc(slotDocRef, { isOccupied });
      toast({
        title: "Sensor Event Sent",
        description: `Slot ${selectedSlotId?.substring(0, 8)}... marked as ${isOccupied ? 'Occupied' : 'Vacant'}.`,
      });
    } catch (error) {
      console.error("Failed to update slot status:", error);
      toast({ variant: 'destructive', title: "Update Failed", description: "Could not update slot status." });
    }
  };

  const isOccupied = selectedSlot?.isOccupied ?? false;
  const isActionDisabled = !selectedSlotId || isLoadingLots || isLoadingSlots || isLoadingSlot;

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="IoT Sensor Simulator"
        description="Simulate sensor events to test real-time occupancy updates."
      />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sensor/Gate Event Simulator</CardTitle>
          <CardDescription>
            Select a lot and slot to manually trigger an occupied/vacant event. This simulates a real-world sensor update.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="lot-select">Parking Lot</Label>
              {isLoadingLots ? <Loader2 className="animate-spin mt-2"/> :
              <Select value={selectedLotId} onValueChange={handleLotChange} disabled={!lots || lots.length === 0}>
                <SelectTrigger id="lot-select">
                  <SelectValue placeholder="Select a lot" />
                </SelectTrigger>
                <SelectContent>
                  {lots?.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>{lot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              }
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-select">Parking Slot</Label>
               {isLoadingSlots || !selectedLotId ? <Loader2 className="animate-spin mt-2"/> :
              <Select value={selectedSlotId} onValueChange={setSelectedSlotId} disabled={!slots || slots.length === 0}>
                <SelectTrigger id="slot-select">
                  <SelectValue placeholder="Select a slot" />
                </SelectTrigger>
                <SelectContent>
                  {slots?.slice(0,100).map((slot) => ( // Limiting to 100 for performance
                    <SelectItem key={slot.id} value={slot.id}>
                      Slot {slot.id.substring(0,8)}... (Lvl {slot.level}, {slot.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              }
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Card className="bg-muted w-full">
             {isActionDisabled ? <div className="p-6 flex justify-center"><Loader2 className="animate-spin" /></div> :
            <CardContent className="p-6 flex items-center justify-between">
                <div className='flex items-center'>
                    <ParkingCircle className='w-6 h-6 text-muted-foreground mr-4'/>
                    <div>
                        <p className="font-semibold">Slot Status</p>
                        <p className="text-sm text-muted-foreground">Toggle to simulate vehicle presence.</p>
                    </div>
                </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-switch" className={cn(!isOccupied ? "text-foreground font-medium" : "text-muted-foreground")}>
                  Vacant
                </Label>
                <Switch 
                  id="status-switch" 
                  checked={isOccupied} 
                  onCheckedChange={handleStatusChange}
                  disabled={isActionDisabled}
                />
                <Label htmlFor="status-switch" className={cn(isOccupied ? "text-foreground font-medium" : "text-muted-foreground")}>
                  Occupied
                </Label>
              </div>
            </CardContent>
             }
          </Card>
        </CardFooter>
      </Card>
    </div>
  );
}
