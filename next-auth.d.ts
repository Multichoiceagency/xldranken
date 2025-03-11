import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Unieke klant-ID */
      id?: string | number;
      /** Extra veld: klant unieke sleutel */
      clcleunik?: string | number;
      /** Extra veld: login */
      login?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    /** Unieke klant-ID */
    clcleunik?: string | number;
    /** Extra veld: login */
    login?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string | number;
    clcleunik?: string | number;
    login?: string;
  }
}
