import React, { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'review', message: 'Alex reviewed your Machine Learning project', time: '2 hours ago', read: false },
        { id: 2, type: 'feedback', message: 'New feedback on your Data Structures submission', time: '5 hours ago', read: false },
        { id: 3, type: 'assignment', message: 'New peer review assignment: Web Dev Project', time: '1 day ago', read: true },
        { id: 4, type: 'collab', message: 'Priya invited you to collaborate on AI Research', time: '2 days ago', read: true },
    ])

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }, [])

    const addNotification = useCallback((msg, type = 'info') => {
        setNotifications(prev => [{ id: Date.now(), type, message: msg, time: 'Just now', read: false }, ...prev])
    }, [])

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{ notifications, markAllRead, addNotification, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotifications = () => {
    const ctx = useContext(NotificationContext)
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
    return ctx
}
