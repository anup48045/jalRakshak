'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const router = useRouter()
  const { user} = useAuthStore()

  useEffect(() => {
    console.log("Dashboard user:", user)
    if (!user) {
      router.push('/login')
      return
    }

    // Redirect to role-specific dashboard
    if (user.role === 'admin') {
      router.push('/dashboard/admin')
      return
    } else if (user.role === 'officer') {
      router.push('/dashboard/officer')
      return
    } else if (user.role === 'citizen') {
      router.push('/dashboard/citizen')
      return
    }
  }, [user, router])
  return <div>Dashboard Page</div>
}
