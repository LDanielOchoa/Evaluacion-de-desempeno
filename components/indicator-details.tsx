import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription } from "@/components/ui/card"

interface IndicatorDetailsProps {
  isOpen: boolean
  onClose: () => void
  data: any
  title: string
}

export function IndicatorDetails({ isOpen, onClose, data, title }: IndicatorDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent>
            <CardDescription>Detalles del indicador</CardDescription>
            <pre className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

