import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import {
    Bell, LogOut, Menu, X, LayoutDashboard, FolderKanban,
    MessageSquare, Users, Star, ChevronDown, GraduationCap
} from 'lucide-react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { unreadCount } = useNotifications()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navLinks = user?.role === 'admin'
        ? [{ to: '/admin', icon: LayoutDashboard, label: 'Course Dashboard' }]
        : [
            { to: '/student', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/submit', icon: FolderKanban, label: 'Submission' },
            { to: '/review', icon: Star, label: 'Peer Review' },
            { to: '/collaborate', icon: Users, label: 'Groups' },
            { to: '/feedback', icon: MessageSquare, label: 'Results' },
        ]

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/'} className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center transition-transform group-hover:scale-105">
                            <GraduationCap size={20} className="text-white" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-gray-900 border-b-2 border-transparent group-hover:border-blue-600 transition-all">
                            PeerCollab
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    {user && (
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map(({ to, icon: Icon, label }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${isActive(to)
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right utilities */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {/* Notification Center */}
                                <Link to="/notifications" className="relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] flex items-center justify-center text-white font-black animate-pulse">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>

                                {/* User Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 pl-3 pr-2 py-1.5 border border-gray-200 rounded-full hover:border-blue-300 hover:shadow-sm transition-all"
                                    >
                                        <div className="w-7 h-7 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center text-[10px] font-black text-blue-700">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="hidden sm:block text-xs font-bold text-gray-700 mr-1">{user.name.split(' ')[0]}</span>
                                        <ChevronDown size={14} className="text-gray-400" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2 overflow-hidden animate-fade-in ring-4 ring-black/5 z-50">
                                            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                                                <p className="text-sm font-black text-gray-900">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">{user.role} Account</p>
                                            </div>
                                            <div className="p-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors text-left"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary py-2 px-5 text-sm">
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Open Mobile Menu */}
                        {user && (
                            <button className="lg:hidden p-2 text-gray-500 hover:text-blue-600" onClick={() => setMenuOpen(!menuOpen)}>
                                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {user && menuOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-up">
                        {navLinks.map(({ to, icon: Icon, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg mb-1 text-sm font-bold transition-all ${isActive(to) ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Backdrop click-out */}
            {profileOpen && <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setProfileOpen(false)} />}
        </nav>
    )
}
