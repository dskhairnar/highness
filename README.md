# Highness Project Setup Guide

This guide will help you set up the Highness project on your local machine. The project consists of three main components:

1. Frontend (React)
2. Strapi CMS (Backend Admin)
3. Backend API (Node.js)
4. PostgreSQL Database

## Prerequisites

### Windows:

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/download/windows/)
- [Git](https://git-scm.com/download/win)
- [VS Code](https://code.visualstudio.com/) (recommended)

### Mac:

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/download/macosx/)
- [Git](https://git-scm.com/download/mac)
- [VS Code](https://code.visualstudio.com/) (recommended)

## Pre-Installation Checks

Before starting the installation, ensure you have:

1. **Node.js Version Check**:

   ```bash
   node --version  # Should be v18 or higher
   npm --version   # Should be 8 or higher
   ```

2. **PostgreSQL Version Check**:

   ```bash
   psql --version  # Should be 14 or higher
   ```

3. **Git Version Check**:

   ```bash
   git --version
   ```

4. **Port Availability**:
   - Port 1337 (Strapi)
   - Port 3000 (Backend)
   - Port 3001 (Frontend)
   - Port 5432 (PostgreSQL)

## Pre-Clone Checklist

Before cloning the repository, ensure your system meets these requirements:

1. **System Requirements**:

   - Node.js v18 or higher
   - npm v8 or higher
   - PostgreSQL v14 or higher
   - Git v2.30 or higher
   - At least 4GB of free RAM
   - At least 2GB of free disk space

2. **Required Ports**:

   - 1337 (Strapi CMS)
   - 3000 (Backend API)
   - 3001 (Frontend)
   - 5432 (PostgreSQL)

3. **Development Tools**:
   - VS Code (recommended)
   - Git
   - PostgreSQL client (pgAdmin for Windows, psql for Mac)

## Important Notes for Clients

1. **Environment Files**:

   - `.env` files are not included in the repository
   - You must create these files as described in the setup steps
   - Never commit `.env` files to the repository

2. **Database**:

   - The database must be created before starting the application
   - Follow the database setup steps carefully
   - Keep your database credentials secure

3. **Node Modules**:

   - `node_modules` folders are not included
   - Run `npm install` in each directory (frontend, backend, cms)
   - This may take several minutes

4. **First-time Setup**:

   - The first build of Strapi may take 5-10 minutes
   - Frontend build may take 2-3 minutes
   - This is normal, please be patient

5. **Common Issues to Watch For**:
   - Node.js version mismatch
   - PostgreSQL service not running
   - Port conflicts
   - Missing environment variables
   - Permission issues with database user

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/dskhairnar/highness.git
cd highness
```

### 2. Database Setup

#### Windows:

1. Install PostgreSQL from the official website
2. During installation:

   - Set a password for the postgres superuser
   - Keep the default port (5432)
   - Install all offered components (especially pgAdmin)

3. Create Database and User:

   ```sql
   -- Open pgAdmin and connect to PostgreSQL
   -- Open Query Tool and run these commands:

   -- Create new user
   CREATE USER highness_user WITH PASSWORD 'your_secure_password';

   -- Create database
   CREATE DATABASE highness;

   -- Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE highness TO highness_user;

   -- Connect to highness database
   \c highness

   -- Grant schema privileges
   GRANT ALL ON SCHEMA public TO highness_user;
   ```

4. Note down these credentials:
   - Database name: highness
   - Username: highness_user
   - Password: (the one you set)
   - Port: 5432

#### Mac:

1. Install PostgreSQL:

```bash
brew install postgresql@14
brew services start postgresql@14
```

2. Create Database and User:

```bash
# Create new user
createuser -P highness_user
# Enter password when prompted

# Create database
createdb highness

# Connect to PostgreSQL
psql postgres

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE highness TO highness_user;
\c highness
GRANT ALL ON SCHEMA public TO highness_user;
```

### 3. Strapi CMS Setup

1. Navigate to the CMS directory:

```bash
cd cms
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the cms directory:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=highness
DATABASE_USERNAME=highness_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
```

4. Start the Strapi development server:

```bash
npm run develop
```

5. Create Admin User:
   - Access http://localhost:1337/admin
   - Click "Create your first administrator"
   - Fill in the required information:
     - First name
     - Last name
     - Email
     - Password
   - Click "Let's start"

The Strapi admin panel will be available at: http://localhost:1337/admin

### 4. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=3000
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_token_here
```

4. Generate Strapi API Token:

   - Log in to Strapi admin panel
   - Go to Settings > API Tokens
   - Click "Create new API Token"
   - Fill in:
     - Name: Backend API
     - Description: Token for backend API access
     - Token duration: Unlimited
     - Token type: Full access
   - Copy the generated token
   - Update the `STRAPI_TOKEN` in backend `.env`

5. Start the backend server:

```bash
npm run dev
```

The backend API will be available at: http://localhost:3000

### 5. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_STRAPI_URL=http://localhost:1337
```

4. Start the frontend development server:

```bash
npm start
```

The frontend application will be available at: http://localhost:3000

## Project Structure Verification

After cloning, verify these files exist:

```
highness/
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
├── backend/
│   ├── package.json
│   └── src/
├── cms/
│   ├── package.json
│   ├── config/
│   └── src/
└── README.md
```

## Known Issues and Solutions

### 1. Backend Issues

- **Port 3000 in use**:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  # Mac
  lsof -i :3000
  ```
- **Missing .env file**: Create `.env` with required variables
- **Database connection**: Verify PostgreSQL is running

### 2. CMS Issues

- **First build takes long**: Normal, wait for completion
- **Missing .env**: Create with database credentials
- **Permission issues**: Check database user permissions
- **Port 1337 in use**: Check and free the port

### 3. Frontend Issues

- **Port 3001 in use**:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  # Mac
  lsof -i :3001
  ```
- **Missing .env**: Create with API URLs
- **Build fails**: Clear node_modules and reinstall

## Quick Start Guide

1. **Clone and Setup**:

   ```bash
   git clone https://github.com/dskhairnar/highness.git
   cd highness
   ```

2. **Database Setup**:

   ```bash
   # Create database and user
   # Follow database setup instructions
   ```

3. **Environment Files**:

   - Create `.env` files in each directory
   - Follow the environment setup guide

4. **Install Dependencies**:

   ```bash
   # In each directory (frontend, backend, cms)
   npm install
   ```

5. **Start Services**:

   ```bash
   # Terminal 1 (CMS)
   cd cms
   npm run develop

   # Terminal 2 (Backend)
   cd backend
   npm run dev

   # Terminal 3 (Frontend)
   cd frontend
   npm start
   ```

## Verification Steps

After setup, verify:

1. **Database**:

   - Can connect to PostgreSQL
   - Database 'highness' exists
   - User has proper permissions

2. **CMS**:

   - Access http://localhost:1337/admin
   - Can create admin account
   - Can generate API token

3. **Backend**:

   - Server starts without errors
   - Can connect to CMS
   - API endpoints respond

4. **Frontend**:
   - Application loads
   - Can connect to backend
   - No console errors

## Getting Started

1. Verify Database Connection:

   - Check if you can connect to the database using pgAdmin (Windows) or psql (Mac)
   - Verify the database user has proper permissions

2. Verify Strapi Setup:

   - Log in to Strapi admin panel
   - Check if you can access the content manager
   - Verify API token is working

3. Verify Backend:

   - Check if the server starts without errors
   - Test API endpoints
   - Verify Strapi connection

4. Verify Frontend:
   - Check if the application loads
   - Test API integration
   - Verify environment variables

## Project Structure

```
highness/
├── frontend/          # React frontend application
├── backend/           # Node.js backend API
├── cms/              # Strapi CMS
│   ├── src/          # Source code
│   ├── config/       # Configuration files
│   ├── public/       # Public assets
│   └── database/     # Database files
└── README.md         # Project documentation
```

## Common Issues and Solutions

### Database Connection Issues

- Ensure PostgreSQL service is running
- Verify database credentials in `.env` files
- Check if the database port (5432) is not blocked
- Verify user permissions
- Check database logs for errors

### Strapi Issues

- Clear the `.cache` folder if you encounter build issues
- Ensure all environment variables are properly set
- Check if the required ports are available
- Verify database connection
- Check Strapi logs

### Backend Issues

- Verify the Strapi URL and token in the backend `.env`
- Ensure all dependencies are installed
- Check if the required ports are available
- Verify API endpoints
- Check backend logs

### Frontend Issues

- Clear node_modules and reinstall if needed
- Verify API URLs in `.env`
- Check for any CORS issues
- Clear browser cache
- Check browser console for errors

## Development Guidelines

1. Always pull the latest changes before starting work
2. Create feature branches for new development
3. Follow the existing code style and structure
4. Test your changes locally before committing
5. Update documentation when making significant changes

## Support

If you encounter any issues during setup or development:

1. Check the common issues section above
2. Review the project documentation
3. Contact the project maintainers

## Additional Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Troubleshooting Guide

### 1. Node.js Issues

```bash
# If you get node version errors
nvm install 18
nvm use 18

# If npm install fails
npm cache clean --force
rm -rf node_modules
npm install
```

### 2. Database Issues

```bash
# Check PostgreSQL service
# Windows
net start postgresql

# Mac
brew services list
brew services restart postgresql@14
```

### 3. Port Issues

```bash
# Check if ports are in use
# Windows
netstat -ano | findstr :1337
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Mac
lsof -i :1337
lsof -i :3000
lsof -i :3001
```

### 4. Build Issues

```bash
# Clear build caches
# In cms directory
rm -rf .cache build
npm run build

# In frontend directory
rm -rf build
npm run build
```

## Support Contact

If you encounter any issues not covered in this documentation:

1. Check the troubleshooting guide above
2. Review the error logs in each component
3. Contact the development team with:
   - Error messages
   - Steps to reproduce
   - Your environment details (OS, Node version, etc.)
