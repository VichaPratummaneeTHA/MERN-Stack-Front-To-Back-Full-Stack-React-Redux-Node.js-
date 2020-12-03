import React, {useEffect, Fragment} from 'react'
import PropTypes from 'prop-types'
import { Spinner } from '../layout/Spinner'
//redux
import { connect } from 'react-redux'
import { getRepos } from '../../actions/profile'

const ProfileGithub = ({
userName,
 repos,
 getRepos
}) => {
  useEffect(()=> {
    getRepos(userName);
  },[getRepos, userName]);
  return (
  <Fragment>
    {repos === null
    ?( <Spinner />)
    :
      repos.map(repo => (
        <div key={repo.id} className='repo bg-white p-1 my-1'>
            <div>
              <h4>
                <a 
                href={repo.html_url}
                target='_blank'
                rel='noopener noreferrer'
                >
                {repo.name} 
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repo.stargazers_count}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repo.watchers_count}
                </li>
                <li className='badge badge-light'>
                  Forks: {repo.forks_count}
                </li>
              </ul>
            </div>
        </div>
      ))
    }
  </Fragment>
  )
}

ProfileGithub.propTypes = {
  getRepos: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  repos: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  repos: state.profile.repos
});

export default connect(mapStateToProps, {getRepos})(ProfileGithub)
