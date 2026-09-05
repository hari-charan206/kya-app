# KYA (Know Your Agent) Admin Dashboard

A robust, production-ready administrative control center designed to monitor, audit, and govern autonomous AI agents interacting with financial transaction rails. Built with **Next.js 16 (App Router)** and **Supabase**.

---

## 🚀 Features

* **Secure Authentication:** Powered by Supabase Auth with server-side session cookies and role-based access control (`senior_admin`, etc.).
* **Real-time Analytics & Monitoring:** Live tracking of active agents, total financial exposure, 24-hour transaction charts, and live anomaly streams.
* **Case Queue & Audit Logs:** Comprehensive logging and tracking of flagged agent behaviors and system events.
* **Credential Management:** Secure issuance, rotation, and revocation of cryptographic API credentials for autonomous agents.
* **Modern Tech Stack:** Utilizes Next.js 16 (Turbopack, Partial Prerendering) paired with Tailwind CSS and Radix UI / Shadcn primitives.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 16 (App Router)
* **Backend & Auth:** Supabase (PostgreSQL, Auth Helpers)
* **Styling:** Tailwind CSS, Shadcn UI components
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
kya-app/
├── app/                  # Next.js App Router pages & API routes
│   ├── dashboard/        # Core operational pages (agents, monitor, flags, audit, settings)
│   ├── auth/             # Login, signup, and callback handlers
│   └── page.tsx          # Root redirect to dashboard
├── components/           # Reusable UI components (login-form, charts, layout bars)
├── lib/                  # Supabase client/server configuration and utilities
└── public/               # Static assets

```

---

## ⚙️ Getting Started Locally

### 1. Clone and Install Dependencies

Clone the repository and install the required packages:

```bash
git clone <repository-url>
cd kya-app
npm install

```

### 2. Configure Environment Variables

Copy the example environment template to create your local config file:

```bash
cp .env.example .env.local

```

Open `.env.local` and fill in your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

```

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🚀 Deployment on Vercel

This application is optimized for deployment on Vercel.

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configure your environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Ensure your **Supabase Auth Redirect URLs** include your Vercel deployment domain (e.g., `[https://your-app.vercel.app/](https://your-app.vercel.app/)**`).
5. Deploy!
