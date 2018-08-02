import {
    GET_TASK,
    GET_TASKS,
    TASK_LOADING,
    DELETE_TASK,
} from '../types';

const initialState = {
    task: null,
    tasks: null,
    loading: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TASK_LOADING:
        console.log('reducer TASK_LOADING ');
            return {
                ...state,
                loading: true
            };
        case GET_TASK:
            return {
                ...state,
                task: action.payload,
                loading: false
            };
        case DELETE_TASK:
            return {
                ...state,
                tasks: state.tasks.filter(task => task._id !== action.payload)
            };
        case GET_TASKS:
            return {
                ...state,
                tasks: action.payload,
                loading: false
            };
        default:
            return state;
    }
}
