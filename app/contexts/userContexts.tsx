"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { UserData } from "../types/evaluation"

interface User {
  CEDULA: number
  NOMBRE: string
  CARGO: string
  CENTRO_DE_COSTO: string
  LIDER_EVALUADOR: string
  CARGO_DE_LIDER_EVALUADOR: string
  ESTADO: string
  ANO_INGRESO: number
  MES_INGRESO: number
  ANOS: number
  ANTIGUEDAD: number
}

interface UserContextType {
  userData: UserData | null
  setUserData: (data: UserData | null) => void
  user: User | null
  setUser: (user: User | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [user, setUser] = useState<User | null>(null)

  return (
    <UserContext.Provider value={{ userData, setUserData, user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
