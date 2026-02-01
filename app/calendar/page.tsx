'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CalendarView from '@/src/components/CalendarView';
import TopNav from '../dashboard/components/TopNav';

export default function CalendarPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-900 via-dark-950 to-dark-950 text-white selection:bg-accent-500/30">
      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
        <TopNav />
        <main>
          <CalendarView onBack={() => router.push('/dashboard')} />
        </main>
      </div>
    </div>
  );
}
