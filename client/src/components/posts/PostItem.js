import React  from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'

//Redux
import { connect } from 'react-redux'
import { addLike, removeLike} from '../../actions/post'

const PostItem = ({
  post:{
    _id,
    user,
    name,
    text,
    avatar,
    likes,/* this array*/
    comments,/* this array*/
    date
  },
  auth,
  addLike,
  removeLike
}) => {
  return (
    <div className="post bg-white p-1 my-1">
    <div>
      <a href="profile.html">
        <img
          className="round-img"
          src={avatar}
          alt=""
        />
        <h4>{name}</h4>
      </a>
    </div>
    <div>
      <p className="my-1">{text}</p>
       <p className="post-date">
          Posted on <Moment format='DD/MM/YYYY'>{date}</Moment>
      </p>
      <button 
        type="button" 
        className="btn btn-light"
        onClick={ event => addLike(_id)}
        >
        <i className="fas fa-thumbs-up" />{' '}
        {likes.length > 0 
         ?(<span> {likes.length}</span>)
         :(null) 
        }  
      </button>

      <button 
        type="button" 
        className="btn btn-light"
        onClick={ event => removeLike(_id)}
        >
        <i className="fas fa-thumbs-down" />
      </button>
      <Link to={`/posts/${_id}`} className="btn btn-primary">
        Discussion {' '}
        {comments.length > 0 
          ?(<span className='comment-count' > {comments.length}</span>)
          :(null)
        }
       
      </Link>

      {
        !auth.loading && user === auth.user._id
        ?(
          <button      
              type="button"
              className="btn btn-danger"
          >
              <i className="fas fa-times"></i>
            </button>
        )
        :(null)
      }
    
    </div>
  </div>
  )
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addLike, removeLike})(PostItem)
