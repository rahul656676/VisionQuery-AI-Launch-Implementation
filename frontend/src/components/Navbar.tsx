'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { LogOut, Upload, LayoutDashboard, BrainCircuit, Shield, Coins } from 'lucide-react'
import axios from 'axios'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        try {
          // Fetch profile (quota & role)
          const token = session.access_token
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setProfile(res.data)
        } catch (e) {
          console.error("Failed to fetch profile", e)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      getUser()
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Do not show navbar on auth pages
  if (pathname === '/login' || pathname === '/register') return null

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">VisionQuery AI</span>
            </Link>
            
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard" 
                  className={`${pathname === '/dashboard' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link 
                  href="/upload" 
                  className={`${pathname.startsWith('/upload') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Link>
                {profile?.role === 'admin' && (
                  <Link 
                    href="/admin" 
                    className={`${pathname.startsWith('/admin') ? 'border-purple-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    <Shield className="w-4 h-4 mr-2 text-purple-500" />
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === "/dashboard" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/upload"
                className="ml-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload Media
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
