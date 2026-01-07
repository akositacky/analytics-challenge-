'use client'

import { useMemo, useCallback } from 'react'
import { ParentSize } from '@visx/responsive'
import { scaleTime, scaleLinear } from '@visx/scale'
import { AreaClosed, LinePath } from '@visx/shape'
import { AxisLeft, AxisBottom } from '@visx/axis'
import { GridRows } from '@visx/grid'
import { curveMonotoneX } from '@visx/curve'
import { Group } from '@visx/group'
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip'
import { localPoint } from '@visx/event'
import { bisector } from 'd3-array'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDailyMetrics } from '@/lib/hooks/use-daily-metrics'
import { useUIStore } from '@/lib/stores/ui-store'
import { LineChart, AreaChart } from 'lucide-react'
import { motion } from 'framer-motion'
import type { DailyMetric } from '@/lib/database.types'

// Motion-wrapped Card
const MotionCard = motion.create(Card)

// Accessors
const getDate = (d: DailyMetric) => new Date(d.date)
const getEngagement = (d: DailyMetric) => d.engagement
const getReach = (d: DailyMetric) => d.reach
const bisectDate = bisector<DailyMetric, Date>((d) => new Date(d.date)).left

// Colors
const colors = {
  engagement: 'hsl(262, 83%, 58%)', // Purple
  engagementFill: 'hsl(262, 83%, 58%, 0.3)',
  reach: 'hsl(221, 83%, 53%)', // Blue
  reachFill: 'hsl(221, 83%, 53%, 0.2)',
  grid: 'hsl(0, 0%, 90%)',
  axis: 'hsl(0, 0%, 50%)',
}

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: 'hsl(0, 0%, 100%)',
  border: '1px solid hsl(0, 0%, 90%)',
  borderRadius: '8px',
  padding: '12px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
}

interface ChartProps {
  data: DailyMetric[]
  width: number
  height: number
  viewType: 'line' | 'area'
}

