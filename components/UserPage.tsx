"use client"
import { useEffect, useState, useMemo, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Search, Grid, List, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { fetchUsers } from "@/store/slices/usersSlice"
import type { RootState, AppDispatch } from "@/store/store"
import { UserModal } from "@/components/user-modal"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import type { User as UserType } from "@/types/user"

const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
))

export default function UserPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { users, loading, error } = useSelector((state: RootState) => state.users)
  const token = useSelector((state: RootState) => state.auth.token)

  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null)

  const usersPerPage = 5

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    const lowerSearchTerm = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(lowerSearchTerm) ||
        user.last_name.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm),
    )
  }, [users, searchTerm])

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
    const startIndex = (currentPage - 1) * usersPerPage
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)
    return { totalPages, paginatedUsers }
  }, [filteredUsers, currentPage, usersPerPage])

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    dispatch(fetchUsers())
  }, [dispatch, token, router])

  if (loading) {
    return <LoadingSpinner />
  }

  const { totalPages, paginatedUsers } = paginationData


  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
    dispatch({ type: "auth/logout" })
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="input search text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10 w-64 bg-white"
              />
            </div>
            <Button onClick={() => {
              setIsModalOpen(true)
            }} className="bg-blue-500 hover:bg-blue-600">
              Create User
            </Button>
            <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Logout
            </Button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center space-x-2"
          >
            <List className="h-4 w-4" />
            <span>Table</span>
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("card")}
            className="flex items-center space-x-2"
          >
            <Grid className="h-4 w-4" />
            <span>Card</span>
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">First Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Last Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                              alt={`${user.first_name} ${user.last_name}`}
                            />
                            <AvatarFallback>
                              {user.first_name[0]}
                              {user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-blue-500 hover:text-blue-700 cursor-pointer">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">{user.first_name}</td>
                      <td className="px-6 py-4 text-gray-900">{user.last_name}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingUser(user)
                              setIsModalOpen(true)
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeletingUser(user)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Card View (keeping original for when toggled) */}
        {viewMode === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback>
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => () => {
                    setEditingUser(user)
                    setIsModalOpen(true)
                  }} className="flex-1">
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeletingUser(user)} className="flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center space-x-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {paginatedUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding a new user."}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        user={editingUser}
      />

      <DeleteConfirmDialog isOpen={!!deletingUser} onClose={() => setDeletingUser(null)} user={deletingUser} />
    </div>
  )
}
