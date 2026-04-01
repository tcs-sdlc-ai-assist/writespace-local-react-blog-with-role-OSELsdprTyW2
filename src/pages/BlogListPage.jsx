import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPosts } from '../utils/blogStorage'
import { getSession } from '../utils/sessionManager'
import { getAvatar } from '../utils/avatar'

export default function BlogListPage() {
  const [posts, setPosts] = useState([])
  const session = getSession()
  const navigate = useNavigate()

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  function canEdit(post) {
    if (!session) return false
    if (session.role === 'admin') return true
    return post.author.username === session.username
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
            <Link
              to="/write"
              className="px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
            >
              Write Post
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getAvatar(post.author.role)}
                      <span className="text-sm font-medium text-gray-700">
                        {post.author.displayName}
                      </span>
                    </div>
                    {canEdit(post) && (
                      <button
                        onClick={() => navigate(`/edit/${post.id}`)}
                        className="text-gray-400 hover:text-violet-500 transition-colors"
                        aria-label="Edit post"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {post.content}
                  </p>

                  <div className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
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
      </main>

      <Footer />
    </div>
  )
}