import offerActionTypes from "./types";

const INITIAL_STATE = {
  update: false,
};

const offerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case offerActionTypes.UPDATE_OFFER_LIST:
      return {
        ...state,
        update: !state.update,
      };
    default:
      return state;
  }
};

export default offerReducer;
