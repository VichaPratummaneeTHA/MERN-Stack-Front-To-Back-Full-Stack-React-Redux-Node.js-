import axios from 'axios';
import {
  GET_PROFILE,
  GET_PROFILES,
  GET_REPOS,
  PROFILE_ERROR, 
  UPDATE_PROFILE,
  ACCOUNT_DELETED,
  CLEAR_PROFILE
  }  from './types';
import {setAlert} from './alert'


/*----- GET PROFILE -----*/

// Get Current Users Profile 

export const getCurrentProfile = () => async dispatch => {
    try {
      const res = await axios.get('api/profile/me');
  
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {

      dispatch({ 
        type: CLEAR_PROFILE 
      });

      dispatch({
        type: PROFILE_ERROR,
        payload: { 
          msg: err.response.statusText, 
          status: err.response.status
        }
      });
    }
  }

// GET All Profiles

export const getAllProfiles = () => async dispatch => {

    // dispatch({ type: CLEAR_PROFILE });

  try {

    const res = await axios.get('/api/profile');

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
    
  } catch (err) {
    
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response
       
      }
    });
  }
}

// GET Profile By Id

export const getProfileById = userId => async dispatch => {
  try {

   const res = await axios.get(`/api/profile/user/${userId}`); 

   dispatch({
     type: GET_PROFILE,
     payload: res.data
   });
    
  } catch (err) {
    
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response
        
      }
    });
  }
}

// GET Repos from Github username

export const getRepos = userName => async dispatch => {
  try {

    const res = await axios.get(`/api/profile/github/${userName}`);
    
    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
    
  } catch (err) {
    
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response
       
      }
    });
  }
}

/*----- CREATE & UPDATE PROFILE -----*/

 // Create or Update Profile 
 
 export const createAndUpdateProfile = (formData, history, edit = false) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.post('/api/profile', formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    dispatch(setAlert( edit === true ? 'Profile Updated Successfully ...' : 'Profile Created Successfully ...', 'success'));

    if(!edit){
      history.push('/dashboard');
    }
    
  } catch (err) {

    const erros = err.response.data.erros

    if(erros){
      erros.forEach(error => 
        dispatch(setAlert(error.msg, 'danger'))  
      );
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { 
        msg: err.response.statusText, 
        status: err.response.status
      }
    });
  }
 }

 // Add Profile Experience 

 export const addExperience = (formData, history) => async dispatch => {

  try {
    const config ={
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const res = await axios.put('/api/profile/experience', formData, config);
    
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(
      'Experience Added Successfully ...',
      'success'
    ));

    history.push('/dashboard');

  } catch (err) {
    
    const errors = err.response.data.erros;

    if(errors){
      errors.forEach( error => 
        dispatch(setAlert(error.msg, 'danger'))
        );
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
 }

 // Add Profile Education

 export const addEducation = (formData, history) => async dispatch => {
   try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    const res = await axios.put('/api/profile/education', formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert(
      'Education Added Successfully ...',
      'success'
    ));

    history.push('/dashboard');

   } catch (err) {
     const errors = err.response.data.erros;

     if(errors){
      errors.forEach( error => 
        dispatch(setAlert(
          error.msg,
          'danger'
        )));
     }

     dispatch({
       type: PROFILE_ERROR,
       payload: {
         msg: err.response.statusText,
         status: err.response.status
       }
     });
   }
 }

/*----- DELETE USER & PROFILE -----*/

//Delete Experience

export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Experience Delete Successfully ...', 'danger'));
    
  } catch (err) {
    
    dispatch({
      type: PROFILE_ERROR,
      payload:{
        msg: err.response.statusText,
        status: err.response.status
      }
    }); 
  }
}

// Delete Education

export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert('Education Delete Successfully ...', 'danger'));
    
  } catch (err) {
    
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    });
  }
}

// Delete Account and Profile 

  export const deleteAccount = () => async dispatch => {

    if(window.confirm('Are you sure? This can NOT be undone ...')){
      try {
        await axios.delete('/api/profile');

        dispatch({
          type: CLEAR_PROFILE
        });
        
        dispatch({
          type: ACCOUNT_DELETED
        });

        dispatch(setAlert('You Account has been permanatly deleted ...'));

      } catch (err) {
        
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status
          }
        });
      }
    }
  }






