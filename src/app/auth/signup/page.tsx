import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  return (
    <Card className="mx-auto max-w-sm w-[380px] shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" placeholder="Max Robinson" required />
            </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full" asChild>
             <Link href="/dashboard">Create an account</Link>
          </Button>
          <Button variant="outline" className="w-full">
             <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.95-4.25 1.95-3.87 0-7-3.13-7-7s3.13-7 7-7c1.73 0 3.25.63 4.33 1.62l2.3-2.3C18.23.45 15.48 0 12.48 0c-6.63 0-12 5.37-12 12s5.37 12 12 12c6.94 0 11.52-4.88 11.52-11.72 0-.79-.07-1.53-.2-2.36h-9.82z"
              ></path>
            </svg>
            Sign up with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
