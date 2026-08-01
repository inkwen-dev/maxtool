# Tailwind CSS

## 什么是 Tailwind CSS？

Tailwind CSS 是**实用优先的 CSS 框架**，通过类名直接应用样式。

**特点：**
- ✅ 不需要写 CSS 文件
- ✅ 响应式设计简单
- ✅ 暗色模式支持
- ✅ 快速开发

---

## 基础用法

### 1. 基本类名

```html
<!-- 传统 CSS -->
<div class="my-div">Content</div>
<style>
  .my-div {
    padding: 1rem;
    background: blue;
    color: white;
  }
</style>

<!-- Tailwind CSS -->
<div class="p-4 bg-blue-500 text-white">Content</div>
```

### 2. 常用类名

```html
<!-- 间距 -->
<div class="p-4">padding: 1rem</div>
<div class="m-4">margin: 1rem</div>
<div class="px-4 py-2">padding: 0.5rem 1rem</div>

<!-- 颜色 -->
<div class="bg-blue-500">蓝色背景</div>
<div class="text-gray-900">深灰文字</div>

<!-- 布局 -->
<div class="flex items-center">Flex 布局</div>
<div class="grid grid-cols-3">3 列网格</div>

<!-- 尺寸 -->
<div class="w-full h-64">全宽，高度 256px</div>
```

---

## 响应式设计

Tailwind 使用**断点前缀**实现响应式：

```html
<!-- 默认：移动端 -->
<div class="text-sm">小文字</div>

<!-- md: 中等屏幕（≥768px） -->
<div class="md:text-base">中等文字</div>

<!-- lg: 大屏幕（≥1024px） -->
<div class="lg:text-lg">大文字</div>
```

**断点：**
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+
- `xl:` - 1280px+

---

## 暗色模式

Tailwind 支持暗色模式：

```html
<!-- 默认（亮色） -->
<div class="bg-white text-gray-900">亮色</div>

<!-- 暗色模式 -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  自适应颜色
</div>
```

**启用暗色模式：**
```typescript
// 在 html 标签添加 dark 类
<html class="dark">
```

---

## 在项目中的使用

### 1. 组件样式

```typescript
// components/ui/Button.tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  Click me
</button>
```

### 2. 响应式布局

```typescript
// 移动端 1 列，桌面端 3 列
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### 3. 暗色模式

```typescript
// 所有组件都支持暗色模式
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

---

## 常用类名速查

### 布局
- `flex` - Flexbox
- `grid` - Grid
- `hidden` - 隐藏
- `block` - 块级元素

### 间距
- `p-4` - padding: 1rem
- `m-4` - margin: 1rem
- `gap-4` - gap: 1rem

### 颜色
- `bg-blue-500` - 蓝色背景
- `text-gray-900` - 深灰文字
- `border-gray-300` - 灰色边框

### 尺寸
- `w-full` - width: 100%
- `h-screen` - height: 100vh
- `max-w-4xl` - max-width: 56rem

### 文字
- `text-sm` - 小文字
- `text-xl` - 大文字
- `font-bold` - 粗体

---

## 学习资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Tailwind CSS 中文文档](https://www.tailwindcss.cn/)

---

## 总结

- Tailwind = 实用优先的 CSS 框架
- 通过类名应用样式
- 响应式和暗色模式支持
- 项目使用 Tailwind CSS 4

