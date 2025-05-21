import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return ""

  try {
    // Try to parse the date string
    const date = new Date(dateString)

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      // If the date is invalid, try to parse it manually
      // This handles formats like "DD-MM-YYYY" or "DD/MM/YYYY"
      const parts = dateString.split(/[-/.]/)
      if (parts.length === 3) {
        // Try different date formats
        // First try DD-MM-YYYY format
        const day = Number.parseInt(parts[0], 10)
        const month = Number.parseInt(parts[1], 10) - 1 // Months are 0-indexed in JS
        const year = Number.parseInt(parts[2], 10)

        const parsedDate = new Date(year, month, day)
        if (!isNaN(parsedDate.getTime())) {
          return new Intl.DateTimeFormat("nl-NL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(parsedDate)
        }
      }

      // If we couldn't parse the date, return the original string
      return dateString
    }

    // If the date is valid, format it
    return new Intl.DateTimeFormat("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    // Return the original string if there's an error
    return dateString
  }
}

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "€0,00"

  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}
