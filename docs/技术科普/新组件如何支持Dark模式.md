# 新组件如何支持 Dark 模式

## 核心问题

> 我要开发一个日期相关的日历工具，日历组件怎么支持 dark 模式？是自动支持，还是需要新增样式？

**答案取决于你使用的方案：**

---

## 方案对比

### 方案一：当前方案（Tailwind Dark Mode）

**需要手动添加 `dark:` 前缀**

```tsx
// ❌ 错误：不会自动支持 dark 模式
export default function Calendar() {
  return (
    <div className="bg-white text-gray-900">
      <div className="bg-gray-100">日期</div>
    </div>
  )
}
```

```tsx
// ✅ 正确：需要手动添加 dark: 前缀
export default function Calendar() {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
      <div className="bg-gray-100 dark:bg-gray-700">日期</div>
    </div>
  )
}
```

**特点：**
- ❌ **不会自动支持**，需要手动添加 `dark:` 前缀
- ❌ **容易遗漏**，忘记添加 dark 样式
- ❌ **工作量大**，每个元素都要写两遍样式

---

### 方案二：推荐方案（Tailwind v4 @theme + CSS 变量）

**使用主题变量 = 自动支持；使用硬编码颜色 = 不支持**

#### 情况 1：使用主题变量（✅ 自动支持）

```tsx
// ✅ 正确：使用主题变量，自动支持 dark 模式
export default function Calendar() {
  return (
    <div className="bg-bg-card text-text-primary">
      <div className="bg-bg-secondary">日期</div>
    </div>
  )
}
```

**特点：**
- ✅ **自动支持 dark 模式**
- ✅ **无需写 `dark:` 前缀**
- ✅ **代码简洁**

#### 情况 2：使用硬编码颜色（❌ 不支持）

```tsx
// ❌ 错误：使用硬编码颜色，不会自动支持 dark 模式
export default function Calendar() {
  return (
    <div className="bg-white text-gray-900">
      <div className="bg-gray-100">日期</div>
    </div>
  )
}
```

**特点：**
- ❌ **不会自动支持 dark 模式**
- ❌ **需要手动添加 `dark:` 前缀**（回到方案一）

---

## 具体示例：日期日历组件

### 示例 1：当前方案（Tailwind Dark Mode）

```tsx
'use client'

import { useState } from 'react'
import { trackUsage } from '@/lib/tracking'

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    trackUsage('calendar')
  }, [])

  return (
    <div className="space-y-6">
      {/* 日历容器 - 需要手动添加 dark: 前缀 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          选择日期
        </h2>
        
        {/* 日历网格 - 每个元素都要写 dark: */}
        <div className="grid grid-cols-7 gap-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300"
            >
              {day}
            </div>
          ))}
          
          {/* 日期单元格 - 每个都要写 dark: */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(new Date(2024, 0, date))}
              className={`
                p-2 rounded
                ${selectedDate?.getDate() === date
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600'
                }
              `}
            >
              {date}
            </button>
          ))}
        </div>
      </div>
      
      {/* 选中日期显示 - 需要写 dark: */}
      {selectedDate && (
        <div className="bg-blue-50 dark:bg-blue-900 border-2 border-blue-500 dark:border-blue-400 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">选中的日期：</p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {selectedDate.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}
```

**问题：**
- ❌ 每个元素都要写 `dark:` 前缀
- ❌ 代码冗长，难以维护
- ❌ 容易遗漏，忘记添加 dark 样式

---

### 示例 2：推荐方案（Tailwind v4 @theme + CSS 变量）

#### 第 1 步：在 `globals.css` 定义主题变量

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* 背景色 */
  --color-bg-card: #ffffff;
  --color-bg-secondary: #f5f5f5;
  --color-bg-hover: #e5e5e5;
  
  /* 文字色 */
  --color-text-primary: #171717;
  --color-text-secondary: #666666;
  
  /* 强调色 */
  --color-accent: #3b82f6;
  --color-accent-hover: #2563eb;
  
  /* 边框色 */
  --color-border: #e5e5e5;
}

@layer theme {
  .dark {
    --color-bg-card: #1e293b;        /* slate-800 */
    --color-bg-secondary: #334155;   /* slate-700 */
    --color-bg-hover: #475569;       /* slate-600 */
    
    --color-text-primary: #f8fafc;   /* slate-50 */
    --color-text-secondary: #cbd5e1; /* slate-300 */
    
    --color-accent: #60a5fa;         /* blue-400 */
    --color-accent-hover: #3b82f6;   /* blue-500 */
    
    --color-border: #334155;        /* slate-700 */
  }
}
```

#### 第 2 步：组件中使用主题变量（✅ 自动支持 dark 模式）

```tsx
'use client'

