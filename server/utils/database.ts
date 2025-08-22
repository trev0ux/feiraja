// In-memory database (replace with real database in production)
export const database = {
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
        story: 'A Fazenda São João é uma propriedade familiar que há 3 gerações se dedica ao cultivo orgânico. Nossos tomates são cultivados em estufas com sistema de irrigação por gotejamento, garantindo o máximo aproveitamento da água.'
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 18,
        carbs: '3.9g',
        fiber: '1.2g',
        protein: '0.9g',
        vitamins: ['Vitamina C', 'Licopeno', 'Potássio']
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
        story: 'O Sítio Frutas do Vale cultiva bananas há mais de 20 anos no Vale do Ribeira. Utilizamos técnicas de agricultura regenerativa que preservam o solo e promovem a biodiversidade local.'
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 89,
        carbs: '22.8g',
        fiber: '2.6g',
        protein: '1.1g',
        vitamins: ['Potássio', 'Vitamina B6', 'Vitamina C']
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
        story: 'A Cooperativa Terra Rica reúne 15 famílias de pequenos produtores que trabalham juntas para produzir arroz integral de alta qualidade, respeitando os ciclos naturais e preservando as nascentes da região.'
      },
      nutritionalInfo: {
        portion: '100g',
        calories: 123,
        carbs: '23g',
        fiber: '1.8g',
        protein: '2.6g',
        vitamins: ['Magnésio', 'Selênio', 'Manganês']
      },
      createdAt: new Date(),
    },
  ]
}