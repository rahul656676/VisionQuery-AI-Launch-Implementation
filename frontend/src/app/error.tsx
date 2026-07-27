'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Something went wrong!</h2>
          <p className="mt-2 text-sm text-gray-500">
            {error.message || "An unexpected error occurred in the application."}
          </p>
        </div>
        
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
