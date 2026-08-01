# Next.js 框架

## 什么是 Next.js？

Next.js 是基于 React 的**全栈框架**，提供：
- 服务端渲染（SSR）
- 静态站点生成（SSG）
- API Routes（后端 API）
- 自动代码分割
- 优化的性能

---

## 核心概念

### 1. 文件系统路由

Next.js 使用**文件夹结构**作为路由：

```
app/
├── page.tsx          → / (首页)
├── about/
│   └── page.tsx      → /about
└── tools/
    └── draw-lots/
        └── page.tsx  → /tools/draw-lots
```

**规则：**
- `page.tsx` = 页面
- `layout.tsx` = 布局
- `route.ts` = API 路由

### 2. 服务端 vs 客户端

```typescript
// 服务端组件（默认）- 在服务器运行
export default function Page() {
  return <div>Server Component</div>
}

// 客户端组件 - 在浏览器运行
'use client'
export default function ClientPage() {
  return <div>Client Component</div>
}
```

---

## 项目结构

### 1. App Router（Next.js 13+）

```
app/
├── layout.tsx        # 根布局（所有页面共享）
├── page.tsx          # 首页
├── not-found.tsx     # 404 页面
├── api/              # API 路由
│   └── track-usage/
│       └── route.ts  # POST /api/track-usage
└── tools/            # 工具页面
    └── draw-lots/
        └── page.tsx
```

### 2. 布局（Layout）

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navigation />
        {children}  {/* 页面内容 */}
        <Footer />
      </body>
    </html>
  )
}
```

### 3. 页面（Page）

```typescript
// app/tools/draw-lots/page.tsx
export default function DrawLotsPage() {
  return <DrawLots />
}
```

---

## API Routes

Next.js 可以在 `app/api/` 中创建后端 API：

```typescript
// app/api/track-usage/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { tool } = await request.json()
  
  // 处理逻辑
  await saveToDatabase(tool)
  
  return NextResponse.json({ success: true })
}
```

**访问：**
```typescript
fetch('/api/track-usage', {
  method: 'POST',
  body: JSON.stringify({ tool: 'draw-lots' })
})
```

---

## 数据获取

### 1. 服务端获取

```typescript
// 服务端组件中直接获取
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  const json = await data.json()
  
  return <div>{json.title}</div>
}
```

### 2. 客户端获取

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
  }, [])

  return <div>{data?.title}</div>
}
```

---

## SEO 优化

### Metadata

```typescript
// app/page.tsx
export const metadata = {
  title: 'Free Online Tools',
  description: 'A collection of free tools'
}

// 动态 metadata
export async function generateMetadata({ params }) {
  return {
    title: `${params.tool} - Free Tools`
  }
}
```

---

## 在项目中的使用

### 1. 页面路由

```typescript
// app/tools/draw-lots/page.tsx
import DrawLots from '@/components/tools/DrawLots'

export default function DrawLotsPage() {
  return <DrawLots />
}
```

### 2. 动态路由

```typescript
// app/category/[category]/page.tsx
export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = params.category
  return <div>{category}</div>
}
```

### 3. API 路由

```typescript
// app/api/track-usage/route.ts
export async function POST(request: Request) {
  // 处理统计请求
}
```

---

## 开发命令

```bash
# 开发服务器
npm run dev        # http://localhost:3000

# 生产构建
npm run build      # 构建优化后的代码

# 生产服务器
npm start          # 运行生产版本
```

---

## 部署

Next.js 可以部署到：
- **Vercel**（推荐，Next.js 官方平台）
- **Netlify**
- **自托管服务器**

**Vercel 部署：**
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 自动部署

---

## 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [Next.js 中文文档](https://nextjs.org/docs/getting-started)

---

## 总结

- Next.js = React + 路由 + SSR + API
- 文件系统即路由
- 服务端和客户端组件
- 项目使用 Next.js 16（App Router）

