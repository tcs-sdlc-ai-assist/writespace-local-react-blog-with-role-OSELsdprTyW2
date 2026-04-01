import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { login, getSession } from '../utils/sessionManager'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const session = getSession()
    if (session) {
      navigate(session.role === 'admin' ? '/admin' : '/blogs', { replace: true })
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    const result = login(username, password)

    if (!result.success) {
      setError(result.error)
      return
    }

    if (result.session.role === 'admin') {
      navigate('/admin', { replace: true })
    } else {
      navigate('/blogs', { replace: true })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-20">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your WriteSpace account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
              >
                Get Started
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}