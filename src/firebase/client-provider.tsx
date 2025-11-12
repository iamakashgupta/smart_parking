'use client';

import React, { useMemo } from 'react';
import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { FirebaseProvider } from './provider';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, firestore } = useMemo(() => {
    const app =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
        disableWarnings: true,
      });
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }

    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}