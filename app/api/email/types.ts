export interface EmailFormData {
  naam: string
  email: string
  telefoon?: string
  bestelnummer: string
  aankoopdatum: string
  productnaam: string
  aantal: string
  redenVanRetour: string
  andereReden?: string
  opmerkingen?: string
  files?: File[]
}
