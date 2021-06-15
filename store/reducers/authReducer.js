//import { LOGIN, SIGNUP } from '../actions/authAction';
import { AUTHENTICATE, LOGOUT } from '../actions/authAction';

const initialState = {
    token: null,
    userId: null
};

export default (state = initialState, action) => {
    
    switch (action.type) {
        
        // case LOGIN: {

        //     console.log('\n---action in authReducer:\n', action);

        //     return {
        //         ...state,
        //         token: action.token,
        //         userId: action.userId
        //     };
        // }
        // case SIGNUP: {
        //     return {
        //         ...state,
        //         token: action.token,
        //         userId: action.userId
        //     };
        // }

        case AUTHENTICATE: {
            return {
                ...state,
                token: action.token,
                userId: action.userId
            };
        }
        case LOGOUT: {
            return initialState;
        }
        
    }

    return state;
};