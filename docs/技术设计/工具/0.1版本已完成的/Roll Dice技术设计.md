# Roll Dice技术设计文档

## 1. 概述

Roll Dice是一款在线掷骰子工具，用户可以模拟掷骰子的过程，支持多种骰子类型和数量，随机获得掷骰子的结果。该工具支持3D动画效果，增强用户体验。

## 2. 功能设计

### 2.1 核心功能
- 支持多种骰子类型（4面、6面、8面、10面、12面、20面等）
- 支持同时掷多个骰子
- 3D动画效果
- 显示掷骰子结果
- 记录掷骰子历史
- 统计掷骰子结果
- 重置功能
- 复制结果功能
- 支持自定义骰子样式

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持常用骰子组合预设（如D&D、RPG等）

## 3. 技术设计

### 3.1 组件结构
- `RollDiceTool`: 主组件，包含所有功能
  - `DiceSelection`: 骰子选择组件（骰子类型、数量）
  - `PresetOptions`: 预设选项组件（常用骰子组合）
  - `DiceAnimation`: 骰子动画组件（3D效果）
  - `RollControls`: 掷骰子控制组件（掷骰子按钮、重置按钮）
  - `ResultsDisplay`: 结果显示组件（当前结果、历史记录）
  - `StatisticsPanel`: 统计面板组件（各面出现次数及概率）
  - `CustomizationOptions`: 自定义选项组件（骰子样式）

### 3.2 核心实现逻辑
```javascript
// 骰子类型定义
type DiceType = 4 | 6 | 8 | 10 | 12 | 20

// 工具状态管理
const [toolState, setToolState] = useState({
  diceType: 6 as DiceType,
  diceCount: 1,
  results: [] as number[],
  total: 0,
  isRolling: false,
  rollHistory: [] as { dice: DiceType; count: number; results: number[]; total: number }[],
  statistics: {}
  customization: {
    diceStyle: 'default' // 'default', 'classic', 'modern'
  }
})

// 掷骰子
const rollDice = () => {
  const { diceType, diceCount } = toolState
  
  setToolState(prev => ({
    ...prev,
    isRolling: true,
    results: [],
    total: 0
  }))
  
  // 骰子滚动动画时间（毫秒）
  const animationDuration = 1500
  
  // 延迟执行，模拟骰子滚动动画
  setTimeout(() => {
    // 生成随机结果
    const results: number[] = []
    let total = 0
    
    for (let i = 0; i < diceCount; i++) {
      // 生成1到diceType之间的随机整数
      const result = Math.floor(Math.random() * diceType) + 1
      results.push(result)
      total += result
    }
    
    // 更新掷骰子历史
    const rollHistoryItem = {
      dice: diceType,
      count: diceCount,
      results,
      total
    }
    
    // 更新统计数据
    const newStatistics = { ...toolState.statistics }
    results.forEach(result => {
      if (!newStatistics[result]) {
        newStatistics[result] = 0
      }
      newStatistics[result]++
    })
    
    setToolState(prev => ({
      ...prev,
      results,
      total,
      isRolling: false,
      rollHistory: [rollHistoryItem, ...prev.rollHistory].slice(0, 10), // 保存最近10次记录
      statistics: newStatistics
    }))
    
    // 记录掷骰子事件
    trackUsage('roll-dice', { diceType, diceCount, results, total })
  }, animationDuration)
}

// 重置功能
const resetRoll = () => {
  setToolState(prev => ({
    ...prev,
    results: [],
    total: 0,
    rollHistory: [],
    statistics: {}
  }))
}

// 复制结果
const copyResult = () => {
  if (toolState.results.length === 0) return
  
  const resultText = `${toolState.diceCount}d${toolState.diceType}: ${toolState.results.join(' + ')} = ${toolState.total}`
  
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

// 设置骰子类型
const setDiceType = (type: DiceType) => {
  setToolState(prev => ({
    ...prev,
    diceType: type
  }))
}

// 设置骰子数量
const setDiceCount = (count: number) => {
  // 限制骰子数量在1-10之间
  const newCount = Math.max(1, Math.min(10, count))
  setToolState(prev => ({
    ...prev,
    diceCount: newCount
  }))
}

// 应用预设骰子组合
const applyPreset = (preset: { diceType: DiceType; diceCount: number }) => {
  setToolState(prev => ({
    ...prev,
    diceType: preset.diceType,
    diceCount: preset.diceCount
  }))
}

// 自定义骰子样式
const changeDiceStyle = (style: 'default' | 'classic' | 'modern') => {
  setToolState(prev => ({
    ...prev,
    customization: {
      ...prev.customization,
      diceStyle: style
    }
  }))
  
  // 保存自定义设置到本地存储
  localStorage.setItem('rollDiceCustomization', JSON.stringify({
    diceStyle: style
  }))
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载自定义设置
  const savedCustomization = localStorage.getItem('rollDiceCustomization')
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
- `Select`: 选择组件（骰子类型）
- `Slider`: 滑块组件（骰子数量）
- `ResultsDisplay`: 结果显示组件
- `StatisticsPanel`: 统计面板组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
type DiceType = 4 | 6 | 8 | 10 | 12 | 20

interface DiceRollResult {
  dice: DiceType
  count: number
  results: number[]
  total: number
}

interface DiceStatistics {
  [key: number]: number
}

interface DiceCustomization {
  diceStyle: 'default' | 'classic' | 'modern'
}

interface RollDiceState {
  diceType: DiceType
  diceCount: number
  results: number[]
  total: number
  isRolling: boolean
  rollHistory: DiceRollResult[]
  statistics: DiceStatistics
  customization: DiceCustomization
  showCopySuccess?: boolean
}

interface DicePreset {
  name: string
  diceType: DiceType
  diceCount: number
  description: string
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 骰子类型选择功能
- 骰子数量设置功能
- 预设骰子组合功能
- 掷骰子功能
- 3D动画效果
- 结果显示功能
- 历史记录功能
- 统计功能
- 重置功能
- 复制结果功能
- 自定义骰子样式功能

### 6.2 边界测试
- 骰子数量为1的情况
- 骰子数量为最大限制（10个）的情况
- 不同骰子类型的测试

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 骰子滚动动画的流畅度
- 结果显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化动画效果
- 增加更多骰子类型和预设组合

## 8. 总结

Roll Dice工具采用组件化设计，核心功能使用JavaScript实现随机结果生成和3D动画效果，支持多种骰子类型和数量，帮助用户模拟掷骰子过程。工具具有良好的用户体验和可维护性。