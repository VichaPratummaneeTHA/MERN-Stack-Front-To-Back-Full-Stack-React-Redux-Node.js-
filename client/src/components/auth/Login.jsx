import React, {useState, Fragment} from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';


const Login = (props) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  function handleOnChange(event){
    const {name, value} = event.target;

    setFormData(function(prevData){
      return{
        ...prevData,
        [name]: value
      }
    });
  }

  function handleOnSubmit(event){
    event.preventDefault();
    props.login(email, password);
 }

 // Redirct to Dashboard if Login success
 if(props.isAuthenticated){
  return <Redirect to='/dashboard' />;
 }

  return (
    <Fragment>
     <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>

      <form className="form" onSubmit={handleOnSubmit}>
        <div className="form-group">
          <input 
          type="email" 
          placeholder="Email Address" 
          name="email"
          value={email}
          onChange={handleOnChange} 
         
          />
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
        <input 
        type="submit" 
        className="btn btn-primary" 
        value="Login" />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to= '/register'>Sign Up</Link>
      </p>
     
    </Fragment>
  )
}

//Validating React component props with prop-types
Login.prototypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);