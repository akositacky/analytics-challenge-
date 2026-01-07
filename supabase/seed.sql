-- =====================
-- SEED DATA FOR TESTING
-- =====================
-- User A: 00366b74-26ec-49f4-b87e-079e0a719313
-- User B: ee1bf5d1-6432-4b8b-a256-1062d3b59407
--
-- NOTE: Before running this seed, create these users in Supabase Auth:
-- 1. Go to Authentication > Users > Add user
-- 2. Create User A: usera@test.com / password123
-- 3. Create User B: userb@test.com / password123
-- 4. Replace the UUIDs below with the actual UUIDs from Supabase

-- =====================
-- POSTS FOR USER A (15 posts)
-- =====================
INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Excited to share our latest product launch! 🚀 What do you think? #startup #launch', 'https://picsum.photos/seed/post1/400/400', 'image', '2025-12-15T14:30:00Z', 1243, 89, 45, 156, 15420, 18650, 8.20, 'https://instagram.com/p/example1'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'Behind the scenes of our creative process 🎬 #bts #creative', 'https://picsum.photos/seed/post2/400/400', 'video', '2025-12-14T10:00:00Z', 5621, 234, 189, 423, 45000, 52000, 12.50, 'https://tiktok.com/@example/video/123'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Monday motivation! 💪 How are you starting your week?', 'https://picsum.photos/seed/post3/400/400', 'carousel', '2025-12-13T08:00:00Z', 876, 56, 23, 89, 9800, 11200, 6.80, 'https://instagram.com/p/example3'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'This hack changed everything! 🤯 #lifehack #viral', 'https://picsum.photos/seed/post4/400/400', 'video', '2025-12-12T16:45:00Z', 12450, 567, 890, 234, 89000, 102000, 15.30, 'https://tiktok.com/@example/video/124'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'New office views 🌆 #worklife #startup', 'https://picsum.photos/seed/post5/400/400', 'image', '2025-12-11T09:15:00Z', 654, 43, 12, 67, 7200, 8100, 5.90, 'https://instagram.com/p/example5'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Team lunch vibes 🍕 #teamwork #culture', 'https://picsum.photos/seed/post6/400/400', 'carousel', '2025-12-10T12:30:00Z', 932, 78, 34, 112, 10500, 12300, 7.40, 'https://instagram.com/p/example6'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'POV: When the code finally works 😅 #developer #coding', 'https://picsum.photos/seed/post7/400/400', 'video', '2025-12-09T18:00:00Z', 8920, 445, 623, 567, 67000, 78000, 13.80, 'https://tiktok.com/@example/video/125'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Grateful for this journey ✨ #reflection #growth', 'https://picsum.photos/seed/post8/400/400', 'image', '2025-12-08T07:45:00Z', 1567, 123, 56, 234, 16800, 19200, 9.10, 'https://instagram.com/p/example8'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'Replying to @user - here is how we did it! #tutorial', 'https://picsum.photos/seed/post9/400/400', 'video', '2025-12-07T14:20:00Z', 3456, 189, 234, 345, 34000, 41000, 10.20, 'https://tiktok.com/@example/video/126'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Weekend project complete! 🛠️ #diy #maker', 'https://picsum.photos/seed/post10/400/400', 'carousel', '2025-12-06T11:00:00Z', 789, 67, 28, 98, 8900, 10100, 6.50, 'https://instagram.com/p/example10'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'Day in my life as a founder 📱 #entrepreneur #startup', 'https://picsum.photos/seed/post11/400/400', 'video', '2025-12-05T08:30:00Z', 6780, 312, 456, 234, 54000, 62000, 11.90, 'https://tiktok.com/@example/video/127'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Coffee and code ☕ #morning #productivity', 'https://picsum.photos/seed/post12/400/400', 'image', '2025-12-04T06:00:00Z', 543, 34, 15, 56, 6100, 7000, 5.20, 'https://instagram.com/p/example12'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Big announcement coming soon! 👀 #teaser #excited', 'https://picsum.photos/seed/post13/400/400', 'image', '2025-12-03T17:00:00Z', 2345, 178, 89, 312, 22000, 25000, 10.80, 'https://instagram.com/p/example13'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'tiktok', 'The algorithm explained in 60 seconds ⚡ #tech #explained', 'https://picsum.photos/seed/post14/400/400', 'video', '2025-12-02T13:45:00Z', 15670, 723, 1234, 567, 120000, 145000, 14.20, 'https://tiktok.com/@example/video/128'),
('00366b74-26ec-49f4-b87e-079e0a719313', 'instagram', 'Throwback to where it all started 🏠 #throwback #memories', 'https://picsum.photos/seed/post15/400/400', 'carousel', '2025-12-01T10:30:00Z', 1890, 145, 67, 223, 19500, 22800, 8.90, 'https://instagram.com/p/example15');

