import { PageHeader } from '@/components/dashboard/page-header';
import { MapView } from '@/components/map-view';
import { LotCard } from '@/components/parking/lot-card';
import { demoLots, demoUsers } from '@/lib/data';

export default function DashboardHomePage() {
  const user = demoUsers[0];

  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title={`Welcome, ${user.name.split(' ')[0]}!`}
        description="Find and manage your parking hassle-free."
      />
      <div className="space-y-8">
        <MapView />

        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Nearby Parking Lots</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {demoLots.map((lot) => (
              <LotCard key={lot.id} lot={lot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
