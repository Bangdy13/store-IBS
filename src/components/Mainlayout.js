/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";
import React, { useContext } from "react";
import Notify from "./Notify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DataContext } from "@/store/GlobalContext";
import Cookies from "js-cookie";
import Modal from "./Modal";
import { useRouter } from "next/router";

const Mainlayout = ({ children, title }) => {
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart } = state;

  const router = useRouter();

  const handleSignOut = () => {
    Cookies.remove("refreshtoken", { path: "api/auth/accessToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "Berhasil logout" } });
    toast.success("Berhasil logout");
    router.push("/");
  };

  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={auth.user.avatar}
            alt="avatar"
            style={{
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              transform: "translateY(-2px)",
              marginRight: "5px",
            }}
          />
          {auth.user.name}
        </a>
        <ul className="dropdown-menu dropdown-menu-end">
          {auth.user.role === "admin" ? (
            <Link href="/dashboard" className="dropdown-item">
              Admin Dashboard
            </Link>
          ) : (
            <Link href="/dashboard" className="dropdown-item">
              My Dashboard
            </Link>
          )}
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={handleSignOut}>
            Logout
          </button>
        </ul>
      </li>
    );
  };
  return (
    <>
      <Head>
        <title>{title ? title + " - IBS" : "IBS"}</title>
      </Head>
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={2000}
        hideProgressBar={true}
      />
      <Notify />
      <Modal />
      <div>
        <header>
          <nav className="navbar navbar-expand-lg shadow-sm">
            <div className="container d-flex align-items-center">
              <Link className="navbar-brand" href="/">
                <img src="/logo.png" alt="logo" width={"100%"} height={40} />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                  {auth?.user?.role === "user" ? (
                    <li className="nav-item">
                      <Link href={"/cart"} className="nav-link">
                        <i className="bi bi-cart-fill me-1"></i>
                        {cart.length > 0 ? (
                          <span>({cart.length})</span>
                        ) : (
                          <span>(0)</span>
                        )}
                      </Link>
                    </li>
                  ) : null}
                  {Object.keys(auth).length === 0 ? (
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="bi bi-person-fill me-1"></i>
                        Account
                      </a>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <Link className="dropdown-item" href="/signin">
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/signup">
                            Register
                          </Link>
                        </li>
                      </ul>
                    </li>
                  ) : (
                    loggedRouter()
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <main className="container mt-3">{children}</main>
        {/* <footer>Copyright @2023 Bangdy</footer> */}
      </div>
    </>
  );
};

export default Mainlayout;
