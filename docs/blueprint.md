# **App Name**: SmartPark

## Core Features:

- User Authentication: Secure user authentication using email/password and Google Sign-In.
- Parking Lot Browser: Browse parking lots in list and map views, displaying occupancy, rates, slot types, hours, and distance.
- Real-time Slot Availability: Provide real-time updates on slot availability using Firestore listeners.
- Instant Booking: Enable immediate check-in via check-in token/QR code upon booking confirmation.
- Advance Reservation: Allow users to make reservations with specified start and end times, preventing double bookings.
- Automated Fare Generation: Use time-based rates to generate final invoices on checkout, saving receipts to Storage.
- Push Notifications: Send push notifications for booking confirmation, reminders, and lot full warnings.
- Admin Dashboard: Admin interface to create/manage lots, levels, slots, define slot attributes, and view real-time occupancy.
- IoT/sensor integration API: Cloud Function endpoints for sensor updates; simulator UI in admin.

## Style Guidelines:

- Primary color: Deep Indigo (#4B0082) to convey trust and reliability, nodding to automotive UX/UI.
- Background color: Very light gray (#F5F5F5), a desaturated near-white to ensure legibility and a clean, spacious layout.
- Accent color: A vibrant Green-Yellow (#ADFF2F) for CTAs, particularly around availability, check-in, and booking options, giving a modern 'tech' feel and visibility.
- Body and headline font: 'Inter', a sans-serif font, known for its clean readability in various sizes.
- Use minimalist, line-based icons for parking-related elements such as lot types, availability, and navigation. Icons should be simple, recognizable and monochromatic using the primary color.
- Mobile-first, responsive layout with clear visual hierarchy. Prioritize key information such as slot availability and pricing.
- Subtle transitions and animations to provide feedback during interactions, such as loading slot availability, booking confirmations, and check-in/check-out processes.