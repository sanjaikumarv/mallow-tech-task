"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { loginUser } from "@/store/slices/authSlice"
import type { RootState, AppDispatch } from "@/store/store"

export default function LoginPage() {
    const [email, setEmail] = useState("eve.holt@reqres.in")
    const [password, setPassword] = useState("cityslicka")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { loading, error, token } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (token) {
            router.push("/users")
        }
    }, [token, router])

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {}

        if (!email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid"
        }

        if (!password) {
            newErrors.password = "Password is required"
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return
        dispatch(loginUser({ email, password }))
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-sm shadow-lg border-0">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="eve.holt@reqres.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-10 h-12 bg-gray-50 border-gray-200 ${errors.email ? "border-red-500" : ""}`}
                                />
                                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`pl-10 pr-10 h-12 bg-gray-50 border-gray-200 ${errors.password ? "border-red-500" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Log in"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
