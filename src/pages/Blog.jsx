import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Header } from '../components/Header'
import { CreatePost } from '../components/CreatePost'
import { PostList } from '../components/PostList'
import { PostFilter } from '../components/PostFilter'
import { PostSorting } from '../components/PostSorting'
import { getPosts } from '../api/posts'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')

  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })

  const posts = postsQuery.data ?? []

  return (
    <div style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
      <h1>My Blog</h1>
      <Header />
      <br />
      <hr />
      <br />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <PostList posts={posts} />
    </div>
  )
}
