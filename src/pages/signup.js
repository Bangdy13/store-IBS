import Mainlayout from "@/components/Mainlayout";
import { DataContext } from "@/store/GlobalContext";
import { postData } from "@/utils/fetchData";
import validation from "@/utils/validation";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function SignupPage() {
  const intialState = { name: "", email: "", password: "", cf_password: "" };
  const [userData, setUserData] = useState(intialState);
  const { name, email, password, cf_password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (auth.user) {
      router.push(redirect || "/");
    }
  }, [router, redirect, auth]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validation(name, email, password, cf_password);
    if (errMsg) {
      dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      toast.error(errMsg);
      return;
    } else {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
    }

    const res = await postData("auth/signup", userData);
    if (res.err) {
      dispatch({ type: "NOTIFY", payload: { error: res.err } });
      toast.error(res.err);
      return;
    } else {
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      toast.success(res.msg);
      return;
    }
  };
  return (
    <Mainlayout title={"Signup"}>
      <form
        className="form-container my-3 cards py-4 px-3"
        onSubmit={handleSubmit}
      >
        <h3 className="mb-4 text-center font-weight-bold">REGISTER ACCOUNT</h3>
        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Username"
            name="name"
            value={name}
            onChange={handleInput}
          />
        </div>
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
        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            placeholder="Confirm Password"
            name="cf_password"
            value={cf_password}
            onChange={handleInput}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          REGISTER
        </button>
        <p className="mt-3">
          Do you have a account?
          <Link href="/signin" legacyBehavior id="link">
            <a className="links">Signin</a>
          </Link>
        </p>
      </form>
    </Mainlayout>
  );
}
