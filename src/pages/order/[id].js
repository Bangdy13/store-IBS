/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import Mainlayout from "@/components/Mainlayout";
import PaypalBtn from "@/components/paypalBtn";
import { DataContext } from "@/store/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

export default function OrderDetailPage() {
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;
  const router = useRouter();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders, router.query.id]);

  if (!auth.user) return null;

  return (
    <Mainlayout title={"Order Detail"}>
      <div className="cart-page container">
        <h3 className="text-center mb-4 fw-semibold">
          {auth.user.role !== "user" ? `Admin Order` : `My Order`}
        </h3>
        <div className="col-2 mb-3">
          <button
            className="btn btn-primary"
            onClick={() => router.push("/dashboard")}
          >
            Back Order
          </button>
        </div>
        {orderDetail.map((order) => (
          <div className="row" key={order._id}>
            <div className="col-md-8">
              <div className="cart-page-inner shadow-sm">
                <h6
                  className="mb-3"
                  style={{ fontWeight: "600", fontSize: "18px" }}
                >
                  Alamat pengiriman
                </h6>
                <hr />
                <div className="pb-0">
                  <i className="bi bi-pin-map-fill me-2"></i>
                  <span
                    style={{ fontWeight: "600", fontSize: "16px" }}
                    className="me-2"
                  >
                    {order.fullname}
                  </span>
                  (+62){order.handphone}
                  <p className="my-1">
                    <b>E-mail :</b> {order.user.email}
                  </p>
                  <p className="my-1">
                    {order.address}, {order.city}, {order.country},{" "}
                    {order.poscode}
                  </p>
                </div>
              </div>
              <div className="cart-page-inner shadow-sm">
                <h6 style={{ fontWeight: "600", fontSize: "18px" }}>
                  Produk item
                </h6>
                {order.cart.map((item) => (
                  <div className="col-lg-12" key={item._id}>
                    <hr className="mb-1" />
                    <div className="d-flex border-bottom py-2">
                      <Link href={`/product/${item._id}`}>
                        <img
                          src={item.image[0].url}
                          alt="product"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                          className="img-thumbnail"
                        />
                      </Link>
                      <div className="ms-3">
                        <h5 style={{ fontWeight: "normal" }}>{item.name}</h5>
                        <div className="d-flex align-items-center justify-content-between">
                          <h6
                            style={{ fontWeight: "600", fontSize: "18px" }}
                            className="price"
                          >
                            {new Intl.NumberFormat("ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumSignificantDigits: 3,
                            }).format(item.price)}
                          </h6>
                          <h6
                            style={{ fontWeight: "normal" }}
                            className="text-end"
                          >
                            x{item.quantity}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-page-inner shadow-sm">
                <h6
                  className="mb-3"
                  style={{ fontWeight: "600", fontSize: "18px" }}
                >
                  Perincian pesanan
                </h6>
                <hr />
                <div className="d-flex justify-content-between">
                  <h6>Nomor pesanan</h6>
                  <h6
                    style={{ fontWeight: "normal", textTransform: "uppercase" }}
                  >
                    {order._id}
                  </h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Tanggal pesanan</h6>
                  <h6 style={{ fontWeight: "normal" }}>
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      hour12: true,
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Metode pembayaran</h6>
                  <h6 style={{ fontWeight: "normal" }}>
                    {order.methodPay ? `${order.methodPay}` : "-"}
                  </h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Tanggal pembayaran</h6>
                  <h6 style={{ fontWeight: "normal" }}>
                    {order.isPaid
                      ? `${new Date(order.dateOfPayment).toLocaleString(
                          "en-US",
                          {
                            hour12: true,
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}`
                      : "-"}
                  </h6>
                </div>
                <div className="d-flex justify-content-between">
                  <h6>Tanggal pengantaran</h6>
                  <h6 style={{ fontWeight: "normal" }}>
                    {order.isDelivered
                      ? `${new Date(order.updatedAt).toLocaleString("en-US", {
                          hour12: true,
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "-"}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="cart-page-inner shadow-sm">
                <div className="cart-summary">
                  <div className="cart-content">
                    <h1>Cart Summary</h1>
                    <p>
                      Total Items (
                      {order.cart.reduce((a, c) => a + c.quantity, 0)})
                      <span>
                        {new Intl.NumberFormat("ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        }).format(order.itemsPrice)}
                      </span>
                    </p>
                    <p>
                      Shipping
                      <span>
                        {new Intl.NumberFormat("ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        }).format(order.shippingPrice)}
                      </span>
                    </p>
                    <h2>
                      Total
                      <span>
                        {new Intl.NumberFormat("ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumSignificantDigits: 3,
                        }).format(order.totalPrice)}
                      </span>
                    </h2>
                  </div>
                  <div
                    className="button-checkout mt-3"
                    // onClick={() => router.push("signin?redirect=/shipping")}
                  >
                    {!order.isPaid && auth.user.role !== "admin" && (
                      <PaypalBtn
                        itemsPrice={order.itemsPrice}
                        shippingPrice={order.shippingPrice}
                        totalPrice={order.totalPrice}
                        order={order}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Mainlayout>
  );
}
