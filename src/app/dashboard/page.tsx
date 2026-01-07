import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { EngagementChart } from '@/components/charts/engagement-chart'
import { PostsTable } from '@/components/posts/posts-table'
import { PostDetailModal } from '@/components/posts/post-detail-modal'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your social media performance across platforms
          </p>
        </div>

        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards />
        </section>

        {/* Chart */}
        <section className="mb-8">
          <EngagementChart />
        </section>

        {/* Posts Table */}
        <section>
          <PostsTable />
        </section>

        {/* Post Detail Modal */}
        <PostDetailModal />
      </div>
    </div>
  )
}
