import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

export const dynamic = "force-dynamic"

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
            return null
          }

          // Construct the URL for customer endpoint
          const url = `${customerApiUrl}?apikey=${apiKey}&email=${credentials.email}`

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
          // Authentication error
        }

        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // Ensure clcleunik is stored in the token
        if (user.clcleunik) {
          token.clcleunik = String(user.clcleunik)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id)
        // Ensure clcleunik is available in the session
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
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