function Chart({ data, width, height, viewType }: ChartProps) {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<DailyMetric>()

  // Margins
  const margin = { top: 20, right: 20, bottom: 40, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // Scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        domain: [
          Math.min(...data.map((d) => getDate(d).getTime())),
          Math.max(...data.map((d) => getDate(d).getTime())),
        ],
        range: [0, innerWidth],
      }),
    [data, innerWidth]
  )

  const valueScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          0,
          Math.max(
            ...data.map((d) => Math.max(getEngagement(d), getReach(d)))
          ) * 1.1,
        ],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight]
  )

  // Tooltip handler
  const handleTooltip = useCallback(
    (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(event) || { x: 0 }
      const x0 = dateScale.invert(x - margin.left)
      const index = bisectDate(data, x0, 1)
      const d0 = data[index - 1]
      const d1 = data[index]
      let d = d0
      if (d1 && getDate(d1)) {
        d = x0.getTime() - getDate(d0).getTime() > getDate(d1).getTime() - x0.getTime() ? d1 : d0
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: dateScale(getDate(d)) + margin.left,
        tooltipTop: valueScale(getEngagement(d)) + margin.top,
      })
    },
    [dateScale, valueScale, data, margin.left, margin.top, showTooltip]
  )

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Grid */}
          <GridRows
            scale={valueScale}
            width={innerWidth}
            stroke={colors.grid}
            strokeOpacity={0.5}
            strokeDasharray="3,3"
          />

          {/* Reach - render first so it's behind */}
          {viewType === 'area' ? (
            <AreaClosed
              data={data}
              x={(d) => dateScale(getDate(d))}
              y={(d) => valueScale(getReach(d))}
              yScale={valueScale}
              curve={curveMonotoneX}
              fill={colors.reachFill}
              stroke={colors.reach}
              strokeWidth={2}
            />
          ) : (
            <LinePath
              data={data}
              x={(d) => dateScale(getDate(d))}
              y={(d) => valueScale(getReach(d))}
              curve={curveMonotoneX}
              stroke={colors.reach}
              strokeWidth={2}
            />
          )}

          {/* Engagement - render second so it's on top */}
          {viewType === 'area' ? (
            <AreaClosed
              data={data}
              x={(d) => dateScale(getDate(d))}
              y={(d) => valueScale(getEngagement(d))}
              yScale={valueScale}
              curve={curveMonotoneX}
              fill={colors.engagementFill}
              stroke={colors.engagement}
              strokeWidth={2}
            />
          ) : (
            <LinePath
              data={data}
              x={(d) => dateScale(getDate(d))}
              y={(d) => valueScale(getEngagement(d))}
              curve={curveMonotoneX}
              stroke={colors.engagement}
              strokeWidth={2}
            />
          )}

          {/* Axes */}
          <AxisBottom
            top={innerHeight}
            scale={dateScale}
            tickFormat={(d) => {
              const date = d as Date
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }}
            stroke={colors.axis}
            tickStroke={colors.axis}
            tickLabelProps={() => ({
              fill: colors.axis,
              fontSize: 11,
              textAnchor: 'middle',
            })}
            numTicks={6}
          />
          <AxisLeft
            scale={valueScale}
            stroke={colors.axis}
            tickStroke={colors.axis}
            tickFormat={(d) => formatNumber(d as number)}
            tickLabelProps={() => ({
              fill: colors.axis,
              fontSize: 11,
              textAnchor: 'end',
              dy: '0.33em',
              dx: -4,
            })}
            numTicks={5}
          />

          {/* Invisible overlay for tooltip */}
          <rect
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />

          {/* Tooltip indicator */}
          {tooltipData && (
            <>
              <circle
                cx={dateScale(getDate(tooltipData))}
                cy={valueScale(getEngagement(tooltipData))}
                r={5}
                fill={colors.engagement}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={dateScale(getDate(tooltipData))}
                cy={valueScale(getReach(tooltipData))}
                r={5}
                fill={colors.reach}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </>
          )}
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          top={tooltipTop}
          left={tooltipLeft}
          style={tooltipStyles}
        >
          <div className="space-y-1">
            <p className="font-medium text-sm">
              {new Date(tooltipData.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.engagement }}
              />
              <span>Engagement: {formatNumber(tooltipData.engagement)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.reach }}
              />
              <span>Reach: {formatNumber(tooltipData.reach)}</span>
            </div>
          </div>
        </TooltipWithBounds>
      )}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

function EmptyChart() {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
    >
      <CardHeader>
        <CardTitle>Engagement Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AreaChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            </motion.div>
            <p>No engagement data available</p>
            <p className="text-sm">Data will appear once you have daily metrics</p>
          </motion.div>
        </div>
      </CardContent>
    </MotionCard>
  )
}

function Legend() {
  return (
    <motion.div 
      className="flex items-center gap-6 text-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.engagement }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        <span>Engagement</span>
      </motion.div>
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.reach }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: 1 }}
        />
        <span>Reach</span>
      </motion.div>
    </motion.div>
  )
}

export function EngagementChart() {
  const { data: metrics, isLoading, error } = useDailyMetrics(30)
  const chartViewType = useUIStore((state) => state.chartViewType)
  const setChartViewType = useUIStore((state) => state.setChartViewType)

  if (isLoading) {
    return <ChartSkeleton />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-red-500">
            Failed to load chart data: {error.message}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics || metrics.length === 0) {
    return <EmptyChart />
  }

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 80, 
        damping: 15,
        delay: 0.2 
      }}
    >
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CardTitle>Engagement Over Time</CardTitle>
            </motion.div>
            <Legend />
          </div>
          <motion.div 
            className="flex gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          >
            <Button
              variant={chartViewType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartViewType('line')}
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartViewType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartViewType('area')}
            >
              <AreaChart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div 
          style={{ height: 300 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <ParentSize>
            {({ width, height }) => (
              <Chart
                data={metrics}
                width={width}
                height={height}
                viewType={chartViewType}
              />
            )}
          </ParentSize>
        </motion.div>
      </CardContent>
    </MotionCard>
  )
}
