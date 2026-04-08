import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function Login() {
    const { login, loading, error, setError } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [validationError, setValidationError] = useState('')

    const validateForm = () => {
        if (!email) {
            setValidationError('Email is required')
            return false
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setValidationError('Please enter a valid email address')
            return false
        }
        if (!password) {
            setValidationError('Password is required')
            return false
        }
        if (password.length < 6) {
            setValidationError('Password must be at least 6 characters')
            return false
        }
        setValidationError('')
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        const result = await login(email, password)
        if (result.success) navigate(result.role === 'admin' ? '/admin' : '/student')
    }

    const fillDemo = (type) => {
        setError('')
        setValidationError('')
        if (type === 'admin') { setEmail('admin@univ.edu'); setPassword('admin123') }
        else { setEmail('alex@student.edu'); setPassword('student123') }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4 shadow-sm">
                        <Star size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
                    <p className="text-gray-600 mt-1">Access PeerCollab Platform</p>
                </div>

                {/* Demo Quick Fill */}
                <div className="card p-4 mb-6 bg-blue-50 border-blue-100">
                    <p className="text-xs text-blue-700 mb-3 font-semibold uppercase tracking-wider text-center">Quick Login (Demo)</p>
                    <div className="flex gap-2">
                        <button onClick={() => fillDemo('admin')} className="flex-1 bg-white border border-blue-200 py-2 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                            Admin Account
                        </button>
                        <button onClick={() => fillDemo('student')} className="flex-1 bg-white border border-blue-200 py-2 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium">
                            Student Account
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => {setEmail(e.target.value); setValidationError('')}}
                                placeholder="name@university.edu"
                                className="input pl-10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => {setPassword(e.target.value); setValidationError('')}}
                                placeholder="••••••••"
                                className="input pl-10 pr-10"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {(error || validationError) && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            <AlertCircle size={16} /> {validationError || error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
