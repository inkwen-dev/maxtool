/**
 * Font transformation utilities
 * Shared functions for font generation tools
 */

/**
 * Transform text using a Unicode code point range
 */
export function transformWithCodePoint(
  text: string,
  uppercaseStart: number,
  lowercaseStart: number,
  numberStart?: number
): string {
  return text.split('').map(c => {
    const code = c.charCodeAt(0)
    if (code >= 65 && code <= 90) {
      return String.fromCodePoint(uppercaseStart + (code - 65)) // A-Z
    }
    if (code >= 97 && code <= 122) {
      return String.fromCodePoint(lowercaseStart + (code - 97)) // a-z
    }
    if (numberStart && code >= 48 && code <= 57) {
      return String.fromCodePoint(numberStart + (code - 48)) // 0-9
    }
    return c
  }).join('')
}

/**
 * Transform text using a character array mapping
 * Note: This handles surrogate pairs correctly using Array.from
 */
export function transformWithCharMap(
  text: string,
  fontChars: string
): string {
  const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  // Use Array.from to correctly handle surrogate pairs
  const normalArray = Array.from(normal)
  const fontArray = Array.from(fontChars)
  
  // Create a mapping object
  const charMap: Record<string, string> = {}
  for (let i = 0; i < normalArray.length && i < fontArray.length; i++) {
    charMap[normalArray[i]] = fontArray[i]
  }
  
  return Array.from(text).map(char => {
    return charMap[char] || char
  }).join('')
}

/**
 * Generate font character array from Unicode code points
 * This correctly handles surrogate pairs
 */
export function generateFontChars(
  uppercaseStart: number,
  lowercaseStart: number
): string {
  const uppercase = Array.from({ length: 26 }, (_, i) => 
    String.fromCodePoint(uppercaseStart + i)
  ).join('')
  const lowercase = Array.from({ length: 26 }, (_, i) => 
    String.fromCodePoint(lowercaseStart + i)
  ).join('')
  return uppercase + lowercase
}

