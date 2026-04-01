import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getUsers, addUser, deleteUser } from '../utils/userStorage'
import { getSession } from '../utils/sessionManager'
import { getAvatar } from '../utils/avatar'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteUsername, setDeleteUsername] = useState(null)
  const session = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session || session.role !== 'admin') {
      navigate('/blogs', { replace: true })
      return
    }

    refreshUsers()
  }, [navigate, session])

  function refreshUsers() {
    setUsers(getUsers())
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!displayName || !username || !password) {
      setError('All fields are required.')
      return
    }

    const result = addUser({
      displayName,
      username,
      password,
      role,
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    setSuccess(`User "${username}" created successfully.`)
    setDisplayName('')
    setUsername('')
    setPassword('')
    setRole('viewer')
    refreshUsers()
  }

  function handleDeleteClick(uname) {
    setDeleteUsername(uname)
    setShowConfirm(true)
  }

  function handleDelete() {
    const result = deleteUser(deleteUsername)

    if (result.success) {
      refreshUsers()
    } else {
      setError(result.error)
    }

    setShowConfirm(false)
    setDeleteUsername(null)
  }

  // Build full user list including hardcoded admin
  const allUsers = [
    { username: 'admin', displayName: 'Admin', role: 'admin' },
    ...users,
  ]

  if (!session || session.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        {/* Gradient Banner */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              Create and manage users on your platform.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create User Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create User</h2>

                {error && (
                  <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-3 rounded-md bg-green-50 text-green-700 text-sm">
                    {success}
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
                      placeholder="Enter display name"
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
                      placeholder="Enter username"
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
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                  >
                    Create User
                  </button>
                </form>
              </div>
            </div>

            {/* Users List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>

              {allUsers.length > 0 ? (
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div
                      key={user.username}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getAvatar(user.role)}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {user.displayName}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-sm text-gray-500">@{user.username}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  user.role === 'admin'
                                    ? 'bg-violet-500 text-white'
                                    : 'bg-indigo-500 text-white'
                                }`}
                              >
                                {user.role}
                              </span>
                            </div>
                          </div>
                        </div>

                        {user.username !== 'admin' && user.username !== session.username && (
                          <button
                            onClick={() => handleDeleteClick(user.username)}
                            className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No users yet. Create one using the form.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete User</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete user &quot;{deleteUsername}&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setDeleteUsername(null)
                }}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}