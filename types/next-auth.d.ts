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
}

declare module "next-auth/jwt" {
  interface JWT {
    clcleunik: string // Use clcleunik instead of customerNumber
  }
}

