# Draw Lots技术设计文档

## 1. 概述

Draw Lots是一款随机抽签工具，用户可以输入姓名列表，随机抽取获胜者，并且获胜者会被排除在后续抽签之外。该工具适用于抽奖、选择参与者等场景。

## 2. 功能设计

### 2.1 核心功能
- 输入姓名列表（支持单行输入多个姓名，用逗号、空格或换行分隔）
- 随机抽取获胜者
- 记录已抽取的获胜者（排除在后续抽取之外）
- 显示抽取结果
- 重置功能（清空已抽取的获胜者，重新开始）
- 复制结果功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持导入/导出姓名列表

## 3. 技术设计

### 3.1 组件结构
- `DrawLotsTool`: 主组件，包含所有功能
  - `NameInput`: 姓名列表输入组件
  - `DrawControls`: 抽取控制组件（抽取按钮、重置按钮）
  - `ResultsDisplay`: 结果显示组件（当前抽取结果、已抽取列表）
  - `ImportExport`: 导入/导出功能组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  inputNames: '',
  allNames: [],
  remainingNames: [],
  drawnNames: [],
  currentWinner: null,
  isDrawing: false
})

// 解析输入的姓名列表
const parseInputNames = (input: string): string[] => {
  if (!input.trim()) return []
  
  // 按逗号、空格、换行符分割姓名
  const names = input.split(/[,\s\n]+/)
    .map(name => name.trim())
    .filter(name => name.length > 0)
  
  // 去重
  return [...new Set(names)]
}

// 更新姓名列表
const updateNameList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const input = e.target.value
  const names = parseInputNames(input)
  
  setToolState(prev => ({
    ...prev,
    inputNames: input,
    allNames: names,
    remainingNames: names.filter(name => !prev.drawnNames.includes(name)),
    currentWinner: null
  }))
}

// 抽取获胜者
const drawWinner = () => {
  if (toolState.remainingNames.length === 0) return
  
  setToolState(prev => ({ ...prev, isDrawing: true }))
  
  // 模拟抽奖动画延迟
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * toolState.remainingNames.length)
    const winner = toolState.remainingNames[randomIndex]
    
    const newDrawnNames = [...toolState.drawnNames, winner]
    const newRemainingNames = toolState.remainingNames.filter((_, index) => index !== randomIndex)
    
    setToolState(prev => ({
      ...prev,
      currentWinner: winner,
      drawnNames: newDrawnNames,
      remainingNames: newRemainingNames,
      isDrawing: false
    }))
  }, 1000)
}

// 重置抽奖
const resetDraw = () => {
  setToolState(prev => ({
    ...prev,
    remainingNames: prev.allNames,
    drawnNames: [],
    currentWinner: null
  }))
}

// 复制结果
const copyResults = () => {
  if (toolState.drawnNames.length === 0) return
  
  const resultsText = `抽奖结果：\n${toolState.drawnNames.map((name, index) => `${index + 1}. ${name}`).join('\n')}`
  
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

// 导入姓名列表
const importNames = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    const names = parseInputNames(content)
    
    setToolState(prev => ({
      ...prev,
      inputNames: names.join('\n'),
      allNames: names,
      remainingNames: names.filter(name => !prev.drawnNames.includes(name))
    }))
  }
  reader.readAsText(file)
}

// 导出姓名列表
const exportNames = () => {
  if (toolState.allNames.length === 0) return
  
  const content = toolState.allNames.join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'names.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 组件挂载时的初始化
useEffect(() => {
  // 可以从本地存储加载之前的姓名列表
  const savedNames = localStorage.getItem('drawLotsNames')
  if (savedNames) {
    const names = parseInputNames(savedNames)
    setToolState(prev => ({
      ...prev,
      inputNames: savedNames,
      allNames: names,
      remainingNames: names
    }))
  }
}, [])

// 保存姓名列表到本地存储
useEffect(() => {
  if (toolState.inputNames) {
    localStorage.setItem('drawLotsNames', toolState.inputNames)
  }
}, [toolState.inputNames])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 文本输入组件
- `ResultsDisplay`: 结果显示组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface DrawLotsState {
  inputNames: string
  allNames: string[]
  remainingNames: string[]
  drawnNames: string[]
  currentWinner: string | null
  isDrawing: boolean
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 姓名列表输入功能（各种分隔符）
- 随机抽取功能
- 获胜者排除功能
- 重置功能
- 复制结果功能
- 导入/导出功能

### 6.2 边界测试
- 空姓名列表处理
- 单姓名列表处理
- 大量姓名列表处理
- 重复姓名处理

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 抽取动画效果
- 结果显示清晰度

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化随机算法
- 支持更多姓名分隔符和导入格式

## 8. 总结

Draw Lots工具采用组件化设计，核心功能使用JavaScript实现随机抽取逻辑，支持多种输入方式和导入导出功能，帮助用户快速、公平地进行抽签活动。工具具有良好的用户体验和可维护性。