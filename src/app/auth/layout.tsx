import Link from 'next/link';
import { Icons } from '@/components/icons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">SmartPark</span>
        </Link>
      </div>
      <main>{children}</main>
    </div>
  );
}
