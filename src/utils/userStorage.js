const STORAGE_KEY = 'writespace_users'

export function getUsers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    return true
  } catch {
    return false
  }
}

export function addUser(user) {
  try {
    const users = getUsers()

    if (!user || !user.username || !user.displayName || !user.password) {
      return { success: false, error: 'All fields are required.' }
    }

    if (user.username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters.' }
    }

    if (/\s/.test(user.username)) {
      return { success: false, error: 'Username must not contain spaces.' }
    }

    if (user.username === 'admin') {
      return { success: false, error: 'Username not allowed.' }
    }

    if (user.password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' }
    }

    if (user.displayName.length < 2) {
      return { success: false, error: 'Display name must be at least 2 characters.' }
    }

    if (users.find((u) => u.username === user.username)) {
      return { success: false, error: 'Username already exists.' }
    }

    const newUser = {
      username: user.username,
      displayName: user.displayName,
      password: user.password,
      role: user.role || 'viewer',
    }

    users.push(newUser)

    if (!saveUsers(users)) {
      return { success: false, error: 'Failed to save user data.' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export function deleteUser(username) {
  try {
    if (!username) {
      return { success: false, error: 'Username is required.' }
    }

    if (username === 'admin') {
      return { success: false, error: 'Cannot delete the admin user.' }
    }

    const users = getUsers()
    const index = users.findIndex((u) => u.username === username)

    if (index === -1) {
      return { success: false, error: 'User not found.' }
    }

    users.splice(index, 1)

    if (!saveUsers(users)) {
      return { success: false, error: 'Failed to save user data.' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}