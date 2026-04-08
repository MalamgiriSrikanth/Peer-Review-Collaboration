import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ProjectCard from '../components/ProjectCard'
import { useAuth } from '../context/AuthContext'
import { statsAPI, projectsAPI } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Star, MessageSquare, Users, Plus, Layout } from 'lucide-react'

function StatCard({ icon: Icon, label, value, colorClass }) {
    return (
        <div className="card p-5 bg-white">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    )
}

export default function StudentDashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [myProjects, setMyProjects] = useState([])
    const [pendingReviews, setPendingReviews] = useState([])

    useEffect(() => {
        statsAPI.getStudentStats(user?.id).then(r => setStats(r.data))
        projectsAPI.getAll().then(r => {
            setMyProjects(r.data.filter(p => p.authorId === user?.id))
            setPendingReviews(r.data.filter(p => p.authorId !== user?.id && p.reviewCount < p.maxReviews))
        })
    }, [user])

    return (
        <DashboardLayout 
            title={`Welcome back, ${user?.name?.split(' ')[0]}!`} 
            subtitle="Manage your projects and review assignments here."
        >
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={FolderKanban} label="Projects" value={stats.submitted} colorClass="bg-blue-100 text-blue-600" />
                    <StatCard icon={Star} label="Done Reviews" value={stats.reviewsDone} colorClass="bg-green-100 text-green-600" />
                    <StatCard icon={MessageSquare} label="Feedback" value={stats.reviewsReceived} colorClass="bg-orange-100 text-orange-600" />
                    <StatCard icon={Users} label="Collabs" value={stats.collaborations} colorClass="bg-purple-100 text-purple-600" />
                </div>
            )}

            {/* Quick Navigation */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 mb-10 overflow-x-auto">
                <div className="flex items-center min-w-max gap-4 px-2">
                    <p className="text-xs font-bold text-gray-400 uppercase mr-4">Quick Links:</p>
                    {[
                        { label: 'Submit New Project', icon: Plus, to: '/submit', color: 'text-blue-600 hover:bg-blue-50' },
                        { label: 'Start Peer Review', icon: Star, to: '/review', color: 'text-green-600 hover:bg-green-50' },
                        { label: 'View Feedback', icon: MessageSquare, to: '/feedback', color: 'text-orange-600 hover:bg-orange-50' },
                        { label: 'Collaboration Rooms', icon: Layout, to: '/collaborate', color: 'text-indigo-600 hover:bg-indigo-50' },
                    ].map(({ label, icon: Icon, to, color }) => (
                        <button
                            key={label}
                            onClick={() => navigate(to)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${color}`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* My Projects */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Your Project Submissions</h2>
                        <button onClick={() => navigate('/submit')} className="btn-primary text-sm flex items-center gap-2">
                            <Plus size={16} /> New Submission
                        </button>
                    </div>
                    {myProjects.length > 0 ? (
                        <div className="space-y-4">
                            {myProjects.map(p => <ProjectCard key={p.id} project={p} />)}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <FolderKanban size={48} className="text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                            <p className="text-gray-500 mb-6">Start by submitting your first academic project for review.</p>
                            <button onClick={() => navigate('/submit')} className="btn-primary">Submit a Project</button>
                        </div>
                    )}
                </div>

                {/* To Review Side Panel */}
                <div className="space-y-8">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Waitlist for Review</h3>
                            <span className="badge-yellow text-[10px]">{pendingReviews.length} Assigned</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {pendingReviews.length > 0 ? (
                                pendingReviews.slice(0, 5).map(p => (
                                    <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/review/${p.id}`)}>
                                        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">{p.title}</h4>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-gray-500">By {p.author}</span>
                                            <span className="text-[10px] text-blue-600 font-medium">Review Now →</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-10 text-center">
                                    <Star size={32} className="text-gray-200 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No pending reviews.</p>
                                </div>
                            )}
                        </div>
                        {pendingReviews.length > 0 && (
                            <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                                <button onClick={() => navigate('/review')} className="text-xs text-blue-600 font-bold hover:underline">
                                    View All Assigned Work
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card p-5 bg-blue-600 text-white shadow-md">
                        <h4 className="font-bold mb-2">Academic Reminder</h4>
                        <p className="text-xs opacity-90 leading-relaxed">
                            Remember to provide constructive feedback focused on project criteria. Be polite and specific.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
