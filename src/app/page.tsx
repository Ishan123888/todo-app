import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
      <div className="text-center text-white px-4">
        <h1 className="text-6xl font-bold mb-4">Todo App</h1>
        <p className="text-xl mb-8">Manage your tasks efficiently</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}