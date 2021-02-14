import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import {
	fetchLikes, 
	selectLikesByPostId, 
  addNewLike,
  removeLike
} from './likesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as farThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { faThumbsUp as fasThumbsUp } from '@fortawesome/free-solid-svg-icons';

export default function Likes({ postId, userId }) {
	const dispatch = useDispatch()
	const likes = useSelector((state) => selectLikesByPostId(state, postId))
    console.log("likes in likes: ", likes);

  const likeStatus = useSelector((state) => state.likes.status)
  const myLikes = userId ? likes.filter(
    (like) => userId === like.liker_id
  ) : "";  
	const likeSum = likes.length;

	const iAlreadyLikeThis = myLikes ? myLikes.length > 0 : "";

	const [addRequestStatus, setAddRequestStatus] = useState('idle')


  const canSave =
   addRequestStatus === 'idle'

  //  ADDLIKE FUNCTION
  const addLike = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          addNewLike({   post_id: postId, liker_id: userId })
        )
        unwrapResult(resultAction)

      } catch (err) {
        console.error('Failed to add like to post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  // UNLIKE FUNCTION
  const unLike = async () => {
    
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        const resultAction = await dispatch(
          removeLike({   id: myLikes[0].id, post_id: postId, liker_id: userId })
        )
        unwrapResult(resultAction)

      } catch (err) {
        console.error('Failed to remove like from post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
	}
	

  // FETCH LIKES USEEFFECT
  useEffect(() => {
    if (likeStatus === 'idle') {
      dispatch(fetchLikes())
    }
  }, [likeStatus, dispatch])
  let fetchedLikes
  if (likeStatus === 'loading') {
    fetchedLikes = null
  } else if (likeStatus === 'succeeded') {
    fetchedLikes = likes
  } else if (likeStatus === 'failed') {
    fetchedLikes = null
  }
  if (fetchedLikes !== undefined && fetchedLikes !== null) {
  }

  // LIKE UNLIKE FUNCTION
  const LikeUnlikeIcons = iAlreadyLikeThis ? (
    <div onClick={() => unLike(postId, userId)}
    className="flex space-x-2 items-center  cursor-pointer font-bold btn btn-primary">
      <FontAwesomeIcon 
      className=""
      icon={fasThumbsUp} size="1x" />
      <div     onClick={() => unLike(postId, userId)}
      >Like</div>
    </div>
  ) : (     
    <div onClick={() => addLike(postId, userId)}
    className="flex space-x-2 items-center  cursor-pointer text-black font-bold btn btn-secondary rounded-lg">
      <FontAwesomeIcon 
        className="love"
        icon={farThumbsUp} size="1x" />
        <div>Like</div>
    </div>             

  )

  // LIKES COUNT
  const IPlusOneLikesThis = iAlreadyLikeThis && likeSum > 1 ? 
    <p ><b>You and {likeSum - 1} others</b></p> : "";

  const PlusOneLikesThis = !iAlreadyLikeThis && likeSum > 1 ? 
    <p><b>{likeSum}  likes</b></p> : "";

  const OnlyILikeThis = iAlreadyLikeThis && likeSum === 1 ? 
    <p ><b>You like this</b></p> : "";

  const OnlyOneLikesThis = !iAlreadyLikeThis && likeSum === 1 ? 
		<p><b>{likeSum} like</b></p> : "";
		
	return (
    <div className="flex flex-col items-end justify-end space-x-2 mr-2 text-green-500 mt-3 text-sm">

        {/* LIKES COUNT - conditionally renders one of these like count templates */}
        <div className="-mt-0.5">
          {IPlusOneLikesThis}
          {PlusOneLikesThis}
          {OnlyILikeThis}
          {OnlyOneLikesThis}
        </div>
        
        {/* conditionally renders like or unlike icon */}
        {LikeUnlikeIcons}
			</div>
	);
};