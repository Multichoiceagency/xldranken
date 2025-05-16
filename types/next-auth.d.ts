import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      clcleunik: string // Use clcleunik instead of customerNumber
      email: string
      name?: string | null
    }
  }

  // Add User interface to ensure clcleunik is included in the user object
  interface User {
    id: string
    clcleunik: string
    email: string
    name?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    clcleunik: string // Use clcleunik instead of customerNumber
  }
}

