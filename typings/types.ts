export interface User {
  id: string
  name?: string | null
  email?: string | null
  password: string
  image?: string | null
  company?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  plate: string
  chassis: string
  model: string
  color: string
  year: number
  offenseDate: Date
  offenseType: string
  lastSignal: string
  incidentAddress: string
  userId: string
  company: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface DashboardProps {
  stats: {
    totalVehicles: number
    todaysVehicles: number
    offenseDistribution: Array<{
      type: string
      count: number
    }>
    dailyActivity: Array<{
      day: Date
      count: number
    }>
  }
}

export type VehicleFormData = {
  plate: string
  chassis: string
  model: string
  color: string
  year: string
  offenseDate: string
  offenseType: string
  lastSignal: string
  incidentAddress: string
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  company: string;
}

export interface ApiRegisterResponse {
  success: boolean;
  error?: string;
}

export interface RegistrationError {
  message: string;
}