import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Users, FolderKanban, ArrowRight, BookOpen, ShieldCheck } from 'lucide-react'
import Navbar from '../components/Navbar'

const SIMPLE_STEPS = [
    { icon: FolderKanban, title: 'Submit', color: 'text-blue-500' },
    { icon: Star, title: 'Review', color: 'text-amber-500' },
    { icon: Users, title: 'Collaborate', color: 'text-emerald-500' },
]

export default function Landing() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Simple Hero Section */}
            <header className="pt-40 pb-20 px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-8 shadow-lg shadow-blue-100 animate-fade-in">
                        <Star size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        PeerCollab Platform
                    </h1>
                    <p className="text-lg text-gray-400 font-medium mb-12">
                        A clean and simple environment for academic growth.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
                        <Link to="/register" className="btn-primary px-12 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-200 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            Join Now <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-12 py-4 rounded-xl text-lg font-bold transition-all flex items-center justify-center">
                            Sign In
                        </Link>
                    </div>

                    {/* Simple Symbols Grid */}
                    <div className="grid grid-cols-3 gap-8 py-10 border-t border-gray-100 max-w-xl mx-auto">
                        {SIMPLE_STEPS.map((step) => (
                            <div key={step.title} className="flex flex-col items-center">
                                <div className={`mb-3 ${step.color}`}>
                                    <step.icon size={28} />
                                </div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{step.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Simple Roles Section */}
            <section className="py-20 bg-gray-50/50 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Student Role</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Submit your work and review your peers in a clean, distraction-free space.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Instructor Role</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Manage your course and monitor student progress with simplified tools.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Minimal Footer */}
            <footer className="py-12 bg-white text-center border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                    PeerCollab — Simple Academic Platform
                </p>
            </footer>
        </div>
    )
}
