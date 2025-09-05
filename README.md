#### DEVELOPMING A FULLSTACK MANAGEMENT SYSTEM
#### GELSON MATAVELA - MOZAMBIQUE, AFRICA


Lead Management System

A complete system for managing leaders and users for companies in Mozambique, featuring advanced analytics dashboards and a fully responsive interface.

Overview

The Lead Management System is a modern web application built with Next.js that enables efficient management of users, business leaders, roles, and permissions. It provides real-time analytical dashboards with demographic and performance metrics.

Key Features
Administrative Dashboard

Real-time metrics on users, companies, and staff

Demographic analysis of leaders (gender, age groups)

Activity charts covering the last 7 days

Company performance overview with ranking

Responsive interface adaptable to sidebar layouts and multiple devices

User Management

Filtered listings by roles (Leaders, Staff, Super Admin)

Enhanced visual presentation with profile pictures and badges

Smart filters by company, role, and status

Individual performance metrics

Role-based permission system

Authentication System

Hierarchical roles (SuperAdmin, Leader, Staff)

Granular permissions for resources and actions

Company management with staff/leader relationships

Structured addresses by Mozambican province

Technology Stack
Frontend

Next.js 15.5.2 with App Router

TypeScript for type safety

Tailwind CSS for responsive styling

React Query for server-state management

Lucide React for icons

next-intl for internationalization

Backend & Database

Prisma ORM for database modeling

PostgreSQL as the main database

Arkos Framework for API endpoints

bcryptjs for password hashing

Development

ESLint & Prettier for code quality

TypeScript strict mode enabled

Reusable modular components

Project Structure
lead-management/
├── app/
│   └── [locale]/
│       ├── admin/
│       │   ├── dashboard/          # Admin dashboard
│       │   ├── users/              # User management
│       │   └── settings/           # Settings
│       └── auth/                   # Authentication
├── src/
│   ├── components/
│   │   ├── dashboard/              # Dashboard components
│   │   ├── azra-ui/                # UI components
│   │   └── ui/                     # Base components
│   ├── hooks/                      # Custom hooks
│   ├── lib/                        # Utilities
│   └── types/                      # Type definitions
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── seed.ts                     # Database seeding
└── packages/
    └── doxa-ui/                    # UI component library

Installation and Setup
Requirements

Node.js 18+

PostgreSQL 14+

pnpm (recommended)

1. Clone the repository
git clone <repository-url>
cd lead-management

2. Install dependencies
pnpm install

3. Configure environment variables
cp .env.example .env


Set the following values in .env:

DATABASE_URL="postgresql://user:password@localhost:5432/lead_management"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

4. Setup the database
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed with sample data (300 users, 10 companies)
npx tsx prisma/seed.ts

5. Run the project
pnpm dev


Access: http://localhost:3000

Sample Data

After seeding, you will have:

SuperUser

Email: superadmin@system.mz

Password: SuperUser123!

Leaders (examples)

Email: leader1@techmoz.mz

Password: Leader1Pass123!

Staff (examples)

Email: staff1@techmoz.mz

Password: Staff1Pass123!

Dashboard Features
Key Metrics

Total users (active/inactive)

Registered companies

Total staff and distribution

Super users

Leader Analysis

Gender distribution with percentages

Age groups (Youth, Adults, Seniors, Veterans)

Leaders per company with expandable details

Top companies by leadership performance

Automated insights on diversity

Visualizations

Activity chart (last 7 days)

User breakdown by type and status

Recent activity by user role

Quick statistics with insights

Companies Included

The system includes 10 Mozambican companies:

TechMoz Solutions (Maputo)

Beira Digital (Sofala)

Nampula Innovations (Nampula)

Gaza Tech (Gaza)

Inhambane Systems (Inhambane)

Tete Mining Tech (Tete)

Chimoio Software (Manica)

Quelimane Analytics (Zambézia)

Pemba Logistics (Cabo Delgado)

Lichinga Digital (Niassa)

UI Components
Dashboard Components

AdminDashboard – Main container

MetricCard – Metric cards

LeadersAnalytics – Leader analytics

UserActivityChart – Activity visualization

CompanyOverview – Company performance overview

Layout Components

Sidebar – Responsive navigation

Navbar – Top bar with search and profile

LoadingStates – Loading indicators

Responsiveness

The system is fully responsive with:

Collapsible sidebar on desktop

Overlay sidebar on mobile

Adaptive grid for various screen sizes

Responsive typography (sm, md, lg breakpoints)

Touch-optimized components

Permissions System
Available Roles

SuperAdmin: Full system access

Leader: Company and staff management

Staff: Limited resource access

Resource Permissions

Granular View, Create, Update, Delete controls

Resources: users, companies, roles, system, reports

Internationalization

Built-in support for:

Portuguese (pt) – default

English (en) – secondary

Namespace-based organization by application section

Deployment
Vercel (Recommended)
pnpm build
# Configure environment variables in Vercel
# Automatic Git-based deployment

Docker
# Dockerfile included in the project
docker build -t lead-management .
docker run -p 3000:3000 lead-management

Testing
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage

Performance
Implemented Optimizations

React Query caching with configured stale time

Lazy-loaded components where appropriate

Optimized images with Next.js Image

Automatic bundle splitting

Optimized CSS-in-JS with Tailwind

Metrics

First Contentful Paint: < 1.5s

Largest Contentful Paint: < 2.5s

Cumulative Layout Shift: < 0.1

Contribution

Fork the repository

Create a feature branch (git checkout -b feature/new-feature)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature/new-feature)

Open a Pull Request

License

This project is licensed under the MIT License. See the LICENSE file for details.

Support

For support or questions:

Open a GitHub issue

Contact via email

Check the full documentation