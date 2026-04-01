import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../utils/sessionManager'
import { getAvatar } from '../utils/avatar'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const session = getSession()
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path) {
    return location.pathname === path
  }

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    setMobileOpen(false)
    navigate('/login')
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  const linkClass = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-indigo-700 text-white'
        : 'text-gray-300 hover:bg-indigo-600 hover:text-white'
    }`

  const mobileLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive(path)
        ? 'bg-indigo-700 text-white'
        : 'text-gray-300 hover:bg-indigo-600 hover:text-white'
    }`

  return (
    <nav className="bg-indigo-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={session ? '/blogs' : '/'} className="text-white text-xl font-bold tracking-wide">
              ✍️ WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!session ? (
              <>
                <Link to="/login" className={linkClass('/login')}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/blogs" className={linkClass('/blogs')}>
                  All Blogs
                </Link>
                <Link to="/write" className={linkClass('/write')}>
                  Write
                </Link>
                {session.role === 'admin' && (
                  <Link to="/users" className={linkClass('/users')}>
                    Users
                  </Link>
                )}

                {/* Avatar & Dropdown */}
                <div className="relative ml-3">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-900"
                  >
                    {getAvatar(session.role)}
                    <span className="text-white font-medium">{session.displayName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        session.role === 'admin'
                          ? 'bg-violet-500 text-white'
                          : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {session.role}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!session ? (
              <>
                <Link to="/login" className={mobileLinkClass('/login')} onClick={closeMobile}>
                  Login
                </Link>
                <Link to="/register" className={mobileLinkClass('/register')} onClick={closeMobile}>
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/blogs" className={mobileLinkClass('/blogs')} onClick={closeMobile}>
                  All Blogs
                </Link>
                <Link to="/write" className={mobileLinkClass('/write')} onClick={closeMobile}>
                  Write
                </Link>
                {session.role === 'admin' && (
                  <Link to="/users" className={mobileLinkClass('/users')} onClick={closeMobile}>
                    Users
                  </Link>
                )}
                <div className="border-t border-indigo-700 pt-3 mt-3">
                  <div className="flex items-center px-3 space-x-2 mb-3">
                    {getAvatar(session.role)}
                    <span className="text-white font-medium">{session.displayName}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        session.role === 'admin'
                          ? 'bg-violet-500 text-white'
                          : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {session.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}