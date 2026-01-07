import { create } from 'zustand'

export type Platform = 'all' | 'instagram' | 'tiktok'
export type ChartViewType = 'line' | 'area'
export type SortDirection = 'asc' | 'desc'

interface UIState {
  // Filter state
  platformFilter: Platform
  setPlatformFilter: (platform: Platform) => void
  
  // Sort state
  sortColumn: string | null
  sortDirection: SortDirection
  setSorting: (column: string | null, direction: SortDirection) => void
  
  // Modal state
  selectedPostId: string | null
  isModalOpen: boolean
  openModal: (postId: string) => void
  closeModal: () => void
  
  // Chart state
  chartViewType: ChartViewType
  setChartViewType: (viewType: ChartViewType) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Filter state
  platformFilter: 'all',
  setPlatformFilter: (platform) => set({ platformFilter: platform }),
  
  // Sort state
  sortColumn: 'posted_at',
  sortDirection: 'desc',
  setSorting: (column, direction) => set({ sortColumn: column, sortDirection: direction }),
  
  // Modal state
  selectedPostId: null,
  isModalOpen: false,
  openModal: (postId) => set({ selectedPostId: postId, isModalOpen: true }),
  closeModal: () => set({ selectedPostId: null, isModalOpen: false }),
  
  // Chart state
  chartViewType: 'area',
  setChartViewType: (viewType) => set({ chartViewType: viewType }),
}))
