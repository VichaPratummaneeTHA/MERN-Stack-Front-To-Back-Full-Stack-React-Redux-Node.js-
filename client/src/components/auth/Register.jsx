import React, {Fragment, useState} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

// import axios from 'axios';

const Register = (props) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2} = formData;

  function handleOnChange(event){
    const {name, value} = event.target;

    setFormData(function(prevData){
      return{
        ...prevData,
        [name]: value
      }
    });
  }

  async function handleOnSubmit(event){

    event.preventDefault();

    if(password !== password2){
      props.setAlert('Password do not match', 'danger');
    }else{
      props.register({ name, email, password});
    // console.log('Register Sussfully ...');
    }
  }

  if(props.isAuthenticated){
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
     <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>

      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-group">
          <input 
          type="text" 
          placeholder="Name" 
          name="name" 
          value={name}
          onChange={handleOnChange}
          />
        </div>

        <div className="form-group">
          <input 
          type="email" 
          placeholder="Email Address" 
          name="email"
          value={email}
          onChange={handleOnChange} 
        
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image use a
            Gravatar email</small>
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleOnChange}
            
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={handleOnChange}
           
          />
        </div>
        <input 
        type="submit" 
        className="btn btn-primary" 
        value="Register" />
      </form>
      <p className='my-1'>
        Already have an account? <Link to= '/login'>Sign In</Link>
      </p>
     
    </Fragment>   
  )
}

//Validating React component props with prop-types
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register})(Register);


    // ------ How to Create newUser into Data Base ----- //  
    //  const newUser = {
    //    name,
    //    email,
    //    password
    //  }
     
    //  try {
    //    const res = await axios.post('/api/users', newUser);
    //    console.log(res.data);
    //  } catch (err) {
    //    console.error(err.response.data);
    //  }