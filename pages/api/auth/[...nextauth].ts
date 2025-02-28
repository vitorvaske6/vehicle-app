import NextAuth, { getServerSession, NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { Session, User } from "@/typings/types"
import { NextApiRequest, NextApiResponse } from "next"
import { Session as NextAuthSession } from 'next-auth';

interface ExtendedSession extends Session {
  user?: User
}

interface ExtendedJWT extends Record<string, unknown> {
  sub?: string
  jti?: string
  exp?: number
}


export async function validateSession(req: NextApiRequest, res: NextApiResponse): Promise<NextAuthSession | null> {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    return null
  }
  else {
    return session
  }
}


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            company: user.company
          } as User
        }

        return null
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }: { session: ExtendedSession; token: ExtendedJWT }) {
      if (token?.sub) {
        session.user = {
          id: token.sub,
          email: token.email,
          name: token.name,
          company: token.company
        } as User
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    }
  }
}

export default NextAuth(authOptions)