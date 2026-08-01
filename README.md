# Free Online Tools

A collection of free, simple, and fast online tools for everyday tasks. No registration required.

## 🚀 Features

- **20+ Free Tools**: Random selection, time management, text tools, and utilities
- **No Registration**: Use tools directly without signing up
- **Fast & Simple**: Clean interface, fast loading
- **Privacy First**: Minimal data collection, no tracking
- **Mobile Friendly**: Responsive design, works on all devices
- **Dark Mode**: Global dark mode support with theme persistence
- **Search**: Real-time search with highlighting
- **User Guide**: Usage instructions for all tools

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
  - 本地开发：本地 PostgreSQL 数据库
  - 生产环境：Supabase PostgreSQL（云服务）
- **Deployment**: Vercel
- **CDN**: Cloudflare

## 📋 Tools List

### Random Tools (7)
- 🎲 Draw Lots - Randomly select from a list with exclusion
- 🔢 Random Number Generator - Generate random numbers in range
- 🪙 Flip a Coin - Flip with 3D animation
- 🎲 Roll Dice - Roll dice with animation
- 🎡 Roulette - Random selection from options
- 👥 Random Team Generator - Generate random teams
- 📋 Random List Generator - Shuffle list items

### Time Tools (5)
- 🕐 Digital Clock - Full-screen digital clock
- ⏱️ Countdown Timer - Set timer with controls
- ⏱️ Stopwatch - Precise time tracking with laps
- 🍅 Pomodoro Timer - 25 min work + 5 min break
- 🕐 Analog Clock - Analog clock with hands

### Text Tools (3)
- 🔤 Font Generator - Generate various font styles
- 📱 Instagram Fonts - Instagram style fonts
- 🔊 Text to Speech - Convert text to speech

### Utilities (5)
- 🔢 Counter - Simple increment counter
- 📊 Scoreboard - Track scores for teams
- ✨ Symbols - Special symbols collection
- 😀 Emoji List - Emoji collection
- 📊 Percentage Calculator - Calculate percentages

**Total: 20 Tools**

## 🏗️ Project Structure

```
freetool/
├── app/
│   ├── tools/              # Tool routes (20 tools)
│   │   ├── draw-lots/
│   │   ├── random-number/
│   │   └── ...
│   ├── api/                 # API routes
│   │   └── track-usage/     # Usage statistics API
│   ├── all-tools/           # All tools page
│   ├── popular/             # Popular tools page
│   ├── category/            # Category pages
│   ├── about/               # About page
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── contact/             # Contact page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── not-found.tsx        # 404 page
│   └── globals.css          # Global styles
├── components/
│   ├── tools/               # Tool components (20 components)
│   │   ├── DrawLots.tsx
│   │   ├── RandomNumber.tsx
│   │   └── ...
│   ├── ui/                  # UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── shared/              # Shared components
│       ├── Navigation.tsx  # Top navigation (with mobile menu)
│       ├── Footer.tsx       # Footer (with theme toggle)
│       ├── SearchBox.tsx   # Search component
│       ├── ToolCard.tsx     # Tool card component
│       ├── ToolContainer.tsx # Tool page container
│       └── ThemeProvider.tsx # Dark mode provider
├── lib/
│   ├── database.ts          # Database adapter (PostgreSQL/Supabase)
│   ├── config.ts            # Configuration
│   ├── tracking.ts          # Usage tracking
│   ├── search.ts            # Search functionality
│   ├── tools-data.ts        # Tools data
│   ├── utils.ts             # Utility functions
│   └── validation.ts        # Data validation
├── types/
│   └── index.ts             # TypeScript type definitions
├── .env.example             # Environment variables example
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── next.config.ts           # Next.js config
├── postcss.config.mjs       # PostCSS config
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.14.2 or higher (recommended: 20.9.0+)
- **npm**: Comes with Node.js, or use yarn/pnpm
- **Git**: For cloning the repository

**Check your versions:**
```bash
node --version  # Should be >= 18.14.2
npm --version   # Should be >= 9.0.0
```

> ⚠️ **Note**: If you see engine warnings during `npm install`, consider upgrading Node.js to version 20+ for better compatibility.

---

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd freetool
```

