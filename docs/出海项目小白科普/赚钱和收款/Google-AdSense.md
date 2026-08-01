# Google AdSense 广告指南

## 什么是 Google AdSense？

Google AdSense 是**Google 的广告平台**，网站主可以在网站上展示广告并赚取收入。

**工作原理：**
1. 你在网站上放置广告代码
2. 访客点击或查看广告
3. Google 支付你费用

---

## 申请条件

### 1. 基本要求

- ✅ 网站已上线（有域名）
- ✅ 有原创内容
- ✅ 网站符合 AdSense 政策
- ✅ 年满 18 岁

### 2. 内容要求

- **原创内容**：不能是复制的内容
- **有价值**：对用户有帮助
- **足够内容**：至少 10-20 页
- **导航清晰**：易于浏览

---

## 申请步骤

### 1. 注册账号

1. 访问 [google.com/adsense](https://www.google.com/adsense)
2. 使用 Google 账号登录
3. 点击 "Get started"

### 2. 填写信息

- **网站 URL**：你的网站地址
- **国家/地区**：选择你的国家
- **支付信息**：收款方式（银行卡或支票）

### 3. 添加广告代码

1. 获取广告代码
2. 添加到网站（见下方集成步骤）
3. 等待审核（通常 1-7 天）

### 4. 审核通过

审核通过后，广告开始展示，开始赚取收入。

---

## 集成到项目

### 1. 获取广告代码

1. 登录 AdSense Dashboard
2. 进入 "Ads" → "By ad unit"
3. 创建广告单元
4. 选择广告类型（显示广告、信息流广告等）
5. 获取广告代码

### 2. 添加到 Next.js

#### 方法 1：在 Layout 中添加

```typescript
// app/layout.tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* AdSense 脚本 */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

#### 方法 2：创建广告组件

```typescript
// components/ads/AdSense.tsx
'use client'
import { useEffect } from 'react'

export default function AdSense({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format="auto"
    />
  )
}
```

#### 方法 3：在页面中使用

```typescript
// app/page.tsx
import AdSense from '@/components/ads/AdSense'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      
      {/* 广告位置 */}
      <AdSense slot="1234567890" />
    </div>
  )
}
```

---

## 广告位置建议

### 1. 最佳位置

- **文章顶部**：用户刚进入页面
- **文章中间**：阅读过程中
- **侧边栏**：不影响主要内容
- **页面底部**：用户浏览完内容

### 2. 避免位置

- ❌ 遮挡主要内容
- ❌ 误导用户点击
- ❌ 过多广告（影响体验）

---

## 收入说明

### 1. 收入来源

- **CPC（点击付费）**：用户点击广告
- **CPM（展示付费）**：广告展示次数

### 2. 收入估算

**影响因素：**
- 网站流量
- 用户地区（美国用户价值更高）
- 内容类型
- 广告位置

**示例：**
- 1000 次访问/天
- 点击率：1%
- 每次点击：$0.50
- **日收入**：1000 × 1% × $0.50 = $5
- **月收入**：$150

**注意：** 实际收入因网站而异，仅供参考。

### 3. 支付

- **最低支付**：$100
- **支付周期**：每月 21-26 日
- **支付方式**：银行转账、西联汇款、支票

---

## 政策要求

### 1. 禁止行为

- ❌ 点击自己的广告
- ❌ 要求他人点击广告
- ❌ 误导性广告位置
- ❌ 违规内容

### 2. 内容政策

- ✅ 原创内容
- ✅ 有价值的内容
- ❌ 版权侵权内容
- ❌ 成人内容（需要特殊申请）

---

## 优化建议

### 1. 提高收入

- **增加流量**：SEO 优化，社交媒体推广
- **优化位置**：测试不同广告位置
- **内容质量**：高质量内容吸引更多用户
- **用户体验**：平衡广告和用户体验

### 2. 监控数据

- 查看 AdSense Dashboard
- 分析点击率和收入
- 调整广告位置和类型

---

## 常见问题

### Q: 申请被拒怎么办？

A: 
1. 检查网站内容质量
2. 确保有足够原创内容
3. 检查是否符合政策
4. 改进后重新申请

### Q: 收入什么时候到账？

A: 
- 达到 $100 后
- 每月 21-26 日支付
- 首次支付可能需要验证

### Q: 可以同时使用多个广告平台吗？

A: 
可以，但不建议过多，影响用户体验。

---

## 学习资源

- [Google AdSense 帮助中心](https://support.google.com/adsense)
- [AdSense 政策](https://support.google.com/adsense/answer/48182)

---

## 总结

- AdSense = Google 广告平台
- 申请需要网站上线和有内容
- 集成简单，添加代码即可
- 收入取决于流量和点击率
- 遵守政策，避免账号被封

