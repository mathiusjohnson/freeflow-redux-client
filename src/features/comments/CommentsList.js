import React from 'react'
import { useSelector } from 'react-redux'
import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'

import { selectCommentsByPostId } from './commentsSlice'
import { selectAllExperiences } from '../experiences/experiencesSlice'

export const CommentsList = ({ postId }) => {
  const comments = useSelector((state) => selectCommentsByPostId(state, postId))
  
  console.log(comments, postId);
  const users = useSelector(selectAllUsers)
  const karmas = useSelector(selectAllExperiences)

  console.log("comments in commentlist: ", comments);
  
  const renderedComments = comments.map((comment) => {
    const date = parseISO(comment.time_posted)
    const timeAgo = formatDistanceToNow(date)

    const user = users.find((user) => user.id === comment.commenter_id) || {
      name: 'Unknown User',
    }

    const commentClassname = classnames('comment', {
      new: comment.isNew,
    })

    const commentKarmas = karmas.filter(karma => karma.comment_id === comment.id)

    const commentExperience = (commentKarmas.length * 29);

    return (
      <div key={comment.id} className={commentClassname}>
        <div>
          {comment.content}
          <div title={comment.created_at}   className="commentInfo">
            <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`}/>
            <b>{`${user.first_name} ${user.last_name}`}</b>
            {commentExperience !== 0 ?             <p>Gained {commentExperience} experience </p>
            : "" }
            <i className="commentTime">{timeAgo} ago</i>
          </div>
        </div>
      </div>
    )
  })

  return (
    <section className="commentsList">
      <h2>Comments</h2>
      {renderedComments}
    </section>
  )
}
