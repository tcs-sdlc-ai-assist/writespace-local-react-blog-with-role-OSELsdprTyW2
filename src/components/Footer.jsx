import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-indigo-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-white text-xl font-bold tracking-wide">
              ✍️ WriteSpace
            </Link>
            <p className="mt-3 text-sm text-gray-400">
              A modern blogging platform for writers and readers. Share your thoughts with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              About
            </h3>
            <p className="text-sm text-gray-400">
              WriteSpace empowers you to create, share, and discover stories that matter. Join our community of passionate writers today.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-indigo-700">
          <p className="text-center text-sm text-gray-400">
            &copy; {currentYear} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}