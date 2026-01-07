'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAnalyticsSummary } from '@/lib/hooks/use-analytics-summary'
import { TrendingUp, TrendingDown, Minus, Heart, BarChart3, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

// Motion-wrapped Card component
const MotionCard = motion.create(Card)

function SummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-1" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  )
}

interface AnimatedCardProps {
  title: string
  icon: React.ReactNode
  value: string | React.ReactNode
  subtitle: string
  valueClassName?: string
}

function AnimatedCard({ title, icon, value, subtitle, valueClassName }: AnimatedCardProps) {
  return (
    <MotionCard
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <motion.div 
          className={`text-2xl font-bold ${valueClassName || ''}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </MotionCard>
  )
}

export function SummaryCards() {
  const { data, isLoading, error } = useAnalyticsSummary()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <motion.div 
        className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Failed to load analytics: {error.message}
      </motion.div>
    )
  }

  // Empty state
  if (!data || data.postsCount === 0) {
    return (
      <motion.div 
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatedCard
          title="Total Engagement"
          icon={<Heart className="h-4 w-4 text-muted-foreground" />}
          value="0"
          subtitle="No posts yet"
        />
        <AnimatedCard
          title="Avg. Engagement Rate"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          value="N/A"
          subtitle="No data available"
        />
        <AnimatedCard
          title="Top Post"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          value="—"
          subtitle="Create your first post"
        />
        <AnimatedCard
          title="Trend (7d)"
          icon={<Minus className="h-4 w-4 text-muted-foreground" />}
          value="0%"
          subtitle="vs. previous 7 days"
        />
      </motion.div>
    )
  }

  const TrendIcon = data.trendDirection === 'up' 
    ? TrendingUp 
    : data.trendDirection === 'down' 
      ? TrendingDown 
      : Minus

  const trendColor = data.trendDirection === 'up'
    ? 'text-green-600'
    : data.trendDirection === 'down'
      ? 'text-red-600'
      : 'text-gray-500'

  return (
    <motion.div 
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatedCard
        title="Total Engagement"
        icon={<Heart className="h-4 w-4 text-pink-500" />}
        value={formatNumber(data.totalEngagement)}
        subtitle="Likes, comments & shares"
      />
      
      <AnimatedCard
        title="Avg. Engagement Rate"
        icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
        value={`${data.averageEngagementRate}%`}
        subtitle={`Across ${data.postsCount} posts`}
      />
      
      <AnimatedCard
        title="Top Post"
        icon={<Trophy className="h-4 w-4 text-yellow-500" />}
        value={data.topPerformingPost ? formatNumber(data.topPerformingPost.engagement) : '—'}
        subtitle={
          data.topPerformingPost?.caption
            ? `${data.topPerformingPost.caption.slice(0, 30)}${data.topPerformingPost.caption.length > 30 ? '...' : ''}`
            : 'No caption'
        }
      />
      
      <AnimatedCard
        title="Trend (7d)"
        icon={<TrendIcon className={`h-4 w-4 ${trendColor}`} />}
        value={
          <>
            {data.trendDirection === 'up' ? '+' : data.trendDirection === 'down' ? '-' : ''}
            {data.trendPercentage}%
          </>
        }
        valueClassName={trendColor}
        subtitle="vs. previous 7 days"
      />
    </motion.div>
  )
}
