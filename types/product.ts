export interface ProductProps {
  imageAlt?: any
  productId?: string
  id_product_mysql?: string // Unieke ID uit de database
  title: string // Naam van het product
  prix_vente_groupe: number // Standaard verkoopprijs
  photo1_base64?: string // Base64-gecodeerde afbeelding
  arcleunik: string // Unieke productcode
  productCode?: string // Extra productcode
  prix_en_promo?: number | null // Promotieprijs, kan null zijn
}
