import React from 'react'
import { Tag, Clock, User, Star, ArrowRight, CheckCircle, Clock3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STATUS_MAP = {
    pending_review: { label: 'Pending Review', class: 'badge-yellow', icon: Clock3 },
    reviewed: { label: 'Reviewed', class: 'badge-green', icon: CheckCircle },
    in_progress: { label: 'In Progress', class: 'badge-blue', icon: Clock3 },
    submitted: { label: 'Submitted', class: 'badge-blue', icon: CheckCircle },
}

export default function ProjectCard({ project, onReview, showReviewButton = false }) {
    const navigate = useNavigate()
    const status = STATUS_MAP[project.status] || STATUS_MAP.submitted
    const StatusIcon = status.icon

    const reviewProgress = (project.reviewCount / project.maxReviews) * 100

    return (
        <div className="card p-5 bg-white hover:border-blue-400 transition-colors cursor-pointer group"
            onClick={() => !showReviewButton && navigate(`/feedback`)}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-blue-600 transition-colors truncate">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                            <User size={13} className="text-gray-400" />
                            <span className="text-xs text-gray-500 font-medium">{project.author}</span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                            <Clock size={13} className="text-gray-400" />
                            <span className="text-xs text-gray-500">{project.submittedAt}</span>
                        </div>
                    </div>
                </div>
                <span className={`${status.class}`}>
                    <StatusIcon size={12} className="mr-1 inline" />
                    {status.label}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                {project.description}
            </p>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600 font-bold uppercase tracking-wider">
                            <Tag size={10} />
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Review Progress Bar */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> Review Progress</span>
                    <span>{project.reviewCount} / {project.maxReviews} Completed</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${reviewProgress}%` }}
                    />
                </div>
            </div>

            {/* Action Bar */}
            {showReviewButton && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                    {project.reviewCount < project.maxReviews ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onReview?.(project) }}
                            className="btn-primary text-xs flex items-center gap-2 py-2 px-4"
                        >
                            Start Review <ArrowRight size={14} />
                        </button>
                    ) : (
                        <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                            <CheckCircle size={16} /> Fully Reviewed
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
