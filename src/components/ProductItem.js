/* eslint-disable @next/next/no-img-element */
import { AddToCart } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import Link from "next/link";
import React, { useContext } from "react";

const ProductItem = ({ product }) => {
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;
  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-xsm-6">
      <div className="card my-3">
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
            <button
              className="btn button-cart"
              disabled={product.inStock === 0 ? true : false}
              onClick={() => dispatch(AddToCart(product, cart))}
            >
              <i className="bi bi-cart-fill me-1"></i>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
