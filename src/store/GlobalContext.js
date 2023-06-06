import { createContext, useEffect, useReducer } from "react";
import reducers from "./Reducers";
import { getData } from "@/utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.err) return localStorage.removeItem("firstLogin");
        dispatch({
          type: "AUTH",
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }
    getData("categories").then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch({ type: "ADD_TO_CATEGORY", payload: res.categories });
    });
  }, []);

  useEffect(() => {
    const save_cart = JSON.parse(localStorage.getItem("save_cart"));
    if (save_cart) dispatch({ type: "ADD_TO_CART", payload: save_cart });
  }, []);

  useEffect(() => {
    localStorage.setItem("save_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: "NOTIFY", payload: { error: res.err } });
        dispatch({ type: "ADD_TO_ORDER", payload: res.orders });
      });
      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: "NOTIFY", payload: { error: res.err } });
          dispatch({ type: "ADD_TO_USER", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_TO_ORDER", payload: [] });
      dispatch({ type: "ADD_TO_USER", payload: [] });
    }
  }, [auth.token, auth.user]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
