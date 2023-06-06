import Mainlayout from "@/components/Mainlayout";
import { DataContext } from "@/store/GlobalContext";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

export default function CreateProductPage() {
  const initialState = {
    name: "",
    price: 0,
    inStock: 0,
    description: "",
    descriptionSize: "",
    category: "",
  };

  const [product, setProduct] = useState(initialState);
  const { state, dispatch } = useContext(DataContext);
  const { name, price, inStock, description, descriptionSize, category } =
    product;
  const { categories } = state;

  const router = useRouter();

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  return (
    <Mainlayout title="Create Product">
      <div className="container" style={{ maxWidth: "90%" }}>
        <button
          className="btn btn-primary fw-semibold"
          style={{ maxWidth: "18%" }}
          onClick={() => router.back()}
        >
          Back all product <i className="bi bi-arrow-right"></i>
        </button>
        <form className="row my-3 cards py-4 px-3">
          <h2 className="font-bold text-center mt-2 mb-4">Create Product</h2>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="name">Nama Produk</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Name product..."
                name="name"
                value={name}
                onChange={handleChangeProduct}
              />
            </div>
            <div className="row align-items-center">
              <div className="form-group col-md-6">
                <label htmlFor="price">Harga</label>
                <input
                  type="number"
                  className="form-control d-block"
                  id="price"
                  placeholder="Price product..."
                  name="price"
                  value={price}
                  onChange={handleChangeProduct}
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="stock">Stok produk</label>
                <input
                  type="number"
                  className="form-control d-block"
                  id="stock"
                  placeholder="Stock product..."
                  name="inStock"
                  value={inStock}
                  onChange={handleChangeProduct}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Deskripsi produk</label>
              <textarea
                className="form-control"
                name="description"
                id="description"
                cols="30"
                rows="3"
                placeholder="Description product...."
                value={description}
                onChange={handleChangeProduct}
              />
            </div>
            <div className="form-group">
              <label htmlFor="descriptionSize">Deskripsi size produk</label>
              <textarea
                className="form-control"
                name="descriptionSize"
                id="descriptionSize"
                cols="30"
                rows="3"
                placeholder="Description size product...."
                value={descriptionSize}
                onChange={handleChangeProduct}
              />
            </div>
            <div className="form-group input-group-prepend">
              <label htmlFor="category">Kategori produk</label>
              <select
                className="form-select"
                name="category"
                id="category"
                value={category}
                onChange={handleChangeProduct}
              >
                <option value="all">All category</option>
                {categories.map((cat) => (
                  <option value={cat._id} key={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6"></div>
        </form>
      </div>
    </Mainlayout>
  );
}
