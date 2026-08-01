# HTML格式化工具技术设计文档

## 1. 概述

HTML格式化工具是一款帮助用户格式化、验证和美化HTML代码的在线工具。用户可以输入或上传HTML数据，进行格式化、压缩、验证和转换等操作。

## 2. 功能设计

### 2.1 核心功能
- HTML格式化（美化）
- HTML压缩（压缩为单行）
- HTML验证（语法检查）
- HTML转义/反转义
- 实时预览
- 复制和下载功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `HtmlFormatter`: 主组件，包含所有功能
  - `HtmlInput`: HTML输入组件（支持粘贴和上传）
  - `HtmlSettings`: HTML设置组件（格式化选项）
  - `HtmlPreview`: 实时预览组件
  - `HtmlValidation`: HTML验证组件
  - `ActionButtons`: 操作按钮（格式化、压缩、复制、下载）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// HTML格式化（简化版，实际实现会更复杂）
const formatHtml = (htmlString, indent = 2) => {
  try {
    // 使用浏览器的DOM解析器
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(htmlString, 'text/html')
    
    // 使用XMLSerializer来序列化DOM
    const serializer = new XMLSerializer()
    let formattedHtml = serializer.serializeToString(htmlDoc.documentElement)
    
    // 手动添加缩进（XMLSerializer不支持缩进）
    formattedHtml = formattedHtml.replace(/></g, '>\n<')
    const lines = formattedHtml.split('\n')
    let indentLevel = 0
    const indentStr = ' '.repeat(indent)
    
    const indentedLines = lines.map(line => {
      // 处理结束标签
      if (line.startsWith('</')) {
        indentLevel--
      }
      
      const indentedLine = indentStr.repeat(indentLevel) + line.trim()
      
      // 处理开始标签（但不是自闭合标签）
      if (line.startsWith('<') && !line.endsWith('/>') && !line.startsWith('</')) {
        indentLevel++
      }
      
      return indentedLine
    })
    
    return indentedLines.join('\n')
  } catch (error) {
    throw new Error('Invalid HTML format')
  }
}

// HTML压缩
const compressHtml = (htmlString) => {
  try {
    return htmlString
      // 移除注释
      .replace(/<!--[\s\S]*?-->/g, '')
      // 移除多余的空格和换行
      .replace(/\s+/g, ' ')
      // 移除标签内的多余空格
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .trim()
  } catch (error) {
    throw new Error('HTML compression failed')
  }
}

// HTML验证（简化版）
const validateHtml = (htmlString) => {
  try {
    const parser = new DOMParser()
    const htmlDoc = parser.parseFromString(htmlString, 'text/html')
    
    // 检查是否有解析错误
    const errors = htmlDoc.querySelectorAll('parsererror')
    if (errors.length > 0) {
      return { 
        valid: false, 
        error: errors[0].textContent,
        line: 0
      }
    }
    
    return { valid: true, error: null, line: null }
  } catch (error) {
    return { 
      valid: false, 
      error: error.message,
      line: null
    }
  }
}

// HTML转义
const escapeHtml = (htmlString) => {
  return htmlString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// HTML反转义
const unescapeHtml = (htmlString) => {
  return htmlString
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}
```

### 3.3 组件复用
- `Button`: 通用按钮组件
- `Textarea`: 通用文本区域组件
- `FileUpload`: 文件上传组件
- `UsageInstructions`: 使用说明组件

### 3.4 工具函数复用
- `copyToClipboard`: 复制功能
- `trackUsage`: 工具使用统计

## 4. 数据结构

```typescript
interface HtmlValidationResult {
  valid: boolean
  error: string | null
  line: number | null
}

interface HtmlFormatterState {
  inputHtml: string
  outputHtml: string
  indent: number
  isFormatting: boolean
  validationResult: HtmlValidationResult
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)
- DOMParser和XMLSerializer (浏览器API)

## 6. 测试计划

### 6.1 功能测试
- 基本HTML格式化
- HTML压缩功能
- HTML验证功能
- HTML转义/反转义
- 复制和下载功能

### 6.2 边界测试
- 非常大的HTML文件
- 格式错误的HTML
- 包含特殊字符的HTML
- 不同编码的HTML

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 错误提示的友好性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化HTML处理算法
- 定期更新功能和修复bug

## 8. 总结

HTML格式化工具采用组件化设计，核心功能使用浏览器原生API实现，无需额外的第三方库。工具提供丰富的HTML处理功能，界面直观易用，适合用户快速处理HTML代码。