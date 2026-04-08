import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Star, Mail, Lock, User, AlertCircle, Eye, EyeOff, GraduationCap, BookOpen } from 'lucide-react'

export default function Register() {
    const { register, loading, error, setError } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' })
    const [showPass, setShowPass] = useState(false)
    const [validationError, setValidationError] = useState('')

    const setField = (field) => (e) => { 
        setError('')
        setValidationError('')
        setForm(prev => ({ ...prev, [field]: e.target.value })) 
    }

    const validateForm = () => {
        if (!form.name || form.name.length < 3) {
            setValidationError('Full name must be at least 3 characters')
            return false
        }
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
            setValidationError('Please enter a valid email address')
            return false
        }
        if (!form.password || form.password.length < 6) {
            setValidationError('Password must be at least 6 characters')
            return false
        }
        if (form.password !== form.confirm) {
            setValidationError('Passwords do not match')
            return false
        }
        setValidationError('')
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        const result = await register(form.name, form.email, form.password, form.role)
        if (result.success) navigate(result.role === 'admin' ? '/admin' : '/student')
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4 shadow-sm">
                        <Star size={24} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
                    <p className="text-gray-600 mt-1">Join the PeerCollab Platform</p>
                </div>

                <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label className="label">I am registering as a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Submit work' },
                                { value: 'admin', label: 'Teacher', icon: BookOpen, desc: 'Manage' },
                            ].map(({ value, label, icon: Icon, desc }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => { setForm(prev => ({ ...prev, role: value })); setValidationError('') }}
                                    className={`p-3 rounded-lg border text-left transition-all ${form.role === value
                                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={18} className={form.role === value ? 'text-blue-600 mb-1' : 'text-gray-400 mb-1'} />
                                    <p className="text-sm">{label}</p>
                                    <p className="text-[10px] opacity-70 font-normal">{desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="label">Full Name</label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={form.name} onChange={setField('name')} placeholder="Enter your name" className="input pl-10" />
                        </div>
                    </div>

                    <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" value={form.email} onChange={setField('email')} placeholder="name@university.edu" className="input pl-10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={setField('password')}
                                    placeholder="••••••••"
                                    className="input pl-10 pr-10"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="label">Confirm</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="password" value={form.confirm} onChange={setField('confirm')} placeholder="••••••••" className="input pl-10" />
                            </div>
                        </div>
                    </div>

                    {(error || validationError) && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            <AlertCircle size={16} /> {validationError || error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
