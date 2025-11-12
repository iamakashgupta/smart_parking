'use client';
import { PageHeader } from '@/components/dashboard/page-header';
import { MapView } from '@/components/map-view';
import { LotCard } from '@/components/parking/lot-card';
import { useUser, useCollection } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ParkingLot } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardHomePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const lotsQuery = query(collection(firestore, 'parking_lots'));
  const { data: lots, isLoading: isLoadingLots } = useCollection<ParkingLot>(lotsQuery);

  const WelcomeMessage = () => {
    if (isUserLoading) {
      return <Skeleton className="h-8 w-48" />;
    }
    if (user) {
      return `Welcome, ${user.displayName?.split(' ')[0] || 'User'}!`;
    }
    return 'Welcome!';
  }

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title={<WelcomeMessage />}
        description="Find and manage your parking hassle-free."
      />
      <div className="space-y-8">
        <MapView lots={lots ?? []} />

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Nearby Parking Lots</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingLots ? (
               Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))
            ) : (
              lots?.map((lot) => (
                <LotCard key={lot.id} lot={lot} />
              ))
            )}
          </div>
        </div>
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