---

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Supabase client
- PostgreSQL client (pg)

**Expected output:**
```
added 500+ packages
```

> ⚠️ **If you see engine warnings**: The project will still work, but upgrading Node.js is recommended.

---

### Step 3: Set Up Environment Variables

1. **Copy the example file:**
```bash
cp .env.example .env.local
```

2. **Edit `.env.local`** with your configuration:

#### For Development (Local PostgreSQL)

```env
# Environment
NODE_ENV=development

# Local PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=your-database-name
```

#### For Production (Supabase PostgreSQL)

```env
# Environment
NODE_ENV=production

# Database Type
DB_TYPE=postgresql

# Supabase Configuration
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

> 📝 **Note**: 
> - For local development without database, you can skip database configuration. The app will work, but usage statistics won't be saved.
> - The database connection is optional for basic functionality.

---

### Step 4: Set Up Database (Optional)

#### Development Environment (Local PostgreSQL)

1. Install and start local PostgreSQL
2. Create a database (e.g., `max_tool`)
3. Run the PostgreSQL SQL script from `docs/上线资源/数据库设计-postgresql.sql`
4. Update `.env.local` with your PostgreSQL credentials

#### Production Environment (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the PostgreSQL SQL script from `docs/上线资源/数据库设计.md`
3. Get your Supabase URL and anon key from project settings
4. Update `.env.local` with Supabase credentials

> 💡 **Tip**: You can skip database setup for now and test the app locally. Database is only needed for usage statistics.

---

### Step 5: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.0.6
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**You should see:**
- Homepage with tool categories
- Navigation bar with search
- Popular tools section
- Footer with theme toggle

---

### Step 6: Build for Production

```bash
npm run build
```

This will:
- Compile TypeScript
- Optimize React components
- Generate static pages
- Create production bundle

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

**Build output location:**
```
.next/
├── static/
├── server/
└── ...
```

---

### Step 7: Start Production Server

```bash
npm start
```

This starts the production server using the built files.

**Expected output:**
```
  ▲ Next.js 16.0.6
  - Local:        http://localhost:3000
  - Ready in 0.5s
```

---

## 📝 Available Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build production bundle |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint to check code quality |

---

## 🧪 Testing the Application

### 1. Test Homepage
- Visit http://localhost:3000
- Check navigation menu
- Test search functionality
- Try theme toggle (dark/light mode)

### 2. Test Tools
- Click on any tool card
- Test tool functionality
- Check usage instructions
- Verify responsive design

### 3. Test Mobile View
- Open browser DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Test mobile navigation menu
- Check responsive layout

### 4. Test Search
- Type in search box
- Verify search highlighting
- Test "no results" message
- Check search results click

### 5. Test Dark Mode
- Click theme toggle in footer
- Verify all pages support dark mode
- Check theme persistence (refresh page)
- Test system preference detection

---

## 🐛 Troubleshooting

### Problem: `npm install` fails

**Solution:**
- Check Node.js version: `node --version` (should be >= 18.14.2)
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

### Problem: Port 3000 is already in use

**Solution:**
```bash
# Option 1: Use a different port
npm run dev -- -p 3001

# Option 2: Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

### Problem: Database connection error

**Solution:**
- Check `.env.local` file exists and has correct values
- Verify database credentials are correct
- For development, you can skip database setup (app will work without it)
- Check database server is running and accessible

---

