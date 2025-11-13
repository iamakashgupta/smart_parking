
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Calendar, Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Icons } from '@/components/icons';

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            SmartPark
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
           <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/auth/signup">Sign Up</Link>
            </Button>
        </nav>
        <nav className="md:hidden">
            <Button variant="outline" asChild>
                <Link href="/dashboard">Menu</Link>
            </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative flex items-center justify-center w-full min-h-[60vh] pt-24 pb-12 md:min-h-[80vh] text-center overflow-hidden">
          <Image
              src="https://picsum.photos/seed/hero-parking/1920/1080"
              alt="Aerial view of a city with parking lots"
              fill
              className="object-cover"
              priority
              data-ai-hint="city parking"
            />
          <div className="absolute inset-0 bg-black/60" />
          <div className={cn(
            "relative z-10 container mx-auto px-4 transition-all duration-1000 ease-out",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Find & Book Your Perfect Parking Spot
            </h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-200 md:text-xl">
              Smart, simple, and seamless parking. Real-time availability and easy booking at your fingertips.
            </p>
            <div className={cn(
                "max-w-2xl mx-auto mt-8 transition-all duration-1000 delay-300 ease-out",
                 isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                <div className="flex flex-col gap-4 sm:flex-row sm:bg-white/10 sm:backdrop-blur-sm sm:p-2 sm:rounded-lg sm:shadow-lg sm:border sm:border-white/20">
                    <div className="relative flex-grow">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                        <Input
                        type="text"
                        placeholder="Enter a location, or landmark"
                        className="w-full h-14 pl-10 bg-transparent text-white placeholder:text-gray-300 border-white/20 sm:border-none sm:h-12"
                        />
                    </div>
                    <Button asChild size="lg" className="h-14 sm:h-12 sm:w-auto">
                        <Link href="/dashboard/lots">
                            <Search className="mr-2 h-5 w-5" />
                            Find Parking
                        </Link>
                    </Button>
                </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground">Parking made easy in 3 simple steps.</p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div ref={ref1} className={cn(
                "flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl",
                inView1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Find</h3>
                <p className="mt-2 text-muted-foreground">Search for parking lots near your destination. View real-time availability and pricing.</p>
              </div>
              <div ref={ref2} className={cn(
                "flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md transition-all duration-500 delay-200 ease-out hover:-translate-y-2 hover:shadow-xl",
                 inView2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Book</h3>
                <p className="mt-2 text-muted-foreground">Reserve your spot in advance or book instantly. Get a digital token for seamless entry.</p>
              </div>
              <div ref={ref3} className={cn(
                "flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md transition-all duration-500 delay-300 ease-out hover:-translate-y-2 hover:shadow-xl",
                 inView3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}>
                 <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">3. Park</h3>
                <p className="mt-2 text-muted-foreground">Arrive, check-in with your QR code, and park your car. Checkout is just as easy.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-muted">
        <div className="container px-4 mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SmartPark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
