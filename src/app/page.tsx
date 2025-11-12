import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Calendar, Car } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 4V6.25C8 7.35457 7.10457 8.25 6 8.25C4.89543 8.25 4 7.35457 4 6.25V4H3C2.44772 4 2 4.44772 2 5V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V5C22 4.44772 21.5523 4 21 4H8Z"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path
              d="M7 2C8.65685 2 10 3.34315 10 5V8.25C10 9.90685 8.65685 11.25 7 11.25C5.34315 11.25 4 9.90685 4 8.25V5C4 3.34315 5.34315 2 7 2Z"
              fill="currentColor"
            />
            <path
              d="M17 2C18.6569 2 20 3.34315 20 5V8.25C20 9.90685 18.6569 11.25 17 11.25C15.3431 11.25 14 9.90685 14 8.25V5C14 3.34315 15.3431 2 17 2Z"
              fill="currentColor"
            />
          </svg>
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
                <Link href="/auth/login">Menu</Link>
            </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative flex items-center justify-center w-full min-h-[60vh] pt-24 pb-12 md:min-h-[80vh] text-center">
          <Image
              src="https://picsum.photos/seed/hero-parking/1920/1080"
              alt="Aerial view of a city with parking lots"
              fill
              className="object-cover"
              priority
              data-ai-hint="city parking"
            />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 container mx-auto px-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
              Find & Book Your Perfect Parking Spot
            </h1>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-200 md:text-xl">
              Smart, simple, and seamless parking. Real-time availability and easy booking at your fingertips.
            </p>
            <div className="max-w-2xl mx-auto mt-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:bg-white sm:p-2 sm:rounded-lg sm:shadow-lg">
                    <div className="relative flex-grow">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                        type="text"
                        placeholder="Enter a location, or landmark"
                        className="w-full h-14 pl-10 bg-white sm:border-none sm:h-12 sm:bg-transparent text-foreground"
                        />
                    </div>
                    <Button asChild size="lg" className="h-14 sm:h-12 sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
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
              <div className="flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Find</h3>
                <p className="mt-2 text-muted-foreground">Search for parking lots near your destination. View real-time availability and pricing.</p>
              </div>
              <div className="flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md">
                <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                    <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Book</h3>
                <p className="mt-2 text-muted-foreground">Reserve your spot in advance or book instantly. Get a digital token for seamless entry.</p>
              </div>
              <div className="flex flex-col items-center p-6 text-center bg-card rounded-lg shadow-md">
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
