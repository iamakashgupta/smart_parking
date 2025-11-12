import { PageHeader } from '@/components/dashboard/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { demoUsers } from '@/lib/data';
import { Car, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const user = demoUsers[0];
  const initials = user.name.split(' ').map((n) => n[0]).join('');

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
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="w-full">Change Photo</Button>
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
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue={user.phone} />
              </div>
            </CardContent>
            <CardContent>
                <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Vehicles</CardTitle>
              <CardDescription>Add and manage your vehicles for quick booking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {user.vehicles.map((vehicle, index) => (
                <div key={vehicle.id}>
                  <div className="flex items-start gap-4">
                    <Car className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-grow">
                      <p className="font-semibold">{vehicle.make} {vehicle.model}</p>
                      <p className="text-sm text-muted-foreground">Reg: {vehicle.registrationNumber} | Type: {vehicle.type}</p>
                    </div>
                     <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove vehicle</span>
                    </Button>
                  </div>
                  {index < user.vehicles.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
            <CardContent>
                <Button variant="outline">Add New Vehicle</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
