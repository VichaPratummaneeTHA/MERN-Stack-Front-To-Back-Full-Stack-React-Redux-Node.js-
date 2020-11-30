import React, { Fragment, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { addEducation } from '../../actions/profile';

export const AddEducation = ({
  addEducation,
  history
}) => {

  const [formData, setFormData] = useState({
    school: '', 
    degree: '', 
    fieldofstudy: '', 
    from: '', 
    to: '', 
    current: false, 
    description: ''
  });

  const [toDataDisabled, toggleDisabled] = useState(false);

  function handleOnChange(event){
    const {name, value} = event.target;

    setFormData(formData => {
        return {
          ...formData,
          [name]: value
        }
    } );
  }

  
  function handleOnCheck(){
    setFormData({...formData, current: !current});
    toggleDisabled(!toDataDisabled);
  }

  function handleSubmit(event){
    event.preventDefault();

    addEducation(formData, history );
  }

  const {school, degree,  fieldofstudy, from, to, current, description} = formData;  
  return (
    <Fragment>
        <h1 className="large text-primary">
        Add Your Education
      </h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form"
            onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school}
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            value={degree}
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Field Of Study" 
            name="fieldofstudy" 
            value={fieldofstudy}
            onChange={handleOnChange}
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input 
            type="date" 
            name="from"
            value={from}
            onChange={handleOnChange} 
          />
        </div>
        <div className="form-group">
          <p>
            <input 
              type="checkbox" 
              name="current"
              // check="{current}" 
              value={current}
              onChange={handleOnCheck} 

              /> Current School or Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input 
              type="date" 
              name="to" 
              value={to}
              onChange={handleOnChange}
              disabled={toDataDisabled ? 'disabled' : ''}   
          />
        </div>
        <div className="form-group">
          <textarea
              name="description"
              cols="30"
              rows="5"
              placeholder="Program Description"
              value={description}
              onChange={handleOnChange} 
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
        </form>
    </Fragment>
  )
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
}

export default connect(
  null, 
  {addEducation})
  (withRouter (AddEducation))
