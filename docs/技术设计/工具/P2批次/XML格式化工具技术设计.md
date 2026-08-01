# XML格式化工具技术设计文档

## 1. 概述

XML格式化工具是一款帮助用户格式化、验证和美化XML数据的在线工具。用户可以输入或上传XML数据，进行格式化、压缩、验证和转换等操作。

## 2. 功能设计

### 2.1 核心功能
- XML格式化（美化）
- XML压缩（压缩为单行）
- XML验证（语法检查）
- XML转义/反转义
- 实时预览
- 复制和下载功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `XmlFormatter`: 主组件，包含所有功能
  - `XmlInput`: XML输入组件（支持粘贴和上传）
  - `XmlSettings`: XML设置组件（格式化选项）
  - `XmlPreview`: 实时预览组件
  - `XmlValidation`: XML验证组件
  - `ActionButtons`: 操作按钮（格式化、压缩、复制、下载）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// XML格式化（简化版，实际实现会更复杂）
const formatXml = (xmlString, indent = 2) => {
  try {
    // 解析XML字符串
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    
    // 检查XML是否有效
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format')
    }
    
    // 格式化XML
    const serializer = new XMLSerializer()
    let formattedXml = serializer.serializeToString(xmlDoc)
    
    // 手动添加缩进（XMLSerializer不支持缩进）
    formattedXml = formattedXml.replace(/></g, '>\n<')
    const lines = formattedXml.split('\n')
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
    throw new Error('Invalid XML format')
  }
}

// XML压缩
const compressXml = (xmlString) => {
  try {
    // 解析XML字符串
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    
    // 检查XML是否有效
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format')
    }
    
    // 压缩XML
    const serializer = new XMLSerializer()
    return serializer.serializeToString(xmlDoc)
  } catch (error) {
    throw new Error('Invalid XML format')
  }
}

// XML验证
const validateXml = (xmlString) => {
  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
    
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      const errorNode = xmlDoc.getElementsByTagName('parsererror')[0]
      return { 
        valid: false, 
        error: errorNode.textContent,
        line: getErrorLine(errorNode, xmlString)
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

// 获取错误行号（简化版）
const getErrorLine = (errorNode, xmlString) => {
  // 实际实现中可以从parsererror节点中提取更准确的行号
  return 0
}

// XML转义
const escapeXml = (xmlString) => {
  return xmlString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// XML反转义
const unescapeXml = (xmlString) => {
  return xmlString
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
interface XmlValidationResult {
  valid: boolean
  error: string | null
  line: number | null
}

interface XmlFormatterState {
  inputXml: string
  outputXml: string
  indent: number
  isFormatting: boolean
  validationResult: XmlValidationResult
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)
- DOMParser和XMLSerializer (浏览器API)

## 6. 测试计划

### 6.1 功能测试
- 基本XML格式化
- XML压缩功能
- XML验证功能
- XML转义/反转义
- 复制和下载功能

### 6.2 边界测试
- 非常大的XML数据
- 格式错误的XML
- 包含特殊字符的XML
- 不同编码的XML

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 错误提示的友好性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化XML处理算法
- 定期更新功能和修复bug

## 8. 总结

XML格式化工具采用组件化设计，核心功能使用浏览器原生API实现，无需额外的第三方库。工具提供丰富的XML处理功能，界面直观易用，适合用户快速处理XML数据。