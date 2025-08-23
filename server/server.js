import express from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const app = express()
const PORT = process.env.PORT || 3003
const JWT_SECRET = 'your-secret-key-change-in-production'

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://feiraja.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static file serving
app.use('/uploads', express.static('uploads'))

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Backend service URLs (configure these based on your microservices)
const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  catalog: process.env.CATALOG_SERVICE_URL || 'http://localhost:3005',
  orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3006',
  users: process.env.USERS_SERVICE_URL || 'http://localhost:3007',
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.admin = admin
    next()
  })
}

// Proxy middleware configuration with error handling
const createProxy = (target, options = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false,
    logLevel: 'debug',
    onError: (err, req, res) => {
      console.error(`Proxy Error for ${req.url}:`, err.message)
      res.status(502).json({ 
        error: 'Service temporarily unavailable',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      })
    },
    onProxyReq: (proxyReq, req, res) => {
      // Forward authentication headers
      if (req.admin) {
        proxyReq.setHeader('X-User-ID', req.admin.id)
        proxyReq.setHeader('X-User-Role', 'admin')
      }
      
      // Handle file uploads
      if (req.file) {
        // Forward file information in headers
        proxyReq.setHeader('X-File-Name', req.file.filename)
        proxyReq.setHeader('X-File-Path', req.file.path)
        proxyReq.setHeader('X-File-Original-Name', req.file.originalname)
      }
    },
    ...options
  })
}

// Fallback in-memory database for local development
let localDatabase = {
  admins: [
    {
      id: 1,
      username: 'admin',
      password: bcrypt.hashSync('admin123', 10),
      email: 'admin@feiraja.com',
    },
  ],
  categories: [
    { id: 1, name: 'Frutas', description: 'Frutas frescas da estação', createdAt: new Date() },
    { id: 2, name: 'Vegetais', description: 'Vegetais frescos e orgânicos', createdAt: new Date() },
    { id: 3, name: 'Grãos', description: 'Grãos e cereais', createdAt: new Date() },
    { id: 4, name: 'Temperos', description: 'Temperos e ervas frescas', createdAt: new Date() },
    { id: 5, name: 'Laticínios', description: 'Produtos lácteos artesanais', createdAt: new Date() },
  ],
  products: [
    {
      id: 1,
      name: 'Tomate Orgânico',
      description: 'Tomate fresco da fazenda, cultivado sem agrotóxicos',
      price: 4.5,
      categoryId: 2,
      image: null,
      inStock: true,
      origin: {
        producer: 'Fazenda São João',
        location: 'Ibiúna, São Paulo',
        distance: '45 km de São Paulo',
        harvestDate: '2025-08-20',
        certifications: ['Orgânico IBD', 'Selo SisOrg'],
        story: 'A Fazenda São João é uma propriedade familiar que há 3 gerações se dedica ao cultivo orgânico.',
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 18,
        carbs: '3.9g',
        fiber: '1.2g',
        protein: '0.9g',
        vitamins: ['Vitamina C', 'Licopeno', 'Potássio'],
      },
      createdAt: new Date(),
    },
  ],
  boxPrices: [
    { id: 1, profileType: 1, name: '1 pessoa', basePrice: 25.0, itemCount: 8 },
    { id: 2, profileType: 2, name: '2 pessoas', basePrice: 45.0, itemCount: 14 },
    { id: 3, profileType: 3, name: '3-4 pessoas', basePrice: 65.0, itemCount: 20 },
    { id: 4, profileType: 5, name: '5+ pessoas', basePrice: 85.0, itemCount: 26 },
  ],
  addresses: [
    {
      id: 1,
      userId: 1,
      name: 'Casa',
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      complement: 'Apto 45',
      reference: 'Próximo ao mercado',
      isDefault: true,
      createdAt: new Date(),
    },
  ],
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: SERVICES 
  })
})

// Fallback local auth for development (before proxy routes)
app.post('/api/admin/login/local', async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = localDatabase.admins.find(a => a.username === username)
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, {
      expiresIn: '24h',
    })

    res.json({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Authentication proxy routes
app.use('/api/admin/login', createProxy(SERVICES.auth, {
  pathRewrite: { '^/api/admin/login': '/login' },
}))

// Fallback local endpoints for development (before proxy routes)
app.get('/api/categories/local', (req, res) => {
  const categoriesWithProducts = localDatabase.categories.filter(category => {
    return localDatabase.products.some(product => product.categoryId === category.id)
  })
  res.json(categoriesWithProducts)
})

app.get('/api/products/local', (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query
  let products = [...localDatabase.products]

  if (category && category !== 'Todas') {
    const categoryObj = localDatabase.categories.find(c => c.name === category)
    if (categoryObj) {
      products = products.filter(p => p.categoryId === categoryObj.id)
    }
  }

  if (search) {
    const searchLower = search.toLowerCase()
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    )
  }

  products = products.map(product => ({
    ...product,
    category: localDatabase.categories.find(c => c.id === product.categoryId)?.name || 'Unknown',
  }))

  const startIndex = (page - 1) * limit
  const endIndex = startIndex + parseInt(limit)
  const paginatedProducts = products.slice(startIndex, endIndex)

  res.json({
    products: paginatedProducts,
    total: products.length,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages: Math.ceil(products.length / limit),
  })
})

// Catalog service proxy routes
app.use('/api/categories', createProxy(SERVICES.catalog, {
  pathRewrite: { '^/api/categories': '/categories' },
}))

app.use('/api/products', createProxy(SERVICES.catalog, {
  pathRewrite: { '^/api/products': '/products' },
}))

app.use('/api/admin/categories', authenticateToken, createProxy(SERVICES.catalog, {
  pathRewrite: { '^/api/admin/categories': '/admin/categories' },
}))

app.use('/api/admin/products', authenticateToken, upload.single('image'), createProxy(SERVICES.catalog, {
  pathRewrite: { '^/api/admin/products': '/admin/products' },
}))

app.use('/api/admin/box-prices', authenticateToken, createProxy(SERVICES.catalog, {
  pathRewrite: { '^/api/admin/box-prices': '/admin/box-prices' },
}))

// Users service proxy routes
app.use('/api/addresses', createProxy(SERVICES.users, {
  pathRewrite: { '^/api/addresses': '/addresses' },
}))

app.use('/api/admin/addresses', authenticateToken, createProxy(SERVICES.users, {
  pathRewrite: { '^/api/admin/addresses': '/admin/addresses' },
}))

// Orders service proxy routes
app.use('/api/orders', authenticateToken, createProxy(SERVICES.orders, {
  pathRewrite: { '^/api/orders': '/orders' },
}))


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Reverse Proxy Server running on port ${PORT}`)
    console.log(`📡 API Gateway available at http://localhost:${PORT}/api`)
    console.log(`🔍 Health check: http://localhost:${PORT}/health`)
    console.log('\n🔧 Configured Services:')
    Object.entries(SERVICES).forEach(([name, url]) => {
      console.log(`   ${name}: ${url}`)
    })
  })
}

export default app