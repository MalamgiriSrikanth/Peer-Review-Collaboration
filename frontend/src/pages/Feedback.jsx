import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { reviewsAPI, projectsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Star, MessageSquare, Calendar, BarChart2, User, ChevronRight } from 'lucide-react'

function StarDisplay({ value }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={14} className={n <= value ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200'} />
            ))}
        </div>
    )
}

const CRITERIA_LABELS = { technical: 'Tech Skills', documentation: 'Project Brief', creativity: 'Originality', presentation: 'Final UI' }

export default function Feedback() {
    const { user } = useAuth()
    const [reviews, setReviews] = useState([])
    const [projects, setProjects] = useState([])
    const [tab, setTab] = useState('received')

    useEffect(() => {
        reviewsAPI.getAll().then(r => setReviews(r.data))
        projectsAPI.getAll().then(r => setProjects(r.data))
    }, [])

    const myProjectIds = projects.filter(p => p.authorId === user?.id).map(p => p.id)
    const received = reviews.filter(r => myProjectIds.includes(r.projectId))
    const given = reviews.filter(r => r.reviewerId === user?.id)

    const avgRating = received.length > 0
        ? (received.reduce((s, r) => s + r.rating, 0) / received.length).toFixed(1)
        : '0.0'

    const displayed = tab === 'received' ? received : given

    return (
        <DashboardLayout title="Performance Results" subtitle="Detailed breakdown of peer evaluations and scores.">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Received', value: received.length, icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Published', value: given.length, icon: Star, color: 'bg-green-100 text-green-600' },
                    { label: 'GPA Equivalent', value: avgRating, icon: BarChart2, color: 'bg-purple-100 text-purple-600' },
                    { label: 'Projects', value: myProjectIds.length, icon: User, color: 'bg-orange-100 text-orange-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card p-5 bg-white flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                            <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                <button
                    onClick={() => setTab('received')}
                    className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[2px] ${tab === 'received' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Received Reviews ({received.length})
                </button>
                <button
                    onClick={() => setTab('given')}
                    className={`px-6 py-4 text-sm font-bold transition-all border-b-2 -mb-[2px] ${tab === 'given' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                    Authored Reviews ({given.length})
                </button>
            </div>

            {/* Review List */}
            {displayed.length > 0 ? (
                <div className="space-y-6">
                    {displayed.map(review => {
                        const project = projects.find(p => p.id === review.projectId)
                        return (
                            <div key={review.id} className="card bg-white shadow-sm overflow-hidden border border-gray-200">
                                <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded border border-gray-200 shadow-sm">
                                            <MessageSquare size={18} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{project?.title || 'Unknown Project'}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                {tab === 'received' ? `Reviewer: ${review.reviewer}` : `Project Author: ${project?.author}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                                        <StarDisplay value={review.rating} />
                                        <span className="text-sm font-black text-gray-900">{review.rating}.0</span>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="mb-8">
                                        <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                            <ChevronRight size={14} className="text-blue-500" /> Professional Feedback
                                        </p>
                                        <p className="text-gray-700 leading-relaxed italic border-l-4 border-gray-100 pl-4 py-1">
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    {review.criteriaScores && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(review.criteriaScores).map(([key, val]) => (
                                                <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 truncate">{CRITERIA_LABELS[key] || key}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-lg font-black text-gray-900">{val}</span>
                                                        <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-8 pt-6 border-t border-gray-50 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                        <Calendar size={12} /> Date Logged: {review.submittedAt || 'Apr 7, 2026'}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="card p-20 bg-white text-center border-dashed border-gray-200">
                    <MessageSquare size={48} className="text-gray-100 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-1">No Activity Found</h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto">Results will appear here once peer evaluations are processed.</p>
                </div>
            )}
        </DashboardLayout>
    )
}
