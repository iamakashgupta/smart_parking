
# SmartPark: Intelligent Parking Management System

## 1. Project Overview

**SmartPark** is a modern, full-stack web application designed to simplify the urban parking experience. It addresses the common frustrations of finding available parking by providing a seamless, real-time platform for drivers to locate, book, and manage parking spots. The application features a user-friendly interface for drivers and a comprehensive admin panel for parking lot operators, making it a complete solution for both sides of the parking equation.

The core mission of SmartPark is to reduce traffic congestion, save drivers time, and create a more efficient parking ecosystem through the use of modern web technologies and artificial intelligence.

---

## 2. Key Features

The application is divided into two main user-facing experiences: the **User Dashboard** and the **Admin Panel**.

### User-Facing Features

- **User Authentication**: Secure sign-up and login functionality using email/password and Google OAuth, handled by Firebase Authentication.
- **Find Parking**: Users can browse a list or an interactive map view of available parking lots. Lots can be searched and filtered by name, address, and available slot types (e.g., EV, Disabled).
- **Real-Time Availability**: The app displays live data on slot availability for each parking lot, including occupancy percentages and the number of free spots, updated in real-time from the Firestore database.
- **Detailed Lot Information**: Users can view detailed information for each lot, including rates, operating hours, amenities (CCTV, WiFi), and images.
- **Booking System**:
    - **Book Now**: For immediate parking, users can book an available spot, which marks it as occupied and generates a QR code for entry.
    - **Reserve**: Users can reserve a spot for a future date and time, with an estimated cost calculated upfront.
- **User Profile Management**: A dedicated profile page where users can update their personal information, change their profile picture, and add/remove their vehicles for faster booking.
- **Booking History**: Users can view a list of their past and active bookings, check their status, and view receipts.
- **AI-Powered Chatbot**: An integrated Genkit-powered chatbot to assist users with common questions about finding parking, managing bookings, and using the app.

### Administrator Features

- **Secure Admin Panel**: Access is restricted to authorized admin accounts (e.g., `akash@gmail.com`) for managing the entire system.
- **Admin Dashboard**: A central hub providing a real-time overview of operations, including:
    - Total revenue from completed bookings.
    - Number of currently active bookings.
    - System-wide occupancy percentage.
    - A chart visualizing revenue trends over the last 7 days.
- **Lot Management**: Admins have full CRUD (Create, Read, Update, Delete) capabilities for parking lots. They can add new lots, edit details of existing ones, and set rates and slot types.
- **Booking Monitoring**: A system-wide view of all user bookings, allowing admins to monitor parking activity across all lots.
- **IoT Sensor Simulator**: A utility page that allows admins to manually simulate a vehicle entering or leaving a parking spot. This demonstrates the app's real-time capabilities by updating slot and lot occupancy instantly.

---

## 3. Technical Architecture

SmartPark is built on a modern, serverless technology stack, prioritizing performance, scalability, and developer experience.

- **Frontend**:
    - **Framework**: [Next.js](https://nextjs.org/) (with App Router)
    - **Language**: [TypeScript](https://www.typescriptlang.org/)
    - **UI Components**: [ShadCN/UI](https://ui.shadcn.com/) - A collection of beautifully designed, accessible components.
    - **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first styling workflow.
    - **State Management**: React Hooks (`useState`, `useEffect`, `useContext`) and `SWR`-like data fetching hooks for Firebase.

- **Backend (Serverless)**:
    - **Platform**: [Firebase](https://firebase.google.com/)
    - **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore) - A NoSQL, real-time database used for storing all application data.
    - **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) for managing user identities.
    - **File Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) for user-uploaded content like profile pictures.

- **Generative AI**:
    - **Framework**: [Genkit](https://firebase.google.com/docs/genkit) - An open-source framework for building production-ready AI-powered features.
    - **Model**: [Google Gemini](https://deepmind.google/technologies/gemini/) - Used as the underlying large language model (LLM) for the chatbot's conversational intelligence.

---

## 4. Database Schema (Firestore)

The data is structured in Firestore using a collection-based NoSQL model.

- **/users/{userId}**:
    - Stores user profile information, including name, email, and a list of their registered vehicles.
    - `(subcollection)` **vehicles**: An array within the user document containing vehicle details.

- **/parking_lots/{lotId}**:
    - Contains all static and semi-static information about a parking lot, such as its name, address, rates, and total number of slots.
    - Includes a denormalized `availableSlots` count for fast, efficient reads.
    - `(subcollection)` **/slots/{slotId}**: Represents an individual parking spot within a lot, storing its type and real-time `isOccupied` status.

- **/bookings/{bookingId}**:
    - A record of every booking made in the system. It links a user, a lot, and a slot together, and tracks the booking's status (`Confirmed`, `Active`, `Completed`), timing, and total cost.

---

## 5. Security Measures

Security is a foundational aspect of the SmartPark application.

- **Authentication**: All user-specific actions (like booking a spot or updating a profile) require a valid, authenticated session managed by Firebase Authentication.

- **Authorization (Firestore Security Rules)**:
    - **User Data**: Users can only read and write to their own data in the `/users/{userId}` collection.
    - **Bookings**: Users can only create bookings for themselves and can only view their own booking history.
    - **Admin Access**: While not fully implemented for a production environment, the rules are structured to easily allow for an admin role that would have write access to all lots and read access to all bookings.

- **Admin Panel Protection**:
    - **UI-Level**: Links to the admin panel are conditionally rendered and only appear for the designated admin user.
    - **Route-Level**: The admin layout includes a check that verifies the logged-in user's email. Any unauthorized user attempting to access an `/admin` URL is automatically redirected to the main dashboard.

- **Environment Variables**: Sensitive information, such as the Google AI API key, is stored securely in an `.env` file and is not exposed on the client-side.
