"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "../app/contexts/userContexts"
import { LeaderEvaluationView } from "./leader-evaluation-leader"

export function PostLoginView() {
  const router = useRouter()
  const { userData } = useUser()

  const isDirectorOrCoordinador = userData?.CARGO.startsWith("DIRECTOR") || userData?.CARGO.startsWith("COORDINADOR")

  useEffect(() => {
    if (!isDirectorOrCoordinador) {
      router.push("/formulario")
    }
  }, [isDirectorOrCoordinador, router])

  if (!isDirectorOrCoordinador) {
    return null
  }

  return <LeaderEvaluationView />
}

