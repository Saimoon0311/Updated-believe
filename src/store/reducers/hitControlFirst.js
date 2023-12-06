import actionTypes from '../saga-types';

/* The initial state of the reducer. */
const initialState = {
  hitControlFirst: false,
};
/* A map of action types to functions that will be called when the action is dispatched. */

const actionMap = {
  [actionTypes.ControlToggel]: (state, act) => {
    return {
      hitControlFirst: act.payload,
    };
  },
};

/**
 * If the action type is in the actionMap, call the corresponding function and return the result.
 * Otherwise, return the state
 * @param [state] - The current state of the reducer.
 * @param action - The action object that was dispatched.
 * @returns The handler function is being returned.
 */
const hit_Control = (state = initialState, action) => {
  const handler = actionMap[action.type];
  return handler ? handler(state, action) : state;
};

export default hit_Control;
