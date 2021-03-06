import React from 'react'
import { useSelector } from 'react-redux'
import { selectPostsByUser } from '../../reducers/postsSlice'
import { selectHelperExperiencesByUserId } from '../../reducers/experiencesSlice'
import { loadState } from '../../helpers/localStorage'
import { selectUserById } from '../../reducers/usersSlice'
import PostExcerpt from '../posts/PostExcerpt'
import UserCard from './UserCard'
// import AddPostForm from '../posts/AddPostForm';
// import {Link} from 'react-router-dom'

export default function UserPage () {
  const userId = loadState()
  // const loggedInUser = useSelector(state => state.user)
  const user = useSelector((state) => selectUserById(state, userId))

  const postsForUser = useSelector((state) => selectPostsByUser(state, userId))

  const experiencesForUser = useSelector((state) => selectHelperExperiencesByUserId(state, userId))

  if (!user || !postsForUser || !experiencesForUser) {
    return null
  }

  const sortedArr = [...postsForUser].sort((a, b) => new Date(b.time_posted) - new Date(a.time_posted))

  const renderedPosts = sortedArr.map((post, index) =>
    <PostExcerpt key={index} postId={post.id} index={index} />
  )

  return (
    <section className="space-y-3 pt-2 mt-2">
      {/* <UserSkillsList /> */}

      <div className="">
        <div className="col-span-2">
          <UserCard
            id={user.id}
            firstName={user.first_name}
            lastName={user.last_name}
            active={user.active}
            location={user.location}
            created_at={user.created_at}
            profession={user.profession}
            tagline={user.tagline}
          />
        </div>
      </div>
      <div className="">
        <h2 className="text-2xl font-semibold text-center border-2 border-green-500 rounded-xl bg-green-500 text-white mx-12">Timeline: </h2>
      </div>
      <section className="">
        {renderedPosts}
      </section>
    </section>
  )
}
