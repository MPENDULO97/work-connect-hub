# Work Connect - Jobs Feature Setup Guide

## Overview
The Jobs feature allows users to post and browse daily job opportunities across 26+ categories including plumbing, cleaning, delivery, and other small daily tasks.

## Categories Available
- **Home Services**: Cleaning, Plumbing, Electrical, Handyman, Appliance Repair, Locksmith, Pest Control
- **Outdoor**: Gardening, Window Cleaning, Gutter Cleaning, Car Wash
- **Personal Services**: Laundry, Ironing, Cooking, Grocery Shopping, Errands
- **Care Services**: Babysitting, Pet Care, House Sitting
- **Skilled Work**: Painting, Carpentry, Furniture Assembly
- **Other**: Delivery, Moving, Tutoring, and more

## Setup Instructions

### 1. Run Database Migration
Apply the new migration to your Supabase database:

```bash
# If using Supabase CLI locally
supabase db reset

# Or apply migration directly in Supabase Dashboard
# Go to SQL Editor and run the contents of:
# supabase/migrations/20251127120000_add_jobs_feature.sql
```

### 2. Database Schema
The migration creates:
- **jobs table** with columns:
  - `id` (UUID, primary key)
  - `poster_id` (UUID, references auth.users)
  - `title` (text)
  - `description` (text)
  - `category` (enum with 26 categories)
  - `location` (text, optional)
  - `price` (decimal, optional)
  - `currency` (text, default 'ZAR')
  - `active` (boolean, default true)
  - `created_at` and `updated_at` timestamps

- **Row Level Security (RLS)** policies:
  - Anyone can view active jobs
  - Authenticated users can create jobs
  - Users can update/delete their own jobs

### 3. Access the Feature
After migration, users can:
- Navigate to `/jobs` to browse available jobs
- Click "Post Job" to create a new job listing
- Filter by category or search by keywords
- View job details including price, location, and description

### 4. Features Included
✅ Browse jobs by 26+ categories
✅ Search functionality (title & description)
✅ Post new jobs with form validation
✅ Category filtering
✅ Price display in ZAR
✅ Location tagging
✅ Responsive design with Tailwind CSS
✅ Protected routes (requires authentication)
✅ Real-time updates with Supabase

## API Endpoints (Supabase)

### Get All Active Jobs
```typescript
const { data, error } = await supabase
  .from("jobs")
  .select("*, profiles!jobs_poster_id_fkey(full_name)")
  .eq("active", true)
  .order("created_at", { ascending: false });
```

### Filter by Category
```typescript
const { data, error } = await supabase
  .from("jobs")
  .select("*")
  .eq("category", "Plumbing")
  .eq("active", true);
```

### Search Jobs
```typescript
const { data, error } = await supabase
  .from("jobs")
  .select("*")
  .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
  .eq("active", true);
```

### Create Job
```typescript
const { error } = await supabase.from("jobs").insert({
  poster_id: user.id,
  title: "Fix leaking tap",
  description: "Need plumber to fix kitchen tap",
  category: "Plumbing",
  location: "Johannesburg",
  price: 300,
  currency: "ZAR"
});
```

### Update Job
```typescript
const { error } = await supabase
  .from("jobs")
  .update({ active: false })
  .eq("id", jobId)
  .eq("poster_id", user.id);
```

## Testing the Feature

### 1. Create Test Jobs
```sql
-- Run in Supabase SQL Editor
INSERT INTO public.jobs (poster_id, title, description, category, location, price)
VALUES 
  ((SELECT id FROM auth.users LIMIT 1), 'Lawn mowing needed', 'Need someone to mow lawn - 2 hours', 'Gardening', 'Sandton', 200),
  ((SELECT id FROM auth.users LIMIT 1), 'Fix leaking pipe', 'Kitchen sink pipe is leaking', 'Plumbing', 'Johannesburg', 350),
  ((SELECT id FROM auth.users LIMIT 1), 'Baby sitter - evening', 'Watch 2 kids for 3 hours', 'Babysitting', 'Pretoria', 150),
  ((SELECT id FROM auth.users LIMIT 1), 'Grocery shopping help', 'Need help with weekly grocery shopping', 'Grocery Shopping', 'Durban', 100),
  ((SELECT id FROM auth.users LIMIT 1), 'Car wash and vacuum', 'Full car wash and interior vacuum', 'Car Wash', 'Cape Town', 120);
```

### 2. Test User Flow
1. Sign up/Login at `/auth/login`
2. Navigate to `/jobs`
3. Browse jobs and filter by category
4. Click "Post Job" to create a new listing
5. Fill in the form and submit
6. Verify the job appears in the list

## Integration with Existing Features

The Jobs feature is separate from the Projects/Proposals system:
- **Projects**: Long-term freelance work with proposals and milestones
- **Jobs**: Quick daily tasks with direct contact

Both features coexist and users can access them from the Dashboard.

## Navigation
- Dashboard (`/dashboard`) → Shows projects and proposals
- Jobs (`/jobs`) → Shows daily job listings
- Users can switch between features using the navigation bar

## Next Steps (Optional Enhancements)

1. **Job Applications**: Add ability for users to apply to jobs
2. **Messaging**: Direct messaging between job poster and applicants
3. **Ratings**: Review system for completed jobs
4. **Payment Integration**: Integrate payment gateway for job payments
5. **Notifications**: Email/SMS alerts for new jobs in preferred categories
6. **Favorites**: Save jobs for later
7. **Job Status**: Track job completion status

## Troubleshooting

### Migration Fails
- Ensure you're connected to the correct Supabase project
- Check if the enum type already exists
- Verify RLS is enabled on your project

### Jobs Not Showing
- Check if user is authenticated
- Verify RLS policies are applied
- Check browser console for errors

### Can't Post Jobs
- Ensure user is logged in
- Check if all required fields are filled
- Verify poster_id matches authenticated user

## Support
For issues or questions, check:
- Supabase Dashboard → Table Editor → jobs
- Browser DevTools → Console for errors
- Network tab to inspect API calls
