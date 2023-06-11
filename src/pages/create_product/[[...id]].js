/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Mainlayout from "@/components/Mainlayout";
import { DataContext } from "@/store/GlobalContext";
import { getData, postData, putData } from "@/utils/fetchData";
import { imageUpload } from "@/utils/imageUpload";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

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
  const { categories, auth } = state;

  const [image, setImage] = useState([]);

  const router = useRouter();
  const { id } = router.query;
  const [edit, setEdit] = useState(false);

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUploadProduct = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImage = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];

    if (files.length === 0) {
      dispatch({ type: "NOTIFY", payload: { error: "File gambar tidak ada" } });
      return toast.error("File gambar tidak ada");
    }
    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return toast.error("Ukuran gambar maksimal 1MB");
      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/jpg" &&
        file.type !== "image/png"
      )
        return toast.error("Format gambar yang dimasukan salah");

      num += 1;
      if (num <= 5) newImage.push(file);
      return newImage;
    });
    if (err) return toast.error(err);

    const imgCount = image.length;
    if (imgCount + newImage.length > 5)
      return toast.error("Pilih 5 gambar yang ingin di upload");
    setImage([...image, ...newImage]);
  };

  const handleDeleteImage = (index) => {
    const newArr = [...image];
    newArr.splice(index, 1);
    setImage(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return toast.error("Authentication is not valid");

    if (
      (!name ||
        !price ||
        !inStock ||
        !description ||
        !descriptionSize ||
        category === "all",
      image.length === 0)
    ) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Mohon isikan semua form dengan benar !" },
      });
      return toast.error("Mohon isikan semua form dengan benar !");
    }

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let media = [];
    const imgNewUrl = image.filter((img) => !img.url);
    const imgOldUrl = image.filter((img) => img.url);

    if (imgNewUrl.length > 0) media = await imageUpload(imgNewUrl);

    let res;
    if (edit) {
      res = await putData(
        `product/${id}`,
        { ...product, image: [...imgOldUrl, ...media] },
        auth.token
      );
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
    } else {
      res = await postData(
        "product",
        { ...product, image: [...imgOldUrl, ...media] },
        auth.token
      );
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
    }
    router.push("/dashboard");

    dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    return toast.success(res.msg);
  };

  useEffect(() => {
    if (id) {
      setEdit(true);
      getData(`product/${id}`).then((res) => {
        setProduct(res.product);
        setImage(res.product.image);
      });
    } else {
      setEdit(false);
      setProduct(initialState);
      setImage([]);
    }
  }, [id]);

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
        <form className="row my-3 cards py-4 px-3" onSubmit={handleSubmit}>
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
              <button
                type="submit"
                className="btn btn-primary mt-3 w-50 fw-semibold"
              >
                {edit ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label htmlFor="file">Upload image product</label>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={handleUploadProduct}
                  multiple
                  accept="image/*"
                />
              </div>
            </div>
            <div className="row img-up">
              {image.map((img, index) => (
                <div className="file-img my-1" key={index}>
                  <img
                    src={img.url ? img.url : URL.createObjectURL(img)}
                    alt=""
                    className="img-thumbnail rounded"
                  />
                  <span onClick={() => handleDeleteImage(index)}>X</span>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
    </Mainlayout>
  );
}
