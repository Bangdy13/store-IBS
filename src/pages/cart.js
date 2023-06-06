/* eslint-disable @next/next/no-img-element */
import Mainlayout from "@/components/Mainlayout";
import { Minus, Plus } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { getData } from "@/utils/fetchData";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";

function CartPage() {
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cart.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = round2(itemsPrice * 0.05);
  const totalPrice = round2(itemsPrice + shippingPrice);

  // const [total, setTotal] = useState(0);
  // const [callback, setCallback] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   const getTotal = () => {
  //     const res = cart.reduce((prev, item) => {
  //       return prev + totalPrice * item.quantity;
  //     }, 0);
  //     setTotal(res);
  //   };
  //   getTotal();
  // }, [cart]);

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem("save_cart"));
    if (cartLocal && cartLocal.length > 0) {
      let newArray = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`);
          const { _id, name, image, inStock, price, sold } = res.product;
          if (inStock > 0) {
            newArray.push({
              _id,
              name,
              image,
              inStock,
              price,
              sold,
              quantity: item.quantity > inStock ? 1 : item.quantity,
            });
          }
        }
        dispatch({ type: "ADD_TO_CART", payload: newArray });
      };
      updateCart();
    }
  }, [dispatch]);
  return (
    <Mainlayout title="Cart page">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mx-0">
            <li className="breadcrumb-item">
              <Link href="/" legacyBehavior id="link">
                <a>Home</a>
              </Link>
            </li>
            <li
              className="breadcrumb-item active text-capitalize"
              aria-current="page"
            >
              My Cart
            </li>
          </ol>
        </nav>
      </div>
      <div className="cart-page">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-8">
              <div className="cart-page-inner">
                {cart.length === 0 ? (
                  <h6>
                    Cart empty{" "}
                    <Link href="/" className="text-primary">
                      Go to shopping
                    </Link>{" "}
                  </h6>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody className="align-middle">
                        {cart?.map((item) => (
                          <tr key={item._id}>
                            <td>
                              <div className="img">
                                <Link href={`product/${item._id}`}>
                                  <img
                                    src={item?.image[0]?.url}
                                    alt="website template image"
                                    className="img-thumbnail"
                                  />
                                </Link>
                                <p>{item.name}</p>
                              </div>
                            </td>
                            <td>
                              {new Intl.NumberFormat("ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumSignificantDigits: 3,
                              }).format(item.price)}
                            </td>
                            <td>
                              <div className="qty">
                                <button
                                  className="btn-minus"
                                  onClick={() =>
                                    dispatch(Minus(cart, item._id))
                                  }
                                  disabled={item.quantity === 1 ? true : false}
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  className="btn-plus"
                                  onClick={() => dispatch(Plus(cart, item._id))}
                                  disabled={
                                    item.quantity === item.inStock
                                      ? true
                                      : false
                                  }
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td>
                              <button
                                className="button_trash"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() =>
                                  dispatch({
                                    type: "DEL_TO_MODAL",
                                    payload: [
                                      {
                                        data: cart,
                                        id: item._id,
                                        name: item.name,
                                        type: "ADD_TO_CART",
                                      },
                                    ],
                                  })
                                }
                              >
                                <i className="bi bi-trash-fill" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            {cart.length === 0 ? null : (
              <div className="col-lg-4">
                <div className="cart-page-inner">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="cart-summary">
                        <div className="cart-content">
                          <h1>Cart Summary</h1>
                          <p>
                            Total Items (
                            {cart.reduce((a, c) => a + c.quantity, 0)})
                            <span>
                              {new Intl.NumberFormat("ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumSignificantDigits: 3,
                              }).format(itemsPrice)}
                            </span>
                          </p>
                          <p>
                            Shipping
                            <span>
                              {new Intl.NumberFormat("ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumSignificantDigits: 3,
                              }).format(shippingPrice)}
                            </span>
                          </p>
                          <h2>
                            Total
                            <span>
                              {new Intl.NumberFormat("ID", {
                                style: "currency",
                                currency: "IDR",
                                maximumSignificantDigits: 3,
                              }).format(totalPrice)}
                            </span>
                          </h2>
                        </div>
                        <div
                          className="button-checkout"
                          onClick={() =>
                            router.push("signin?redirect=/shipping")
                          }
                        >
                          <button>Checkout</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
