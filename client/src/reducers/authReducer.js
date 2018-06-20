import { TEST_DISPATCH } from '../actions/types';

const initState = {
    isAuthenticated: false,
    user: {}
};

export default function(state = initState, action) {
    switch(action.type) {
        case TEST_DISPATCH:
            return {
                ...state,
                user:action.payload
            }
        default:
        return state;
    }
}