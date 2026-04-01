import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPosts, deletePost } from '../utils/blogStorage'
import { getSession } from '../utils/sessionManager'
import { getAvatar } from '../utils/avatar'

export default function ReadPage() {
  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()
  const session = getSession()

  useEffect(() => {
    const posts = getPosts()
    const found = posts.find((p) => p.id === id)

    if (!found) {
      setNotFound(true)
      return
    }

    setPost(found)
  }, [id])

  function canEdit() {
    if (!session) return false
    if (session.role === 'admin') return true
    return post.author.username === session.username
  }

  function handleDelete() {
    const result = deletePost(id)

    if (result.success) {
      navigate('/blogs', { replace: true })
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow flex items-center justify-center bg-gray-50 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Post not found</h1>
            <p className="text-gray-500 text-lg mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-block px-6 py-3 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Author & Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                {getAvatar(post.author.role)}
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {post.author.displayName}
                  </span>
                  <div className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                    {post.updatedAt > post.createdAt && (
                      <span> · Edited {new Date(post.updatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {canEdit() && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${post.id}`)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>

            {/* Content */}
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/blogs"
              className="text-violet-500 hover:text-violet-600 font-medium transition-colors text-sm"
            >
              ← Back to All Blogs
            </Link>
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
                onClick={() => setShowConfirm(false)}
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