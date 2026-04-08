import React from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { useNotifications } from '../context/NotificationContext'
import { Bell, Star, MessageSquare, Users, FolderKanban, Info, CheckCheck, Clock } from 'lucide-react'

const TYPE_ICONS = {
    review: Star,
    feedback: MessageSquare,
    assignment: FolderKanban,
    collab: Users,
    info: Info,
}

const TYPE_COLORS = {
    review: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    feedback: 'bg-blue-50 text-blue-700 border-blue-100',
    assignment: 'bg-purple-50 text-purple-700 border-purple-100',
    collab: 'bg-green-50 text-green-700 border-green-100',
    info: 'bg-gray-50 text-gray-700 border-gray-100',
}

export default function Notifications() {
    const { notifications, markAllRead, unreadCount } = useNotifications()

    return (
        <DashboardLayout title="Alert Center" subtitle="Keep track of your academic progress and project feedback.">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900">{notifications.length}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Alerts</span>
                        </div>
                        {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button 
                            onClick={markAllRead} 
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest border-b border-transparent hover:border-blue-800"
                        >
                            <CheckCheck size={14} /> Mark all as read
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {notifications.map(n => {
                        const Icon = TYPE_ICONS[n.type] || Info
                        const colorClass = TYPE_COLORS[n.type] || TYPE_COLORS.info

                        return (
                            <div
                                key={n.id}
                                className={`flex items-start gap-4 p-5 rounded-lg border bg-white shadow-sm transition-all relative ${!n.read ? 'border-l-4 border-l-blue-600' : 'border-gray-200'}`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${colorClass}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`text-sm leading-relaxed ${n.read ? 'text-gray-500' : 'text-gray-900 font-bold'}`}>
                                            {n.message}
                                        </p>
                                        {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-4 animate-pulse" />}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                        <Clock size={10} />
                                        {n.time || 'A moment ago'}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {notifications.length === 0 && (
                    <div className="card p-20 text-center bg-gray-50 border-dashed border-gray-200">
                        <Bell size={48} className="text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-1">All Caught Up</h3>
                        <p className="text-gray-400 text-sm">You have no new notifications at this time.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
