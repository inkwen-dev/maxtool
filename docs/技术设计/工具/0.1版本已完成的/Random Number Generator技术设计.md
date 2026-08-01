# Random Number Generator技术设计文档

## 1. 概述

Random Number Generator是一款随机数字生成工具，用户可以在指定范围内生成随机数字，支持多种生成方式和自定义选项。该工具适用于生成随机密码、随机验证码、抽奖号码等场景。

## 2. 功能设计

### 2.1 核心功能
- 指定生成范围（最小值和最大值）
- 生成单个随机数
- 批量生成多个随机数
- 支持整数和小数生成
- 支持不重复随机数生成
- 支持设置小数位数（生成小数时）
- 复制生成结果功能
- 清空结果功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 常见随机数应用场景参考

## 3. 技术设计

### 3.1 组件结构
- `RandomNumberTool`: 主组件，包含所有功能
  - `RangeInput`: 范围输入组件（最小值、最大值）
  - `OptionsPanel`: 选项面板组件（整数/小数、批量数量、是否去重等）
  - `GenerationControls`: 生成控制组件（生成按钮、清空按钮）
  - `ResultsDisplay`: 结果显示组件（生成的随机数列表）

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  minValue: 1,
  maxValue: 100,
  isInteger: true,
  decimalPlaces: 2,
  batchCount: 1,
  uniqueNumbers: false,
  generatedNumbers: [] as number[],
  isGenerating: false
})

// 生成随机数
const generateRandomNumber = () => {
  const { minValue, maxValue, isInteger, decimalPlaces, batchCount, uniqueNumbers, generatedNumbers } = toolState
  
  // 参数验证
  if (minValue > maxValue) {
    // 显示错误提示
    return
  }
  
  setToolState(prev => ({ ...prev, isGenerating: true }))
  
  // 延迟执行，模拟生成过程
  setTimeout(() => {
    const newNumbers: number[] = []
    const allNumbers = [...generatedNumbers]
    
    for (let i = 0; i < batchCount; i++) {
      let randomNum: number
      
      // 如果需要不重复的随机数
      if (uniqueNumbers) {
        // 生成范围内所有可能的数字
        const possibleNumbers = []
        const step = isInteger ? 1 : Math.pow(10, -decimalPlaces)
        
        for (let num = minValue; num <= maxValue; num += step) {
          const roundedNum = Number(num.toFixed(decimalPlaces))
          if (!allNumbers.includes(roundedNum) && !newNumbers.includes(roundedNum)) {
            possibleNumbers.push(roundedNum)
          }
        }
        
        // 如果没有可用的数字，跳出循环
        if (possibleNumbers.length === 0) break
        
        // 随机选择一个数字
        const randomIndex = Math.floor(Math.random() * possibleNumbers.length)
        randomNum = possibleNumbers[randomIndex]
      } else {
        // 生成单个随机数
        if (isInteger) {
          randomNum = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
        } else {
          randomNum = Math.random() * (maxValue - minValue) + minValue
          randomNum = Number(randomNum.toFixed(decimalPlaces))
        }
      }
      
      newNumbers.push(randomNum)
    }
    
    setToolState(prev => ({
      ...prev,
      generatedNumbers: [...prev.generatedNumbers, ...newNumbers],
      isGenerating: false
    }))
  }, 500)
}

// 清空结果
const clearResults = () => {
  setToolState(prev => ({
    ...prev,
    generatedNumbers: []
  }))
}

// 复制结果
const copyResults = () => {
  if (toolState.generatedNumbers.length === 0) return
  
  const resultsText = toolState.generatedNumbers.join(', ')
  
  navigator.clipboard.writeText(resultsText)
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

// 重置所有选项
const resetOptions = () => {
  setToolState({
    minValue: 1,
    maxValue: 100,
    isInteger: true,
    decimalPlaces: 2,
    batchCount: 1,
    uniqueNumbers: false,
    generatedNumbers: [],
    isGenerating: false
  })
}

// 组件挂载时的初始化
useEffect(() => {
  // 可以从本地存储加载之前的选项设置
  const savedOptions = localStorage.getItem('randomNumberOptions')
  if (savedOptions) {
    setToolState(prev => ({
      ...prev,
      ...JSON.parse(savedOptions)
    }))
  }
}, [])

// 保存选项设置到本地存储
useEffect(() => {
  const { minValue, maxValue, isInteger, decimalPlaces, batchCount, uniqueNumbers } = toolState
  const optionsToSave = { minValue, maxValue, isInteger, decimalPlaces, batchCount, uniqueNumbers }
  localStorage.setItem('randomNumberOptions', JSON.stringify(optionsToSave))
}, [toolState.minValue, toolState.maxValue, toolState.isInteger, toolState.decimalPlaces, toolState.batchCount, toolState.uniqueNumbers])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Input`: 输入组件
- `Checkbox`: 复选框组件
- `ResultsDisplay`: 结果显示组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface RandomNumberState {
  minValue: number
  maxValue: number
  isInteger: boolean
  decimalPlaces: number
  batchCount: number
  uniqueNumbers: boolean
  generatedNumbers: number[]
  isGenerating: boolean
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 范围输入验证（最小值、最大值）
- 单个随机数生成功能
- 批量生成功能
- 整数/小数切换功能
- 小数位数设置功能
- 不重复随机数功能
- 复制结果功能
- 清空功能

### 6.2 边界测试
- 最小值等于最大值的情况
- 批量生成大量随机数的情况
- 不重复随机数超过范围的情况
- 小数位数为0的情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 生成过程的加载状态
- 结果显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化随机算法
- 增加更多随机数生成选项和功能

## 8. 总结

Random Number Generator工具采用组件化设计，核心功能使用JavaScript实现随机数生成逻辑，支持多种生成方式和自定义选项，帮助用户快速生成符合需求的随机数字。工具具有良好的用户体验和可维护性。