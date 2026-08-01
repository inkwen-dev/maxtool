# URL编码解码工具技术设计文档

## 一、概述

本文档详细描述MaxTool 0.2版本中URL编码解码工具（URL Encoder/Decoder）的技术设计，包括功能设计、技术实现、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化。

## 二、功能设计

### 1. 核心功能

#### 基本编码/解码
- 支持URL编码：将普通文本转换为符合URL规范的编码文本
- 支持URL解码：将编码后的URL文本转换为普通文本
- 实时显示编码/解码结果

#### 高级功能
- 支持批量编码/解码：处理多行文本
- 支持编码类型选择：标准URL编码、RFC 3986编码等
- 支持特殊字符处理：自动识别和处理特殊字符

### 2. 用户界面

#### 输入区域
- 文本输入框：用于输入要编码/解码的文本
- 编码类型选择：选择不同的URL编码标准

#### 输出区域
- 结果显示：实时显示编码/解码后的结果

#### 功能按钮
- 交换按钮：快速交换输入和输出内容
- 复制按钮：复制编码/解码结果
- 清空按钮：清空输入和输出内容

#### 使用说明
- 提供简洁的使用步骤说明

## 三、技术设计

### 1. 技术选型

#### 核心库
- 原生JavaScript：用于URL编码/解码的核心逻辑

#### 浏览器API
- Clipboard API：用于复制编码/解码结果

### 2. 组件结构

#### 主组件

