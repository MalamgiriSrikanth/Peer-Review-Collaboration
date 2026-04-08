import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { collabAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationContext'
import { Users, Send, MessageSquare, Hash, Code, FileText, PlusCircle, Clock, ChevronRight } from 'lucide-react'

const MOCK_MESSAGES = {
    1: [
        { id: 1, user: 'Priya Patel', avatar: 'PP', text: 'Hey team! I started on the data preprocessing pipeline.', time: '10:23 AM' },
        { id: 2, user: 'Omar Hassan', avatar: 'OH', text: 'Nice! I\'ll handle the model training part then.', time: '10:25 AM' },
        { id: 3, user: 'Alex Johnson', avatar: 'AJ', text: 'I can set up the evaluation metrics and visualization.', time: '10:28 AM' },
        { id: 4, user: 'Priya Patel', avatar: 'PP', text: 'Perfect! Let\'s sync up tonight at 8 PM.', time: '10:30 AM' },
    ],
    2: [
        { id: 1, user: 'Omar Hassan', avatar: 'OH', text: 'Should we go with Next.js or plain React?', time: '2:15 PM' },
        { id: 2, user: 'Alex Johnson', avatar: 'AJ', text: 'Let\'s use Vite + React for simplicity. Faster build times.', time: '2:17 PM' },
    ],
}

export default function CollaborationRoom() {
    const { user } = useAuth()
    const { addNotification } = useNotifications()
    const [collabs, setCollabs] = useState([])
    const [selected, setSelected] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [activeTab, setActiveTab] = useState('chat')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        collabAPI.getAll().then(r => { 
            setCollabs(r.data)
            if (r.data.length && !selected) setSelected(r.data[0]) 
        })
    }, [])

    useEffect(() => {
        if (selected) setMessages(MOCK_MESSAGES[selected.id] || [])
    }, [selected])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!input.trim()) return
        const msg = { 
            id: Date.now(), 
            user: user.name, 
            avatar: user.avatar, 
            text: input.trim(), 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
        setMessages(prev => [...prev, msg])
        setInput('')
        addNotification(`New activity in "${selected.name}" workspace`, 'collab')
    }

    return (
        <DashboardLayout title="Team Workspace" subtitle="Official communication channel for peer-led project development.">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)] min-h-[600px]">
                {/* Sidebar — Available Teams */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Channels</h3>
                        <button title="Create team" className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            <PlusCircle size={16} />
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-2 overflow-y-auto pr-2">
                        {collabs.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelected(c)}
                                className={`w-full text-left p-4 rounded-lg transition-all border ${selected?.id === c.id 
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                    : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200 hover:bg-blue-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${selected?.id === c.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                        <Hash size={16} className={selected?.id === c.id ? 'text-white' : 'text-gray-400'} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold truncate">{c.name}</p>
                                        <p className={`text-[10px] uppercase font-bold truncate mt-0.5 ${selected?.id === c.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {c.project}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Workspace Area */}
                {selected ? (
                    <div className="lg:col-span-9 card bg-white shadow-sm flex flex-col overflow-hidden border border-gray-200">
                        {/* Session Header */}
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
                                    <Users size={20} className="text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-gray-900 text-sm">{selected.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                        {selected.members.length} Members Online • Project ID: #{selected.id}00
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                                {[
                                    { id: 'chat', icon: MessageSquare, label: 'Discussion' },
                                    { id: 'docs', icon: FileText, label: 'Resources' },
                                    { id: 'code', icon: Code, label: 'Review' },
                                ].map(({ id, icon: Icon, label }) => (
                                    <button
                                        key={id}
                                        onClick={() => setActiveTab(id)}
                                        className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === id 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                                    >
                                        <Icon size={12} />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'chat' && (
                            <>
                                {/* Message Thread */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {messages.map(msg => {
                                        const isMe = msg.user === user.name
                                        return (
                                            <div key={msg.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                <div className={`w-9 h-9 rounded shadow-sm flex items-center justify-center text-xs font-black text-white flex-shrink-0 ${isMe ? 'bg-blue-700' : 'bg-gray-600'}`}>
                                                    {msg.avatar}
                                                </div>
                                                <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className="flex items-center gap-2 mb-1.5 px-1">
                                                        <span className="text-[10px] font-black text-gray-900 lowercase tracking-tight">{isMe ? 'You' : msg.user}</span>
                                                        <span className="text-[10px] font-bold text-gray-400">{msg.time}</span>
                                                    </div>
                                                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border ${isMe 
                                                        ? 'bg-blue-600 text-white border-blue-700 rounded-tr-none' 
                                                        : 'bg-white text-gray-700 border-gray-200 rounded-tl-none'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Controls */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                                    <div className="flex gap-4">
                                        <input
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                            placeholder="Write an official message to the team..."
                                            className="input flex-1 h-12 bg-white border-gray-200 shadow-sm font-medium"
                                        />
                                        <button 
                                            onClick={sendMessage} 
                                            className="btn-primary h-12 px-8 flex items-center gap-3 text-sm font-bold shadow-blue-100"
                                        >
                                            <Send size={18} />
                                            Post
                                        </button>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 mt-3 flex items-center gap-1">
                                        <Clock size={10} /> Shift + Enter for new line. Professional communication is expected.
                                    </p>
                                </div>
                            </>
                        )}

                        {activeTab === 'docs' && (
                            <div className="flex-1 flex items-center justify-center flex-col gap-6 text-center p-12 bg-gray-50">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                                    <FileText size={40} className="text-blue-200" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 mb-2">Central Documentation</h4>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">Create project charters, technical specifications, and meeting minutes directly within the workspace.</p>
                                </div>
                                <button className="btn-primary py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                                    <PlusCircle size={16} /> New Project Document
                                </button>
                            </div>
                        )}

                        {activeTab === 'code' && (
                            <div className="flex-1 flex items-center justify-center flex-col gap-6 text-center p-12 bg-gray-50">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                                    <Code size={40} className="text-purple-200" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 mb-2">Internal Code Review</h4>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">Upload function snippets or logic flows for internal team validation before final project submission.</p>
                                </div>
                                <button className="btn-primary py-3 px-8 text-xs font-bold uppercase tracking-widest bg-purple-600 border-purple-700 hover:bg-purple-700 shadow-purple-100 flex items-center gap-3">
                                    <Code size={16} /> Share Logic Snippet
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="lg:col-span-9 card bg-gray-50 border-dashed border-gray-200 flex items-center justify-center p-12">
                        <div className="text-center">
                            <Users size={48} className="text-gray-200 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Workspace Selected</h3>
                            <p className="text-gray-400 text-sm">Select a team channel from the sidebar to start collaborating.</p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
