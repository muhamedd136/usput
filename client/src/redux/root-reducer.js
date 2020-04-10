import offerReducer from "./offers/reducer";
import { combineReducers } from "redux";

export default combineReducers({
  offers: offerReducer,
});
