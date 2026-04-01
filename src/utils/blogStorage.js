import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'writespace_posts'

export function getPosts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const posts = data ? JSON.parse(data) : []
    return posts.sort((a, b) => b.createdAt - a.createdAt)
  } catch {
    return []
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    return true
  } catch {
    return false
  }
}

export function addPost(post) {
  try {
    const posts = getPosts()

    if (!post || !post.title || !post.content) {
      return { success: false, error: 'Title and content are required.' }
    }

    if (!post.author || !post.author.username) {
      return { success: false, error: 'Author information is required.' }
    }

    const newPost = {
      id: uuidv4(),
      title: post.title,
      content: post.content,
      author: {
        username: post.author.username,
        displayName: post.author.displayName,
        role: post.author.role,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    posts.push(newPost)

    if (!savePosts(posts)) {
      return { success: false, error: 'Failed to save post data.' }
    }

    return { success: true, post: newPost }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export function updatePost(id, updatedFields) {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required.' }
    }

    const posts = getPosts()
    const index = posts.findIndex((p) => p.id === id)

    if (index === -1) {
      return { success: false, error: 'Post not found.' }
    }

    if (updatedFields.title !== undefined && !updatedFields.title) {
      return { success: false, error: 'Title cannot be empty.' }
    }

    if (updatedFields.content !== undefined && !updatedFields.content) {
      return { success: false, error: 'Content cannot be empty.' }
    }

    posts[index] = {
      ...posts[index],
      ...updatedFields,
      id: posts[index].id,
      author: posts[index].author,
      createdAt: posts[index].createdAt,
      updatedAt: Date.now(),
    }

    if (!savePosts(posts)) {
      return { success: false, error: 'Failed to save post data.' }
    }

    return { success: true, post: posts[index] }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}

export function deletePost(id) {
  try {
    if (!id) {
      return { success: false, error: 'Post ID is required.' }
    }

    const posts = getPosts()
    const index = posts.findIndex((p) => p.id === id)

    if (index === -1) {
      return { success: false, error: 'Post not found.' }
    }

    posts.splice(index, 1)

    if (!savePosts(posts)) {
      return { success: false, error: 'Failed to save post data.' }
    }

    return { success: true }
  } catch {
    return { success: false, error: 'An unexpected error occurred.' }
  }
}