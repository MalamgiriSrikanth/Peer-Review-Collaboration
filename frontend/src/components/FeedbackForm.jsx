import React, { useState } from 'react'
import { Star, Send, AlertCircle, Loader2 } from 'lucide-react'

const CRITERIA = [
    { key: 'technical', label: 'Technical Implementation', desc: 'Code quality, logic, and choice of tools' },
    { key: 'documentation', label: 'Project Clarity', desc: 'Is the code commented? Is there a README?' },
    { key: 'creativity', label: 'Innovation', desc: 'Originality of the solution' },
    { key: 'presentation', label: 'UI & UX Quality', desc: 'Visual appeal and user flow' },
]

function StarRating({ value, onChange, disabled }) {
    const [hovered, setHovered] = useState(0)
    return (
        <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
                <button
                    key={n}
                    type="button"
                    disabled={disabled}
                    onClick={() => !disabled && onChange(n)}
                    onMouseEnter={() => !disabled && setHovered(n)}
                    onMouseLeave={() => !disabled && setHovered(0)}
                    className={`transition-colors p-1 rounded-md ${disabled ? 'cursor-default' : 'cursor-pointer hover:bg-gray-100'}`}
                >
                    <Star
                        size={22}
                        className={n <= (hovered || value) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                    />
                </button>
            ))}
        </div>
    )
}

export default function FeedbackForm({ onSubmit, loading = false }) {
    const [ratings, setRatings] = useState({ technical: 0, documentation: 0, creativity: 0, presentation: 0 })
    const [comment, setComment] = useState('')
    const [errors, setErrors] = useState({})

    const overallRating = Math.round(Object.values(ratings).reduce((s, v) => s + v, 0) / CRITERIA.length) || 0

    const validate = () => {
        const newErrors = {}
        const incomplete = CRITERIA.filter(c => !ratings[c.key])
        if (incomplete.length > 0) newErrors.ratings = `Please rate all ${incomplete.length} remaining criteria`
        if (comment.trim().length < 30) newErrors.comment = `Current: ${comment.trim().length} chars. Need at least 30.`
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        setErrors({})
        onSubmit?.({ criteriaScores: ratings, rating: overallRating, comment: comment.trim() })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="card p-8 bg-white shadow-sm border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-8 border-b pb-4">Evaluation Scorecard</h3>
                
                <div className="space-y-8">
                    {CRITERIA.map(({ key, label, desc }) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-gray-900">{label}</p>
                                <p className="text-xs text-gray-500">{desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <StarRating
                                    value={ratings[key]}
                                    onChange={(val) => {
                                        setRatings(prev => ({ ...prev, [key]: val }))
                                        if (errors.ratings) setErrors(p => ({ ...p, ratings: '' }))
                                    }}
                                    disabled={loading}
                                />
                                <span className="w-4 text-center font-bold text-gray-900">{ratings[key] || '0'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between bg-gray-50 -mx-8 -mb-8 p-8">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Aggregate Score</p>
                        <p className="text-3xl font-extrabold text-blue-600">{overallRating > 0 ? overallRating.toFixed(1) : '—'}<span className="text-sm text-gray-400 font-normal"> / 5.0</span></p>
                    </div>
                    {errors.ratings && (
                        <div className="flex items-center gap-2 text-red-600 bg-white px-3 py-2 rounded-md border border-red-100 text-xs font-bold">
                            <AlertCircle size={14} /> {errors.ratings}
                        </div>
                    )}
                </div>
            </div>

            <div className="card p-8 bg-white shadow-sm">
                <label className="label text-lg font-bold">Constructive Comments <span className="text-red-500">*</span></label>
                <p className="text-xs text-gray-500 mb-4">Focus on strengths and provide specific advice for improvement.</p>
                <textarea
                    value={comment}
                    onChange={e => {
                        setComment(e.target.value)
                        if (errors.comment) setErrors(p => ({ ...p, comment: '' }))
                    }}
                    disabled={loading}
                    rows={6}
                    placeholder="Write your review here... (Min 30 characters)"
                    className={`input resize-none h-40 ${errors.comment ? 'border-red-500 focus:ring-red-200' : 'focus:ring-blue-200'}`}
                />
                <div className="flex items-center justify-between mt-3">
                    {errors.comment ? (
                        <p className="text-xs text-red-600 font-bold flex items-center gap-1"><AlertCircle size={14} /> {errors.comment}</p>
                    ) : (
                        <p className="text-xs text-gray-400">Please provide a professional tone in your review.</p>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${comment.length >= 30 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {comment.length} characters
                    </span>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-lg font-bold shadow-blue-200 flex items-center justify-center gap-3"
            >
                {loading ? <><Loader2 size={24} className="animate-spin" /> Submitting Review...</> : <><Send size={18} /> Publish Official Review</>}
            </button>
        </form>
    )
}
