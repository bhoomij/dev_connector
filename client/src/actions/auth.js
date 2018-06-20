import {TEST_DISPATCH } from './types';

export function registerUser(userData) {
    return {
        type: TEST_DISPATCH,
        payload: userData
    };
}