import { PageHeader } from '@/components/dashboard/page-header';
import { LotCard } from '@/components/parking/lot-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { demoLots } from '@/lib/data';
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
  return (
    <div className="container mx-auto px-0">
      <PageHeader
        title="Find Parking"
        description="Browse all available parking lots."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lots..." className="pl-9" />
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
                <DropdownMenuCheckboxItem checked>
                  Compact
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Regular
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Large
                </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem checked>
                  EV
                </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem>
                  Disabled
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
      </PageHeader>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {demoLots.map((lot) => (
          <LotCard key={lot.id} lot={lot} />
        ))}
         {demoLots.map((lot) => (
          <LotCard key={lot.id + '-2'} lot={{...lot, id: lot.id + '-2'}} />
        ))}
      </div>
    </div>
  );
}
