'use client'

import { transformWithCodePoint, transformWithCharMap } from '@/lib/font-utils'
import FontToolBase from '@/components/shared/FontToolBase'

// Instagram font mapping
// Use transform functions for better Unicode handling
const instagramFonts = [
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
  { 
    name: 'Small Caps', 
    transform: (text: string) => transformWithCharMap(text, 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ') // Small Caps
  },
]

export default function InstagramFonts() {
  return (
    <FontToolBase
      toolId="instagram-fonts"
      fontStyles={instagramFonts}
      label="Instagram Font Style"
      instructions={
        <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
          <li>Enter your text in the input field</li>
          <li>Select an Instagram font style</li>
          <li>Copy the generated text</li>
          <li>Paste it in your Instagram bio, posts, or stories</li>
        </ul>
      }
    />
  )
}

