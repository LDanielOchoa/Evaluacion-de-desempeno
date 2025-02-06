"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Pencil, Trash2, Search, UserPlus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="relative w-full max-w-md">
          <Input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-12 pr-4 py-3 border-2 border-green-300 rounded-full focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 transition duration-300 text-lg"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 h-6 w-6" />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 text-lg">
              <UserPlus className="mr-2 h-6 w-6" /> Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Agregar Nuevo Usuario
              </DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleAddUser} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </motion.div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto rounded-2xl shadow-lg"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100 dark:bg-green-800">
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Avatar</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Cédula</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Nombre</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Cargo</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Centro de Costo</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Estado</TableHead>
                <TableHead className="font-bold text-lg text-green-800 dark:text-green-200">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.CEDULA}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-green-50 dark:hover:bg-green-700 transition-colors duration-200"
                  >
                    <TableCell>
                      <Avatar className="h-12 w-12 border-2 border-green-500">
                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.NOMBRE}`} />
                        <AvatarFallback className="bg-green-200 text-green-800 font-bold">
                          {user.NOMBRE.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.CEDULA}</TableCell>
                    <TableCell className="font-medium">{user.NOMBRE}</TableCell>
                    <TableCell>{user.CARGO}</TableCell>
                    <TableCell>{user.CENTRO_DE_COSTO}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.ESTADO === "Activo" ? "success" : "secondary"}
                        className="text-sm font-semibold px-3 py-1 rounded-full"
                      >
                        {user.ESTADO}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentUser(user)
                            setIsEditDialogOpen(true)
                          }}
                          className="text-green-600 hover:text-green-800 hover:bg-green-100 transition-colors duration-200"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.CEDULA)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </motion.div>
      )}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">Editar Usuario</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <UserForm user={currentUser} onSubmit={handleUpdateUser} onCancel={() => setIsEditDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
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
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="NOMBRE"
        value={formData.NOMBRE}
        onChange={handleChange}
        placeholder="Nombre"
        required
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="CARGO"
        value={formData.CARGO}
        onChange={handleChange}
        placeholder="Cargo"
        required
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="CENTRO_DE_COSTO"
        value={formData.CENTRO_DE_COSTO}
        onChange={handleChange}
        placeholder="Centro de Costo"
        required
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="LIDER_EVALUADOR"
        value={formData.LIDER_EVALUADOR}
        onChange={handleChange}
        placeholder="Líder Evaluador"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="CARGO_DE_LIDER_EVALUADOR"
        value={formData.CARGO_DE_LIDER_EVALUADOR}
        onChange={handleChange}
        placeholder="Cargo de Líder Evaluador"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="ESTADO"
        value={formData.ESTADO}
        onChange={handleChange}
        placeholder="Estado"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="CLAVE"
        value={formData.CLAVE}
        onChange={handleChange}
        placeholder="Clave"
        type="password"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="SEGURIDAD"
        value={formData.SEGURIDAD}
        onChange={handleChange}
        placeholder="Seguridad"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <Input
        name="LIDER"
        value={formData.LIDER}
        onChange={handleChange}
        placeholder="Líder"
        className="border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-md"
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="hover:bg-green-100 transition-colors duration-200"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold transition duration-300 ease-in-out transform hover:scale-105"
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}

