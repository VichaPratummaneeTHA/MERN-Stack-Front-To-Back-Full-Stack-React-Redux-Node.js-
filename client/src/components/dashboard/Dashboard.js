import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from '../layout/Spinner';
import { getCurrentProfile } from '../../actions/profile'
import DashBoardActions from './DashBoardActions';
import ExperienceList from './Experience';

import PropTypes from 'prop-types';

const Dashboard = ({
  auth: {
    user
  },
  profile: {
    profile,
    loading
  },
  getCurrentProfile 
}) => {
  
  React.useEffect(() => {
    getCurrentProfile()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return (
   loading && profile === null 
   ? <Spinner />
   : <Fragment>
     <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user">{' '}Welcome {' '}{
          user ? user.name : null
        }</i>
      </p>
      {
        profile !== null 
        ? (
        <Fragment>
           <DashBoardActions />
           <ExperienceList experience={profile.experience} />
   
        </Fragment>)
        : (
        <Fragment>
           <p>You have not profile yet. Please create your profile and add some infomation ...</p>
           <Link to='/create-profile' className='btn btn-primary my-2'> Create New Profile</Link>
        </Fragment>)
      }
   </Fragment>
  )
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
