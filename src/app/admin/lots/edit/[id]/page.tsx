'use client';
import { useState, useEffect } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, setDoc, addDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { ParkingLot, SlotType } from '@/lib/types';

const slotTypes: SlotType[] = ['Compact', 'Regular', 'Large', 'EV', 'Disabled'];

const lotFormSchema = z.object({
  name: z.string().min(3, 'Lot name must be at least 3 characters.'),
  address: z.string().min(5, 'Address is required.'),
  totalSlots: z.number().int().min(1, 'There must be at least 1 slot.'),
  rates: z.object({
    perHour: z.number().min(0, 'Hourly rate cannot be negative.'),
    perDay: z.number().min(0, 'Daily rate cannot be negative.'),
  }),
  operatingHours: z.string().min(1, 'Operating hours are required.'),
  slotTypes: z.array(z.string()).min(1, 'At least one slot type must be selected.'),
  distance: z.string().min(1, 'Distance is required.'),
});

type LotFormData = z.infer<typeof lotFormSchema>;

export default function LotEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNewLot = id === 'new';

  const firestore = useFirestore();
  const lotDocRef = useMemoFirebase(() => {
    if (!firestore || isNewLot) return null;
    return doc(firestore, 'parking_lots', id);
  }, [firestore, id, isNewLot]);
  
  const { data: lot, isLoading: isLoadingLot } = useDoc<ParkingLot>(lotDocRef);
  
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<LotFormData>({
    resolver: zodResolver(lotFormSchema),
    defaultValues: {
      name: 'Cyber City Parkade',
      address: 'Sector 24, Gurugram, Haryana',
      totalSlots: 150,
      rates: { perHour: 80, perDay: 500 },
      operatingHours: '24/7',
      slotTypes: ['Regular', 'EV', 'Compact'],
      distance: '2.5 km',
    }
  });

  const selectedSlotTypes = watch('slotTypes');

  useEffect(() => {
    if (lot && !isNewLot) {
      reset({
        name: lot.name,
        address: lot.address,
        totalSlots: lot.totalSlots,
        rates: lot.rates,
        operatingHours: lot.operatingHours,
        slotTypes: lot.slotTypes,
        distance: lot.distance
      });
    }
  }, [lot, isNewLot, reset]);

  const onSubmit: SubmitHandler<LotFormData> = async (data) => {
    if (!firestore) return;
    setIsSaving(true);
    
    try {
      if (isNewLot) {
        const newLotData = {
          ...data,
          images: [
            `https://picsum.photos/seed/${Date.now()}/800/600`,
            `https://picsum.photos/seed/${Date.now() + 1}/800/600`
          ],
          location: { lat: 28.496, lng: 77.088 }, // Gurugram location
          createdAt: serverTimestamp(),
          availableSlots: data.totalSlots, // Initially all slots are available
        };

        const newLotRef = await addDoc(collection(firestore, 'parking_lots'), newLotData);

        // Batch create slots for the new lot
        const batch = writeBatch(firestore);
        for (let i = 0; i < data.totalSlots; i++) {
          const slotType = data.slotTypes[i % data.slotTypes.length] as SlotType;
          const slotRef = doc(collection(firestore, `parking_lots/${newLotRef.id}/slots`));
          batch.set(slotRef, {
            lotId: newLotRef.id,
            level: Math.floor(i / 50) + 1, // Using a constant for slots per level
            type: slotType,
            isOccupied: false,
          });
        }
        await batch.commit();

        toast({ title: 'Lot Created', description: `"${data.name}" has been added.` });
        router.push('/admin/lots');
      } else {
        await setDoc(doc(firestore, 'parking_lots', id), data, { merge: true });
        toast({ title: 'Lot Updated', description: `"${data.name}" has been updated.` });
        router.push('/admin/lots');
      }
    } catch (error) {
      console.error('Failed to save lot:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save the parking lot.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingLot && !isNewLot) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!isNewLot && !lot) {
    notFound();
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title={isNewLot ? 'Add New Lot' : 'Edit Lot'}
        description={isNewLot ? 'Fill in the details to create a new parking lot.' : `Editing details for ${lot?.name}.`}
      >
        <Button variant="outline" asChild>
          <Link href="/admin/lots">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lots
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Lot Details</CardTitle>
            <CardDescription>Provide the core information for this parking facility.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Lot Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" {...register('address')} />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="totalSlots">Total Slots</Label>
              <Input id="totalSlots" type="number" {...register('totalSlots', { valueAsNumber: true })} />
              {errors.totalSlots && <p className="text-sm text-destructive">{errors.totalSlots.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="operatingHours">Operating Hours</Label>
              <Input id="operatingHours" {...register('operatingHours')} />
              {errors.operatingHours && <p className="text-sm text-destructive">{errors.operatingHours.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rates.perHour">Hourly Rate (₹)</Label>
              <Input id="rates.perHour" type="number" {...register('rates.perHour', { valueAsNumber: true })} />
              {errors.rates?.perHour && <p className="text-sm text-destructive">{errors.rates.perHour.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rates.perDay">Daily Rate (₹)</Label>
              <Input id="rates.perDay" type="number" {...register('rates.perDay', { valueAsNumber: true })} />
              {errors.rates?.perDay && <p className="text-sm text-destructive">{errors.rates.perDay.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="distance">Distance</Label>
              <Input id="distance" {...register('distance')} />
              {errors.distance && <p className="text-sm text-destructive">{errors.distance.message}</p>}
            </div>
            <div className="grid gap-2 md:col-span-2">
                <Label>Supported Slot Types</Label>
                <div className="flex flex-wrap gap-4 pt-2">
                    {slotTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                                id={`slot-type-${type}`}
                                checked={selectedSlotTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                    const currentTypes = watch('slotTypes');
                                    if (checked) {
                                        setValue('slotTypes', [...currentTypes, type]);
                                    } else {
                                        setValue('slotTypes', currentTypes.filter(t => t !== type));
                                    }
                                }}
                            />
                            <label htmlFor={`slot-type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {type}
                            </label>
                        </div>
                    ))}
                </div>
                {errors.slotTypes && <p className="text-sm text-destructive">{errors.slotTypes.message}</p>}
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isNewLot ? 'Create Lot' : 'Save Changes'}
            </Button>
        </div>
      </form>
    </div>
  );
}
