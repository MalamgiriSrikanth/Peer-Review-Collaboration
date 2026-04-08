import React, { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { statsAPI, assignmentsAPI, projectsAPI, usersAPI } from '../services/api'
import {
    Users, FolderKanban, Star, Clock, Plus, CheckCircle,
    Calendar, BookOpen, Loader2, X
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, colorClass, sub }) {
    return (
        <div className="card p-5 bg-white">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {sub && <p className="text-[10px] text-gray-500 mt-1 font-medium">{sub}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboard() {
    const { user } = useAuth()
    const [stats, setStats] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [projects, setProjects] = useState([])
    const [students, setStudents] = useState([])
    const [showNewAssignment, setShowNewAssignment] = useState(false)
    const [showNewStudent, setShowNewStudent] = useState(false)
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '', criteria: '' })
    const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '' })
    const [creating, setCreating] = useState(false)
    const [formError, setFormError] = useState('')

    useEffect(() => {
        refreshData()
    }, [])

    const refreshData = () => {
        statsAPI.getAdminStats().then(r => setStats(r.data))
        assignmentsAPI.getAll().then(r => setAssignments(r.data))
        projectsAPI.getAll().then(r => setProjects(r.data))
        usersAPI.getStudents().then(r => setStudents(r.data))
    }

    const validateAssignment = () => {
        if (!newAssignment.title || newAssignment.title.length < 5) return 'Title must be at least 5 chars'
        if (!newAssignment.deadline) return 'Deadline is required'
        return null
    }

    const handleCreateAssignment = async (e) => {
        e.preventDefault()
        const error = validateAssignment()
        if (error) { setFormError(error); return }
        
        setCreating(true)
        const criteriaArr = newAssignment.criteria.split(',').map(s => s.trim()).filter(Boolean)
        await assignmentsAPI.create({ ...newAssignment, criteria: criteriaArr, assignedCount: 0 })
        refreshData()
        setCreating(false)
        setShowNewAssignment(false)
        setNewAssignment({ title: '', description: '', deadline: '', criteria: '' })
        setFormError('')
    }

    const handleAddStudent = async (e) => {
        e.preventDefault()
        if (!newStudent.name || !newStudent.email) { setFormError('All fields required'); return }
        
        setCreating(true)
        await usersAPI.create({ ...newStudent, role: 'student' })
        refreshData()
        setCreating(false)
        setShowNewStudent(false)
        setNewStudent({ name: '', email: '', password: '' })
        setFormError('')
    }

    const handleRemoveStudent = async (id) => {
        if (!confirm('Permanently remove this student?')) return
        await usersAPI.remove(id)
        refreshData()
    }

    return (
        <DashboardLayout title="Instructor Dashboard" subtitle="Manage courses, assignments, and monitor student progress.">
            {/* Stats Overview */}
            {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard icon={Users} label="Students" value={stats.totalStudents} colorClass="bg-blue-100 text-blue-600" sub="Total enrollment" />
                    <StatCard icon={FolderKanban} label="Submissions" value={stats.totalProjects} colorClass="bg-indigo-100 text-indigo-600" sub="Active projects" />
                    <StatCard icon={Star} label="Reviews" value={stats.totalReviews} colorClass="bg-green-100 text-green-600" sub={`Avg ${stats.avgRating} rating`} />
                    <StatCard icon={Clock} label="Pending" value={stats.pendingReviews} colorClass="bg-red-100 text-red-600" sub="Needs evaluation" />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Assignments */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-600" />
                            Course Assignments
                        </h2>
                        <button
                            onClick={() => { setShowNewAssignment(!showNewAssignment); setFormError('') }}
                            className="btn-primary flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} /> New Assignment
                        </button>
                    </div>

                    {showNewAssignment && (
                        <div className="card p-6 bg-blue-50 border-blue-200">
                            <form onSubmit={handleCreateAssignment} className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-gray-900">Configure Assignment</h3>
                                    <button type="button" onClick={() => setShowNewAssignment(false)} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
                                </div>
                                <input required placeholder="Assignment Title" value={newAssignment.title} onChange={e => setNewAssignment(p => ({ ...p, title: e.target.value }))} className="input" />
                                <textarea placeholder="Guidelines for students" rows={2} value={newAssignment.description} onChange={e => setNewAssignment(p => ({ ...p, description: e.target.value }))} className="input resize-none" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Due Date</label>
                                        <input required type="date" value={newAssignment.deadline} onChange={e => setNewAssignment(p => ({ ...p, deadline: e.target.value }))} className="input" />
                                    </div>
                                    <div>
                                        <label className="label">Criteria (CSV)</label>
                                        <input placeholder="e.g. Design, Code" value={newAssignment.criteria} onChange={e => setNewAssignment(p => ({ ...p, criteria: e.target.value }))} className="input" />
                                    </div>
                                </div>
                                {formError && <p className="text-xs text-red-600 font-bold">{formError}</p>}
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={creating} className="btn-primary text-sm flex items-center gap-2">
                                        {creating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />} 
                                        Save Assignment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {assignments.map(a => {
                            const progress = a.assignedCount > 0 ? (a.completedCount / a.assignedCount) * 100 : 0
                            return (
                                <div key={a.id} className="card bg-white overflow-hidden">
                                    <div className="p-5 border-b border-gray-100 flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{a.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Deadline: <span className="text-red-500 font-medium">{a.deadline}</span></p>
                                        </div>
                                        <span className="badge-blue text-[10px]">Active</span>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-sm text-gray-600 mb-4">{a.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {a.criteria?.map(c => <span key={c} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200 font-bold uppercase">{c}</span>)}
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                                                <span>Class Completion</span>
                                                <span>{a.completedCount} / {a.assignedCount} Students</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                                                <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-10">
                    {/* Student List */}
                    <div className="card bg-white shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-sm">Class Roster</h3>
                            <button onClick={() => setShowNewStudent(!showNewStudent)} className="text-blue-600 hover:text-blue-700 text-xs font-bold flex items-center gap-1">
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        
                        {showNewStudent && (
                            <div className="p-4 bg-gray-50 border-b border-gray-200">
                                <form onSubmit={handleAddStudent} className="space-y-3">
                                    <input required placeholder="Name" value={newStudent.name} onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} className="input text-xs py-1.5" />
                                    <input required type="email" placeholder="Email" value={newStudent.email} onChange={e => setNewStudent(p => ({ ...p, email: e.target.value }))} className="input text-xs py-1.5" />
                                    <input required type="password" placeholder="Pass" value={newStudent.password} onChange={e => setNewStudent(p => ({ ...p, password: e.target.value }))} className="input text-xs py-1.5" />
                                    <button type="submit" disabled={creating} className="btn-primary w-full text-xs py-1.5">Add Member</button>
                                </form>
                            </div>
                        )}

                        <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                            {students.map(s => (
                                <div key={s.id} className="p-4 flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 border border-gray-200">
                                            {s.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{s.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{s.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRemoveStudent(s.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Submissions Feed */}
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-4">Latest Project Activity</h3>
                        <div className="space-y-3">
                            {projects.slice(0, 4).map(p => (
                                <div key={p.id} className="p-3 bg-white border border-gray-200 rounded-lg flex gap-3 shadow-sm">
                                    <div className="p-2 bg-gray-50 rounded border border-gray-100 group-hover:bg-blue-50 transition-colors shrink-0">
                                        <FolderKanban size={14} className="text-gray-400 group-hover:text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{p.title}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">By {p.author}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
