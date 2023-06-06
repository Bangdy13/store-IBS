import { toast } from "react-toastify";

export const ACTIONS = {
  NOTIFY: "NOTIFY",
  AUTH: "AUTH",
  ADD_TO_CART: "ADD_TO_CART",
  DEL_TO_MODAL: "DEL_TO_MODAL",
  ADD_TO_ORDER: "ADD_TO_ORDER",
  ADD_TO_USER: "ADD_TO_USER",
  ADD_TO_CATEGORY: "ADD_TO_CATEGORY",
};

export const AddToCart = (product, cart) => {
  if (product.inStock === 0) return toast.error("Produk ini sudah habis stock");

  const check = cart.every((item) => {
    return item._id !== product._id;
  });
  if (!check) {
    return toast.error("Produk ini sudah ada ditroli");
  } else {
    toast.success("Produk telah ditambah ketroli");
    return {
      type: "ADD_TO_CART",
      payload: [...cart, { ...product, quantity: 1 }],
    };
  }
};

export const Minus = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity -= 1;
  });
  return { type: "ADD_TO_CART", payload: newData };
};

export const Plus = (data, id) => {
  const newData = [...data];
  newData.forEach((item) => {
    if (item._id === id) item.quantity += 1;
  });
  return { type: "ADD_TO_CART", payload: newData };
};

export const DeleteItem = (data, id, type) => {
  const newData = data.filter((item) => item._id !== id);
  return { type, payload: newData };
};

export const UpdateItem = (data, id, post, type) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return { type, payload: newData };
};
