"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { deleteUser } from "@/store/slices/usersSlice"
import type { AppDispatch } from "@/store/store"
import type { User } from "@/types/user"

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export function DeleteConfirmDialog({ isOpen, onClose, user }: DeleteConfirmDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return

    setLoading(true)
    try {
      await dispatch(deleteUser(user.id))
      onClose()
    } catch (error) {
      console.error("Error deleting user:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                This action cannot be undone. Are you sure you want to delete this user?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.first_name} ${user.last_name}`} />
              <AvatarFallback>
                {user.first_name[0]}
                {user.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent" disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} className="flex-1" disabled={loading}>
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete User"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
