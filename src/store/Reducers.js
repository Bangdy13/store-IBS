import { ACTIONS } from "./Actions";

const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY:
      return { ...state, notify: action.payload };
    case ACTIONS.AUTH:
      return { ...state, auth: action.payload };
    case ACTIONS.ADD_TO_CART:
      return { ...state, cart: action.payload };
    case ACTIONS.DEL_TO_MODAL:
      return { ...state, modal: action.payload };
    case ACTIONS.ADD_TO_ORDER:
      return { ...state, orders: action.payload };
    case ACTIONS.ADD_TO_USER:
      return { ...state, users: action.payload };
    case ACTIONS.ADD_TO_CATEGORY:
      return { ...state, categories: action.payload };

    default:
      return state;
  }
};

export default reducers;