-- =====================
-- POSTS FOR USER B (15 posts)
-- =====================
INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Living my best life 🌴 #vacation #travel', 'https://picsum.photos/seed/postb1/400/400', 'image', '2025-12-15T11:00:00Z', 2340, 156, 78, 234, 24000, 28000, 9.80, 'https://instagram.com/p/exampleb1'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Recipe of the day: 5-minute pasta 🍝 #cooking #recipe', 'https://picsum.photos/seed/postb2/400/400', 'video', '2025-12-14T18:30:00Z', 8934, 456, 678, 890, 72000, 85000, 13.10, 'https://tiktok.com/@exampleb/video/201'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Sunset views never get old 🌅 #nature #photography', 'https://picsum.photos/seed/postb3/400/400', 'image', '2025-12-13T19:45:00Z', 1567, 89, 45, 167, 16000, 18500, 8.40, 'https://instagram.com/p/exampleb3'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Wait for the end! 😱 #unexpected #funny', 'https://picsum.photos/seed/postb4/400/400', 'video', '2025-12-12T14:00:00Z', 23456, 1234, 2345, 678, 180000, 210000, 16.70, 'https://tiktok.com/@exampleb/video/202'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Morning routine 🌅☕ #lifestyle #wellness', 'https://picsum.photos/seed/postb5/400/400', 'carousel', '2025-12-11T07:00:00Z', 1234, 98, 56, 189, 13500, 15800, 7.90, 'https://instagram.com/p/exampleb5'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Storytime: How I quit my job 💼 #storytime #career', 'https://picsum.photos/seed/postb6/400/400', 'video', '2025-12-10T20:15:00Z', 15678, 890, 1123, 456, 125000, 148000, 14.50, 'https://tiktok.com/@exampleb/video/203'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Home workout complete 💪 #fitness #homeworkout', 'https://picsum.photos/seed/postb7/400/400', 'video', '2025-12-09T16:30:00Z', 987, 67, 34, 123, 10200, 11800, 7.20, 'https://instagram.com/p/exampleb7'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Book recommendations 📚 #reading #books', 'https://picsum.photos/seed/postb8/400/400', 'carousel', '2025-12-08T14:00:00Z', 1456, 234, 67, 345, 15600, 17900, 9.30, 'https://instagram.com/p/exampleb8'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Packing tips for minimalist travel ✈️ #travel #packing', 'https://picsum.photos/seed/postb9/400/400', 'video', '2025-12-07T09:45:00Z', 6789, 345, 567, 234, 55000, 64000, 12.10, 'https://tiktok.com/@exampleb/video/204'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Brunch date 🥐 #foodie #brunch', 'https://picsum.photos/seed/postb10/400/400', 'image', '2025-12-06T10:30:00Z', 876, 56, 23, 98, 9100, 10400, 6.60, 'https://instagram.com/p/exampleb10'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Skincare routine that changed my life 🧴 #skincare #routine', 'https://picsum.photos/seed/postb11/400/400', 'video', '2025-12-05T17:00:00Z', 19234, 1023, 1567, 890, 156000, 182000, 15.80, 'https://tiktok.com/@exampleb/video/205'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'City lights 🌃 #nightlife #cityscape', 'https://picsum.photos/seed/postb12/400/400', 'image', '2025-12-04T21:00:00Z', 2134, 145, 78, 267, 21500, 24800, 9.70, 'https://instagram.com/p/exampleb12'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Cozy Sunday vibes 🛋️ #sunday #cozy', 'https://picsum.photos/seed/postb13/400/400', 'carousel', '2025-12-03T15:30:00Z', 1678, 112, 45, 198, 17200, 19600, 8.50, 'https://instagram.com/p/exampleb13'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'tiktok', 'Apartment tour 2025 🏠 #hometour #apartment', 'https://picsum.photos/seed/postb14/400/400', 'video', '2025-12-02T12:00:00Z', 11234, 678, 892, 456, 92000, 108000, 13.40, 'https://tiktok.com/@exampleb/video/206'),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', 'instagram', 'Grateful for the little things ✨ #gratitude #mindfulness', 'https://picsum.photos/seed/postb15/400/400', 'image', '2025-12-01T08:00:00Z', 1890, 167, 89, 278, 19800, 22500, 9.20, 'https://instagram.com/p/exampleb15');

-- =====================
-- DAILY METRICS FOR USER A (30 days)
-- =====================
INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-01', 2450, 28500),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-02', 3120, 35200),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-03', 2890, 31800),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-04', 1980, 22400),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-05', 4560, 48900),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-06', 3240, 36700),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-07', 2780, 30100),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-08', 3890, 42300),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-09', 5670, 61200),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-10', 4120, 45600),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-11', 2340, 26800),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-12', 6780, 72400),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-13', 3450, 38900),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-14', 4890, 53200),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-15', 3670, 41100),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-16', 2890, 32400),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-17', 4230, 46800),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-18', 5120, 55900),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-19', 3780, 41200),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-20', 4560, 49800),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-21', 6230, 67400),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-22', 5890, 63100),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-23', 4120, 45200),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-24', 3450, 38600),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-25', 2890, 32100),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-26', 3670, 40800),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-27', 4890, 53400),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-28', 5230, 56700),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-29', 4670, 50900),
('00366b74-26ec-49f4-b87e-079e0a719313', '2025-12-30', 5450, 59200);

-- =====================
-- DAILY METRICS FOR USER B (30 days)
-- =====================
INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-01', 3120, 36400),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-02', 4560, 51200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-03', 3890, 43600),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-04', 5230, 58100),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-05', 7890, 86400),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-06', 4120, 45800),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-07', 5670, 62300),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-08', 4890, 53700),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-09', 3450, 38200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-10', 6780, 74100),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-11', 4230, 46900),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-12', 9870, 108200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-13', 5120, 56400),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-14', 6450, 70800),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-15', 5890, 64500),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-16', 4560, 50200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-17', 5230, 57600),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-18', 6780, 74300),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-19', 5450, 59800),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-20', 7120, 78100),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-21', 8340, 91200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-22', 6890, 75400),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-23', 5670, 62100),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-24', 4890, 53600),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-25', 4120, 45200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-26', 5340, 58600),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-27', 6780, 74200),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-28', 7230, 79100),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-29', 6120, 67000),
('ee1bf5d1-6432-4b8b-a256-1062d3b59407', '2025-12-30', 7450, 81600);
