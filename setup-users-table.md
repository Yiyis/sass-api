# Setting Up Users Table in Supabase

## 🗄️ Database Setup

### 1. Run the SQL Script
Go to your Supabase dashboard → SQL Editor and run the `add-users-table.sql` file.

### 2. What This Creates:
- **`users` table** to store Google SSO user information
- **Indexes** for fast lookups by email and provider
- **Row Level Security (RLS)** policies
- **Triggers** to automatically update timestamps
- **`user_id` column** in `api_keys` table (for future user-specific API keys)

### 3. Table Structure:
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  image_url TEXT,
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  last_sign_in TIMESTAMPTZ
)
```

## 🔐 How It Works

### First Time Login:
1. User signs in with Google
2. NextAuth `signIn` callback triggers
3. Checks if user exists in `users` table
4. If not, creates new user record
5. If yes, updates `last_sign_in` timestamp

### What Gets Stored:
- **Email** from Google account
- **Name** from Google profile
- **Profile picture URL** from Google
- **Provider** (always "google")
- **Provider ID** (Google's unique user ID)
- **Timestamps** for creation and sign-ins

## 🚀 Benefits

### Current:
- **User tracking** - Know who's using your system
- **Login history** - Track when users sign in
- **Profile data** - Store user names and images

### Future:
- **User-specific API keys** - Link keys to specific users
- **Usage analytics** - Track API usage per user
- **Team management** - Multiple users per organization
- **User preferences** - Customize dashboard per user

## 🔧 Testing

### 1. Sign out completely
### 2. Sign in with Google again
### 3. Check Supabase `users` table
### 4. You should see your user record!

## 📝 Environment Variables

Make sure you have these in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

The service role key is needed because the `signIn` callback runs on the server side.