##### UrlEncoderDecoder
- **位置**：`components/tools/UrlEncoderDecoder.tsx`
- **功能**：URL编码解码工具的主组件
- **结构**：
  ```tsx
  'use client'

  import { useState, useEffect } from 'react'
  import Button from '@/components/ui/Button'
  import Textarea from '@/components/ui/Textarea'
  import { trackUsage } from '@/lib/tracking'
  import UsageInstructions from '@/components/shared/UsageInstructions'
  import { copyToClipboard } from '@/lib/clipboard-utils'

  // 定义编码类型
  type EncodingType = 'standard' | 'rfc3986' | 'component' | 'path'

  // 编码类型选项
  const ENCODING_TYPES = [
    { id: 'standard', name: '标准URL编码', description: '使用encodeURI()' },
    { id: 'rfc3986', name: 'RFC 3986', description: '更严格的URL编码标准' },
    { id: 'component', name: 'URL组件编码', description: '使用encodeURIComponent()' },
    { id: 'path', name: 'URL路径编码', description: '编码URL路径部分' }
  ] as const

  export default function UrlEncoderDecoder() {
    // State declarations
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [encodingType, setEncodingType] = useState<EncodingType>('standard')
    const [mode, setMode] = useState<'encode' | 'decode'>('encode')
    const [error, setError] = useState<string | null>(null)
    const [hasTracked, setHasTracked] = useState(false)

    // 初始化
    useEffect(() => {
      trackUsage('url-encoder-decoder')
      setHasTracked(true)
    }, [])

    // 编码/解码逻辑
    useEffect(() => {
      if (!inputText) {
        setOutputText('')
        setError(null)
        return
      }

      try {
        let result: string

        if (mode === 'encode') {
          result = encodeUrl(inputText, encodingType)
        } else {
          result = decodeUrl(inputText, encodingType)
        }

        setOutputText(result)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '处理失败')
        setOutputText('')
      }
    }, [inputText, mode, encodingType])

    // URL编码逻辑
    const encodeUrl = (text: string, type: EncodingType): string => {
      switch (type) {
        case 'standard':
          return encodeURI(text)
        case 'rfc3986':
          return encodeURIComponent(text).replace(/[!'()*]/g, (c) => {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase()
          })
        case 'component':
          return encodeURIComponent(text)
        case 'path':
          return encodeURI(text).replace(/\//g, '%2F')
        default:
          return text
      }
    }

    // URL解码逻辑
    const decodeUrl = (text: string, type: EncodingType): string => {
      // 对于编码类型，解码逻辑基本一致
      try {
        return decodeURIComponent(text)
      } catch (err) {
        throw new Error('无效的URL编码格式')
      }
    }

    // Event handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputText(e.target.value)
    }

    const handleModeToggle = () => {
      setMode(prevMode => prevMode === 'encode' ? 'decode' : 'encode')
      // 交换输入和输出
      setInputText(outputText)
      setOutputText(inputText)
    }

    const handleCopy = () => {
      if (outputText) {
        copyToClipboard(outputText)
        // 显示复制成功提示
      }
    }

    const handleClear = () => {
      setInputText('')
      setOutputText('')
      setError(null)
    }

    const handleEncodingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setEncodingType(e.target.value as EncodingType)
    }

    // Render
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">URL编码/解码</h2>
          
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <label className="block">编码类型</label>
              <select
                value={encodingType}
                onChange={handleEncodingTypeChange}
                className="w-full p-2 border rounded"
              >
                {ENCODING_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Button onClick={handleModeToggle} variant="secondary">
              {mode === 'encode' ? '切换到解码' : '切换到编码'}
            </Button>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block">
              {mode === 'encode' ? '输入要编码的文本' : '输入要解码的URL'}
            </label>
            <Textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={mode === 'encode' ? '输入要编码为URL格式的文本...' : '输入要解码的URL...'}
              rows={6}
              className="w-full"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block">
              {mode === 'encode' ? 'URL编码结果' : 'URL解码结果'}
            </label>
            <Textarea
              value={outputText}
              readOnly
              rows={6}
              className="w-full bg-bg-secondary"
            />
          </div>

          <div className="flex justify-between">
            <Button onClick={handleClear} variant="secondary">
              清空
            </Button>
            <Button onClick={handleCopy} disabled={!outputText} variant="primary">
              复制结果
            </Button>
          </div>
        </div>

        {/* Encoding Type Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">编码类型说明</h3>
          <div className="p-4 bg-bg-secondary rounded-lg">
            {ENCODING_TYPES.find(type => type.id === encodingType)?.description}
          </div>
        </div>

        {/* Usage Instructions */}
        <UsageInstructions
          items={[
            '在输入框中输入要编码/解码的文本',
            '选择合适的编码类型（根据需要）',
            '查看实时生成的编码/解码结果',
            '使用"切换"按钮在编码和解码模式之间切换',
            '点击"复制"按钮复制结果，"清空"按钮重置输入',
            '支持多行文本处理，适合批量操作'
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
- **用途**：用于切换模式、复制和清空等按钮
- **复用原因**：保持UI一致性

##### Textarea组件
- **位置**：`components/ui/Textarea.tsx`
- **用途**：用于文本输入和输出
- **复用原因**：保持UI一致性

#### 工具函数复用

##### copyToClipboard函数
- **位置**：`lib/clipboard-utils.ts`
- **用途**：实现复制编码/解码结果到剪贴板的功能
- **复用原因**：项目规范要求所有剪贴板操作必须使用共享函数

##### trackUsage函数
- **位置**：`lib/tracking.ts`
- **用途**：跟踪工具的使用情况
- **复用原因**：项目规范要求所有工具必须实现使用跟踪

### 4. 工具函数设计

#### UrlService

- **位置**：`lib/url-service.ts`
- **功能**：封装URL编码/解码的核心逻辑
- **API**：
  ```typescript
  /**
   * URL编码
   * @param text - 要编码的文本
   * @param type - 编码类型
   * @returns 编码后的文本
   */
  export function encodeUrl(text: string, type: EncodingType): string;

  /**
   * URL解码
   * @param text - 要解码的文本
   * @returns 解码后的文本
   */
  export function decodeUrl(text: string): string;

  /**
   * 获取编码类型选项
   * @returns 编码类型选项数组
   */
  export function getEncodingTypes(): Array<{ id: string; name: string; description: string }>;
  ```

## 三、技术实现

### 1. URL编码实现

使用JavaScript内置的URL编码函数，并根据不同的编码类型进行扩展：

```typescript
export function encodeUrl(text: string, type: EncodingType): string {
  switch (type) {
    case 'standard':
      return encodeURI(text)
    case 'rfc3986':
      return encodeURIComponent(text).replace(/[!'()*]/g, (c) => {
        return '%' + c.charCodeAt(0).toString(16).toUpperCase()
      })
    case 'component':
      return encodeURIComponent(text)
    case 'path':
      return encodeURI(text).replace(/\//g, '%2F')
    default:
      return text
  }
}
```

### 2. URL解码实现

使用JavaScript内置的URL解码函数：

```typescript
export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch (err) {
    throw new Error('无效的URL编码格式')
  }
}
```

### 3. 实时处理实现

使用React的useEffect钩子监听输入文本、模式和编码类型的变化，自动触发编码/解码计算。

```typescript
useEffect(() => {
  if (!inputText) {
    setOutputText('')
    setError(null)
    return
  }

  try {
    let result: string

    if (mode === 'encode') {
      result = encodeUrl(inputText, encodingType)
    } else {
      result = decodeUrl(inputText)
    }

    setOutputText(result)
    setError(null)
  } catch (err) {
    setError(err instanceof Error ? err.message : '处理失败')
    setOutputText('')
  }
}, [inputText, mode, encodingType])
```

### 4. 复制功能实现

使用共享的`copyToClipboard`函数将编码/解码结果复制到剪贴板。

```typescript
const handleCopy = () => {
  if (outputText) {
    copyToClipboard(outputText)
    // 显示复制成功提示
  }
}
```

## 四、性能优化

### 1. 计算优化

- 只在输入文本变化时进行编码/解码计算
- 避免重复计算相同的输入内容

### 2. 渲染优化

- 使用React的memo优化组件渲染性能
- 使用Textarea组件的readOnly属性优化输出区域的性能

## 五、测试计划

### 1. 功能测试

- 测试基本URL编码功能
- 测试基本URL解码功能
- 测试不同编码类型的编码结果
- 测试交换输入输出功能
- 测试复制功能
- 测试清空功能

### 2. 边界情况测试

- 测试空文本输入
- 测试包含特殊字符的文本
- 测试包含中文和其他非ASCII字符的文本
- 测试超长文本输入
- 测试无效的URL编码格式

### 3. 兼容性测试

- 测试在不同浏览器中的兼容性
- 测试在不同设备（桌面端、移动端）的显示效果

## 六、总结

本技术设计文档详细描述了MaxTool 0.2版本中URL编码解码工具的技术实现方案，包括功能设计、技术选型、组件结构和代码复用等方面。设计严格遵循项目规范，注重代码复用、组件化和性能优化，确保实现高质量、可维护的URL编码解码工具。