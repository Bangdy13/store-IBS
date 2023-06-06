/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/rules-of-hooks */
import { UpdateItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { patchData } from "@/utils/fetchData";
import React, { useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function PaypalBtn({ order }) {
  const refPaypalBtn = useRef();
  const { state, dispatch } = useContext(DataContext);
  const { auth, orders } = state;

  useEffect(() => {
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: order.totalPrice,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          dispatch({ type: "NOTIFY", payload: { loading: true } });
          return actions.order.capture().then(function () {
            patchData(`order/pay/${order._id}`, null, auth.token).then(
              (res) => {
                if (res.err) {
                  dispatch({ type: "NOTIFY", payload: { error: res.err } });
                  return toast.error(res.err);
                }
                dispatch(
                  UpdateItem(
                    orders,
                    order._id,
                    {
                      ...order,
                      isPaid: true,
                      dateOfPayment: new Date().toLocaleString("en-US", {
                        // details.create_time
                        hour12: true,
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }),
                      methodPay: "Transfer bank",
                    },
                    "ADD_TO_ORDER"
                  )
                );
                dispatch({ type: "NOTIFY", payload: { success: res.msg } });
                return toast.success(res.msg);
              }
            );
          });
        },
      })
      .render(refPaypalBtn.current);
  }, [auth, dispatch, order, order.totalPrice, orders]);
  return <div ref={refPaypalBtn}></div>;
}
