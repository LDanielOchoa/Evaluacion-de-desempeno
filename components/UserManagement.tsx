"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Plus } from "lucide-react"

interface User {
  CEDULA: number
  NOMBRE: string
  CARGO: string
  CENTRO_DE_COSTO: string
  LIDER_EVALUADOR: string
  CARGO_DE_LIDER_EVALUADOR: string
  ESTADO: string
  CLAVE: string
  SEGURIDAD: string
  LIDER: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/get_all_users")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      } else {
        console.error("Error fetching users:", data.error)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setSearchTerm(value)
    const filtered = users.filter(
      (user) =>
        user.NOMBRE.toLowerCase().includes(value) ||
        user.CEDULA.toString().includes(value) ||
        user.CARGO.toLowerCase().includes(value),
    )
    setFilteredUsers(filtered)
  }

  const handleAddUser = async (newUser: User) => {
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Usuario agregado",
          description: "El usuario ha sido agregado exitosamente.",
        })
        fetchUsers()
        setIsAddDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el usuario. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`https://evaluacion-de-desempeno.onrender.com/update_user/${updatedUser.CEDULA}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Usuario actualizado",
          description: "El usuario ha sido actualizado exitosamente.",
        })
        fetchUsers()
        setIsEditDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (cedula: number) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      try {
        const response = await fetch(`https://evaluacion-de-desempeno.onrender.com/delete_user/${cedula}`, {
          method: "DELETE",
        })
        const data = await response.json()
        if (data.success) {
          toast({
            title: "Usuario eliminado",
            description: "El usuario ha sido eliminado exitosamente.",
          })
          fetchUsers()
        } else {
          throw new Error(data.error)
        }
      } catch (error) {
        console.error("Error deleting user:", error)
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario. Por favor, intente nuevamente.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gestión de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Agregar Usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
              </DialogHeader>
              <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Centro de Costo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.CEDULA}>
                    <TableCell>{user.CEDULA}</TableCell>
                    <TableCell>{user.NOMBRE}</TableCell>
                    <TableCell>{user.CARGO}</TableCell>
                    <TableCell>{user.CENTRO_DE_COSTO}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentUser(user)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.CEDULA)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <UserForm user={currentUser} onSubmit={handleUpdateUser} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

interface UserFormProps {
  user?: User
  onSubmit: (user: User) => void
  onCancel: () => void
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<User>(
    user || {
      CEDULA: 0,
      NOMBRE: "",
      CARGO: "",
      CENTRO_DE_COSTO: "",
      LIDER_EVALUADOR: "",
      CARGO_DE_LIDER_EVALUADOR: "",
      ESTADO: "",
      CLAVE: "",
      SEGURIDAD: "",
      LIDER: "",
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="CEDULA"
        value={formData.CEDULA}
        onChange={handleChange}
        placeholder="Cédula"
        type="number"
        required
      />
      <Input name="NOMBRE" value={formData.NOMBRE} onChange={handleChange} placeholder="Nombre" required />
      <Input name="CARGO" value={formData.CARGO} onChange={handleChange} placeholder="Cargo" required />
      <Input
        name="CENTRO_DE_COSTO"
        value={formData.CENTRO_DE_COSTO}
        onChange={handleChange}
        placeholder="Centro de Costo"
        required
      />
      <Input
        name="LIDER_EVALUADOR"
        value={formData.LIDER_EVALUADOR}
        onChange={handleChange}
        placeholder="Líder Evaluador"
      />
      <Input
        name="CARGO_DE_LIDER_EVALUADOR"
        value={formData.CARGO_DE_LIDER_EVALUADOR}
        onChange={handleChange}
        placeholder="Cargo de Líder Evaluador"
      />
      <Input name="ESTADO" value={formData.ESTADO} onChange={handleChange} placeholder="Estado" />
      <Input name="CLAVE" value={formData.CLAVE} onChange={handleChange} placeholder="Clave" type="password" />
      <Input name="SEGURIDAD" value={formData.SEGURIDAD} onChange={handleChange} placeholder="Seguridad" />
      <Input name="LIDER" value={formData.LIDER} onChange={handleChange} placeholder="Líder" />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar</Button>
      </div>
    </form>
  )
}

