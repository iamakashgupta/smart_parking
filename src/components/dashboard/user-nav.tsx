'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserNav() {
  return (
    <Button variant="outline" asChild>
      <Link href="/dashboard/lots">Find Parking</Link>
    </Button>
  )
}
