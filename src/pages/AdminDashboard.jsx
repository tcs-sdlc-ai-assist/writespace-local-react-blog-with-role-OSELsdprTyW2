import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPosts, deletePost } from '../utils/blogStorage'
import { getUsers } from '../utils/userStorage'
import { getSession } from '../utils/sessionManager'
import { getAvatar } from '../utils/avatar'

export default function AdminDashboard() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const session = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    setPosts(getPosts())
    setUsers(getUsers())
  }, [])

  const totalPosts = posts.length
  const totalUsers = users.length + 1 // +1 for the hardcoded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1
  const viewerCount = users.filter((u) => u.role === 'viewer').length

  const recentPosts = posts.slice(0, 5)

  function handleDeleteClick(id) {
    setDeleteId(id)
    setShowConfirm(true)
  }

  function handleDelete() {
    const result = deletePost(deleteId)

    if (result.success) {
      setPosts(getPosts())
    }

    setShowConfirm(false)
    setDeleteId(null)
  }

  const stats = [
    {
      label: 'Total Posts',
      value: totalPosts,
      icon: '📝',
      color: 'bg-violet-500',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      icon: '👥',
      color: 'bg-indigo-500',
    },
    {
      label: 'Admins',
      value: adminCount,
      icon: '👑',
      color: 'bg-amber-500',
    },
    {
      label: 'Viewers',
      value: viewerCount,
      icon: '📖',
      color: 'bg-emerald-500',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        {/* Gradient Banner */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-3 text-lg text-gray-300">
              Welcome back, {session?.displayName}. Here's an overview of your platform.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{stat.icon}</span>
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${stat.color} text-white text-lg font-bold`}
                  >
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </h3>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/write"
                className="px-6 py-3 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors text-center"
              >
                ✍️ Write a New Post
              </Link>
              <Link
                to="/users"
                className="px-6 py-3 rounded-md text-sm font-medium bg-indigo-700 text-white hover:bg-indigo-600 transition-colors text-center"
              >
                👥 Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
              <Link
                to="/blogs"
                className="text-violet-500 hover:text-violet-600 font-medium transition-colors text-sm"
              >
                View All →
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          {getAvatar(post.author.role)}
                          <span className="text-sm font-medium text-gray-700">
                            {post.author.displayName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/edit/${post.id}`)}
                          className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post.id)}
                          className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-6">
                  No posts yet. Be the first to share your story!
                </p>
                <Link
                  to="/write"
                  className="inline-block px-6 py-3 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Post</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setDeleteId(null)
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