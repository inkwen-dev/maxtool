import { Tool } from '@/types'

// All tools data
export const tools: Tool[] = [
  // Random Tools
  {
    id: 'draw-lots',
    name: 'Draw Lots',
    description: 'Randomly select from a list of names. Winners are excluded from future draws.',
    category: 'Random',
    icon: '🎲',
    path: '/tools/random/draw-lots',
    tags: ['random', 'lottery', 'selection', 'draw']
  },
  {
    id: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range.',
    category: 'Random',
    icon: '🔢',
    path: '/tools/random/random-number',
    tags: ['random', 'number', 'generator']
  },
  {
    id: 'flip-coin',
    name: 'Flip a Coin',
    description: 'Flip a coin online with 3D animation. Heads or tails.',
    category: 'Random',
    icon: '🪙',
    path: '/tools/random/flip-coin',
    tags: ['random', 'coin', 'flip', 'heads', 'tails']
  },
  {
    id: 'roll-dice',
    name: 'Roll Dice',
    description: 'Roll dice online with 3D animation.',
    category: 'Random',
    icon: '🎲',
    path: '/tools/random/roll-dice',
    tags: ['random', 'dice', 'roll']
  },
  {
    id: 'roulette',
    name: 'Roulette',
    description: 'Randomly select from a list of options.',
    category: 'Random',
    icon: '🎡',
    path: '/tools/random/roulette',
    tags: ['random', 'roulette', 'selection']
  },
  {
    id: 'random-team',
    name: 'Random Team Generator',
    description: 'Quickly and fairly generate random teams.',
    category: 'Random',
    icon: '👥',
    path: '/tools/random/random-team',
    tags: ['random', 'team', 'generator']
  },
  {
    id: 'random-list',
    name: 'Random List Generator',
    description: 'Randomly shuffle items in a list.',
    category: 'Random',
    icon: '📋',
    path: '/tools/random/random-list',
    tags: ['random', 'list', 'shuffle']
  },
  
  // Time Tools
  {
    id: 'digital-clock',
    name: 'Digital Clock',
    description: 'Full-screen digital clock display.',
    category: 'Time',
    icon: '🕐',
    path: '/tools/time/digital-clock',
    tags: ['time', 'clock', 'digital']
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Online countdown timer application.',
    category: 'Time',
    icon: '⏱️',
    path: '/tools/time/countdown-timer',
    tags: ['time', 'timer', 'countdown']
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    description: 'Precise time tracking stopwatch.',
    category: 'Time',
    icon: '⏱️',
    path: '/tools/time/stopwatch',
    tags: ['time', 'stopwatch', 'timer']
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    description: 'Improve productivity with focused work sessions.',
    category: 'Time',
    icon: '🍅',
    path: '/tools/time/pomodoro',
    tags: ['time', 'pomodoro', 'productivity']
  },
  {
    id: 'analog-clock',
    name: 'Analog Clock',
    description: 'Online full-screen analog clock with dark mode support.',
    category: 'Time',
    icon: '🕐',
    path: '/tools/time/analog-clock',
    tags: ['time', 'clock', 'analog']
  },
  
  // Text Tools
  {
    id: 'font-generator',
    name: 'Font Generator',
    description: 'Generate various font styles.',
    category: 'Text',
    icon: '🔤',
    path: '/tools/text/font-generator',
    tags: ['text', 'font', 'generator']
  },
  {
    id: 'instagram-fonts',
    name: 'Instagram Fonts',
    description: 'Generate Instagram style fonts.',
    category: 'Text',
    icon: '📱',
    path: '/tools/text/instagram-fonts',
    tags: ['text', 'font', 'instagram']
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text to speech like Siri or robot voice.',
    category: 'Text',
    icon: '🔊',
    path: '/tools/text/text-to-speech',
    tags: ['text', 'speech', 'tts']
  },
  
  // Utilities
  {
    id: 'counter',
    name: 'Counter',
    description: 'Simple increment counter for counting people, scores, or mouse clicks.',
    category: 'Utilities',
    icon: '🔢',
    path: '/tools/utilities/counter',
    tags: ['counter', 'count', 'increment']
  },
  {
    id: 'scoreboard',
    name: 'Scoreboard',
    description: 'Track scores for sports and games.',
    category: 'Utilities',
    icon: '📊',
    path: '/tools/utilities/scoreboard',
    tags: ['score', 'scoreboard', 'track']
  },
  {
    id: 'symbol',
    name: 'Symbol',
    description: 'Collection of special symbols, copy and paste.',
    category: 'Utilities',
    icon: '✨',
    path: '/tools/utilities/symbol',
    tags: ['symbol', 'special', 'characters']
  },
  {
    id: 'emoji-list',
    name: 'Emoji List',
    description: 'Collection of emojis, click to copy.',
    category: 'Utilities',
    icon: '😀',
    path: '/tools/utilities/emoji-list',
    tags: ['emoji', 'emoticons', 'smileys']
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    description: 'Calculate percentages.',
    category: 'Utilities',
    icon: '📊',
    path: '/tools/utilities/percentage',
    tags: ['calculator', 'percentage', 'math']
  }
]

// Get all tools
export function getAllTools(): Tool[] {
  return tools
}

// Get tool by ID
export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id)
}

// Get tools by category
export function getToolsByCategory(category: string): Tool[] {
  return tools.filter(tool => tool.category === category)
}

// Get popular tools (can be based on usage statistics)
export function getPopularTools(): Tool[] {
  // Temporarily return first 6 tools
  return tools.slice(0, 6)
}