import { useState } from 'react'
import { trackUsage } from '@/lib/tracking'

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    trackUsage('calendar')
  }, [])

  return (
    <div className="space-y-6">
      {/* 日历容器 - 使用主题变量，自动支持 dark 模式 */}
      <div className="bg-bg-card rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          选择日期
        </h2>
        
        {/* 日历网格 - 使用主题变量，自动支持 dark 模式 */}
        <div className="grid grid-cols-7 gap-2">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-text-secondary"
            >
              {day}
            </div>
          ))}
          
          {/* 日期单元格 - 使用主题变量，自动支持 dark 模式 */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(new Date(2024, 0, date))}
              className={`
                p-2 rounded
                ${selectedDate?.getDate() === date
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-primary hover:bg-bg-hover'
                }
              `}
            >
              {date}
            </button>
          ))}
        </div>
      </div>
      
      {/* 选中日期显示 - 使用主题变量，自动支持 dark 模式 */}
      {selectedDate && (
        <div className="bg-accent/10 border-2 border-accent rounded-lg p-4">
          <p className="text-sm text-text-secondary">选中的日期：</p>
          <p className="text-xl font-bold text-accent">
            {selectedDate.toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}
```

**优势：**
- ✅ **自动支持 dark 模式**（无需写 `dark:` 前缀）
- ✅ **代码简洁**（类名更短）
- ✅ **易于维护**（颜色集中管理）

---

## 对比总结

| 方案 | 新组件是否自动支持 dark 模式 | 需要做什么 |
|------|---------------------------|----------|
| **方案一（Tailwind Dark Mode）** | ❌ **不会自动支持** | 需要手动为每个元素添加 `dark:` 前缀 |
| **方案二（Tailwind v4 @theme）** | ✅ **自动支持**（如果使用主题变量） | 使用 `bg-bg-card` 等主题变量，而不是 `bg-white` |

---

## 最佳实践

### ✅ 推荐做法

1. **使用主题变量**
   ```tsx
   // ✅ 正确
   <div className="bg-bg-card text-text-primary">
   ```

2. **避免硬编码颜色**
   ```tsx
   // ❌ 错误
   <div className="bg-white text-gray-900">
   ```

3. **使用透明度修饰符**
   ```tsx
   // ✅ 正确
   <div className="bg-accent/10 border-accent">
   ```

### ❌ 避免的做法

1. **硬编码颜色**
   ```tsx
   // ❌ 错误：不会自动支持 dark 模式
   <div className="bg-white dark:bg-gray-800">
   ```

2. **混用主题变量和硬编码**
   ```tsx
   // ❌ 错误：部分支持，部分不支持
   <div className="bg-bg-card text-gray-900">
   ```

---

## 开发指南

### 创建新组件时的检查清单

- [ ] 使用 `bg-bg-card` 而不是 `bg-white`
- [ ] 使用 `text-text-primary` 而不是 `text-gray-900`
- [ ] 使用 `bg-bg-secondary` 而不是 `bg-gray-100`
- [ ] 使用 `border-border` 而不是 `border-gray-200`
- [ ] 使用 `bg-accent` 而不是 `bg-blue-500`
- [ ] **不要写 `dark:` 前缀**（如果使用主题变量）

### 主题变量列表

| 用途 | 主题变量 | 替代硬编码 |
|------|---------|-----------|
| 卡片背景 | `bg-bg-card` | `bg-white` / `bg-gray-800` |
| 次要背景 | `bg-bg-secondary` | `bg-gray-100` / `bg-gray-700` |
| 主文字 | `text-text-primary` | `text-gray-900` / `text-gray-100` |
| 次要文字 | `text-text-secondary` | `text-gray-600` / `text-gray-400` |
| 边框 | `border-border` | `border-gray-200` / `border-gray-700` |
| 强调色 | `bg-accent` | `bg-blue-500` / `bg-blue-400` |

---

## 实际案例

### 案例 1：日期选择器组件

**使用主题变量（✅ 自动支持）：**
```tsx
<div className="bg-bg-card border border-border rounded-lg p-4">
  <div className="text-text-primary">日期选择器</div>
  <button className="bg-accent text-white hover:bg-accent-hover">
    选择日期
  </button>
</div>
```

**使用硬编码颜色（❌ 需要手动添加 dark:）：**
```tsx
<div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
  <div className="text-gray-900 dark:text-gray-100">日期选择器</div>
  <button className="bg-blue-500 dark:bg-blue-400 text-white hover:bg-blue-600 dark:hover:bg-blue-500">
    选择日期
  </button>
</div>
```

---

## 总结

### 回答你的问题

> 日期日历组件怎么支持 dark 模式？是自动支持，还是需要新增样式？

**答案：**

1. **如果使用推荐方案（Tailwind v4 @theme + CSS 变量）**：
   - ✅ **使用主题变量 = 自动支持**
   - ❌ **使用硬编码颜色 = 不支持**（需要手动添加 `dark:` 前缀）

2. **如果使用当前方案（Tailwind Dark Mode）**：
   - ❌ **不会自动支持**，需要手动为每个元素添加 `dark:` 前缀

### 建议

**迁移到推荐方案（Tailwind v4 @theme + CSS 变量）**，这样：
- ✅ 新组件自动支持 dark 模式（只要使用主题变量）
- ✅ 代码更简洁（不需要写 `dark:` 前缀）
- ✅ 易于维护（颜色集中管理）

