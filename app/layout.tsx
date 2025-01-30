import { UserProvider } from "./contexts/userContexts"
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Evaluación de desempeño',
  description: 'Desempeño administrativo personal',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  )
}

