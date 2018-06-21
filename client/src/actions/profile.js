import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading())
    axios.get('/api/profile')
        .then(res =>
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => dispatch({
            type: GET_PROFILE,
            payload: {}
        }));
};
// set profile
const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING,
    }
}

// clear current profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE,
    }
}