"use client"

import { useUser } from "../app/contexts/userContexts"
import { LeaderEvaluationView } from "./leader-evaluation-leader"

export function PostLoginView() {
  const { userData } = useUser()

  return <LeaderEvaluationView />
}

