import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import ProjectSubmission from './pages/ProjectSubmission'
import PeerReview from './pages/PeerReview'
import Feedback from './pages/Feedback'
import CollaborationRoom from './pages/CollaborationRoom'
import Notifications from './pages/Notifications'

// Role-Based Route Guard
function ProtectedRoute({ children, requiredRole }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" replace />
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
    }
    return children
}

function AppRoutes() {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace /> : <Register />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
            <Route path="/submit" element={<ProtectedRoute requiredRole="student"><ProjectSubmission /></ProtectedRoute>} />
            <Route path="/review/:projectId" element={<ProtectedRoute requiredRole="student"><PeerReview /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute requiredRole="student"><PeerReview /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/collaborate" element={<ProtectedRoute><CollaborationRoom /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    )
}
