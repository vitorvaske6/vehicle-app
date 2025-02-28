// pages/profile/sessions.tsx
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

const SessionList = () => {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch(`/api/sessions`)
      const data = await response.json()
      setSessions(data)
    }
    fetchSessions()
  }, [])

  return (
    <div>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>IP: {session.ipAddress}</p>
          <p>Device: {session.userAgent}</p>
          <p>Last Active: {new Date(session.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

export default SessionList