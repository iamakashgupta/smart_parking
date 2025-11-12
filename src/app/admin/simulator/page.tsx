'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { demoLots } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { ParkingCircle } from 'lucide-react';

export default function AdminSimulatorPage() {
  const [selectedLotId, setSelectedLotId] = useState(demoLots[0].id);
  const [selectedSlotId, setSelectedSlotId] = useState(demoLots[0].slots[0].id);
  const [isOccupied, setIsOccupied] = useState(demoLots[0].slots[0].isOccupied);

  const selectedLot = demoLots.find(lot => lot.id === selectedLotId);
  const selectedSlot = selectedLot?.slots.find(slot => slot.id === selectedSlotId);

  const handleLotChange = (lotId: string) => {
    const newLot = demoLots.find(l => l.id === lotId);
    if (newLot) {
      setSelectedLotId(lotId);
      const newSlot = newLot.slots[0];
      setSelectedSlotId(newSlot.id);
      setIsOccupied(newSlot.isOccupied);
    }
  };

  const handleSlotChange = (slotId: string) => {
     const lot = demoLots.find(l => l.id === selectedLotId);
     const newSlot = lot?.slots.find(s => s.id === slotId);
     if (newSlot) {
        setSelectedSlotId(slotId);
        setIsOccupied(newSlot.isOccupied);
     }
  };

  const handleStatusChange = (checked: boolean) => {
    setIsOccupied(checked);
    toast({
        title: "Sensor Event Sent",
        description: `Slot ${selectedSlotId} in ${selectedLot?.name} marked as ${checked ? 'Occupied' : 'Vacant'}.`,
    })
  }

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
              <Select value={selectedLotId} onValueChange={handleLotChange}>
                <SelectTrigger id="lot-select">
                  <SelectValue placeholder="Select a lot" />
                </SelectTrigger>
                <SelectContent>
                  {demoLots.map((lot) => (
                    <SelectItem key={lot.id} value={lot.id}>{lot.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slot-select">Parking Slot</Label>
              <Select value={selectedSlotId} onValueChange={handleSlotChange}>
                <SelectTrigger id="slot-select">
                  <SelectValue placeholder="Select a slot" />
                </SelectTrigger>
                <SelectContent>
                  {selectedLot?.slots.slice(0,100).map((slot) => ( // Limiting to 100 for performance
                    <SelectItem key={slot.id} value={slot.id}>
                      Slot {slot.id} (Level {slot.level}, {slot.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Card className="bg-muted">
            <CardContent className="p-6 flex items-center justify-between">
                <div className='flex items-center'>
                    <ParkingCircle className='w-6 h-6 text-muted-foreground mr-4'/>
                    <div>
                        <p className="font-semibold">Slot Status</p>
                        <p className="text-sm text-muted-foreground">Toggle to simulate vehicle presence.</p>
                    </div>
                </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="status-switch" className={cn(isOccupied ? "text-muted-foreground" : "text-foreground font-medium")}>
                  Vacant
                </Label>
                <Switch 
                  id="status-switch" 
                  checked={isOccupied} 
                  onCheckedChange={handleStatusChange}
                />
                <Label htmlFor="status-switch" className={cn(isOccupied ? "text-foreground font-medium" : "text-muted-foreground")}>
                  Occupied
                </Label>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
