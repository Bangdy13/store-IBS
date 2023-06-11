import FilterSearch from "@/components/FilterSearch";
import Mainlayout from "@/components/Mainlayout";
import ProductItem from "@/components/ProductItem";
import { DataContext } from "@/store/GlobalContext";
import { getData } from "@/utils/fetchData";
import filterSearch from "@/utils/filterSearch";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const Home = (props) => {
  const [products, setProducts] = useState(props.products);
  const [isCheck, setIsCheck] = useState(false);

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleViewProductAll = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  const handleChecked = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckedAll = () => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });
    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteAllProduct = () => {
    let deleteArr = [];
    products.forEach((product) => {
      if (product.checked) {
        deleteArr.push({
          data: "",
          id: product._id,
          name: "Apa anda ingin hapus semua produknya?",
          type: "DELETE_TO_PRODUCT",
        });
      }
    });
    dispatch({ type: "DEL_TO_MODAL", payload: deleteArr });
  };

  return (
    <Mainlayout title="Home">
      <h1 className="fw-semibold fs-2 text-center my-4">Featured Products</h1>
      <div className="container">
        <FilterSearch state={state} />
        {auth.user?.role === "admin" && (
          <div
            className="delete_all btn bg-danger d-flex align-items-center mx-0 py-0"
            style={{ maxWidth: "12%" }}
          >
            <input
              type="checkbox"
              checked={isCheck}
              onChange={handleCheckedAll}
              style={{
                height: "25px",
                width: "25px",
              }}
            />
            <button
              className="btn btn-danger text-white ms-2 fw-semibold py-1 my-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={handleDeleteAllProduct}
            >
              Delete all
            </button>
          </div>
        )}
      </div>
      <div className="product-content container">
        {products.length === 0 ? (
          <h2>Product not found</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleChecked={handleChecked}
            />
          ))
        )}
      </div>
      <div className="text-center mt-3 mb-4">
        {props.result < page * 4 ? (
          ""
        ) : (
          <a
            style={{ cursor: "pointer", color: "blue" }}
            className="fw-normal"
            onClick={handleViewProductAll}
          >
            View all product
            <i className="bi bi-chevron-compact-right"></i>
          </a>
        )}
      </div>
    </Mainlayout>
  );
};
export const getServerSideProps = async ({ query }) => {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${page * 4}&category=${category}&sort=${sort}&name=${search}`
  );
  return { props: { products: res.products, result: res.result } };
};

export default Home;
