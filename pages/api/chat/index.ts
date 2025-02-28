import { NextApiRequest, NextApiResponse } from 'next'
import { validateSession } from '../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await validateSession(req, res)

  if (!session?.user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method === 'POST') {
    await handlePOST(req, res)
  }

  return res.status(405).end()
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prompt = `
      using this type: {
        plate           String : plate number of the vehicle
        chassis         String : chassis number of the vehicle
        model           String : model and make of the vehicle
        color           String : color of the vehicle
        year            Int : year of the vehicle
        offenseDate     DateTime : date and time of the offense
        offenseType     String : type of offense
        lastSignal      String : last signal received from the vehicle
        incidentAddress String : where the vehicle was last seen
      }
      Convert the user message into a vehicle data object. Any unknown field should be blank.
      make sure your only response message is the vehicle data object.
    `

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "contents": [{
          "parts": [
            { "text": prompt, },
            { "text": req.body.message, }
          ]
        }]
      })
    })

    const _json = await response.json()
    const final = JSON.parse(_json.candidates[0].content.parts[0].text.replace(/```json\n|\n```\n/g, ''))
    console.log({ final })
    return res.status(201).json(final)
  } catch (error) {
    console.log(`error`, error)
    return res.status(500).json({ error: `Erro ao criar veículo: ${error}` })
  }
}