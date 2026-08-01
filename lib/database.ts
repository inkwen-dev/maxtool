import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Pool, PoolClient } from 'pg'

// Database connection type
type ConnectionType = 'supabase' | 'postgresql'

// Supabase client
let supabaseClient: SupabaseClient | null = null

// PostgreSQL connection pool
let pgPool: Pool | null = null

// Connection type
let connectionType: ConnectionType | null = null

// Detect connection type
function detectConnectionType(): ConnectionType {
  // Prefer Supabase if URL and Key are provided
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return 'supabase'
  }
  
  // Use direct PostgreSQL connection if connection info is provided
  if (process.env.DB_HOST && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_NAME) {
    return 'postgresql'
  }
  
  throw new Error(
    'Missing database configuration. ' +
    'Please provide either Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) ' +
    'or PostgreSQL connection info (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) in your .env.local file.'
  )
}

// Initialize database connection (required)
export function initDatabase() {
  connectionType = detectConnectionType()
  
  if (connectionType === 'supabase') {
    // Use Supabase
    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_ANON_KEY!
    
    supabaseClient = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Supabase initialized')
  } else if (connectionType === 'postgresql') {
    // Use direct PostgreSQL connection
    pgPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 10, // Maximum number of connections
      idleTimeoutMillis: 30000, // Maximum time a connection can be idle before being closed
      connectionTimeoutMillis: 2000, // Maximum time to wait for a connection to be established before timing out
    })
    console.log('✅ PostgreSQL pool initialized')
  }
}

// Ensure database is initialized
function ensureDatabaseInitialized() {
  if (!connectionType) {
    initDatabase()
  }
}

// Insert usage statistics
export async function insertUsageStats(toolName: string): Promise<void> {
  ensureDatabaseInitialized()
  
  if (connectionType === 'supabase') {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized. Please check environment variables.')
    }
    
    const { error } = await supabaseClient
      .from('usage_stats')
      .insert({ tool_name: toolName })
    
    if (error) {
      throw error
    }
  } else if (connectionType === 'postgresql') {
    if (!pgPool) {
      throw new Error('PostgreSQL pool not initialized. Please check environment variables.')
    }
    
    await pgPool.query(
      'INSERT INTO usage_stats (tool_name) VALUES ($1)',
      [toolName]
    )
  }
}

// Query usage statistics
export async function getUsageStats(toolName?: string) {
  ensureDatabaseInitialized()
  
  if (connectionType === 'supabase') {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized. Please check environment variables.')
    }
    
    let query = supabaseClient.from('usage_stats').select('*')
    
    if (toolName) {
      query = query.eq('tool_name', toolName)
    }
    
    const { data, error } = await query
    
    if (error) {
      throw error
    }
    
    return data
  } else if (connectionType === 'postgresql') {
    if (!pgPool) {
      throw new Error('PostgreSQL pool not initialized. Please check environment variables.')
    }
    
    if (toolName) {
      const result = await pgPool.query(
        'SELECT * FROM usage_stats WHERE tool_name = $1',
        [toolName]
      )
      return result.rows
    } else {
      const result = await pgPool.query('SELECT * FROM usage_stats')
      return result.rows
    }
  }
  
  return []
}

// Close connection (optional)
export async function closeDatabase() {
  if (pgPool) {
    await pgPool.end()
    console.log('✅ PostgreSQL pool closed')
  }
}

