# Bonaventure Chidalu — Portfolio

A production-ready fullstack portfolio with Supabase backend, Cloudinary image uploads, and an Engineering Journal feed.

##  Stack
- **Next.js 14** · **React 18** · **TypeScript** · **Tailwind CSS**
- **Framer Motion** · **GSAP** · **Three.js**
- **Supabase** (PostgreSQL + Auth + RLS)
- **Cloudinary** (image upload/CDN)
- **Jose** (JWT admin auth)

##  Features
-  Mouse-tracking SVG robot on hero
-  10-language selector
-  Engineering Journal feed (5 sections, grid + timeline, infinite scroll, search, tags)
-  Full admin dashboard — Projects, Blog, Experience, Testimonials, Messages, Settings
-  Cloudinary drag-drop image upload with preview
-  JWT-protected admin routes + middleware
-  Supabase PostgreSQL with RLS policies
-  Fully responsive

##  Quick Start

### 1. Install dependencies
```bash
cd bonaventure-portfolio
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste the entire contents of `lib/supabase/migration.sql` → Run
3. Copy your project URL and anon key from **Settings → API**

### 3. Set up Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Copy your Cloud Name, API Key, API Secret from the dashboard

### 4. Create `.env.local`
```bash
cp .env.example .env.local
# Fill in your values
```

Required variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
JWT_SECRET=your-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Create admin account
The SQL migration seeds a default admin. Update the email/password in `lib/supabase/migration.sql` before running it, or update via Supabase dashboard → Table editor → admins table.

**Default:** `bonaventurechidalu@gmail.com` / `Admin@123`
 **Change the password after first login!**

### 6. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

##  Structure
```
├── app/
│   ├── page.tsx              # Home
│   ├── work/page.tsx         # Projects
│   ├── about/page.tsx        # About
│   ├── blog/page.tsx         # Engineering Journal
│   ├── blog/[slug]/page.tsx  # Single post
│   ├── contact/page.tsx      # Contact
│   ├── admin/                # Admin dashboard
│   └── api/                  # All API routes
├── components/
│   ├── admin/                # Admin UI components
│   ├── blog/                 # Blog components
│   └── ...                   # Shared components
├── hooks/
│   └── usePosts.ts           # usePosts, useFeaturedPosts, useSearchPosts
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser Supabase client
│   │   ├── server.ts         # Server Supabase client + admin client
│   │   ├── db.ts             # Reusable DB utilities
│   │   └── migration.sql     # Full DB schema + seed
│   ├── cloudinary.ts         # Upload/delete helpers
│   ├── auth.ts               # JWT sign/verify
│   └── api.ts                # Response helpers
└── types/index.ts            # All TypeScript types
```

##  Admin Pages
| Page | URL |
|---|---|
| Dashboard | `/admin` |
| Projects | `/admin/projects` |
| Engineering Journal | `/admin/blog` |
| Experience | `/admin/experience` |
| Testimonials | `/admin/testimonials` |
| Messages | `/admin/messages` |
| Settings | `/admin/settings` |

##  Deploy to Vercel
```bash
npx vercel
```
Add all env variables in Vercel dashboard → Settings → Environment Variables.

##  Engineering Journal Sections
| Section | Color | Use For |
|---|---|---|
| Latest Thoughts | 🟡 Yellow | Short takes, opinions |
| Building In Public | 🟢 Green | Progress updates, ship logs |
| Engineering Notes | 🔵 Blue | Technical deep dives |
| AI Experiments | 🟣 Purple | ML/AI projects |
| What I'm Learning | 🩷 Pink | Learning notes |

---
Built for **Bonaventure Chidalu** — FCT Abuja, Nigeria 🇳🇬
