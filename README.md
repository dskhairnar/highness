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
