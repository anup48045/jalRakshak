"use client";

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import UserManagement from '@/components/UserManagement/page';

export default function UserManagementPage() {
  const { user, hasRole } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!user || !hasRole(['admin'])) {
      router.push('/dashboard');
    }
  }, [user, hasRole, router]);

  if (!user || !hasRole(['admin'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <UserManagement />
      </div>
    </div>
  );
}