### Problem: Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix errors or check tsconfig.json
```

---

### Problem: Dark mode not working

**Solution:**
- Check `ThemeProvider` is imported in `app/layout.tsx`
- Verify `globals.css` has dark mode styles
- Clear browser cache and reload

---

### Problem: Mobile menu not showing

**Solution:**
- Check browser window width (should be < 768px)
- Verify `Navigation.tsx` has mobile menu code
- Check browser console for errors

---

## 📚 Documentation

All project documentation is in the `docs/` directory:

### Project Planning
- `docs/项目计划/开发工作计划.md` - Overall development plan
- `docs/项目计划/第1期开发计划.md` - Phase 1 development plan
- `docs/项目计划/前端代码计划.md` - Frontend development plan
- `docs/项目计划/后端代码计划.md` - Backend development plan
- `docs/项目计划/优化完成报告.md` - Optimization completion report

### Technical Design
- `docs/上线资源/数据库设计.md` - Database design (PostgreSQL)
- `docs/上线资源/环境配置方案.md` - Environment configuration
- `docs/项目计划/专业代码检查报告.md` - Code quality report
- `docs/项目计划/产品经理评估报告.md` - Product evaluation report

---

## 🎨 Features Overview

### Navigation
- **Desktop**: Horizontal menu with categories dropdown
- **Mobile**: Hamburger menu with collapsible navigation
- **Search**: Real-time search with highlighting
- **Sticky**: Navigation stays at top when scrolling

### Dark Mode
- **Toggle**: Theme switch button in footer
- **Persistence**: Theme saved in localStorage
- **System Preference**: Auto-detects system theme on first visit
- **Global**: All pages and components support dark mode

### Search
- **Real-time**: Search as you type (300ms debounce)
- **Highlighting**: Matching text highlighted in yellow
- **No Results**: Friendly message when no tools found
- **Multi-field**: Searches name, description, category, and tags

### Tools
- **20 Tools**: All tools fully functional
- **Usage Instructions**: Every tool has "How to use" section
- **Responsive**: Works on all screen sizes
- **Local Storage**: Some tools save data locally

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local` (for production)
   - Set `NODE_ENV=production`
   - Configure Supabase credentials
   - Add Supabase credentials

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

### Manual Deployment

```bash
# Build the project
npm run build

# The build output is in .next/ directory
# You can deploy this to any Node.js hosting service
```

---

## 🔧 Development Tips

### Hot Reload
- Next.js automatically reloads when you save files
- No need to restart the dev server

### TypeScript
- All files use TypeScript
- Type errors will show in terminal and editor
- Fix errors before building

### Component Structure
- Tools: `components/tools/ToolName.tsx`
- Pages: `app/tools/tool-name/page.tsx`
- Shared: `components/shared/ComponentName.tsx`
- UI: `components/ui/ComponentName.tsx`

### Adding a New Tool

1. Create component: `components/tools/NewTool.tsx`
2. Create page: `app/tools/new-tool/page.tsx`
3. Add to data: `lib/tools-data.ts`
4. Add validation: `lib/validation.ts`
5. Test locally: `npm run dev`

---

## 📦 Project Status

### ✅ Completed Features

- [x] 20 tools fully implemented
- [x] Responsive design (mobile & desktop)
- [x] Dark mode support
- [x] Search functionality with highlighting
- [x] Mobile navigation menu
- [x] 404 error page
- [x] Usage instructions for all tools
- [x] Error handling improvements
- [x] SEO optimization
- [x] Database adapter layer

### ⏳ Pending (Optional)

- [ ] Database connection configuration
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] Analytics integration

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-tool`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add new tool"`
6. Push: `git push origin feature/new-tool`
7. Create a Pull Request

---

## 📝 License

MIT

---

## 🙏 Acknowledgments

- Inspired by PiliApp.com and other tool websites
- Built with Next.js and Tailwind CSS
- Icons from emoji characters

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the documentation in `docs/` directory
3. Check browser console for errors
4. Verify environment variables are set correctly

---

## 🎯 Quick Start Checklist

For new developers, follow these steps:

- [ ] Install Node.js 18+
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] (Optional) Configure database
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Test a few tools
- [ ] Try dark mode toggle
- [ ] Test mobile view
- [ ] Build with `npm run build`

**You're ready to develop!** 🚀
