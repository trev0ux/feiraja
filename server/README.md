# Feiraja Static Server

Simple static file server for serving the Feiraja frontend application.

## Architecture

This server now serves as a lightweight static file server that:
- Serves built frontend assets from the `dist` directory
- Handles SPA routing by serving `index.html` for all routes
- Provides a health check endpoint

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Build the Frontend** (from project root)
   ```bash
   npm run build
   ```

3. **Start the Static Server**
   ```bash
   npm run dev
   ```
   
   The server will start on `http://localhost:3003`

## Endpoints

### Health Check
- `GET /health` - Returns server status

### Static Files
- `GET /*` - Serves static files from dist directory or index.html for SPA routing

## API Backend

The API backend has been moved to a separate project. The API is now available at:
**https://feiraja-api.vercel.app**

### API Endpoints
- `GET /api/health` - API health check
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get products with filtering
- `POST /api/admin/login` - Admin authentication
- And more endpoints for admin operations

## Environment Variables

Update your frontend environment variables to point to the new API:
```bash
API_BASE_URL=https://feiraja-api.vercel.app
```