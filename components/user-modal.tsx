"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { UserIcon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createUser, updateUser } from "@/store/slices/usersSlice"
import type { AppDispatch } from "@/store/store"
import type { User } from "@/types/user"

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
      })
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        avatar: "",
      })
    }
    setErrors({})
  }, [user, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required"
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      if (user) {
        await dispatch(updateUser({ id: user.id, userData: formData }))
      } else {
        await dispatch(createUser(formData))
      }
      onClose()
    } catch (error) {
      console.error("Error saving user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={formData.avatar || "/placeholder.svg?height=80&width=80&query=user+avatar"}
                alt="User avatar"
              />
              <AvatarFallback>
                {formData.first_name[0]}
                {formData.last_name[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatar}
              onChange={(e) => handleInputChange("avatar", e.target.value)}
            />
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
                className={`pl-10 ${errors.first_name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className={`pl-10 ${errors.last_name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{user ? "Updating..." : "Creating..."}</span>
                </div>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
