# Feiraja Backend API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Start the Server**
   ```bash
   npm run dev
   ```
   
   The server will start on `http://localhost:3002`

3. **Start the Frontend** (in another terminal)
   ```bash
   cd ..
   npm run dev
   ```
   
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Public Endpoints
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get products with filtering
- `GET /api/addresses` - Get all addresses (optional ?userId parameter)
- `GET /api/addresses/:id` - Get specific address by ID

### Admin Endpoints (require authentication)
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category
- `POST /api/admin/products` - Create product (with image upload)
- `PUT /api/admin/products/:id` - Update product (with image upload)
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/box-prices` - Get box prices
- `PUT /api/admin/box-prices/:id` - Update box price
- `POST /api/admin/addresses` - Create address
- `PUT /api/admin/addresses/:id` - Update address
- `DELETE /api/admin/addresses/:id` - Delete address
- `PATCH /api/admin/addresses/:id/default` - Set address as default

## Admin Credentials

- **Username:** admin
- **Password:** admin123

## Features

- JWT authentication
- File upload for product images
- Category management
- Product management with categories
- Product origin and traceability information
- Nutritional information display
- Enhanced admin form for complete product details
- Box pricing configuration
- Address management with default address support
- In-memory database (replace with real DB in production)

## Address Data Structure

```json
{
  "id": 1,
  "userId": 1,
  "name": "Casa",
  "street": "Rua das Flores, 123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "complement": "Apto 45",
  "reference": "Próximo ao mercado",
  "isDefault": true,
  "createdAt": "2025-08-21T13:21:57.681Z",
  "updatedAt": "2025-08-21T13:24:52.846Z"
}
```

### Address Fields
- `id`: Unique identifier
- `userId`: User owner (for future multi-user support)
- `name`: Address nickname (e.g., "Casa", "Trabalho")
- `street`: Street address with number
- `neighborhood`: Neighborhood/district
- `city`: City name
- `state`: State/province (2-letter code)
- `zipCode`: Postal code
- `complement`: Optional additional info (apt, floor, etc.)
- `reference`: Optional landmark reference
- `isDefault`: Boolean indicating if this is the default address
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp (optional)

## Environment Variables

The frontend uses the following environment variable:
- `API_BASE_URL` - Base URL for the API server (default: http://localhost:3002)

Create a `.env` file in the project root:
```
API_BASE_URL=http://localhost:3002
```

## Next Steps for Production

1. Replace in-memory database with PostgreSQL/MongoDB
2. Add more environment variables for configuration
3. Implement proper error handling and validation
4. Add image optimization and storage (AWS S3, Cloudinary)
5. Add rate limiting and security middleware
6. Implement user management and roles
7. Add logging and monitoring