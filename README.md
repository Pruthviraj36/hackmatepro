# HackMate - Hackathon Teammate Matching Platform

A Next.js application for finding hackathon teammates with privacy-first matching.

## Features

- 🔐 User authentication and profiles
- 👥 Discover and match with teammates
- 🎯 Skill-based filtering
- 🏆 Hackathon history tracking
- 📧 Invitation system
- 💼 Project showcase

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/hackmate?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push database schema:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio

## API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/[username]` - Get user by username
- `GET /api/users/discover` - Discover users

### Invitations
- `GET /api/invitations` - Get all invitations
- `POST /api/invitations` - Create invitation
- `PATCH /api/invitations/[id]` - Accept/reject invitation

### Matches
- `GET /api/matches` - Get all matches

### Hackathons
- `GET /api/hackathons` - Get all hackathons
- `POST /api/hackathons` - Create hackathon
- `GET /api/hackathons/history` - Get hackathon history
- `POST /api/hackathons/history` - Add hackathon history

### Projects
- `GET /api/projects` - Get projects
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (pages)/           # Page routes
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and Prisma client
├── prisma/                # Prisma schema
└── src/                   # Source files (pages, components)
```

## License

MIT
