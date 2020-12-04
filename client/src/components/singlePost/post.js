import React, {Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '../layout/Spinner'

//redux
import { connect } from 'react-redux'
import { getSinglePost } from '../../actions/post'

const post = ({
  getSinglePost
}) => {
  useEffect(()=>{
    getSinglePost()
  }, [getSinglePost]);
  
  return (
    <div>
      
    </div>
  )
}

post.propTypes = {
  getSinglePost: PropTypes.func.isRequired
}

export default connect(null, { getSinglePost })(post)
