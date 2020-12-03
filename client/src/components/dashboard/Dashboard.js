import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Spinner } from '../layout/Spinner';
import { getCurrentProfile, deleteAccount} from '../../actions/profile'
import DashBoardActions from './DashBoardActions';
import ExperienceList from './Experience';
import EducationList from './Education';

import PropTypes from 'prop-types';

const Dashboard = ({
  auth: {
    user
  },
  profile: {
    profile,
    loading
  },
  getCurrentProfile,
  deleteAccount 
}) => {
  
  React.useEffect(() => {
    getCurrentProfile()
  }, [getCurrentProfile]) //eslint-disable-line react-hooks/exhaustive-deps

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
           <EducationList education={profile.education}/>

           <div className="my-2">
             <button
              className='btn btn-danger'
              onClick={()=> deleteAccount()}
              >
               <i className='fas fa-user-minus m-1'>{'  '}</i>
               Delete My Account
             </button>
           </div>
   
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
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount})(Dashboard);
