/* eslint-disable @next/next/no-img-element */
import Mainlayout from "@/components/Mainlayout";
import { AddToCart } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { getData } from "@/utils/fetchData";
import Link from "next/link";
import React, { useContext, useState } from "react";

export default function SingleProduct(props) {
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;

  const isActive = (index) => {
    if (tab === index) return " active";
    return "";
  };

  return (
    <Mainlayout title={`${product.name}`}>
      <div className="container  mb-5">
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
              {product.name}
            </li>
          </ol>
        </nav>
        <div className="row detail_page">
          <div className="col-md-5">
            <img
              src={product.image[tab].url}
              alt=""
              className="img-thumbnail rounded my-1 w-100"
              style={{ height: "500px" }}
            />
            <div className="row mx-0 mb-3" style={{ cursor: "pointer" }}>
              {product.image.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className={"img-thumbnail rounded me-1 p-1" + isActive(index)}
                  style={{ width: "18%", height: "100px", objectFit: "cover" }}
                  onClick={() => setTab(index)}
                />
              ))}
            </div>
          </div>
          <div className="col-md-7">
            <h3 className="product_name">{product.name}</h3>
            <div className="d-flex justify-content-between mt-3">
              <h6 className="detail_price">
                {new Intl.NumberFormat("ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumSignificantDigits: 3,
                }).format(product.price)}
              </h6>
              <h6 className="sold">{product.sold} sold</h6>
            </div>
            <div className="d-flex mt-2 align-items-center">
              <h5>Status :</h5>
              {product.inStock > 0 ? (
                <h6 className="inStock ms-2">inStock {product.inStock} pcs</h6>
              ) : (
                <h6 className="outStock ms-2">outStock</h6>
              )}
            </div>
            <div className="mt-2">
              <div className="accordion" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      Description
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">{product.description}</div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Description Size
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      {product.descriptionSize}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {auth.user?.role === "admin" ? null : (
              <div className="mt-4">
                <button
                  type="button"
                  disabled={product.inStock === 0 ? true : false}
                  className="btn button-cart w-25 px-2 py-2 text-button"
                  onClick={() => dispatch(AddToCart(product, cart))}
                >
                  <i className="bi bi-cart-fill me-1"></i>
                  Add to cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}

export const getServerSideProps = async ({ params: { id } }) => {
  const res = await getData(`product/${id}`);
  return { props: { product: res.product } };
};
