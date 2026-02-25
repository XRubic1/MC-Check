# MC-Check

One-page web app for MC verification entries: enter verifications and view a sortable, searchable list. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- **Tab 1 – Enter MC Verification:** MC#, Carrier, Amount, Approved (checkbox), User (entered by), Notes, Date entered (defaults to today, editable).
- **Tab 2 – Verification List:** Table of all entries (including Notes and Date entered), sortable by column, with a search field.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the contents of `supabase/schema.sql` to create the `mc_verifications` table and policies.
3. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` – Project URL (Settings → API)
   - `VITE_SUPABASE_ANON_KEY` – anon/public key (Settings → API)

### 3. Run the app

```bash
npm run dev
```

Open the URL shown (e.g. http://localhost:5173).

## Supabase table

The table `mc_verifications` and the SQL to create it (including indexes and optional RLS) are in **`supabase/schema.sql`**. Run that script in the Supabase SQL Editor to set up the database.

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Production build
- `npm run preview` – Preview production build
