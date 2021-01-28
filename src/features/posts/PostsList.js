import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostExcerpt from './PostExcerpt';
import AddPostForm from './AddPostForm';

import {
  fetchPosts,
  selectPostIds,
} from './postsSlice'

import {
  fetchLikes
} from '../likes/likesSlice'

export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)

  const postStatus = useSelector((state) => state.posts.status)
  const postError = useSelector((state) => state.posts.error)

  const likeStatus = useSelector((state) => state.likes.status)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{postError}</div>
  }

  useEffect(() => {
    if (likeStatus === 'idle') {
      dispatch(fetchLikes())
    }
  }, [likeStatus, dispatch])

  return (
    <div>
      <AddPostForm />
      <section className="posts-list">
        <h2>Posts</h2>
        {content}
      </section>
    </div>
  )
}
