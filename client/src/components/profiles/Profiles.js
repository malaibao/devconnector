import React, { useEffect } from 'react';
import ProfileItem from './ProfileItem';
import { connect } from 'react-redux';
import { getProfiles } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import PropTypes from 'prop-types';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <h1 className='large text-primary'>Developers</h1>
          <p className='lead'>
            <i className='fab fa-connectdevelop'></i>
            Browse and connect with developers
          </p>
          <div>
            {profiles.length > 0 ? (
              profiles.map(profile => (
                <ProfileItem key={profile._id} profile={profile} />
              ))
            ) : (
              <h4>No profiles found. </h4>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
