/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import CreateCategories from "@/components/CreateCategories";
import FilterSearch from "@/components/FilterSearch";
import Mainlayout from "@/components/Mainlayout";
import ProductItem from "@/components/ProductItem";
import { UpdateItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { getData, patchData } from "@/utils/fetchData";
import filterSearch from "@/utils/filterSearch";
import { imageUpload } from "@/utils/imageUpload";
import validation from "@/utils/validation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

function MultiDashboard(props) {
  const [products, setProducts] = useState(props.products);

  const initialState = { avatar: "", name: "", password: "", cf_password: "" };
  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders, users } = state;

  const router = useRouter();
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  useEffect(() => {
    if (auth.user) {
      setData({ ...data, name: auth.user.name });
    }
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = validation(name, auth.user.email, password, cf_password);
      if (errMsg) dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
      return toast.error(errMsg);
    }
    if (name !== auth.user.name || avatar) updateInfo();
  };

  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.msg } });
        return toast.error(res.msg);
      }
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) {
      dispatch({ type: "NOTIFY", payload: { error: "File tidak ada" } });
      return toast.error("File tidak ada");
    }
    // cek size gambar
    if (file.size > 1024 * 1024) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Ukuran gambar harus maksimal 1mb." },
      });
      return toast.error("Ukuran gambar harus maksimal 1mb");
    }
    // cek format gambar
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/jpg"
    ) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Format gambar salah." },
      });
      return toast.error("Format gambar salah");
    }
    setData({ ...data, avatar: file });
  };

  const updateInfo = async () => {
    let media;
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      "user",
      { name, avatar: avatar ? media[0].url : auth.user.avatar },
      auth.token
    ).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      dispatch({
        type: "AUTH",
        payload: { token: auth.token, user: res.user },
      });
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
  };

  const handlePaid = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/pay/${order._id}`, null, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      const { isPaid, dateOfPayment, method, isDelivered } = res.result;
      dispatch(
        UpdateItem(
          orders,
          order._id,
          {
            ...order,
            isPaid,
            dateOfPayment,
            method,
            isDelivered,
          },
          "ADD_TO_ORDER"
        )
      );
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
  };

  const handleDeliver = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/deliver/${order._id}`, null, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      const { isPaid, updatedAt, method, isDelivered } = res.result;
      dispatch(
        UpdateItem(
          orders,
          order._id,
          {
            ...order,
            isPaid,
            updatedAt,
            method,
            isDelivered,
          },
          "ADD_TO_ORDER"
        )
      );
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
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

  const handleViewProductAll = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  if (!auth.user) return null;
  return (
    <Mainlayout
      title={auth.user.role === "user" ? "User Dashboard" : "Admin Dashboard"}
    >
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mx-0">
          <li className="breadcrumb-item">
            <Link href="/" legacyBehavior id="link">
              <a>Home</a>
            </Link>
          </li>
          {auth.user.role === "user" ? (
            <li
              className="breadcrumb-item active text-capitalize"
              aria-current="page"
            >
              My Dashboard
            </li>
          ) : (
            <li
              className="breadcrumb-item active text-capitalize"
              aria-current="page"
            >
              Admin Dashboard
            </li>
          )}
        </ol>
      </nav>
      <div className="my-account">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3 ">
              {auth.user.role === "user" ? (
                <div
                  className="nav flex-column nav-pills shadow-sm py-3 px-3"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <a
                    className="nav-link active"
                    id="orders-nav"
                    data-bs-toggle="pill"
                    href="#orders-tab"
                    role="tab"
                  >
                    <i className="bi bi-bag-fill" />
                    Orders
                  </a>{" "}
                  <a
                    className="nav-link"
                    id="account-nav"
                    data-bs-toggle="pill"
                    href="#account-tab"
                    role="tab"
                  >
                    <i className="bi bi-person-fill" />
                    My Account
                  </a>
                </div>
              ) : (
                <div
                  className="nav flex-column nav-pills shadow-sm py-3 px-3"
                  role="tablist"
                  aria-orientation="vertical"
                >
                  <a
                    className="nav-link active"
                    id="orders-nav"
                    data-bs-toggle="pill"
                    href="#orders-tab"
                    role="tab"
                  >
                    <i className="bi bi-bag-fill" />
                    All Orders
                  </a>{" "}
                  <a
                    className="nav-link"
                    id="users-nav"
                    data-bs-toggle="pill"
                    href="#users-tab"
                    role="tab"
                  >
                    <i className="bi bi-person-lines-fill" />
                    All Users
                  </a>{" "}
                  <a
                    className="nav-link"
                    id="products-nav"
                    data-bs-toggle="pill"
                    href="#products-tab"
                    role="tab"
                  >
                    <i className="bi bi-box2-fill" />
                    All Products
                  </a>{" "}
                  <a
                    className="nav-link"
                    id="category-nav"
                    data-bs-toggle="pill"
                    href="#category-tab"
                    role="tab"
                  >
                    <i className="bi bi-list-task" />
                    All Category
                  </a>{" "}
                  <a
                    className="nav-link"
                    id="account-nav"
                    data-bs-toggle="pill"
                    href="#account-tab"
                    role="tab"
                  >
                    <i className="bi bi-person-fill" />
                    My Account
                  </a>
                </div>
              )}
            </div>
            <div className="col-md-9">
              <div className="tab-content shadow-sm py-3">
                {/* ORDERS */}
                <div
                  className="tab-pane fade show active"
                  id="orders-tab"
                  role="tabpanel"
                  aria-labelledby="orders-nav"
                >
                  <div className="table-responsive">
                    {orders.length === 0 ? (
                      <h6>
                        Order empty{" "}
                        <Link href="/" className="text-primary">
                          Go to order
                        </Link>{" "}
                      </h6>
                    ) : (
                      <table className="table table-bordered">
                        <thead className="thead-dark">
                          <tr>
                            <th>No</th>
                            <th>Product</th>
                            <th>Order Date</th>
                            <th>Total</th>
                            <th>Pay Date</th>
                            <th>Delivery Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={order._id}>
                              <td>{index + 1}</td>
                              <td>
                                {order.cart.map((item) => (
                                  <div
                                    key={item._id}
                                    className="img d-flex justify-content-between align-items-center"
                                  >
                                    <Link href={`product/${item._id}`}>
                                      <img
                                        src={item.image[0].url}
                                        alt="website template image"
                                        className="img-thumbnail mb-1"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Link>
                                    <div
                                      style={{
                                        fontSize: "14px",
                                        color: "gray",
                                      }}
                                    >
                                      x{item.quantity}
                                    </div>
                                  </div>
                                ))}
                              </td>
                              <td>
                                {new Date(order.createdAt).toLocaleString(
                                  "en-US",
                                  {
                                    hourCycle: "h24",
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </td>
                              <td>
                                {new Intl.NumberFormat("ID", {
                                  style: "currency",
                                  currency: "IDR",
                                  maximumSignificantDigits: 3,
                                }).format(order.totalPrice)}
                              </td>
                              <td>
                                {order.isPaid ? (
                                  <div className="text-success">
                                    {new Date(
                                      order.dateOfPayment
                                    ).toLocaleString("en-US", {
                                      hourCycle: "h24",
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                ) : (
                                  <div className="alert-danger"></div>
                                )}
                                {auth.user.role === "admin" &&
                                  !order.isPaid && (
                                    <button
                                      className="btn btn-primary"
                                      // disabled={!order.isPaid}
                                      onClick={() => handlePaid(order)}
                                    >
                                      Paid
                                    </button>
                                  )}
                              </td>
                              <td>
                                {order.isDelivered ? (
                                  <div className="text-success">
                                    {new Date(order.updatedAt).toLocaleString(
                                      "en-US",
                                      {
                                        hourCycle: "h24",
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <>
                                    {auth.user.role === "user" ? (
                                      <div className="alert-danger">-</div>
                                    ) : (
                                      <div className="alert-danger"></div>
                                    )}
                                  </>
                                )}
                                {auth.user.role === "admin" &&
                                  !order.isDelivered && (
                                    <button
                                      className="btn btn-primary"
                                      disabled={!order.isPaid}
                                      onClick={() => handleDeliver(order)}
                                    >
                                      Delivered
                                    </button>
                                  )}
                              </td>
                              <td>
                                <Link href={`/order/${order._id}`}>
                                  <button className="btn button-cart py-2 px-1">
                                    Detail
                                  </button>
                                </Link>
                                {/* {auth.user.role === "admin" && (
                                  <button
                                    className="btn button-cart py-2 px-1"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() =>
                                      dispatch({
                                        type: "DEL_TO_MODAL",
                                        payload: [
                                          {
                                            data: orders,
                                            id: order._id,
                                            name: order._id,
                                            type: "ADD_TO_ORDER",
                                          },
                                        ],
                                      })
                                    }
                                  >
                                    Delete
                                  </button>
                                )} */}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                {/* USERS */}
                {auth.user.role === "admin" && (
                  <div
                    className="tab-pane fade"
                    id="users-tab"
                    role="tabpanel"
                    aria-labelledby="users-nav"
                  >
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="thead-dark">
                          <tr>
                            <th>No</th>
                            <th>Avatar</th>
                            <th>Username</th>
                            <th>E-mail</th>
                            <th>Admin or User</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr key={user._id}>
                              <td>{index + 1}</td>
                              <td>
                                <img
                                  src={user.avatar}
                                  alt={user.avatar}
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    overflow: "hidden",
                                    obejctFit: "cover",
                                    borderRadius: "50%",
                                  }}
                                />
                              </td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                {user.role === "admin" ? (
                                  user.root ? (
                                    <div className="text-root">Root</div>
                                  ) : (
                                    <div className="text-admin">Admin</div>
                                  )
                                ) : (
                                  <div className="text-user">User</div>
                                )}
                              </td>
                              <td style={{ cursor: "pointer" }}>
                                <Link
                                  legacyBehavior
                                  id="link"
                                  href={
                                    auth.user.root &&
                                    auth.user.email !== user.email
                                      ? `/edituser/${user._id}`
                                      : "#!"
                                  }
                                >
                                  <a>
                                    <i
                                      className="bi bi-pencil-square fs-5 text-info me-4"
                                      title="Edit"
                                    ></i>
                                  </a>
                                </Link>
                                {auth.user.root &&
                                auth.user.email !== user.email ? (
                                  <a
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    onClick={() =>
                                      dispatch({
                                        type: "DEL_TO_MODAL",
                                        payload: [
                                          {
                                            data: users,
                                            id: user._id,
                                            name: user.email,
                                            type: "ADD_TO_USER",
                                          },
                                        ],
                                      })
                                    }
                                  >
                                    <i
                                      className="bi bi-trash fs-5 text-danger"
                                      title="Delete"
                                    ></i>
                                  </a>
                                ) : (
                                  <a>
                                    <i
                                      className="bi bi-trash fs-5 text-secondary"
                                      title="Delete"
                                    ></i>
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {/* CATEGORY PRODUCT */}
                {auth.user.role === "admin" && (
                  <div
                    className="tab-pane fade"
                    id="category-tab"
                    role="tabpanel"
                    aria-labelledby="category-nav"
                  >
                    <div className="d-flex gap-3">
                      <CreateCategories />
                    </div>
                  </div>
                )}
                {/* CREATE PRODUCT */}
                {auth.user.role === "admin" && (
                  <div
                    className="tab-pane fade"
                    id="products-tab"
                    role="tabpanel"
                    aria-labelledby="products-nav"
                  >
                    <button
                      className="btn btn-primary fw-semibold"
                      style={{ maxWidth: "20%" }}
                      onClick={() => router.push("/create_product")}
                    >
                      <i className="bi bi-plus-lg"></i> Create product
                    </button>
                    <hr />
                    <div>
                      <FilterSearch state={state} />
                    </div>

                    <div
                      className="delete_all btn bg-danger d-flex align-items-center mx-0 py-0"
                      style={{ maxWidth: "16%" }}
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
                    <div className="text-end my-2">
                      {props.result < page * 3 ? (
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
                    <div className="d-flex flex-wrap content-product">
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
                  </div>
                )}
                {/* ACCOUNT */}
                <div
                  className="tab-pane fade"
                  id="account-tab"
                  role="tabpanel"
                  aria-labelledby="account-nav"
                >
                  <h4 className="text-center mb-3">
                    {auth.user.role === "user" ? "My Profile" : "Admin Profile"}
                  </h4>
                  <form
                    className="form-container my-3 cards py-4 px-3"
                    style={{ maxWidth: "70%" }}
                  >
                    <div className="avatar">
                      <img
                        src={
                          avatar
                            ? URL.createObjectURL(avatar)
                            : auth.user.avatar
                        }
                        alt="avatar"
                      />
                      <span>
                        <i className="bi bi-camera-fill"></i>
                        <p>Ubah Foto</p>
                        <input
                          type="file"
                          name="file"
                          id="file_up"
                          accept="image/*"
                          onChange={changeAvatar}
                        />
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor="name">Username</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        className="form-control"
                        placeholder="Your name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="E-mail Address..."
                        name="email"
                        defaultValue={auth.user.email}
                        disabled={true}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf_password">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm New Password"
                        name="cf_password"
                        value={cf_password}
                        onChange={handleChange}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mt-3 w-100"
                      disabled={notify.loading}
                      onClick={handleUpdateProfile}
                    >
                      UPDATE ACCOUNT
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
}
export const getServerSideProps = async ({ query }) => {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${page * 3}&category=${category}&sort=${sort}&name=${search}`
  );
  return { props: { products: res.products, result: res.result } };
};

export default dynamic(() => Promise.resolve(MultiDashboard), {
  ssr: false,
});
