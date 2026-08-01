# JSON格式化工具技术设计文档

## 一、概述

本文档详细描述MaxTool 0.2版本中JSON格式化工具（JSON Formatter）的技术设计，包括功能设计、技术实现、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化。

## 二、功能设计

### 1. 核心功能

#### JSON格式化
- 将压缩的JSON字符串格式化为可读性强的格式
- 支持语法高亮显示
- 支持自定义缩进大小

#### JSON验证
- 实时验证JSON格式的正确性
- 提供详细的错误信息和位置指示

#### 辅助功能
- 支持JSON压缩（移除空格和换行）
- 支持JSON转义/反转义
- 支持复制格式化后的JSON
- 支持清空输入

### 2. 用户界面

#### 输入区域
- 多行文本输入框：用于输入原始JSON数据
- 清空按钮：快速清空输入内容

#### 配置选项
- 缩进大小选择：2空格、4空格或Tab
- 语法高亮开关：开启/关闭语法高亮

#### 输出区域
- 格式化后的JSON显示区域：支持语法高亮
- 错误提示区域：显示JSON验证错误信息

#### 功能按钮
- 格式化按钮：格式化输入的JSON
- 压缩按钮：压缩输入的JSON
- 转义按钮：转义输入的JSON字符串
- 反转义按钮：反转义输入的JSON字符串
- 复制按钮：复制格式化后的JSON

#### 使用说明
- 提供简洁的使用步骤说明

## 三、技术设计

### 1. 技术选型

#### 核心库
- **react-syntax-highlighter**：用于JSON语法高亮显示
- **json5**：用于JSON解析和格式化，支持更宽松的JSON格式

#### 浏览器API
- Textarea API：用于处理多行文本输入
- Clipboard API：用于复制格式化后的JSON

### 2. 组件结构

#### 主组件

##### JSONFormatter
- **位置**：`components/tools/JSONFormatter.tsx`
- **功能**：JSON格式化工具的主组件
- **结构**：
  ```tsx
  'use client'

  import { useState, useRef } from 'react'
  import Button from '@/components/ui/Button'
  import Input from '@/components/ui/Input'
  import { trackUsage } from '@/lib/tracking'
  import UsageInstructions from '@/components/shared/UsageInstructions'
  import { copyToClipboard } from '@/lib/clipboard-utils'
  import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
  import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
  import * as json5 from 'json5'

  export default function JSONFormatter() {
    // State declarations
    const [input, setInput] = useState('')
    const [formatted, setFormatted] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2')
    const [highlight, setHighlight] = useState(true)
    const [hasTracked, setHasTracked] = useState(false)
    const outputRef = useRef<HTMLPreElement>(null)

    // Event handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value)
      setError(null)
    }

    const handleIndentSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIndentSize(e.target.value as '2' | '4' | 'tab')
    }

    const getIndent = () => {
      switch (indentSize) {
        case '2':
          return 2
        case '4':
          return 4
        case 'tab':
          return '\t'
        default:
          return 2
      }
    }

    const formatJSON = () => {
      if (!input.trim()) {
        setFormatted('')
        setError('请输入JSON数据')
        return
      }

      try {
        const parsed = json5.parse(input)
        const formattedJSON = JSON.stringify(parsed, null, getIndent())
        setFormatted(formattedJSON)
        setError(null)
        if (!hasTracked) {
          trackUsage('json-formatter')
          setHasTracked(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '无效的JSON格式')
        setFormatted('')
      }
    }

    const compressJSON = () => {
      if (!input.trim()) {
        setError('请输入JSON数据')
        return
      }

      try {
        const parsed = json5.parse(input)
        const compressedJSON = JSON.stringify(parsed)
        setFormatted(compressedJSON)
        setError(null)
        if (!hasTracked) {
          trackUsage('json-formatter')
          setHasTracked(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '无效的JSON格式')
        setFormatted('')
      }
    }

    const escapeJSON = () => {
      if (!input.trim()) {
        setError('请输入JSON数据')
        return
      }

      try {
        const escaped = JSON.stringify(input)
        setFormatted(escaped)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '转义失败')
        setFormatted('')
      }
    }

    const unescapeJSON = () => {
      if (!input.trim()) {
        setError('请输入JSON数据')
        return
      }

      try {
        const unescaped = JSON.parse(input)
        setFormatted(unescaped)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '反转义失败')
        setFormatted('')
      }
    }

    const handleCopy = () => {
      if (formatted) {
        copyToClipboard(formatted.toString())
        // 显示复制成功提示
      }
    }

    const handleClear = () => {
      setInput('')
      setFormatted('')
      setError(null)
    }

    // Render
    return (
      <div className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">输入JSON</h2>
            <Button onClick={handleClear} variant="secondary">
              清空
            </Button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="请输入JSON数据..."
            className="w-full h-60 p-3 border rounded-lg resize-y font-mono text-sm"
          />
        </div>

        {/* Configuration Options */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">配置选项</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="mr-2">缩进大小：</label>
              <select
                value={indentSize}
                onChange={handleIndentSizeChange}
                className="p-2 border rounded"
              >
                <option value="2">2空格</option>
                <option value="4">4空格</option>
                <option value="tab">Tab</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="highlight"
                checked={highlight}
                onChange={(e) => setHighlight(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="highlight">语法高亮</label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={formatJSON} disabled={!input.trim()}>
            格式化JSON
          </Button>
          <Button onClick={compressJSON} disabled={!input.trim()} variant="secondary">
            压缩JSON
          </Button>
          <Button onClick={escapeJSON} disabled={!input.trim()} variant="secondary">
            转义JSON
          </Button>
          <Button onClick={unescapeJSON} disabled={!input.trim()} variant="secondary">
            反转义JSON
          </Button>
          <Button onClick={handleCopy} disabled={!formatted} variant="secondary">
            复制结果
          </Button>
        </div>

        {/* Error Section */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">错误信息：</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Output Section */}
        {formatted && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">格式化结果</h2>
            <div className="p-4 bg-bg-secondary rounded-lg overflow-auto">
              {highlight ? (
                <SyntaxHighlighter
                  language="json"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, fontSize: '0.875rem' }}
                  showLineNumbers
                >
                  {formatted.toString()}
                </SyntaxHighlighter>
              ) : (
                <pre ref={outputRef} className="font-mono text-sm whitespace-pre-wrap">
                  {formatted.toString()}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <UsageInstructions
          items={[
            '在输入框中输入或粘贴JSON数据',
            '根据需要调整缩进大小和语法高亮选项',
            '点击"格式化JSON"按钮将JSON格式化为可读性强的格式',
            '或使用其他功能按钮（压缩、转义、反转义）处理JSON',
            '点击"复制结果"按钮复制处理后的JSON'
          ]}
        />
      </div>
    )
  }
  ```

