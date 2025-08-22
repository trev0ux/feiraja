import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Create Express app
const app = express()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Handle OPTIONS requests for all routes
app.options('*', (req, res) => {
  res.status(200).end()
})

// Middleware - CORS handled by vercel.json
app.use(bodyParser.json())

// In-memory database (replace with real database in production)
let database = {
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
    {
      id: 5,
      name: 'Laticínios',
      description: 'Produtos lácteos artesanais',
      createdAt: new Date(),
    },
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
        story:
          'A Fazenda São João é uma propriedade familiar que há 3 gerações se dedica ao cultivo orgânico. Nossos tomates são cultivados em estufas com sistema de irrigação por gotejamento, garantindo o máximo aproveitamento da água.',
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
    {
      id: 2,
      name: 'Banana Prata',
      description: 'Banana madura e doce, cultivada naturalmente',
      price: 2.8,
      categoryId: 1,
      image: null,
      inStock: true,
      origin: {
        producer: 'Sítio Frutas do Vale',
        location: 'Registro, São Paulo',
        distance: '180 km de São Paulo',
        harvestDate: '2025-08-19',
        certifications: ['Produção Sustentável'],
        story:
          'O Sítio Frutas do Vale cultiva bananas há mais de 20 anos no Vale do Ribeira. Utilizamos técnicas de agricultura regenerativa que preservam o solo e promovem a biodiversidade local.',
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 89,
        carbs: '22.8g',
        fiber: '2.6g',
        protein: '1.1g',
        vitamins: ['Potássio', 'Vitamina B6', 'Vitamina C'],
      },
      createdAt: new Date(),
    },
    {
      id: 3,
      name: 'Arroz Integral',
      description: 'Arroz integral orgânico, fonte de fibras',
      price: 8.5,
      categoryId: 3,
      image: null,
      inStock: true,
      origin: {
        producer: 'Cooperativa Terra Rica',
        location: 'Eldorado, São Paulo',
        distance: '220 km de São Paulo',
        harvestDate: '2025-07-15',
        certifications: ['Orgânico IBD', 'Fair Trade'],
        story:
          'A Cooperativa Terra Rica reúne 15 famílias de pequenos produtores que trabalham juntas para produzir arroz integral de alta qualidade, respeitando os ciclos naturais e preservando as nascentes da região.',
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 123,
        carbs: '23g',
        fiber: '1.8g',
        protein: '2.6g',
        vitamins: ['Magnésio', 'Selênio', 'Manganês'],
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
      userId: 1, // For future user system
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
    {
      id: 2,
      userId: 1,
      name: 'Trabalho',
      street: 'Av. Paulista, 1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      complement: '15º andar',
      reference: 'Torre Norte',
      isDefault: false,
      createdAt: new Date(),
    },
  ],
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

// JWT TOKEN GENERATION ROUTE
app.post('/api/generate-token', (req, res) => {
  try {
    const { payload, expiresIn = '24h' } = req.body

    if (!payload) {
      return res.status(400).json({ error: 'Payload is required' })
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn })

    res.json({
      token,
      expiresIn,
      payload
    })
  } catch (error) {
    res.status(500).json({ error: 'Token generation failed' })
  }
})

// JWT TOKEN VERIFICATION ROUTE
app.post('/api/verify-token', (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Token is required' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    
    res.json({
      valid: true,
      payload: decoded
    })
  } catch (error) {
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid or expired token' 
    })
  }
})

// AUTH ROUTES
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = database.admins.find(a => a.username === username)
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

// CATEGORY ROUTES
app.get('/api/categories', (req, res) => {
  try {
    // Get only categories that have at least one product
    const categoriesWithProducts = database.categories.filter(category => {
      return database.products.some(product => product.categoryId === category.id)
    })

    res.json(categoriesWithProducts)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PRODUCT ROUTES
app.get('/api/products', (req, res) => {
  const { category, search, page = 1, limit = 20 } = req.query
  let products = [...database.products]

  // Filter by category
  if (category && category !== 'Todas') {
    const categoryObj = database.categories.find(c => c.name === category)
    if (categoryObj) {
      products = products.filter(p => p.categoryId === categoryObj.id)
    }
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase()
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
    )
  }

  // Add category names
  products = products.map(product => ({
    ...product,
    category: database.categories.find(c => c.id === product.categoryId)?.name || 'Unknown',
  }))

  // Pagination
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

// ADDRESS ROUTES
app.get('/api/addresses', (req, res) => {
  try {
    const { userId } = req.query
    let addresses = database.addresses

    // Filter by userId if provided
    if (userId) {
      addresses = addresses.filter(addr => addr.userId === parseInt(userId))
    }

    res.json(addresses)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// For Vercel serverless functions
export default app
