import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_SINGLE_POST
} from '../actions/types'

const inittialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

function switchPostCase( state = inittialState, action){

  switch(action.type){
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case GET_SINGLE_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }
     case ADD_POST:
       return {
         ...state,
         posts: [...state.posts, action.payload],
         loading: false
       } 
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
        loadind: false
      };
    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts:
          state.posts.map(post => post._id === action.payload.id
          ? {
            ...post, 
            likes: action.payload.likes
          }
          : post   
          ),
        loading: false  
      }
    default:
      return state;
  }
}

export default switchPostCase;