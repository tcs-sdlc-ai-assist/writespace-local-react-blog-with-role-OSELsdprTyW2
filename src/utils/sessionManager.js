import { getUsers } from './userStorage'

const SESSION_KEY = 'writespace_session'

export function login(username, password) {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' }
    }

    if (username === 'admin' && password === 'admin') {
      const session = { username: 'admin', displayName: 'Admin', role: 'admin' }
      localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      return { success: true, session }
    }

    const users = getUsers()
    const user = users.find((u) => u.username === username)

    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid username or password.' }
    }

    const session = {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    return { success: true, session }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // Silent fail on logout
  }
}

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}