'use client';
import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/dashboard/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Car, Trash2, PlusCircle, Loader2, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Vehicle } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  registrationNumber: z.string().min(1, 'Registration is required'),
  type: z.enum(['Compact', 'Regular', 'Large', 'EV']),
});
type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function ProfilePage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemoFirebase(() => (firestore && user) ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<User>(userDocRef);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      registrationNumber: '',
      type: 'Regular',
    }
  });

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setPhone(userData.phone || '');
    } else if (user) {
      setName(user.displayName || '');
    }
  }, [userData, user]);

  const handleSaveChanges = async () => {
    if (!userDocRef) return;
    setIsSaving(true);
    try {
      await updateDoc(userDocRef, { name, phone });
      if (user) {
          // This doesn't update the user object from useUser() immediately,
          // but will be reflected on next login. For immediate UI update, we rely on local state.
      }
      toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddVehicle: SubmitHandler<VehicleFormData> = async (data) => {
    if (!userDocRef) return;
    const newVehicle = { ...data, id: `v${Date.now()}` };
    try {
      await updateDoc(userDocRef, { vehicles: arrayUnion(newVehicle) });
      toast({ title: 'Vehicle Added', description: `${data.make} ${data.model} has been added.` });
      reset();
      setIsVehicleDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add vehicle.' });
    }
  };
  
  const handleRemoveVehicle = async (vehicle: Vehicle) => {
      if (!userDocRef) return;
      try {
        await updateDoc(userDocRef, { vehicles: arrayRemove(vehicle) });
        toast({ title: 'Vehicle Removed' });
      } catch (error) {
          console.error(error);
          toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove vehicle.' });
      }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile-photos/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(user, { photoURL });
      if (userDocRef) {
          await updateDoc(userDocRef, { photoURL });
      }

      toast({ title: 'Photo Updated', description: 'Your new profile picture has been saved.' });
      // Force a reload of the user object to see the change
      await user.reload();
      // This is a bit of a hack to force re-render with new photoURL
      setName(name + " "); setName(name);


    } catch (error) {
      console.error('Photo upload failed:', error);
      toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload your new photo.' });
    } finally {
      setIsUploading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.trim().split(' ').map((n) => n[0]).join('').toUpperCase();
  }
  
  if (isUserLoading || (user && isUserDataLoading)) {
    return <ProfileSkeleton />
  }

  if (!user) {
    return <div className="text-center p-8 bg-card rounded-lg shadow-sm">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and vehicle details."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
           <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-2">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
                <AvatarFallback>{getInitials(userData?.name || user.displayName)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  {isUploading ? 'Uploading...' : 'Change Photo'}
                </Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" />
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Vehicles</CardTitle>
              <CardDescription>Add and manage your vehicles for quick booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {userData?.vehicles && userData.vehicles.length > 0 ? userData.vehicles.map((vehicle, index) => (
                <div key={vehicle.id}>
                  <div className="flex items-start gap-4">
                    <Car className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-muted-foreground">Reg: {vehicle.registrationNumber} | Type: {vehicle.type}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => handleRemoveVehicle(vehicle)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove vehicle</span>
                    </Button>
                  </div>
                  {index < (userData?.vehicles?.length ?? 0) - 1 && <Separator className="mt-4" />}
                </div>
              )) : (
                <p className="text-muted-foreground text-center py-4">No vehicles added yet.</p>
              )}
            </CardContent>
            <CardFooter>
                <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Vehicle</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Vehicle</DialogTitle>
                            <DialogDescription>Enter your vehicle's details.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit(handleAddVehicle)} className="space-y-4 pt-4">
                           <div className="grid gap-2">
                                <Label htmlFor="make">Make (e.g., Maruti, Tata)</Label>
                                <Input id="make" {...register('make')} />
                                {errors.make && <p className="text-sm text-destructive">{errors.make.message}</p>}
                           </div>
                           <div className="grid gap-2">
                                <Label htmlFor="model">Model (e.g., Swift, Nexon)</Label>
                                <Input id="model" {...register('model')} />
                                {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
                           </div>
                           <div className="grid gap-2">
                                <Label htmlFor="registrationNumber">Registration Number</Label>
                                <Input id="registrationNumber" {...register('registrationNumber')} />
                                {errors.registrationNumber && <p className="text-sm text-destructive">{errors.registrationNumber.message}</p>}
                           </div>
                           <div className="grid gap-2">
                                <Label htmlFor="type">Vehicle Type</Label>
                                <Select onValueChange={(value) => setValue('type', value as 'Compact' | 'Regular' | 'Large' | 'EV')} defaultValue='Regular'>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Regular">Regular</SelectItem>
                                        <SelectItem value="Compact">Compact</SelectItem>
                                        <SelectItem value="Large">Large</SelectItem>
                                        <SelectItem value="EV">EV (Electric)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && <p className="text-sm text-destructive">{errors.type.message}</p>}
                           </div>
                           <DialogFooter>
                               <Button type="submit">Add Vehicle</Button>
                           </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and vehicle details."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Skeleton className="w-24 h-24 rounded-full mb-2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-1/3" />
              <Skeleton className="h-5 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
             <CardFooter>
              <Skeleton className="h-10 w-36" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
