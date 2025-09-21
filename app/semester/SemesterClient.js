// /app/semester/SemesterClient.js
'use client'

import { Suspense } from 'react'
import SemesterContent from './SemesterContent'

export default function SemesterClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading Semester...</p>
        </div>
      </div>
    }>
      <SemesterContent />
    </Suspense>
  )
}