import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get API URL and key from environment variables
          const customerApiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
          const apiKey = process.env.NEXT_PUBLIC_API_KEY

          if (!customerApiUrl || !apiKey) {
            console.error("Customer API URL or API Key is not defined")
            return null
          }

          // Construct the URL for customer endpoint
          const url = `${customerApiUrl}?apikey=${apiKey}&email=${credentials.email}`
          console.log("Auth API URL:", url) // Debug log

          const response = await fetch(url)
          const data = await response.json()

          if (data.success === "true" && data.result.customer && data.result.customer.length > 0) {
            const customer = data.result.customer.find(
              (user: any) => user.email === credentials.email && user.password === credentials.password,
            )

            if (customer) {
              // Return user with the required properties
              return {
                id: customer.clcleunik.toString(),
                clcleunik: customer.clcleunik.toString(), // Store the customer ID here
                email: customer.email,
                name:
                  customer.firstName && customer.lastName
                    ? `${customer.firstName} ${customer.lastName}`
                    : customer.denomination || customer.customerNumber,
              }
            }
          }
        } catch (error) {
          console.error("Authentication error:", error)
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Safely assign clcleunik if it exists
        if (user.clcleunik) {
          token.clcleunik = String(user.clcleunik)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id)
        // Safely assign clcleunik if it exists
        if (token.clcleunik) {
          session.user.clcleunik = String(token.clcleunik)
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  // Add debug mode to help troubleshoot issues
  debug: process.env.NODE_ENV !== "production",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

