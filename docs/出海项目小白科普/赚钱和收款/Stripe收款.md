# Stripe 收款指南

## 什么是 Stripe？

Stripe 是**全球支付处理平台**，支持：
- 信用卡支付
- 订阅付费
- 退款处理
- 多币种支持

**特点：**
- ✅ 支持 134 种货币
- ✅ 开发者友好
- ✅ 手续费透明
- ✅ 全球可用

---

## 注册账号

### 1. 注册要求

**重要：** Stripe 不支持中国大陆注册，需要：
- 香港/美国/其他地区身份
- 或使用海外公司注册

**推荐方式：**
- 使用香港身份注册
- 或使用海外公司

### 2. 注册步骤

1. 访问 [stripe.com](https://stripe.com)
2. 点击 "Start now"
3. 填写信息：
   - 邮箱
   - 密码
   - 国家/地区（选择支持的地区）
4. 验证邮箱

---

## 获取 API 密钥

### 1. 进入 Dashboard

登录后进入 Dashboard → Developers → API keys

### 2. 获取密钥

**测试密钥（Test mode）：**
- **Publishable key**: `pk_test_...`（前端使用）
- **Secret key**: `sk_test_...`（后端使用，保密！）

**生产密钥（Live mode）：**
- 需要完成账户验证
- **Publishable key**: `pk_live_...`
- **Secret key**: `sk_live_...`

---

## 集成到项目

### 1. 安装 SDK

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. 配置环境变量

```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 3. 创建支付页面

```typescript
// app/payment/page.tsx
'use client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const handlePayment = async () => {
    const stripe = await stripePromise
    
    // 创建支付会话
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ amount: 1000 }) // $10.00
    })
    
    const session = await response.json()
    
    // 跳转到 Stripe 支付页面
    await stripe?.redirectToCheckout({ sessionId: session.id })
  }

  return <button onClick={handlePayment}>Pay $10</button>
}
```

### 4. 创建支付会话 API

```typescript
// app/api/create-checkout-session/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: Request) {
  const { amount } = await request.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Premium Plan',
        },
        unit_amount: amount, // 金额（分）
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  })

  return NextResponse.json({ id: session.id })
}
```

---

## 费用说明

### 手续费

**美国：**
- 在线支付：2.9% + $0.30
- 国际卡：3.9% + $0.30

**示例：**
- $10 订单：$10 × 2.9% + $0.30 = $0.59 手续费
- 实际收到：$9.41

### 提现

- **提现周期**：2-7 个工作日
- **提现费用**：免费（自动提现）

---

## 测试支付

### 1. 使用测试卡

Stripe 提供测试卡号：

**成功支付：**
```
Card: 4242 4242 4242 4242
Expiry: 任意未来日期
CVC: 任意 3 位数字
```

**失败支付：**
```
Card: 4000 0000 0000 0002
```

### 2. 测试流程

1. 使用测试密钥
2. 使用测试卡号
3. 完成支付流程
4. 在 Dashboard 查看测试交易

---

## 生产环境

### 1. 账户验证

切换到 Live mode 前需要：
- 验证身份信息
- 验证银行账户
- 验证税务信息

### 2. 切换密钥

```env
# 生产环境
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### 3. Webhook（可选）

处理支付完成事件：

```typescript
// app/api/webhook/route.ts
export async function POST(request: Request) {
  const event = await stripe.webhooks.constructEvent(...)
  
  if (event.type === 'checkout.session.completed') {
    // 支付成功，更新数据库
  }
}
```

---

## 常见场景

### 1. 一次性支付

```typescript
// 创建支付会话
const session = await stripe.checkout.sessions.create({
  mode: 'payment',
  // ...
})
```

### 2. 订阅付费

```typescript
// 创建订阅
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{
    price: 'price_xxx', // 订阅价格 ID
    quantity: 1,
  }],
})
```

### 3. 退款

```typescript
// 处理退款
await stripe.refunds.create({
  payment_intent: 'pi_xxx',
  amount: 1000, // 退款金额（分）
})
```

---

## 学习资源

- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe 支付集成指南](https://stripe.com/docs/payments/checkout)

---

## 总结

- Stripe = 全球支付处理平台
- 需要海外身份或公司注册
- 手续费：2.9% + $0.30（美国）
- 集成简单，API 友好
- 测试环境免费测试

