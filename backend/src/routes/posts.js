import { requireAuth } from '../middleware/jwt.js'

import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }

    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'Cannot filter by both author and tag' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('Error getting posts: ', err)
      res.status(500).end()
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('Error getting post: ', err)
      res.status(500).end()
    }
  })

  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    const { title, author, contents, tags } = req.body
    try {
      const post = await createPost(req.auth.sub, {
        title,
        author,
        contents,
        tags,
      })
      return res.status(201).json(post)
    } catch (err) {
      console.error('Error creating post: ', err)
      res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    const { title, author, contents, tags } = req.body
    try {
      const post = await updatePost(id, req.auth.sub, {
        title,
        author,
        contents,
        tags,
      })
      if (post === null) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('Error updating post: ', err)
      res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    const { id } = req.params
    try {
      const { deletedCount } = await deletePost(id, req.auth.sub)
      if (deletedCount === 0) return res.status(404).end()
      return res.status(204).end()
    } catch (err) {
      console.error('Error deleting post: ', err)
      res.status(500).end()
    }
  })

  // app.get('/posts/author/:author', async (req, res) => {
  //   const { author } = req.params
  //   const posts = await listPostsByAuthor(author)
  //   res.json(posts)
  // })

  // app.get('/posts/tag/:tag', async (req, res) => {
  //   const { tag } = req.params
  //   const posts = await listPostsByTag(tag)
  //   res.json(posts)
  // })
}
