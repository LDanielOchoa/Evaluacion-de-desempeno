"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { UserData } from "../types/evaluation"

interface UserContextType {
  userData: UserData | null
  setUserData: (data: UserData | null) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null)

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

