# Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **npm** or **pnpm**

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Configure environment variables in `.env.local`:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/sirahats
   MONGODB_DB=sirahats
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary Configuration (if using image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

## Database Setup

### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Create database: `sirahats`

### Option 2: MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

## Seeding the Database

Run the seed script to populate the database with sample data:

```bash
npm run seed
```

This will create:
- Test user: `john.doe@example.com` / `password123`
- Admin user: `admin@sirahats.com` / `admin123`
- Sample collections
- Sample products
- Sample orders

## Development

1. Start development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- Login with admin account: `admin@sirahats.com` / `admin123`
- Access admin panel at `/admin`

## Troubleshooting

### Seed Script Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` environment variable
- Verify database connection

### Common Errors
- **MONGODB_URI not set**: Create `.env.local` file
- **Connection failed**: Check MongoDB status and connection string
- **Permission denied**: Ensure database user has write access