### 3. 组件复用

#### 现有组件复用

##### UsageInstructions组件
- **位置**：`components/shared/UsageInstructions.tsx`
- **用途**：显示工具的使用步骤说明
- **复用原因**：项目规范要求所有工具组件必须使用此组件

##### Button组件
- **位置**：`components/ui/Button.tsx`
- **用途**：用于格式化、压缩、转义、反转义、复制和清空按钮
- **复用原因**：保持UI一致性

#### 工具函数复用

##### copyToClipboard函数
- **位置**：`lib/clipboard-utils.ts`
- **用途**：实现复制格式化后的JSON到剪贴板的功能
- **复用原因**：项目规范要求所有剪贴板操作必须使用共享函数

##### trackUsage函数
- **位置**：`lib/tracking.ts`
- **用途**：跟踪工具的使用情况
- **复用原因**：项目规范要求所有工具必须实现使用跟踪

### 4. 工具函数设计

#### JSONService

- **位置**：`lib/json-service.ts`
- **功能**：封装JSON处理的核心逻辑
- **API**：
  ```typescript
  /**
   * 格式化JSON字符串
   * @param jsonString - 原始JSON字符串
   * @param indent - 缩进大小（数字表示空格数，字符串表示缩进字符）
   * @returns 格式化后的JSON字符串
   */
  export function formatJSON(jsonString: string, indent: number | string = 2): string;

  /**
   * 压缩JSON字符串
   * @param jsonString - 原始JSON字符串
   * @returns 压缩后的JSON字符串
   */
  export function compressJSON(jsonString: string): string;

  /**
   * 转义JSON字符串
   * @param jsonString - 原始JSON字符串
   * @returns 转义后的JSON字符串
   */
  export function escapeJSON(jsonString: string): string;

  /**
   * 反转义JSON字符串
   * @param jsonString - 转义后的JSON字符串
   * @returns 反转义后的JSON字符串
   */
  export function unescapeJSON(jsonString: string): string;

  /**
   * 验证JSON格式
   * @param jsonString - 要验证的JSON字符串
   * @returns 验证结果对象，包含是否有效和错误信息
   */
  export function validateJSON(jsonString: string): { valid: boolean; error?: string };
  ```

## 三、技术实现

### 1. JSON格式化实现

使用`json5`库解析JSON字符串，然后使用`JSON.stringify`方法将其格式化为指定缩进大小的字符串。

```typescript
export function formatJSON(jsonString: string, indent: number | string = 2): string {
  const parsed = json5.parse(jsonString)
  return JSON.stringify(parsed, null, indent)
}
```

### 2. JSON验证实现

使用`json5`库解析JSON字符串，捕获解析过程中可能出现的错误，并返回验证结果。

```typescript
export function validateJSON(jsonString: string): { valid: boolean; error?: string } {
  try {
    json5.parse(jsonString)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : '无效的JSON格式' }
  }
}
```

### 3. 语法高亮实现

使用`react-syntax-highlighter`库实现JSON语法高亮显示，支持自定义样式和行号。

```tsx
<SyntaxHighlighter
  language="json"
  style={vscDarkPlus}
  customStyle={{ margin: 0, fontSize: '0.875rem' }}
  showLineNumbers
>
  {formatted.toString()}
</SyntaxHighlighter>
```

### 4. 复制功能实现

使用共享的`copyToClipboard`函数将格式化后的JSON复制到剪贴板。

```typescript
const handleCopy = () => {
  if (formatted) {
    copyToClipboard(formatted.toString())
    // 显示复制成功提示
  }
}
```

## 四、性能优化

### 1. 输入处理优化

- 使用防抖（debounce）技术减少实时验证的频率
- 仅在用户停止输入一段时间后才进行JSON验证

### 2. 渲染优化

- 使用`memo`或`useMemo`缓存格式化后的JSON结果
- 仅在输入或配置选项变化时重新计算格式化结果

## 五、测试计划

### 1. 功能测试

- 测试基本JSON格式化功能
- 测试JSON验证功能
- 测试JSON压缩功能
- 测试JSON转义/反转义功能
- 测试复制功能

### 2. 边界情况测试

- 测试空输入情况
- 测试格式错误的JSON
- 测试超大JSON数据的处理

### 3. 兼容性测试

- 测试在不同浏览器中的兼容性
- 测试在不同设备（桌面端、移动端）的显示效果

## 六、总结

本技术设计文档详细描述了MaxTool 0.2版本中JSON格式化工具的技术实现方案，包括功能设计、技术选型、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化，确保实现高质量、可维护的JSON格式化工具。