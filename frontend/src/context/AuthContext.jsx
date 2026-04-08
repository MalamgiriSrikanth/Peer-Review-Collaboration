import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { usersAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const login = useCallback(async (email, password) => {
        setLoading(true)
        setError('')
        try {
            const res = await usersAPI.login({ email, password })
            if (res.success) {
                setUser(res.user)
                setLoading(false)
                return { success: true, role: res.user.role }
            } else {
                setError(res.message || 'Login failed')
                setLoading(false)
                return { success: false }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
            setLoading(false)
            return { success: false }
        }
    }, [])

    const register = useCallback(async (name, email, password, role) => {
        setLoading(true)
        setError('')
        try {
            const res = await usersAPI.register({ name, email, password, role })
            if (res.success) {
                setLoading(false)
                return { success: true }
            } else {
                setError(res.message || 'Registration failed')
                setLoading(false)
                return { success: false }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
            setLoading(false)
            return { success: false }
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setError('')
    }, [])

    const value = useMemo(() => ({
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError
    }), [user, loading, error, login, register, logout])

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
