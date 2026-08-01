import { NextResponse } from 'next/server'
import { insertUsageStats } from '@/lib/database'
import { validateToolName } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const { tool } = await request.json()
    
    // Validate
    if (!tool || typeof tool !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request. Please provide a valid tool name.' 
        },
        { status: 400 }
      )
    }
    
    if (!validateToolName(tool)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Tool "${tool}" is not recognized. Please use a valid tool name.` 
        },
        { status: 400 }
      )
    }
    
    // Insert data to Supabase
    try {
      await insertUsageStats(tool)
      return NextResponse.json({ success: true })
    } catch (dbError) {
      // Database errors don't affect user experience, log silently
      console.error('Database error:', dbError)
      // Still return success, as tracking failure should not affect tool usage
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('API error:', error)
    // Return user-friendly error message
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

