import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'
import { VehicleFormData } from '@/typings/types'
import { validateSession } from './auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await validateSession(req, res)
  console.log(`session`, session)
  if (!session?.user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method === 'POST') {
    try {
      const data: VehicleFormData = JSON.parse(req.body)
      console.log('teste?', {
        ...data,
        year: parseInt(data.year),
        offenseDate: new Date(data.offenseDate),
        userId: session.user.id,
        company: session.user.company || ''
      })
      const vehicle = await prisma.vehicle.create({
        data: {
          ...data,
          year: parseInt(data.year),
          offenseDate: new Date(data.offenseDate),
          userId: session.user.id,
          company: session.user.company || ''
        }
      })

      return res.status(201).json(vehicle)
    } catch (error) {
      console.log(`error`, error)
      return res.status(500).json({ error: `Erro ao criar veículo: ${error}` })
    }
  }

  return res.status(405).end()
}