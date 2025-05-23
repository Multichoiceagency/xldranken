// Helper functions for address management with the updated API

export interface CustomerAddress {
  // Main address (factuuradres)
  adresse?: string
  cp?: string
  ville?: string
  nom?: string

  // Delivery address (bezorgadres)
  adresse_livraison?: string
  cp_livraison?: string
  ville_livraison?: string
}

export interface Address {
  id: string
  type: "Factuuradres" | "Bezorgadres"
  name: string
  street: string
  postal: string
  city: string
  isDefault?: boolean
}

// Extract addresses from customer data based on the actual API structure
export function extractAddressesFromCustomer(customerData: any): Address[] {
  const addresses: Address[] = []

  // Get customer name
  const customerName = customerData.nom || customerData.name || customerData.company_name || "Onbekend"

  // Extract main address (factuuradres)
  if (customerData.adresse) {
    addresses.push({
      id: "billing",
      type: "Factuuradres",
      name: customerName,
      street: customerData.adresse,
      postal: customerData.cp || "",
      city: customerData.ville || "",
      isDefault: true,
    })
  }

  // Extract delivery address if different (bezorgadres)
  if (customerData.adresse_livraison && customerData.adresse_livraison !== customerData.adresse) {
    addresses.push({
      id: "shipping",
      type: "Bezorgadres",
      name: customerName,
      street: customerData.adresse_livraison,
      postal: customerData.cp_livraison || customerData.cp || "",
      city: customerData.ville_livraison || customerData.ville || "",
      isDefault: false,
    })
  }

  return addresses
}

// Convert address to customer data format for API updates
export function addressToCustomerData(address: Address): Partial<CustomerAddress> {
  if (address.type === "Factuuradres") {
    return {
      adresse: address.street,
      cp: address.postal,
      ville: address.city,
      nom: address.name,
    }
  } else {
    return {
      adresse_livraison: address.street,
      cp_livraison: address.postal,
      ville_livraison: address.city,
    }
  }
}

// Create empty address data for deletion
export function createEmptyAddressData(addressType: "Factuuradres" | "Bezorgadres"): Partial<CustomerAddress> {
  if (addressType === "Factuuradres") {
    return {
      adresse: "",
      cp: "",
      ville: "",
    }
  } else {
    return {
      adresse_livraison: "",
      cp_livraison: "",
      ville_livraison: "",
    }
  }
}
