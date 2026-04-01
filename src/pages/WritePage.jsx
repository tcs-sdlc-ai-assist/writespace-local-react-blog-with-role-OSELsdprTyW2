import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getSession } from '../utils/sessionManager'
import { addPost, getPosts, updatePost } from '../utils/blogStorage'

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const [contentTouched, setContentTouched] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const session = getSession()
  const isEditMode = Boolean(id)

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true })
      return
    }

    if (isEditMode) {
      const posts = getPosts()
      const post = posts.find((p) => p.id === id)

      if (!post) {
        navigate('/blogs', { replace: true })
        return
      }

      if (session.role !== 'admin' && post.author.username !== session.username) {
        navigate('/blogs', { replace: true })
        return
      }

      setTitle(post.title)
      setContent(post.content)
    }
  }, [id, isEditMode, navigate, session])

  if (!session) {
    return null
  }

  function getTitleError() {
    if (!titleTouched) return ''
    if (!title.trim()) return 'Title is required.'
    return ''
  }

  function getContentError() {
    if (!contentTouched) return ''
    if (!content.trim()) return 'Content is required.'
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setTitleTouched(true)
    setContentTouched(true)

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    if (isEditMode) {
      const result = updatePost(id, {
        title: title.trim(),
        content: content.trim(),
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      navigate(`/blog/${id}`, { replace: true })
    } else {
      const result = addPost({
        title: title.trim(),
        content: content.trim(),
        author: {
          username: session.username,
          displayName: session.displayName,
          role: session.role,
        },
      })

      if (!result.success) {
        setError(result.error)
        return
      }

      navigate(`/blog/${result.post.id}`, { replace: true })
    }
  }

  function handleCancel() {
    navigate(-1)
  }

  const titleError = getTitleError()
  const contentError = getContentError()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Post' : 'Write a New Post'}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                {isEditMode
                  ? 'Update your blog post below'
                  : 'Share your thoughts with the world'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <span className="text-xs text-gray-400">
                    {title.length} characters
                  </span>
                </div>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => setTitleTouched(true)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                    titleError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your post title"
                />
                {titleError && (
                  <p className="mt-1 text-xs text-red-600">{titleError}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Content
                  </label>
                  <span className="text-xs text-gray-400">
                    {content.length} characters
                  </span>
                </div>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={() => setContentTouched(true)}
                  rows={12}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                    contentError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Write your blog post content here..."
                />
                {contentError && (
                  <p className="mt-1 text-xs text-red-600">{contentError}</p>
                )}
              </div>

              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                >
                  {isEditMode ? 'Update Post' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}