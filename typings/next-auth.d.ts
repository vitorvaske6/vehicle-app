/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, Session } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User
    session: Session
  }
}