import axios from 'axios';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_SINGLE_POST,
  ADD_COMMENT,
  REMOVE_COMMENT

} from './types';

import { setAlert } from './alert';

// GET Posts

export const getPosts =() => async dispatch => {

  try {

  const res = await axios.get('/api/posts'); 
  
  dispatch({
    type: GET_POSTS,
    payload: res.data
  });
    
  } catch (err) {
    
    dispatch({
      type: POST_ERROR,
      payload:{
        msg: err.respones.statusText,
        status: err.respones.status
      }
    });

  }
}

// GET Sigle Post

export const getSinglePost = id => async dispatch => {
  try {

    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
      type: GET_SINGLE_POST,
      payload: res.data
    });
    
  } catch (err) {
    
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.respones
      }
    });
  }
}

// Add Post
export const addPost = formData => async dispatch => {

  const config = {
    headers:{
      'Content-Type': 'application/json'
    }
  }

  try {

    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Add successfully', 'success'));
    
  } catch (err) {

    dispatch({
      type: POST_ERROR,
      payload:{
        msg: err.respones
      }
    });
  }
}

// Add Like 

export const addLike = id => async dispatch => {

  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload:{
        id,
        likes: res.data
      }
    });
    
  } catch (err) {
    
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.respones
        //status: err.respones.status
      }
    });
  }
}

// Remove Like

export const removeLike = id => async dispatch => {
   
  try {

    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: res.data
      }
    });
    
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.respones
        //,status: err.respones.status
      }
    });
  }
}

// Delete Post

export const deletePost = id => async dispatch => {

  try {

    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id
    });

    dispatch(setAlert('Post Delete Successfully ...', 'success'));
    
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.respones
      }
    });
  }
}

// Add Comment
export const addComment = (postId, formData) => async dispatch => {

  const config = {
    headers:{
      'Content-Type': 'application/json'
    }
  }

  try {

    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    });

    dispatch(setAlert('Comment Add Successfully ...', 'success'));
    
  } catch (err) {

    dispatch({
      type: POST_ERROR,
      payload:{
        msg: err.respones
      }
    });
  }
}

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {

  try {

   await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    });

    dispatch(setAlert('Comment Delete Successfully ...', 'success'));
    
  } catch (err) {
    
    dispatch({
      type: POST_ERROR,
      payload:{
        msg: err.respones
      }
    });
  }
}