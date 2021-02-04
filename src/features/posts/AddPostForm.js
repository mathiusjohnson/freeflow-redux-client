import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { addNewPost } from './postsSlice'
import SkillSelector from '../dbSkills/SkillSelector'
import { addPostSkills } from '../postSkills/postSkillsSlice'

export default function AddPostForm() {
  const [content, setContent] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')
  const posts = useSelector(state => state.posts.entities)

  const postSkills = useSelector(state => state.postSkills.entities)

  const loggedInUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : ""
  // const selectedSkill = JSON.parse(localStorage.getItem('selected_skill'))

  const userId = loggedInUser.id;
  const dispatch = useDispatch()
  const onContentChanged = (e) => setContent(e.target.value)

  const canSave =
    [content, userId].every(Boolean) && addRequestStatus === 'idle'

  let id;

  let postLength = Object.keys(posts).length;

  let postSkillsId = Object.keys(postSkills).length

  const OnSavePostClicked = async () => {
    const selectedSkill = JSON.parse(localStorage.getItem('selected_skill'));

    if (canSave) {

      id = postLength + 1;
      if (id !== null && id !== undefined) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addNewPost({ 
            id: id,
            owner_id: userId, 
            text_body: content,
            active: true, 
            is_helper: false, 
            is_helped: false, 
            avatar: loggedInUser.avatar,
            username: loggedInUser.username,
          })
        )
        unwrapResult(resultAction)
        setContent('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
      try {
        console.log("dispatch addpostskills is firing");
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addPostSkills({ 
            post_id: id,
            db_skills_id: selectedSkill.id, 
            id: postSkillsId,
            name: selectedSkill.name
          })
        )
        unwrapResult(resultAction)
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }

    }
  }

  return (
    <section>
      <SkillSelector 
        id={id}
        // canTriggerAxios={triggerPostSkillAxios}
        loggedInUser={loggedInUser} />
      <form className="space-y-2 mx-2">
        <label htmlFor="postContent"></label>
        <textarea
          placeholder="Add a new post..."
          className="w-full  border-1 border-solid border-gray-400 rounded-xl p-5" 
          id="postContent rounded-xl"
          name="postContent"
          value={content}
          data-testid="postText"
          rows="3"
          onChange={onContentChanged}
        />
        <div className="flex justify-center">
          <div 
          className="btn btn-primary"
          type="button" 
          data-testid="sendButton"
          onClick={OnSavePostClicked} disabled={!canSave}>
            Post
          </div>
        </div>
      </form>
    </section>
  )
}
