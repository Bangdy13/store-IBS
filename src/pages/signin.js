import Mainlayout from "@/components/Mainlayout";
import { DataContext } from "@/store/GlobalContext";
import { postData } from "@/utils/fetchData";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SigninPage() {
  const intialState = { email: "", password: "" };
  const [userData, setUserData] = useState(intialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();
  const { redirect } = router.query;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/signin", userData);
    if (res.err) {
      dispatch({ type: "NOTIFY", payload: { error: res.err } });
      toast.error(res.err);
      return;
    } else {
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      toast.success(res.msg);
    }

    dispatch({
      type: "AUTH",
      payload: {
        token: res.access_token,
        user: res.user,
      },
    });

    Cookies.set("refreshtoken", res.refresh_token, {
      path: "api/auth/accessToken",
      expires: 7,
    });
    localStorage.setItem("firstLogin", true);
  };

  useEffect(() => {
    if (auth.user) {
      router.push(redirect || "/");
    }
  }, [router, redirect, auth]);
  return (
    <Mainlayout title={"Signin"}>
      <form
        className="form-container my-5 cards py-4 px-3"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-center font-weight-bold">LOGIN ACCOUNT</h3>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder="E-mail Address..."
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleInput}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleInput}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          LOGIN
        </button>
        <p className="mt-3">
          You don&apos;t have a account?
          <Link href="/signup" legacyBehavior id="link">
            <a className="links">Signup</a>
          </Link>
        </p>
      </form>
    </Mainlayout>
  );
}
