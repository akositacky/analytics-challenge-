'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { usePost } from '@/lib/hooks/use-posts'
import { useUIStore } from '@/lib/stores/ui-store'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Eye, 
  BarChart3, 
  ExternalLink,
  Instagram,
  Video,
  Image,
  Layers,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toLocaleString()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 12,
    },
  },
}

const metricCardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 150,
      damping: 15,
    },
  },
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value,
  index,
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  index: number
}) {
  return (
    <motion.div 
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
      variants={metricCardVariants}
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: 'rgba(var(--primary), 0.1)',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, type: 'spring' as const, stiffness: 200 }}
      >
        <Icon className="h-5 w-5 text-muted-foreground" />
      </motion.div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <motion.p 
          className="font-semibold"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  )
}

function ModalSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'instagram') {
    return (
      <motion.span 
        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
      >
        <Instagram className="h-3 w-3" />
        Instagram
      </motion.span>
    )
  }
  return (
    <motion.span 
      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
    >
      <Video className="h-3 w-3" />
      TikTok
    </motion.span>
  )
}

function MediaTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4" />
    case 'carousel':
      return <Layers className="h-4 w-4" />
    default:
      return <Image className="h-4 w-4" />
  }
}

export function PostDetailModal() {
  const isModalOpen = useUIStore((state) => state.isModalOpen)
  const selectedPostId = useUIStore((state) => state.selectedPostId)
  const closeModal = useUIStore((state) => state.closeModal)

  const { data: post, isLoading, error } = usePost(selectedPostId)

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Post Details
            {post && <PlatformBadge platform={post.platform} />}
          </DialogTitle>
        </DialogHeader>

        {isLoading && <ModalSkeleton />}

        {error && (
          <motion.div 
            className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Failed to load post: {error.message}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {post && (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Thumbnail */}
              <motion.div 
                className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {post.thumbnail_url ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <motion.img
                    src={post.thumbnail_url}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MediaTypeIcon type={post.media_type} />
                  </div>
                )}
                <motion.div 
                  className="absolute top-3 right-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-black/50 text-white">
                    <MediaTypeIcon type={post.media_type} />
                    {post.media_type}
                  </span>
                </motion.div>
              </motion.div>

              {/* Caption */}
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Caption</h3>
                <p className="text-sm">
                  {post.caption || <span className="italic text-muted-foreground">No caption</span>}
                </p>
              </motion.div>

              {/* Posted Date */}
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Posted</h3>
                <p className="text-sm">{formatDate(post.posted_at)}</p>
              </motion.div>

              {/* Metrics Grid */}
              <motion.div variants={itemVariants}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Engagement Metrics</h3>
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  variants={containerVariants}
                >
                  <MetricCard icon={Heart} label="Likes" value={formatNumber(post.likes)} index={0} />
                  <MetricCard icon={MessageCircle} label="Comments" value={formatNumber(post.comments)} index={1} />
                  <MetricCard icon={Share2} label="Shares" value={formatNumber(post.shares)} index={2} />
                  <MetricCard icon={Bookmark} label="Saves" value={formatNumber(post.saves)} index={3} />
                  <MetricCard icon={Eye} label="Reach" value={formatNumber(post.reach)} index={4} />
                  <MetricCard icon={BarChart3} label="Impressions" value={formatNumber(post.impressions)} index={5} />
                </motion.div>
              </motion.div>

              {/* Engagement Rate */}
              {post.engagement_rate !== null && (
                <motion.div 
                  className="p-4 rounded-lg bg-primary/10 border border-primary/20"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Engagement Rate</span>
                    <motion.span 
                      className="text-2xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: 'spring' as const, stiffness: 200 }}
                    >
                      {post.engagement_rate}%
                    </motion.span>
                  </div>
                </motion.div>
              )}

              {/* View on Platform Button */}
              {post.permalink && (
                <motion.div variants={itemVariants}>
                  <Button asChild className="w-full">
                    <motion.a 
                      href={post.permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      View on {post.platform === 'instagram' ? 'Instagram' : 'TikTok'}
                    </motion.a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
