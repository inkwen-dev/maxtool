// Configuration management
export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Is development environment
  isDev: process.env.NODE_ENV === 'development',
  
  // Is production environment
  isProd: process.env.NODE_ENV === 'production',
}

