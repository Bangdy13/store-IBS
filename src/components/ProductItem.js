/* eslint-disable @next/next/no-img-element */
import { AddToCart } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";

const ProductItem = ({ product, handleChecked }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const router = useRouter();

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-xsm-6">
      <div className="card my-3">
        {auth.user?.role === "admin" && (
          <input
            type="checkbox"
            className="position-absolute"
            style={{ height: "20px", width: "20px" }}
            checked={product.checked}
            onChange={() => handleChecked(product._id)}
          />
        )}
        <Link href={`product/${product._id}`}>
          <img
            src={product.image[0].url}
            className="card-img-top"
            alt="product"
          />
        </Link>
        <div className="card-body py-2">
          <h5 className="card-title text-capitalize" title={product.name}>
            {product.name}
          </h5>
          <div className="d-flex justify-content-between mx-0">
            <h6 className="price">
              {new Intl.NumberFormat("ID", {
                style: "currency",
                currency: "IDR",
                maximumSignificantDigits: 3,
              }).format(product.price)}
            </h6>
            <p className="sold">{product.sold} sold</p>
          </div>
          <div className="d-flex justify-content-start">
            {auth.user?.role !== "admin" ? (
              <button
                className="btn button-cart"
                disabled={product.inStock === 0 ? true : false}
                onClick={() => dispatch(AddToCart(product, cart))}
              >
                <i className="bi bi-cart-fill me-1"></i>
                Add to cart
              </button>
            ) : (
              <div className="d-flex gap-1 w-100">
                <button
                  className="btn button-cart w-100"
                  onClick={() => router.push(`create_product/${product._id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger w-100"
                  title="delete"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  onClick={() =>
                    dispatch({
                      type: "DEL_TO_MODAL",
                      payload: [
                        {
                          data: "",
                          id: product._id,
                          name: product.name,
                          type: "DELETE_TO_PRODUCT",
                        },
                      ],
                    })
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
