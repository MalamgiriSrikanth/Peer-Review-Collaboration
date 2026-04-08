import React from 'react'
import Navbar from './Navbar'

export default function DashboardLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-20">
                {(title || subtitle) && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                        <div className="border-b border-gray-200 pb-6">
                            {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
                        </div>
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    {children}
                </div>
            </main>
        </div>
    )
}
