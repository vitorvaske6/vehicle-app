import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { RegisterFormData, ApiRegisterResponse } from '@/typings/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiRegisterResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const { name, email, password, company }: RegisterFormData = req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company
      }
    })

    res.status(201).json({ success: true })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Erro interno no servidor'
    })
  }
}