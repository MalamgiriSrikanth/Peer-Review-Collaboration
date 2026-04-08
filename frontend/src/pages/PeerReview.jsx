import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import ProjectCard from '../components/ProjectCard'
import FeedbackForm from '../components/FeedbackForm'
import { projectsAPI, reviewsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useNotifications } from '../context/NotificationContext'
import { ArrowLeft, Star, CheckCircle, Loader2 } from 'lucide-react'

export default function PeerReview() {
    const { user } = useAuth()
    const { projectId } = useParams()
    const navigate = useNavigate()
    const { addNotification } = useNotifications()

    const [projects, setProjects] = useState([])
    const [selected, setSelected] = useState(null)
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        projectsAPI.getAll().then(r => {
            const reviewable = r.data.filter(p => p.authorId !== user?.id && p.reviewCount < p.maxReviews)
            setProjects(reviewable)
            if (projectId) {
                const found = r.data.find(p => p.id === Number(projectId))
                if (found) setSelected(found)
            }
        })
    }, [user, projectId])

    const handleReview = async (reviewData) => {
        setLoading(true)
        try {
            await reviewsAPI.create({ ...reviewData, projectId: selected.id, reviewerId: user.id, reviewer: user.name })
            addNotification(`You successfully reviewed "${selected.title}"`, 'review')
            setSubmitted(true)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (submitted) return (
        <DashboardLayout>
            <div className="max-w-md mx-auto mt-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Submitted!</h2>
                <p className="text-gray-600 mb-10">Your constructive feedback has been shared with your peer. Great work!</p>
                <div className="flex flex-col gap-4">
                    <button onClick={() => { setSelected(null); setSubmitted(false) }} className="btn-primary py-3">Review Another Project</button>
                    <button onClick={() => navigate('/student')} className="btn-secondary py-3">Return to My Dashboard</button>
                </div>
            </div>
        </DashboardLayout>
    )

    if (selected) return (
        <DashboardLayout title="Quality Review" subtitle={`Assessing: ${selected.title}`}>
            <div className="max-w-3xl mx-auto">
                <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline mb-8 transition-colors">
                    <ArrowLeft size={18} /> View All Available Projects
                </button>

                {/* Project Briefing Card */}
                <div className="card p-8 bg-white shadow-sm border-l-4 border-l-blue-600 mb-10">
                    <div className="flex items-start gap-5">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                            <Star size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{selected.title}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Submitted by {selected.author}</p>
                            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{selected.description}</p>
                            {selected.tags && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {selected.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <FeedbackForm onSubmit={handleReview} loading={loading} />
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout title="Peer Review Pool" subtitle="Help your classmates by providing high-quality feedback on their projects.">
            {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projects.map(p => (
                        <ProjectCard key={p.id} project={p} showReviewButton onReview={setSelected} />
                    ))}
                </div>
            ) : (
                <div className="card p-20 bg-white text-center">
                    <Star size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Projects to Review</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You've caught up with all current submissions. Check back later for new academic projects.</p>
                    <button onClick={() => navigate('/student')} className="btn-primary mt-8">Go to Dashboard</button>
                </div>
            )}
        </DashboardLayout>
    )
}
