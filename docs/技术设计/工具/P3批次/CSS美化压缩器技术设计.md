# CSS美化/压缩器技术设计文档

## 1. 概述

CSS美化/压缩器是一款帮助用户格式化、压缩和优化CSS代码的在线工具。用户可以输入或上传CSS代码，进行美化（格式化）、压缩（减小文件大小）或优化操作。

## 2. 功能设计

### 2.1 核心功能
- CSS美化（格式化）
- CSS压缩（减小文件大小）
- CSS优化（删除冗余代码）
- 实时预览
- 复制和下载功能

### 2.2 辅助功能
- 深色/浅色模式支持
- 响应式设计，适配不同设备
- 使用说明和示例

## 3. 技术设计

### 3.1 组件结构
- `CssBeautifierCompressor`: 主组件，包含所有功能
  - `CssInput`: CSS输入组件（支持粘贴和上传）
  - `CssSettings`: CSS设置组件（美化选项、压缩选项）
  - `CssPreview`: 实时预览组件
  - `ActionButtons`: 操作按钮（美化、压缩、复制、下载）
  - `UsageInstructions`: 使用说明组件

### 3.2 核心实现逻辑
```javascript
// CSS美化（简化版，实际实现会更复杂）
const beautifyCss = (cssString, indent = 2) => {
  try {
    // 基本格式化逻辑
    let result = cssString
      // 在{后添加换行
      .replace(/\{/g, ' {\n')
      // 在}后添加换行
      .replace(/\}/g, '\n}\n')
      // 在;后添加换行
      .replace(/;/g, ';\n')
      // 处理选择器后的{前的空格
      .replace(/([^{}]+)\{/g, (match, selector) => selector.trim() + ' {')
      // 处理属性后的:
      .replace(/([^;:]+):/g, (match, property) => property.trim() + ': ')
      // 移除多余的空行
      .replace(/\n\s*\n/g, '\n')
      .trim()
    
    // 添加缩进
    const indentStr = ' '.repeat(indent)
    let indentLevel = 0
    const lines = result.split('\n')
    
    const indentedLines = lines.map(line => {
      // 处理结束大括号
      if (line.startsWith('}')) {
        indentLevel--
      }
      
      const indentedLine = indentStr.repeat(indentLevel) + line.trim()
      
      // 处理开始大括号
      if (line.endsWith('{')) {
        indentLevel++
      }
      
      return indentedLine
    })
    
    return indentedLines.join('\n')
  } catch (error) {
    throw new Error('CSS formatting failed')
  }
}

// CSS压缩（简化版）
const compressCss = (cssString) => {
  try {
    return cssString
      // 移除注释
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // 移除多余的空格
      .replace(/\s+/g, ' ')
      // 移除{前的空格
      .replace(/\s*{\s*/g, '{')
      // 移除}前的空格
      .replace(/\s*}\s*/g, '}')
      // 移除;前的空格
      .replace(/\s*;\s*/g, ';')
      // 移除:前的空格
      .replace(/\s*:\s*/g, ':')
      // 移除,前的空格
      .replace(/\s*,\s*/g, ',')
      // 移除最后的;（如果有）
      .replace(/;\s*}/g, '}')
      .trim()
  } catch (error) {
    throw new Error('CSS compression failed')
  }
}

// CSS优化（简化版）
const optimizeCss = (cssString) => {
  try {
    // 首先压缩CSS
    let optimized = compressCss(cssString)
    
    // 这里可以添加更多优化逻辑，如：
    // - 合并相同的选择器
    // - 移除冗余的属性
    // - 缩短颜色值
    // - 等等
    
    return optimized
  } catch (error) {
    throw new Error('CSS optimization failed')
  }
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
interface CssFormatterState {
  inputCss: string
  outputCss: string
  indent: number
  isFormatting: boolean
  operation: 'beautify' | 'compress' | 'optimize'
}
```

## 5. 依赖

- React 18 (前端框架)
- Next.js 14 (全栈框架)
- Tailwind CSS (样式框架)

## 6. 测试计划

### 6.1 功能测试
- 基本CSS美化
- CSS压缩功能
- CSS优化功能
- 复制和下载功能

### 6.2 边界测试
- 非常大的CSS文件
- 格式错误的CSS
- 包含特殊字符的CSS
- 不同编码的CSS

### 6.3 UI/UX测试
- 深色/浅色模式切换
- 响应式设计适配
- 交互流畅性
- 预览的准确性

## 7. 部署与维护

- 部署在Vercel平台
- 收集用户反馈，优化CSS处理算法
- 定期更新功能和修复bug

## 8. 总结

CSS美化/压缩器采用组件化设计，核心功能使用原生JavaScript实现，无需额外的第三方库。工具提供丰富的CSS处理功能，界面直观易用，适合用户快速处理CSS代码。