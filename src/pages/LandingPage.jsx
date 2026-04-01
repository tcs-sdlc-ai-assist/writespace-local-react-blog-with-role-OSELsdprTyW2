import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getPosts } from '../utils/blogStorage'

export default function LandingPage() {
  const recentPosts = getPosts().slice(0, 3)

  const features = [
    {
      title: 'Write Freely',
      description: 'Express your thoughts without limits. Create and publish blog posts with our simple, distraction-free editor.',
      icon: '✍️',
    },
    {
      title: 'Private & Local',
      description: 'Your data stays on your device. No servers, no tracking — just you and your words stored locally.',
      icon: '🔒',
    },
    {
      title: 'Instant & Fast',
      description: 'No loading screens or slow connections. Everything runs instantly in your browser for a seamless experience.',
      icon: '⚡',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-violet-300">WriteSpace</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              A modern blogging platform for writers and readers. Share your thoughts with the world, one post at a time.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-md text-base font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-md text-base font-medium bg-indigo-700 text-white hover:bg-indigo-600 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why WriteSpace?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Posts Preview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Latest Posts
            </h2>
            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>By {post.author.displayName}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No posts yet. Be the first to share your story!
                </p>
                <Link
                  to="/register"
                  className="inline-block mt-6 px-6 py-3 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}