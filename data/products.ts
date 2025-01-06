export const products = Array.from({ length: 100 }, (_, i) => {
  const categories = ['wine', 'beer', 'spirits', 'soft-drinks']
  const category = categories[Math.floor(Math.random() * categories.length)]
  
  const brands = {
    wine: ['Château Margaux', 'Penfolds', 'Dom Pérignon', 'Opus One', 'Mouton Rothschild'],
    beer: ['Heineken', 'Grolsch', 'La Trappe', 'Hertog Jan', 'Brand'],
    spirits: ['Johnnie Walker', 'Grey Goose', 'Hendrick\'s', 'Bacardi', 'Jack Daniel\'s'],
    'soft-drinks': ['Coca-Cola', 'Fanta', 'Sprite', 'Red Bull', 'Monster']
  }
  
  const volumes = {
    wine: ['75CL', '150CL', '300CL'],
    beer: ['33CL', '50CL', '75CL'],
    spirits: ['50CL', '70CL', '100CL'],
    'soft-drinks': ['25CL', '33CL', '50CL']
  }

  const basePrice = {
    wine: 29.99,
    beer: 2.49,
    spirits: 34.99,
    'soft-drinks': 1.49
  }

  const brand = brands[category][Math.floor(Math.random() * brands[category].length)]
  const volume = volumes[category][Math.floor(Math.random() * volumes[category].length)]
  const price = (basePrice[category] * (0.8 + Math.random() * 0.4)).toFixed(2)
  const hasDiscount = Math.random() > 0.7
  const originalPrice = hasDiscount ? (parseFloat(price) * 1.2).toFixed(2) : undefined

  return {
    id_product_mysql: (i + 1).toString(),
    arcleunik: (i + 1).toString(),
    title: `${brand} ${category === 'wine' ? 'Reserve' : category === 'beer' ? 'Premium' : ''} ${volume}`,
    photo1_base64: `/placeholder.svg?height=${300 + Math.floor(Math.random() * 100)}&width=${200 + Math.floor(Math.random() * 100)}`,
    prix_vente_groupe: price,
    promoPrice: originalPrice,
    prix_en_promo: hasDiscount ? "1" : "0",
    unite_full_name: volume,
    qtyByBox: category === 'beer' ? '24' : '6',
    category,
    brand,
    rating: (3 + Math.random() * 2).toFixed(1),
    countryFlag: category === 'wine' ? '🇫🇷' : category === 'beer' ? '🇳🇱' : '🇬🇧',
    country: category === 'wine' ? 'France' : category === 'beer' ? 'Netherlands' : 'United Kingdom'
  }
})

