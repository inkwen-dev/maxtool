# Random List Generator技术设计文档

## 1. 概述

Random List Generator是一款随机列表生成工具，用户可以输入项目列表，随机打乱顺序生成新的列表。该工具适用于随机排序、随机展示、随机选择等场景。

## 2. 功能设计

### 2.1 核心功能
- 输入项目列表（支持单行输入多个项目，用逗号、空格或换行分隔）
- 随机打乱列表顺序
- 批量生成多个随机列表
- 显示生成结果
- 复制结果功能
- 重置功能
- 支持导入/导出项目列表

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例
- 支持保存列表配置

## 3. 技术设计

### 3.1 组件结构
- `RandomListTool`: 主组件，包含所有功能
  - `ItemInput`: 项目列表输入组件
  - `ShuffleControls`: 打乱控制组件（打乱按钮、重置按钮）
  - `BatchOptions`: 批量生成选项组件（生成数量）
  - `ResultsDisplay`: 结果显示组件（生成的随机列表）
  - `ImportExport`: 导入/导出功能组件

### 3.2 核心实现逻辑
```javascript
// 工具状态管理
const [toolState, setToolState] = useState({
  inputItems: '',
  allItems: [],
  shuffledLists: [],
  batchCount: 1,
  isShuffling: false
})

// 解析输入的项目列表
const parseInputItems = (input: string): string[] => {
  if (!input.trim()) return []
  
  // 按逗号、空格、换行符分割项目
  const items = input.split(/[,\s\n]+/)
    .map(item => item.trim())
    .filter(item => item.length > 0)
  
  // 去重
  return [...new Set(items)]
}

// 更新项目列表
const updateItemList = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const input = e.target.value
  const items = parseInputItems(input)
  
  setToolState(prev => ({
    ...prev,
    inputItems: input,
    allItems: items,
    shuffledLists: []
  }))
}

// 设置批量生成数量
const setBatchCount = (count: number) => {
  // 限制批量生成数量在1-10之间
  const newCount = Math.max(1, Math.min(10, count))
  
  setToolState(prev => ({
    ...prev,
    batchCount: newCount
  }))
}

// 打乱列表
const shuffleList = () => {
  const { allItems, batchCount } = toolState
  
  if (allItems.length === 0) return
  
  setToolState(prev => ({
    ...prev,
    isShuffling: true
  }))
  
  // 打乱过程模拟延迟
  const shuffleDuration = 500
  
  setTimeout(() => {
    const newShuffledLists = []
    
    for (let i = 0; i < batchCount; i++) {
      // 深拷贝原始列表
      const itemsCopy = [...allItems]
      
      // Fisher-Yates打乱算法
      for (let j = itemsCopy.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1))
        ;[itemsCopy[j], itemsCopy[k]] = [itemsCopy[k], itemsCopy[j]]
      }
      
      newShuffledLists.push(itemsCopy)
    }
    
    // 保存生成的随机列表
    setToolState(prev => ({
      ...prev,
      shuffledLists: newShuffledLists,
      isShuffling: false
    }))
    
    // 记录使用事件
    trackUsage('random-list', { batchCount, itemCount: allItems.length })
  }, shuffleDuration)
}

// 重置功能
const resetShuffle = () => {
  setToolState(prev => ({
    ...prev,
    shuffledLists: []
  }))
}

// 复制结果
const copyResults = () => {
  if (toolState.shuffledLists.length === 0) return
  
  const resultsText = toolState.shuffledLists.map((list, index) => 
    `List ${index + 1}: ${list.join(', ')}`
  ).join('\n\n')
  
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

// 导入项目列表
const importItems = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (event) => {
    const content = event.target?.result as string
    const items = parseInputItems(content)
    
    setToolState(prev => ({
      ...prev,
      inputItems: content,
      allItems: items,
      shuffledLists: []
    }))
  }
  reader.readAsText(file)
}

// 导出项目列表
const exportItems = () => {
  if (toolState.allItems.length === 0) return
  
  const content = toolState.allItems.join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'items.txt'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 组件挂载时的初始化
useEffect(() => {
  // 加载之前的项目列表
  const savedItems = localStorage.getItem('randomListItem')
  if (savedItems) {
    const items = parseInputItems(savedItems)
    setToolState(prev => ({
      ...prev,
      inputItems: savedItems,
      allItems: items
    }))
  }
  
  // 加载批量生成设置
  const savedBatchCount = localStorage.getItem('randomListBatchCount')
  if (savedBatchCount) {
    setToolState(prev => ({
      ...prev,
      batchCount: parseInt(savedBatchCount, 10) || 1
    }))
  }
}, [])

// 保存设置到本地存储
useEffect(() => {
  if (toolState.inputItems) {
    localStorage.setItem('randomListItem', toolState.inputItems)
  }
  
  localStorage.setItem('randomListBatchCount', toolState.batchCount.toString())
}, [toolState.inputItems, toolState.batchCount])
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 文本输入组件
- `Slider`: 滑块组件（批量生成数量）
- `ResultsDisplay`: 结果显示组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `trackUsage`: 工具使用统计
- `copyToClipboard`: 复制到剪贴板功能

## 4. 数据结构

```typescript
interface RandomListState {
  inputItems: string
  allItems: string[]
  shuffledLists: string[][]
  batchCount: number
  isShuffling: boolean
  showCopySuccess?: boolean
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 项目列表输入功能（各种分隔符）
- 随机打乱功能
- 批量生成功能
- 结果显示功能
- 复制结果功能
- 重置功能
- 导入/导出功能

### 6.2 边界测试
- 空项目列表处理
- 单项目列表处理
- 大量项目列表处理
- 重复项目处理
- 批量生成最大数量（10个）的情况

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 打乱过程的加载状态
- 结果显示的清晰度和可阅读性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化打乱算法
- 增加更多随机列表生成选项和功能

## 8. 总结

Random List Generator工具采用组件化设计，核心功能使用Fisher-Yates算法实现随机打乱逻辑，支持多种输入方式和批量生成功能，帮助用户快速生成随机顺序的列表。工具具有良好的用户体验和可维护性。