# Supabase 使用指南

## 什么是 Supabase？

Supabase 是**开源的 Firebase 替代品**，提供：
- PostgreSQL 数据库
- 实时订阅
- 身份认证
- 存储服务

**项目用途：** 免费 PostgreSQL 数据库（生产环境）

---

## 注册和创建项目

### 1. 注册账号

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "Start your project"
3. 使用 GitHub 账号登录（推荐）

### 2. 创建项目

1. 点击 "New Project"
2. 填写信息：
   - **Name**: 项目名称（如：freetool-prod）
   - **Database Password**: 设置数据库密码（记住它！）
   - **Region**: 选择离用户近的区域（如：Southeast Asia）
3. 点击 "Create new project"
4. 等待 2-3 分钟创建完成

---

## 获取连接信息

### 1. 找到 API 密钥

1. 进入项目 Dashboard
2. 点击左侧 "Settings" → "API"
3. 找到以下信息：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGc...`（公开密钥，前端使用）
   - **service_role key**: `eyJhbGc...`（服务密钥，后端使用，保密！）

### 2. 配置环境变量

```env
# .env.local（生产环境）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

---

## 创建数据库表

### 1. 使用 SQL Editor

1. 进入项目 Dashboard
2. 点击左侧 "SQL Editor"
3. 点击 "New query"

### 2. 执行 SQL 脚本

复制 `docs/上线资源/数据库设计.md` 中的 PostgreSQL SQL 脚本：

```sql
-- 创建表
CREATE TABLE usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_tool_name ON usage_stats(tool_name);
CREATE INDEX idx_created_at ON usage_stats(created_at);
```

4. 点击 "Run" 执行

### 3. 验证表创建

1. 点击左侧 "Table Editor"
2. 应该看到 `usage_stats` 表

---

## 在项目中使用

### 1. 安装客户端

```bash
npm install @supabase/supabase-js
```

### 2. 初始化客户端

```typescript
// lib/database.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
```

### 3. 插入数据

```typescript
// 插入使用统计
await supabase
  .from('usage_stats')
  .insert({ tool_name: 'draw-lots' })
```

### 4. 查询数据

```typescript
// 查询所有
const { data } = await supabase
  .from('usage_stats')
  .select('*')

// 条件查询
const { data } = await supabase
  .from('usage_stats')
  .select('*')
  .eq('tool_name', 'draw-lots')
```

---

## 免费额度

**免费计划限制：**
- 数据库存储：500MB
- 带宽：2GB/月
- API 请求：无限制
- 项目数量：无限制

**对于 MVP 项目足够使用！**

---

## 安全设置

### 1. Row Level Security (RLS)

Supabase 默认启用 RLS，需要配置策略：

```sql
-- 允许匿名插入（用于统计）
CREATE POLICY "Allow anonymous insert" 
ON usage_stats 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 允许匿名查询
CREATE POLICY "Allow anonymous select" 
ON usage_stats 
FOR SELECT 
TO anon 
USING (true);
```

### 2. API 密钥

- **anon key**: 前端使用，可以公开
- **service_role key**: 后端使用，**绝对不能**暴露在前端

---

## 监控和查看数据

### 1. Table Editor

- 查看表数据
- 手动插入/编辑数据
- 筛选和排序

### 2. SQL Editor

- 执行 SQL 查询
- 查看执行计划
- 分析性能

### 3. Logs

- 查看 API 请求日志
- 查看错误日志
- 监控使用情况

---

## 常见问题

### Q: 如何重置数据库？

A: Settings → Database → Reset database（会删除所有数据）

### Q: 如何备份数据？

A: Settings → Database → Backups（自动备份）

### Q: 如何查看使用量？

A: Settings → Usage（查看存储和带宽使用）

---

## 学习资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase 中文文档](https://supabase.com/docs/guides)

---

## 总结

- Supabase = 免费 PostgreSQL 数据库
- 注册 → 创建项目 → 获取密钥 → 创建表
- 项目使用 Supabase 作为生产数据库
- 免费额度足够 MVP 使用

