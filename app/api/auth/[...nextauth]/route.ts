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
          console.warn("Geen credentials opgegeven")
          return null
        }

        const customerApiUrl = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
        const apiKey = process.env.NEXT_PUBLIC_API_KEY

        if (!customerApiUrl || !apiKey) {
          console.error("API URL of API Key ontbreekt in env")
          return null
        }

        const url = `${customerApiUrl}?apikey=${apiKey}&email=${credentials.email}`
        console.log("Authenticatie verzoek naar:", url)

        try {
          const response = await fetch(url)
          const data = await response.json()

          console.log("API respons ontvangen:", JSON.stringify(data, null, 2))

          if (data.success === "true" && Array.isArray(data.result.customer)) {
            const matchedCustomer = data.result.customer.find(
              (user: any) =>
                user.email === credentials.email &&
                user.password === credentials.password,
            )

            if (matchedCustomer) {
              console.log("Ingelogde klant:", matchedCustomer.email)

              return {
                id: String(matchedCustomer.clcleunik),
                clcleunik: String(matchedCustomer.clcleunik),
                email: matchedCustomer.email,
                name:
                  matchedCustomer.firstName && matchedCustomer.lastName
                    ? `${matchedCustomer.firstName} ${matchedCustomer.lastName}`
                    : matchedCustomer.denomination || matchedCustomer.customerNumber,
              }
            } else {
              console.warn("Geen klant gevonden met juiste wachtwoord")
            }
          }
        } catch (err) {
          console.error("Authenticatiefout:", err)
        }

        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.clcleunik = user.clcleunik
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id)
        session.user.clcleunik = String(token.clcleunik)
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV !== "production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }