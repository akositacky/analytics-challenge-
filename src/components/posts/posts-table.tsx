'use client'

import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { usePosts } from '@/lib/hooks/use-posts'
import { useUIStore, type Platform } from '@/lib/stores/ui-store'
import type { Post } from '@/lib/database.types'
import { ArrowUpDown, Instagram, Video, Image, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

// Motion-wrapped Card
const MotionCard = motion.create(Card)

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PlatformBadge({ platform }: { platform: string }) {
  if (platform === 'instagram') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400">
        <Instagram className="h-3 w-3" />
        Instagram
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
      <Video className="h-3 w-3" />
      TikTok
    </span>
  )
}

function MediaTypeIcon({ type }: { type: string }) {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-muted-foreground" />
    case 'carousel':
      return <Layers className="h-4 w-4 text-muted-foreground" />
    default:
      return <Image className="h-4 w-4 text-muted-foreground" />
  }
}

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyTable() {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 100, damping: 15 }}
    >
      <CardHeader>
        <CardTitle>Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-medium"
            >
              No posts found
            </motion.p>
            <motion.p 
              className="text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Posts will appear here once you add them
            </motion.p>
          </motion.div>
        </div>
      </CardContent>
    </MotionCard>
  )
}

export function PostsTable() {
  const platformFilter = useUIStore((state) => state.platformFilter)
  const setPlatformFilter = useUIStore((state) => state.setPlatformFilter)
  const sortColumn = useUIStore((state) => state.sortColumn)
  const sortDirection = useUIStore((state) => state.sortDirection)
  const setSorting = useUIStore((state) => state.setSorting)
  const openModal = useUIStore((state) => state.openModal)

  const { data: posts, isLoading, error } = usePosts(platformFilter)

  const sorting: SortingState = useMemo(() => {
    if (!sortColumn) return []
    return [{ id: sortColumn, desc: sortDirection === 'desc' }]
  }, [sortColumn, sortDirection])

  const columns: ColumnDef<Post>[] = useMemo(
    () => [
      {
        accessorKey: 'thumbnail_url',
        header: '',
        cell: ({ row }) => (
          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
            {row.original.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={row.original.thumbnail_url}
                alt="Post thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <MediaTypeIcon type={row.original.media_type} />
              </div>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'caption',
        header: 'Caption',
        cell: ({ row }) => (
          <div className="max-w-[200px] md:max-w-[300px]">
            <p className="truncate text-sm">
              {row.original.caption || <span className="text-muted-foreground italic">No caption</span>}
            </p>
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'platform',
        header: 'Platform',
        cell: ({ row }) => <PlatformBadge platform={row.original.platform} />,
        enableSorting: false,
      },
      {
        accessorKey: 'likes',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => {
              const isDesc = column.getIsSorted() === 'desc'
              setSorting('likes', isDesc ? 'asc' : 'desc')
              column.toggleSorting(!isDesc)
            }}
          >
            Likes
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => formatNumber(row.original.likes),
      },
      {
        accessorKey: 'comments',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => {
              const isDesc = column.getIsSorted() === 'desc'
              setSorting('comments', isDesc ? 'asc' : 'desc')
              column.toggleSorting(!isDesc)
            }}
          >
            Comments
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => formatNumber(row.original.comments),
      },
      {
        accessorKey: 'shares',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => {
              const isDesc = column.getIsSorted() === 'desc'
              setSorting('shares', isDesc ? 'asc' : 'desc')
              column.toggleSorting(!isDesc)
            }}
          >
            Shares
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => formatNumber(row.original.shares),
      },
      {
        accessorKey: 'engagement_rate',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => {
              const isDesc = column.getIsSorted() === 'desc'
              setSorting('engagement_rate', isDesc ? 'asc' : 'desc')
              column.toggleSorting(!isDesc)
            }}
          >
            Eng. Rate
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => 
          row.original.engagement_rate !== null 
            ? `${row.original.engagement_rate}%` 
            : 'N/A',
      },
      {
        accessorKey: 'posted_at',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-foreground"
            onClick={() => {
              const isDesc = column.getIsSorted() === 'desc'
              setSorting('posted_at', isDesc ? 'asc' : 'desc')
              column.toggleSorting(!isDesc)
            }}
          >
            Posted
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: ({ row }) => formatDate(row.original.posted_at),
      },
    ],
    [setSorting]
  )

  const table = useReactTable({
    data: posts || [],
    columns,
    state: {
      sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            Failed to load posts: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!posts || posts.length === 0) {
    return <EmptyTable />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Posts</CardTitle>
          <Select
            value={platformFilter}
            onValueChange={(value) => setPlatformFilter(value as Platform)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openModal(row.original.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
