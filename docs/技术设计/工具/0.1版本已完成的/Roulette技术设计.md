# Roulette技术设计文档

## 1. 概述

Roulette是一款在线轮盘选择工具，用户可以输入多个选项，通过随机旋转轮盘来选择一个或多个选项。该工具适用于随机选择、决策辅助等场景。

## 2. 功能设计

### 2.1 核心功能
- 输入选项列表（支持单行输入多个选项，用逗号、空格或换行分隔）
- 轮盘动画效果
- 随机选择选项
- 支持同时选择多个选项
- 记录已选择的选项（排除在后续选择之外）
- 显示选择结果
- 重置功能（清空已选择的选项，重新开始）
- 复制结果功能
- 支持导入/导出选项列表

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持自定义轮盘样式

## 3. 技术设计

### 3.1 组件结构
- `RouletteTool`: 主组件，包含所有功能
  - `OptionInput`: 选项列表输入组件
  - `RouletteWheel`: 轮盘组件（动画效果）
  - `SpinControls`: 旋转控制组件（旋转按钮、重置按钮）
  - `ResultsDisplay`: 结果显示组件（当前选择结果、已选择列表）
  - `ImportExport`: 导入/导出功能组件
  - `CustomizationOptions`: 自定义选项组件（轮盘样式）

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  inputOptions: '',
  allOptions: [],
  remainingOptions: [],
  selectedOptions: [],
  currentSelection: null,
  isSpinning: false,
  customization: {
    wheelStyle: 'default' // 'default', 'colorful', 'minimal'
  }
})

// 解析输入的选项列表
const parseInputOptions = (input: string): string[] => {
  if (!input.trim()) return []
  
  // 按逗号、空格、换行符分割选项
  const options = input.split(/[,\s\n]+/)
    .map(option => option.trim())
    .filter(option => option.length > 0)
  
  // 去重
  return [...new Set(options)]
}

// 更新选项列表
const updateOptionList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const input = e.target.value
  const options = parseInputOptions(input)
  
  setToolState(prev => ({
    ...prev,
    inputOptions: input,
    allOptions: options,
    remainingOptions: options.filter(option => !prev.selectedOptions.includes(option)),
    currentSelection: null
  }))
}

// 旋转轮盘
const spinRoulette = () => {
  const { remainingOptions } = toolState
  
  if (remainingOptions.length === 0) return
  
  setToolState(prev => ({
    ...prev,
    isSpinning: true,
    currentSelection: null
  }))
  
  // 轮盘旋转动画时间（毫秒）
  const animationDuration = 3000
  
  // 延迟执行，模拟轮盘旋转动画
  setTimeout(() => {
    // 随机选择一个选项
    const randomIndex = Math.floor(Math.random() * remainingOptions.length)
    const selection = remainingOptions[randomIndex]
    
    // 更新状态
    setToolState(prev => {
      const newSelectedOptions = [...prev.selectedOptions, selection]
      const newRemainingOptions = prev.remainingOptions.filter((_, index) => index !== randomIndex)
      
      return {
        ...prev,
        currentSelection: selection,
        selectedOptions: newSelectedOptions,
        remainingOptions: newRemainingOptions,
        isSpinning: false
      }
    })
    
    // 记录使用事件
    trackUsage('roulette', { selection, totalOptions: toolState.allOptions.length })
  }, animationDuration)
}

// 重置功能
const resetRoulette = () => {
  setToolState(prev => ({
    ...prev,
    remainingOptions: prev.allOptions,
    selectedOptions: [],
    currentSelection: null
  }))
}

// 复制结果
const copyResults = () => {
  if (toolState.selectedOptions.length === 0) return
  
  const resultsText = `选择结果：\n${toolState.selectedOptions.map((option, index) => `${index + 1}. ${option}`).join('\n')}`
  
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

// 自定义轮盘样式
const changeWheelStyle = (style: 'default' | 'colorful' | 'minimal') => {
  setToolState(prev => ({
    ...prev,
    customization: {
      ...prev.customization,
      wheelStyle: style
    }
  }))
  
  // 保存自定义设置到本地存储
  localStorage.setItem('rouletteCustomization', JSON.stringify({
    wheelStyle: style
  }))
}

// 导入选项列表
const importOptions = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    const options = parseInputOptions(content)
    
    setToolState(prev => ({
      ...prev,
      inputOptions: content,
      allOptions: options,
      remainingOptions: options.filter(option => !prev.selectedOptions.includes(option))
    }))
  }
  reader.readAsText(file)
}

// 导出选项列表
const exportOptions = () => {
  if (toolState.allOptions.length === 0) return
  
  const content = toolState.allOptions.join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'options.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载自定义设置
  const savedCustomization = localStorage.getItem('rouletteCustomization')
  if (savedCustomization) {
    setToolState(prev => ({
      ...prev,
      customization: JSON.parse(savedCustomization)
    }))
  }
  
  // 加载之前的选项列表
  const savedOptions = localStorage.getItem('rouletteOptions')
  if (savedOptions) {
    const options = parseInputOptions(savedOptions)
    setToolState(prev => ({
      ...prev,
      inputOptions: savedOptions,
      allOptions: options,
      remainingOptions: options
    }))
  }
}, [])

// 保存选项列表到本地存储
useEffect(() => {
  if (toolState.inputOptions) {
    localStorage.setItem('rouletteOptions', toolState.inputOptions)
  }
}, [toolState.inputOptions])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 文本输入组件
- `RouletteWheel`: 轮盘组件
- `ResultsDisplay`: 结果显示组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface RouletteCustomization {
  wheelStyle: 'default' | 'colorful' | 'minimal'
}

interface RouletteState {
  inputOptions: string
  allOptions: string[]
  remainingOptions: string[]
  selectedOptions: string[]
  currentSelection: string | null
  isSpinning: boolean
  customization: RouletteCustomization
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 选项列表输入功能（各种分隔符）
- 轮盘旋转功能
- 随机选择功能
- 结果显示功能
- 重置功能
- 复制结果功能
- 导入/导出功能
- 自定义轮盘样式功能

### 6.2 边界测试
- 空选项列表处理
- 单选项列表处理
- 大量选项列表处理
- 重复选项处理

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 轮盘旋转动画的流畅度
- 结果显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化轮盘动画效果
- 增加更多轮盘样式和自定义选项

## 8. 总结

Roulette工具采用组件化设计，核心功能使用JavaScript实现随机选择逻辑和轮盘动画效果，支持多种输入方式和导入导出功能，帮助用户快速、公平地进行随机选择。工具具有良好的用户体验和可维护性。