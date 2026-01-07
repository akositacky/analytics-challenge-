'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export function LogoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const queryClient = useQueryClient()
  const supabase = createClient()

  const handleLogout = async () => {
    setLoading(true)
    
    // Clear all cached queries before signing out
    queryClient.clear()
    
    await supabase.auth.signOut()
    
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="h-4 w-4 mr-2" />
      {loading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
