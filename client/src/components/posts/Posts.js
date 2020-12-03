import React, { Fragment, useEffect }from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '../layout/Spinner';
import PostItem from './PostItem';
// redux
import { connect } from 'react-redux';
import { getPosts } from '../../actions/post';

const Posts = ({
  post:{
    posts,
    loading
  },
  getPosts
}) => 
{
  useEffect(()=>{
    getPosts();
  }, [getPosts]);

  return (
    loading 
    ?<Spinner />
    :
    <Fragment>
      <h1 className='large text-primary'>POST</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Welcome To Community
      </p>
      {/* PostForm*/}
      
      <div className="posts">
        {
          posts.map(post => (
            <PostItem
              key={post._id}
              post={post}
             />
          ))
        }
      </div>
    </Fragment>
  )
}

Posts.propTypes = {
  post: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  post: state.post
}); 

export default connect(mapStateToProps, { getPosts })(Posts)
