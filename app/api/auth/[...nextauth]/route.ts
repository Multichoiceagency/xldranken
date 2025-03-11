import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export const authOptions: NextAuthOptions = {
  // Gebruik de JWT_SECRET als geheime sleutel voor het ondertekenen van tokens.
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mailadres", type: "email" },
        password: { label: "Wachtwoord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Geen inloggegevens verstrekt");
        }
        const email = credentials.email;
        const password = credentials.password;

        // Bouw de URL voor de MegaWin Customer List API
        // Let op: in je .env staat API_URL_CUSTOMER=https://api.megawin.be/CUSTOMER/
        const apiUrl = `${process.env.API_URL_CUSTOMER}LIST/`;

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: { "API_KEY": process.env.API_KEY || "" },
        });

        if (!res.ok) {
          throw new Error("Fout bij het ophalen van de klantenlijst");
        }
        const data = await res.json();
        if (!data.success) {
          throw new Error("Klantenlijst ophalen mislukt");
        }
        const customers = data.result.customer || [];

        // Zoek naar een klant met overeenkomende inloggegevens
        const foundCustomer = customers.find((customer: any) =>
          customer.email.toLowerCase() === email.toLowerCase() &&
          customer.password === password
        );
        return foundCustomer || null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: { secret: process.env.JWT_SECRET },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Gebruik fallback zodat deze velden nooit undefined worden.
        token.id = user.clcleunik ?? "";
        token.email = user.email ?? "";
        token.login = user.login ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        login: token.login,
      };
      return session;
    },
  },
  pages: { signIn: "/login" },
  debug: false,
};

const authHandler = NextAuth(authOptions);

export async function POST(request: Request) {
  // Gebruik een basis-URL voor de URL-constructie; zorg ervoor dat NEXTAUTH_URL is ingesteld in je .env
  const url = new URL(request.url, process.env.NEXTAUTH_URL || "http://localhost:3000");
  const contentType = request.headers.get("content-type") || "";
  
  // Als het pad '_log' bevat of als de content-type niet application/json is,
  // retourneer dan direct een lege JSON-respons om parsingfouten te voorkomen.
  if (url.pathname.includes("/_log") || !contentType.includes("application/json")) {
    return new NextResponse("{}", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  return authHandler(request);
}

export { authHandler as GET };
