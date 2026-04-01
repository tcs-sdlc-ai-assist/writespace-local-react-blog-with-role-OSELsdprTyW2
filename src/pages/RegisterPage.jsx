import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { addUser } from '../utils/userStorage'
import { login, getSession } from '../utils/sessionManager'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    if (!displayName || !username || !password || !confirmPassword) {
      setError('All fields are required.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = addUser({
      displayName,
      username,
      password,
      role: 'viewer',
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    const loginResult = login(username, password)

    if (!loginResult.success) {
      setError(loginResult.error)
      return
    }

    navigate('/blogs', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gray-50 py-20">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
              <p className="mt-2 text-sm text-gray-600">
                Create your WriteSpace account
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
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your display name"
                />
              </div>

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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-violet-500 hover:text-violet-600 font-medium transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}