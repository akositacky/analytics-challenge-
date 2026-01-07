-- Migration: Add get_user_summary database helper function
-- This function aggregates analytics data for a user in a single optimized query

CREATE OR REPLACE FUNCTION public.get_user_summary(user_uuid uuid)
RETURNS TABLE(
  total_engagement bigint, 
  average_engagement_rate numeric, 
  posts_count integer, 
  top_post_id uuid, 
  top_post_caption text, 
  top_post_engagement bigint, 
  top_post_platform text, 
  trend_percentage numeric, 
  trend_direction text
)
LANGUAGE plpgsql
SECURITY INVOKER  -- Respects RLS policies
AS $$
DECLARE
  recent_engagement BIGINT;
  prior_engagement BIGINT;
  calc_trend NUMERIC;
BEGIN
  -- Calculate recent engagement (last 7 days)
  SELECT COALESCE(SUM(likes + comments + shares), 0)
  INTO recent_engagement
  FROM posts
  WHERE user_id = user_uuid
    AND posted_at >= NOW() - INTERVAL '7 days';
  
  -- Calculate prior engagement (7-14 days ago)
  SELECT COALESCE(SUM(likes + comments + shares), 0)
  INTO prior_engagement
  FROM posts
  WHERE user_id = user_uuid
    AND posted_at >= NOW() - INTERVAL '14 days'
    AND posted_at < NOW() - INTERVAL '7 days';
  
  -- Calculate trend percentage
  IF prior_engagement > 0 THEN
    calc_trend := ((recent_engagement - prior_engagement)::NUMERIC / prior_engagement) * 100;
  ELSIF recent_engagement > 0 THEN
    calc_trend := 100;
  ELSE
    calc_trend := 0;
  END IF;

  RETURN QUERY
  WITH post_stats AS (
    SELECT 
      p.id,
      p.caption,
      p.platform,
      p.engagement_rate,
      (p.likes + p.comments + p.shares) as engagement
    FROM posts p
    WHERE p.user_id = user_uuid
  ),
  top_post AS (
    SELECT id, caption, platform, engagement
    FROM post_stats
    ORDER BY engagement DESC
    LIMIT 1
  )
  SELECT 
    COALESCE(SUM(ps.engagement), 0)::BIGINT as total_engagement,
    COALESCE(ROUND(AVG(ps.engagement_rate), 2), 0)::NUMERIC as average_engagement_rate,
    COUNT(ps.id)::INTEGER as posts_count,
    tp.id as top_post_id,
    tp.caption as top_post_caption,
    COALESCE(tp.engagement, 0)::BIGINT as top_post_engagement,
    tp.platform as top_post_platform,
    ROUND(ABS(calc_trend), 1)::NUMERIC as trend_percentage,
    CASE 
      WHEN calc_trend > 0 THEN 'up'
      WHEN calc_trend < 0 THEN 'down'
      ELSE 'neutral'
    END as trend_direction
  FROM post_stats ps
  LEFT JOIN top_post tp ON true
  GROUP BY tp.id, tp.caption, tp.platform, tp.engagement;
END;
$$;

-- Add a comment to document the function
COMMENT ON FUNCTION public.get_user_summary(uuid) IS 
  'Aggregates analytics summary for a user: total engagement, average rate, top post, and trend data. Used by /api/analytics/summary endpoint.';
