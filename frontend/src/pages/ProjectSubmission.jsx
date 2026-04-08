import React, { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { projectsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Tag, FileText, CheckCircle, Trash2, Upload, AlertCircle, Loader2 } from 'lucide-react'

const AVAILABLE_TAGS = ['Python', 'JavaScript', 'React', 'Node.js', 'ML/AI', 'Data Science', 'Mobile', 'Web', 'Blockchain', 'Cloud', 'DevOps', 'UI/UX', 'Database', 'Security', 'IoT']

export default function ProjectSubmission() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ title: '', description: '', tags: [], status: 'submitted' })
    const [docs, setDocs] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState({})

    const toggleTag = (tag) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : prev.tags.length < 5 ? [...prev.tags, tag] : prev.tags
        }))
        if (errors.tags) setErrors(p => ({ ...p, tags: '' }))
    }

    const validateForm = () => {
        const newErrors = {}
        if (!form.title || form.title.length < 5) newErrors.title = 'Title must be at least 5 characters'
        if (!form.description || form.description.length < 20) newErrors.description = 'Description must be at least 20 characters'
        if (form.tags.length === 0) newErrors.tags = 'Select at least one technology tag'
        return newErrors
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setSubmitting(true)
        try {
            await projectsAPI.create({ 
                ...form, 
                author: user.name, 
                authorId: user.id,
                submittedAt: new Date().toLocaleDateString(),
                reviewCount: 0,
                maxReviews: 3
            })
            setSuccess(true)
            setTimeout(() => navigate('/student'), 2500)
        } catch (err) {
            setErrors({ submit: 'Failed to submit project. Please try again.' })
        } finally {
            setSubmitting(false)
        }
    }

    if (success) return (
        <DashboardLayout>
            <div className="max-w-md mx-auto mt-20 text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
                <p className="text-gray-600 mb-8">Your project has been uploaded and is now available for peer review.</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-gray-500">Redirecting to project board...</span>
                </div>
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout title="Submit Project" subtitle="Provide project details and documentation for peer evaluation.">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="card p-8 bg-white shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded">
                                <FolderKanban size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Project Overview</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="label">Project Title <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    value={form.title}
                                    onChange={e => { setForm(p => ({ ...p, title: e.target.value })); if (errors.title) setErrors(p => ({ ...p, title: '' })) }}
                                    placeholder="e.g., Sentiment Analysis System"
                                    className={`input ${errors.title ? 'border-red-500' : ''}`}
                                />
                                {errors.title && <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1"><AlertCircle size={10}/> {errors.title}</p>}
                            </div>

                            <div>
                                <label className="label">Full Description <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows={6}
                                    value={form.description}
                                    onChange={e => { setForm(p => ({ ...p, description: e.target.value })); if (errors.description) setErrors(p => ({ ...p, description: '' })) }}
                                    placeholder="Explain your approach, the core logic, and any specific findings..."
                                    className={`input resize-none ${errors.description ? 'border-red-500' : ''}`}
                                />
                                <div className="flex items-center justify-between mt-1.5">
                                    {errors.description ? (
                                        <p className="text-xs text-red-600 font-bold flex items-center gap-1"><AlertCircle size={10}/> {errors.description}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400">Min 20 characters required</p>
                                    )}
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{form.description.length} chars</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technology Stack */}
                    <div className="card p-8 bg-white shadow-sm">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded">
                                <Tag size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Tech Stack</h3>
                                <p className="text-xs text-gray-500">Select up to 5 relevant tags</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2.5 mt-6">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${form.tags.includes(tag)
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {errors.tags && <p className="text-xs text-red-600 font-bold mt-4 flex items-center gap-1"><AlertCircle size={12}/> {errors.tags}</p>}
                    </div>

                    {/* File Uploads (Mock) */}
                    <div className="card p-8 bg-white shadow-sm">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Attachments</h3>
                        </div>

                        <div
                            onClick={() => document.getElementById('file-input').click()}
                            className="group border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                        >
                            <div className="w-12 h-12 bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                                <Upload size={24} />
                            </div>
                            <p className="text-base font-bold text-gray-900">Choose files or drag them here</p>
                            <p className="text-sm text-gray-500 mt-1">Submit your code repo link, PDF report, or demo video</p>
                        </div>
                        <input id="file-input" type="file" multiple className="hidden"
                            onChange={e => setDocs(prev => [...prev, ...Array.from(e.target.files).map(f => f.name)])} />
                        
                        {docs.length > 0 && (
                            <div className="mt-6 space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Selected Files:</p>
                                {docs.map((name, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg group">
                                        <div className="flex items-center gap-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-700">{name}</span>
                                        </div>
                                        <button type="button" onClick={() => setDocs(d => d.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-500 p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-600">
                            <AlertCircle size={20} />
                            <p className="text-sm font-bold">{errors.submit}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg shadow-blue-200"
                    >
                        {submitting ? (
                            <><Loader2 size={24} className="animate-spin" /> Processing...</>
                        ) : (
                            <>Submit Project Final Version</>
                        )}
                    </button>
                </form>
            </div>
        </DashboardLayout>
    )
}
