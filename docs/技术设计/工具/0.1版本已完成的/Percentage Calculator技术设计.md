# Percentage Calculator技术设计文档

## 1. 概述

Percentage Calculator是一款百分比计算器工具，用户可以使用它来进行各种百分比相关的计算，如百分比增长、百分比减少、百分比转换等。该工具适用于财务计算、数据分析、学习等场景。

## 2. 功能设计

### 2.1 核心功能
- 支持多种百分比计算类型（百分比转换、百分比增减等）
- 支持数字输入和实时计算
- 支持计算结果显示
- 支持计算历史记录
- 支持深色/浅色模式
- 支持响应式设计

### 2.2 辅助功能
- 提供百分比计算示例
- 支持计算类型切换
- 支持结果复制功能
- 提供使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `PercentageCalculatorTool`: 主组件，包含所有功能
  - `CalculatorTypes`: 计算器类型切换组件
  - `InputForm`: 输入表单组件
  - `ResultDisplay`: 结果显示组件
  - `HistoryPanel`: 历史记录面板组件
  - `Examples`: 示例组件

### 3.2 核心实现逻辑
```javascript
// 计算类型枚举
const CalculatorType = {
  PERCENTAGE_OF: 'percentageOf',
  PERCENTAGE_FROM: 'percentageFrom',
  PERCENTAGE_INCREASE: 'percentageIncrease',
  PERCENTAGE_DECREASE: 'percentageDecrease',
  PERCENTAGE_DIFFERENCE: 'percentageDifference'
} as const

type CalculatorTypeValue = typeof CalculatorType[keyof typeof CalculatorType]

// 计算类型配置
const calculatorTypes: CalculatorTypeConfig[] = [
  {
    id: CalculatorType.PERCENTAGE_OF,
    name: 'X的Y%是多少？',
    inputs: [
      { id: 'x', label: 'X', placeholder: '输入X的值' },
      { id: 'y', label: 'Y', placeholder: '输入百分比Y' }
    ],
    formula: 'X × Y% = 结果',
    calculate: (x: number, y: number) => x * (y / 100)
  },
  {
    id: CalculatorType.PERCENTAGE_FROM,
    name: 'X是Y的百分之几？',
    inputs: [
      { id: 'x', label: 'X', placeholder: '输入X的值' },
      { id: 'y', label: 'Y', placeholder: '输入Y的值' }
    ],
    formula: 'X ÷ Y × 100% = 结果',
    calculate: (x: number, y: number) => (x / y) * 100
  },
  {
    id: CalculatorType.PERCENTAGE_INCREASE,
    name: 'X增加Y%是多少？',
    inputs: [
      { id: 'x', label: 'X', placeholder: '输入X的值' },
      { id: 'y', label: 'Y', placeholder: '输入增加的百分比Y' }
    ],
    formula: 'X × (1 + Y%) = 结果',
    calculate: (x: number, y: number) => x * (1 + y / 100)
  },
  {
    id: CalculatorType.PERCENTAGE_DECREASE,
    name: 'X减少Y%是多少？',
    inputs: [
      { id: 'x', label: 'X', placeholder: '输入X的值' },
      { id: 'y', label: 'Y', placeholder: '输入减少的百分比Y' }
    ],
    formula: 'X × (1 - Y%) = 结果',
    calculate: (x: number, y: number) => x * (1 - y / 100)
  },
  {
    id: CalculatorType.PERCENTAGE_DIFFERENCE,
    name: 'X和Y之间的百分比差异是多少？',
    inputs: [
      { id: 'x', label: 'X', placeholder: '输入第一个值X' },
      { id: 'y', label: 'Y', placeholder: '输入第二个值Y' }
    ],
    formula: '|X - Y| ÷ ((X + Y) ÷ 2) × 100% = 结果',
    calculate: (x: number, y: number) => {
      const difference = Math.abs(x - y)
      const average = (x + y) / 2
      return (difference / average) * 100
    }
  }
]

// 工具状态管理
const [toolState, setToolState] = useState({
  currentType: CalculatorType.PERCENTAGE_OF as CalculatorTypeValue,
  inputs: { x: '', y: '' },
  result: null as number | null,
  history: [] as CalculationHistory[],
  copiedResult: false
})

// 获取当前计算类型配置
const getCurrentTypeConfig = () => {
  return calculatorTypes.find(type => type.id === toolState.currentType) || calculatorTypes[0]
}

// 计算结果
const calculateResult = () => {
  const currentType = getCurrentTypeConfig()
  const x = parseFloat(toolState.inputs.x)
  const y = parseFloat(toolState.inputs.y)
  
  // 验证输入
  if (isNaN(x) || isNaN(y)) {
    setToolState(prev => ({ ...prev, result: null }))
    return
  }
  
  // 避免除以零
  if ((currentType.id === CalculatorType.PERCENTAGE_FROM && y === 0) ||
      (currentType.id === CalculatorType.PERCENTAGE_DIFFERENCE && x + y === 0)) {
    setToolState(prev => ({ ...prev, result: null }))
    return
  }
  
  // 执行计算
  const result = currentType.calculate(x, y)
  
  // 更新状态
  setToolState(prev => {
    // 创建历史记录
    const newHistory: CalculationHistory = {
      id: Date.now().toString(),
      type: prev.currentType,
      inputs: prev.inputs,
      result: result,
      timestamp: new Date()
    }
    
    return {
      ...prev,
      result: result,
      history: [newHistory, ...prev.history].slice(0, 10) // 保留最近10条记录
    }
  })
}

// 切换计算类型
const changeCalculatorType = (type: CalculatorTypeValue) => {
  setToolState(prev => ({ 
    ...prev, 
    currentType: type,
    inputs: { x: '', y: '' },
    result: null
  }))
}

// 更新输入值
const updateInput = (inputId: string, value: string) => {
  setToolState(prev => ({
    ...prev,
    inputs: {
      ...prev.inputs,
      [inputId]: value
    }
  }))
}

// 复制结果
const copyResult = () => {
  if (toolState.result !== null) {
    navigator.clipboard.writeText(toolState.result.toString())
      .then(() => {
        setToolState(prev => ({ ...prev, copiedResult: true }))
        
        // 3秒后清除提示
        setTimeout(() => {
          setToolState(prev => ({ ...prev, copiedResult: false }))
        }, 3000)
      })
      .catch(err => {
        console.error('复制失败:', err)
      })
  }
}

// 清除输入
const clearInputs = () => {
  setToolState(prev => ({
    ...prev,
    inputs: { x: '', y: '' },
    result: null
  }))
}

// 清除历史记录
const clearHistory = () => {
  setToolState(prev => ({
    ...prev,
    history: []
  }))
}

// 从历史记录中恢复
const restoreFromHistory = (historyItem: CalculationHistory) => {
  setToolState(prev => ({
    ...prev,
    currentType: historyItem.type,
    inputs: historyItem.inputs,
    result: historyItem.result
  }))
}

// 输入变化时自动计算
useEffect(() => {
  // 只有当两个输入都有值时才计算
  if (toolState.inputs.x && toolState.inputs.y) {
    calculateResult()
  } else {
    setToolState(prev => ({ ...prev, result: null }))
  }
}, [toolState.inputs, toolState.currentType])

// 组件挂载时的初始化
useEffect(() => {
  // 从本地存储加载历史记录
  const savedHistory = localStorage.getItem('percentageCalculatorHistory')
  if (savedHistory) {
    try {
      const history = JSON.parse(savedHistory)
      setToolState(prev => ({ ...prev, history }))
    } catch (error) {
      console.error('解析历史记录失败:', error)
    }
  }
}, [])

// 历史记录变化时保存到本地存储
useEffect(() => {
  localStorage.setItem('percentageCalculatorHistory', JSON.stringify(toolState.history))
}, [toolState.history])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Select`: 选择器组件
- `Card`: 卡片组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface CalculatorInput {
  id: string
  label: string
  placeholder: string
}

interface CalculatorTypeConfig {
  id: string
  name: string
  inputs: CalculatorInput[]
  formula: string
  calculate: (x: number, y: number) => number
}

interface CalculationHistory {
  id: string
  type: string
  inputs: { [key: string]: string }
  result: number
  timestamp: Date
}

interface PercentageCalculatorState {
  currentType: string
  inputs: { [key: string]: string }
  result: number | null
  history: CalculationHistory[]
  copiedResult: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 各种百分比计算类型的功能
- 输入验证功能
- 结果计算准确性
- 历史记录功能
- 结果复制功能

### 6.2 边界测试
- 输入非常大的数字
- 输入负数
- 输入零
- 除以零的情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 计算类型切换时的界面效果
- 复制结果提示的用户体验

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化计算功能
- 定期更新计算类型和示例
- 优化计算性能

## 8. 总结

Percentage Calculator工具采用组件化设计，核心功能使用JavaScript实现各种百分比计算逻辑，支持多种计算类型和历史记录功能。工具具有良好的用户体验和可维护性，适用于各种百分比计算场景。