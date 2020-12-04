import React, {useState} from 'react'
import PropTypes from 'prop-types'

//redux
import { connect } from 'react-redux'
import { addPost } from '../../actions/post'

const PostForm = ({
  addPost
}) => {

  const [text, setText] = useState('');

  // function handleOnChange(event){
  //   const {name, value} = event.target;

  //   setText(text => {
  //     return {
  //       ...text,
  //       [name]: value
  //     }
  //   });
  // }

  // function handleOnSubmit(event){
  //   event.preventDefault();
  //   addPost(text);
  //   setText('');
  // }

  return (
     <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form 
          className="form my-1"
          onSubmit={event => {
            event.preventDefault();
            addPost({ text });
            setText(' ');
          }} 
            >
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            value={text}
            onChange={event => setText(event.target.value)}
            
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
  )
}

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
}

export default connect(null, {addPost})(PostForm)