import axios from 'axios';
import jwt_decode from 'jwt-decode'
import setAuthHeader from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(res=>history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    }
}

// Login User
export const loginUser = (userData) => dispatch => {
    axios
        .post('/api/users/login', userData)
        .then(res=> {
            console.log(res.data);
            const {token} = res.data;
            // Save token
            localStorage.setItem('jwtToken', token);
            // Set header
            setAuthHeader(token);
            // Decode token
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};