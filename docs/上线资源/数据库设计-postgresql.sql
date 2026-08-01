-- ============================================
-- PostgreSQL数据库初始化脚本
-- 项目：Free Online Tools
-- 数据库：PostgreSQL (本地/Supabase)
-- ============================================

-- 0. 启用 UUID 扩展（如果需要使用 uuid_generate_v4）
-- 注意：PostgreSQL 13+ 可以使用 gen_random_uuid()，无需扩展
-- 如果使用 uuid_generate_v4()，需要先执行：CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 推荐使用 gen_random_uuid()（无需扩展，性能更好）

-- 1. 创建使用统计表
CREATE TABLE IF NOT EXISTS usage_stats (
  -- 主键，唯一标识每条记录
  -- 使用 gen_random_uuid() 无需扩展，PostgreSQL 13+ 支持
  -- 如果 PostgreSQL 版本 < 13，请使用：uuid_generate_v4() 并启用 uuid-ossp 扩展
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 工具名称，如 'draw-lots', 'random-number'
  -- 用于统计哪个工具使用最多
  tool_name VARCHAR(100) NOT NULL,
  
  -- 使用时间，记录用户何时使用了工具
  -- 用于分析使用时间段和趋势
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. 创建索引
-- 按工具名称查询（统计某个工具的使用次数）
CREATE INDEX IF NOT EXISTS idx_tool_name ON usage_stats(tool_name);

-- 按时间查询（分析使用趋势）
CREATE INDEX IF NOT EXISTS idx_created_at ON usage_stats(created_at);

-- 3. 添加表注释
COMMENT ON TABLE usage_stats IS '工具使用统计表，记录每个工具的使用情况';
COMMENT ON COLUMN usage_stats.id IS '主键，唯一标识每条记录';
COMMENT ON COLUMN usage_stats.tool_name IS '工具名称，如 draw-lots, random-number';
COMMENT ON COLUMN usage_stats.created_at IS '使用时间，记录用户何时使用了工具';

-- 4. 验证表创建
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'usage_stats'
ORDER BY ordinal_position;

-- ============================================
-- 统计查询（PostgreSQL）
-- ============================================

-- 1. 统计每个工具的总使用次数
SELECT 
  tool_name, 
  COUNT(*) as total_usage 
FROM usage_stats 
GROUP BY tool_name 
ORDER BY total_usage DESC;

-- 2. 统计今天的工具使用情况
SELECT 
  tool_name, 
  COUNT(*) as today_usage 
FROM usage_stats 
WHERE DATE(created_at) = CURRENT_DATE
GROUP BY tool_name 
ORDER BY today_usage DESC;

-- 3. 统计最热门的10个工具
SELECT 
  tool_name, 
  COUNT(*) as usage_count 
FROM usage_stats 
GROUP BY tool_name 
ORDER BY usage_count DESC 
LIMIT 10;

-- ============================================
-- 数据维护（可选）
-- ============================================

-- 数据清理：删除30天前的数据
-- DELETE FROM usage_stats 
-- WHERE created_at < NOW() - INTERVAL '30 days';

