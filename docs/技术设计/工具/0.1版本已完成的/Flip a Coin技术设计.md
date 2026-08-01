# Flip a Coin技术设计文档

## 1. 概述

Flip a Coin是一款在线抛硬币工具，用户可以模拟抛硬币的过程，随机获得正面（Heads）或反面（Tails）的结果。该工具支持3D动画效果，增强用户体验。

## 2. 功能设计

### 2.1 核心功能
- 模拟抛硬币过程
- 显示抛硬币结果（正面/反面）
- 3D动画效果
- 记录抛硬币历史
- 统计正面和反面的次数及概率
- 重置功能
- 复制结果功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持自定义硬币样式

## 3. 技术设计

### 3.1 组件结构
- `FlipCoinTool`: 主组件，包含所有功能
  - `CoinAnimation`: 硬币动画组件（3D效果）
  - `FlipControls`: 抛硬币控制组件（抛硬币按钮、重置按钮）
  - `ResultsDisplay`: 结果显示组件（当前结果、历史记录）
  - `StatisticsPanel`: 统计面板组件（正面/反面次数及概率）
  - `CustomizationOptions`: 自定义选项组件（硬币样式）

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  result: null as 'heads' | 'tails' | null,
  isFlipping: false,
  flipHistory: [] as ('heads' | 'tails')[],
  statistics: {
    heads: 0,
    tails: 0,
    total: 0
  },
  customization: {
    coinStyle: 'default' // 'default', 'classic', 'modern'
  }
})

// 抛硬币
const flipCoin = () => {
  setToolState(prev => ({
    ...prev,
    isFlipping: true,
    result: null
  }))
  
  // 硬币旋转动画时间（毫秒）
  const animationDuration = 1500
  
  // 延迟执行，模拟硬币旋转动画
  setTimeout(() => {
    // 随机生成正面或反面（50%概率）
    const result = Math.random() > 0.5 ? 'heads' : 'tails'
    
    // 更新历史记录和统计数据
    setToolState(prev => {
      const newHistory = [...prev.flipHistory, result]
      const newStatistics = {
        heads: newHistory.filter(r => r === 'heads').length,
        tails: newHistory.filter(r => r === 'tails').length,
        total: newHistory.length
      }
      
      return {
        ...prev,
        result,
        isFlipping: false,
        flipHistory: newHistory,
        statistics: newStatistics
      }
    })
    
    // 记录抛硬币事件
    trackUsage('flip-coin', { result, flipCount: toolState.flipHistory.length + 1 })
  }, animationDuration)
}

// 重置功能
const resetFlip = () => {
  setToolState(prev => ({
    ...prev,
    result: null,
    flipHistory: [],
    statistics: {
      heads: 0,
      tails: 0,
      total: 0
    }
  }))
}

// 复制结果
const copyResult = () => {
  if (!toolState.result) return
  
  const resultText = toolState.result === 'heads' ? 'Heads' : 'Tails'
  
  navigator.clipboard.writeText(resultText)
    .then(() => {
      // 显示复制成功提示
      setToolState(prev => ({
        ...prev,
        showCopySuccess: true
      }))
      
      // 2秒后隐藏提示
      setTimeout(() => {
        setToolState(prev => ({
          ...prev,
          showCopySuccess: false
        }))
      }, 2000)
    })
    .catch(err => {
      console.error('复制失败:', err)
      // 显示复制失败提示
    })
}

// 自定义硬币样式
const changeCoinStyle = (style: 'default' | 'classic' | 'modern') => {
  setToolState(prev => ({
    ...prev,
    customization: {
      ...prev.customization,
      coinStyle: style
    }
  }))
  
  // 保存自定义设置到本地存储
  localStorage.setItem('flipCoinCustomization', JSON.stringify({
    coinStyle: style
  }))
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载自定义设置
  const savedCustomization = localStorage.getItem('flipCoinCustomization')
  if (savedCustomization) {
    setToolState(prev => ({
      ...prev,
      customization: JSON.parse(savedCustomization)
    }))
  }
}, [])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `ResultsDisplay`: 结果显示组件
- `StatisticsPanel`: 统计面板组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface FlipCoinStatistics {
  heads: number
  tails: number
  total: number
}

interface FlipCoinCustomization {
  coinStyle: 'default' | 'classic' | 'modern'
}

interface FlipCoinState {
  result: 'heads' | 'tails' | null
  isFlipping: boolean
  flipHistory: ('heads' | 'tails')[]
  statistics: FlipCoinStatistics
  customization: FlipCoinCustomization
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 抛硬币功能
- 3D动画效果
- 结果显示功能
- 历史记录功能
- 统计功能
- 重置功能
- 复制结果功能
- 自定义硬币样式功能

### 6.2 边界测试
- 大量抛硬币的情况（统计准确性）
- 动画性能测试（在不同设备上）

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 动画效果的流畅度
- 结果显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化动画效果
- 增加更多自定义硬币样式

## 8. 总结

Flip a Coin工具采用组件化设计，核心功能使用JavaScript实现随机结果生成和3D动画效果，帮助用户模拟抛硬币过程。工具具有良好的用户体验和可维护性。