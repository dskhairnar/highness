# Highness Backend

This is the backend server for the Highness application.

## Prerequisites

- Node.js (v18.x or v20.x)
- npm (v8.x or higher)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=1337
   NODE_ENV=development
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests

## Troubleshooting

If you encounter any issues during installation:

1. Make sure you're using the correct Node.js version (v18.x or v20.x)
2. Clear npm cache and reinstall:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/     # Configuration files
│   ├── routes/     # API routes
│   └── index.js    # Main application file
├── package.json
└── README.md
```
