'use client'

import { transformWithCodePoint } from '@/lib/font-utils'
import FontToolBase from '@/components/shared/FontToolBase'

const fontStyles = [
  { 
    name: 'Bold', 
    transform: (text: string) => transformWithCodePoint(text, 0x1D400, 0x1D41A) // Mathematical Bold
  },
  { 
    name: 'Italic', 
    transform: (text: string) => transformWithCodePoint(text, 0x1D434, 0x1D44E) // Mathematical Italic
  },
  { 
    name: 'Bold Italic', 
    transform: (text: string) => transformWithCodePoint(text, 0x1D468, 0x1D482) // Mathematical Bold Italic
  },
  { 
    name: 'Monospace', 
    transform: (text: string) => transformWithCodePoint(text, 0x1D670, 0x1D68A, 0x1D7F6) // Mathematical Monospace
  },
  { name: 'Double Struck', transform: (text: string) => text.split('').map(c => {
    const code = c.charCodeAt(0)
    // Mathematical Double-Struck: Some letters have special code points
    // Special cases: C=U+2102, F=U+2131, H=U+210D, P=U+2119, Q=U+211A, R=U+211D, Z=U+2124
    if (code >= 65 && code <= 90) {
      const specialCases: Record<number, number> = {
        67: 0x2102,  // C -> ℂ
        70: 0x2131,  // F -> ℱ
        72: 0x210D,  // H -> ℍ
        80: 0x2119,  // P -> ℙ
        81: 0x211A,  // Q -> ℚ
        82: 0x211D,  // R -> ℝ
        90: 0x2124,  // Z -> ℤ
      }
      if (specialCases[code]) {
        return String.fromCodePoint(specialCases[code])
      }
      // Regular letters: U+1D538-U+1D551 (but skip the special ones)
      // A, B, D, E, G, I, J, K, L, M, N, O, S, T, U, V, W, X, Y
      const regularMap: Record<number, number> = {
        65: 0x1D538,  // A
        66: 0x1D539,  // B
        68: 0x1D53B,  // D
        69: 0x1D53C,  // E
        71: 0x1D53E,  // G
        73: 0x1D540,  // I
        74: 0x1D541,  // J
        75: 0x1D542,  // K
        76: 0x1D543,  // L
        77: 0x1D544,  // M
        78: 0x1D545,  // N
        79: 0x1D546,  // O
        83: 0x1D54A,  // S
        84: 0x1D54B,  // T
        85: 0x1D54C,  // U
        86: 0x1D54D,  // V
        87: 0x1D54E,  // W
        88: 0x1D54F,  // X
        89: 0x1D550,  // Y
      }
      if (regularMap[code]) {
        return String.fromCodePoint(regularMap[code])
      }
    }
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D552 + (code - 97)) // a-z
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7D8 + (code - 48)) // 0-9
    return c
  }).join('') },
  { 
    name: 'Sans Serif', 
    transform: (text: string) => transformWithCodePoint(text, 0x1D5D4, 0x1D5EE) // Mathematical Sans-Serif Bold
  },
]

export default function FontGenerator() {
  return (
    <FontToolBase
      toolId="font-generator"
      fontStyles={fontStyles}
      label="Font Style"
    />
  )
}

