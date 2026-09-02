# Setup & Fix Instructions

## Before running npm run dev — run these commands ONCE:

```powershell
# 1. Delete conflicting config (if exists)
Remove-Item -Force "next.config.js" -ErrorAction SilentlyContinue

# 2. Delete old locale folder (if still exists)
Remove-Item -Recurse -Force -LiteralPath "app\[locale]" -ErrorAction SilentlyContinue

# 3. Clear Next.js cache
Remove-Item -Recurse -Force -LiteralPath ".next" -ErrorAction SilentlyContinue

# 4. Start dev server
npm run dev
```

## Then in your browser:
- Press Ctrl+Shift+R (hard refresh) to clear browser cache
- Or open DevTools → Network tab → check "Disable cache"

## Required Environment Variables (.env.local):
See .env.example for all required variables.
At minimum you need:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- NEXT_PUBLIC_APP_URL=http://localhost:3000

## Admin Login:
- URL: http://localhost:3000/admin/login
- Set up your admin account via Supabase dashboard
