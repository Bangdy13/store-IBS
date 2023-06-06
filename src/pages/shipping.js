import Mainlayout from "@/components/Mainlayout";
import { DataContext } from "@/store/GlobalContext";
import React, { useContext, useEffect, useState } from "react";
// import PaypalBtn from "@/components/paypalBtn";
import { toast } from "react-toastify";
import { getData, postData } from "@/utils/fetchData";
import { useRouter } from "next/router";

export default function ShippingAddress() {
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart, orders } = state;

  const [fullname, setFullname] = useState("");
  const [handphone, setHandphone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [poscode, setPosCode] = useState("");

  // const [payment, setPayment] = useState(false);
  const [callback, setCallback] = useState(false);

  const router = useRouter();

  const handlePayment = async () => {
    if (!fullname || !handphone || !address || !city || !country || !poscode) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Silahkan isi semua form dengan benar" },
      });
      return toast.error("Silahkan isi semua form dengan benar");
    }
    let newCart = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item);
      }
    }
    if (newCart.length < cart.length) {
      setCallback(!callback);
      dispatch({
        type: "NOTIFY",
        payload: { error: "Produk ini habis stock" },
      });
      return toast.error("Produk ini habis stock atau jumlah produk sedikit");
    }
    dispatch({
      type: "NOTIFY",
      payload: { loading: true },
    });
    postData(
      "order",
      {
        fullname,
        handphone,
        address,
        city,
        country,
        poscode,
        itemsPrice,
        shippingPrice,
        totalPrice,
        cart,
      },
      auth.token
    ).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      dispatch({ type: "ADD_TO_CART", payload: [] });

      const newOrder = {
        ...res.newOrder,
        user: auth.user,
      };

      dispatch({ type: "ADD_TO_ORDER", payload: [...orders, newOrder] });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      toast.success(res.msg);
      return router.push(`/order/${res.newOrder._id}`);
    });
  };

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cart.reduce((a, c) => a + c.quantity * c.price, 0));
  const shippingPrice = round2(itemsPrice * 0.05);
  const totalPrice = round2(itemsPrice + shippingPrice);

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
  }, [dispatch, callback]);

  return (
    <Mainlayout title="ShippingAddress">
      <div className="row w-75 mx-auto">
        <div className="col-75 card py-3">
          <div className="container">
            <form style={{ maxWidth: "100%" }}>
              <div className="row">
                <div className="col-50">
                  <h3>ALamat Pengiriman</h3>
                  <label htmlFor="fullname">
                    <i className="bi bi-person-fill" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="John M. Doe"
                  />
                  <label htmlFor="handphone">
                    <i className="bi bi-phone-fill" /> No.Handphone
                  </label>
                  <input
                    type="text"
                    id="handphone"
                    name="handphone"
                    value={handphone}
                    onChange={(e) => setHandphone(e.target.value)}
                    placeholder="081984******"
                  />
                  <label htmlFor="address">
                    <i className="bi bi-person-vcard-fill" /> ALamat Lengkap
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="542 W. 15th Street"
                  />
                  <label htmlFor="city">
                    <i className="bi bi-bank" /> Kota
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                  />
                  <div className="row">
                    <div className="col-50">
                      <label htmlFor="country">Negara</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Negara"
                      />
                    </div>
                    <div className="col-50">
                      <label htmlFor="poskode">Kode Pos</label>
                      <input
                        type="text"
                        id="poskode"
                        name="poskode"
                        value={poscode}
                        onChange={(e) => setPosCode(e.target.value)}
                        placeholder={10001}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-25 card h-50 ms-3 py-3">
          <div className="container">
            <h4>
              Cart items
              <span className="price" style={{ color: "black" }}>
                <i className="bi bi-cart-fill me-1" />
                <b>{cart.reduce((a, c) => a + c.quantity, 0)}</b>
              </span>
            </h4>
            <p>
              Sub Total{" "}
              <span className="price">
                {new Intl.NumberFormat("ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(itemsPrice)}
              </span>
            </p>
            <p>
              Shipping{" "}
              <span className="price">
                {new Intl.NumberFormat("ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(shippingPrice)}
              </span>
            </p>
            <hr />
            <p>
              Total{" "}
              <span className="price" style={{ color: "black" }}>
                <b>
                  {new Intl.NumberFormat("ID", {
                    style: "currency",
                    currency: "IDR",
                    maximumSignificantDigits: 3,
                  }).format(totalPrice)}
                </b>
              </span>
            </p>

            <button className="btn button-cart" onClick={handlePayment}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
