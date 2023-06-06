/* eslint-disable react-hooks/exhaustive-deps */
import Mainlayout from "@/components/Mainlayout";
import { UpdateItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { patchData } from "@/utils/fetchData";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

function EditUserPage() {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth } = state;

  const router = useRouter();
  const { id } = router.query;

  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    users.forEach((user) => {
      if (user._id === id) {
        setEditUser(user);
        setCheckAdmin(user.role === "admin" ? true : false);
      }
    });
  }, [users]);

  const handleEditUser = (e) => {
    e.preventDefault();
    let role = checkAdmin ? "admin" : "user";
    if (num % 2 !== 0) {
      dispatch({ type: "NOTIFY", payload: { loading: true } });
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.err) {
          dispatch({ type: "NOTIFY", payload: { error: res.err } });
          return toast.error(res.err);
        }
        dispatch(
          UpdateItem(
            users,
            editUser._id,
            {
              ...editUser,
              role,
            },
            "ADD_TO_USER"
          )
        );
        dispatch({ type: "NOTIFY", payload: { success: res.msg } });
        return toast.success(res.msg);
      });
    }
    router.push("/dashboard");
  };

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  return (
    <>
      <Mainlayout title={`Edit User`}>
        <div className="d-flex justify-content-center align-items-center mt-lg-5 mt-md-0">
          <form className="form-container cards py-4 px-3">
            <h1 className="fs-4 font-weight-bold text-center">EDIT USERS</h1>
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Username"
                defaultValue={editUser.name}
                disabled
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
                defaultValue={editUser.email}
                disabled
              />
            </div>
            <div className="form-group d-flex align-items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={checkAdmin}
                style={{ width: "15px", height: "15px" }}
                onChange={handleCheck}
              />
              <label
                className="ms-2"
                htmlFor="isAdmin"
                style={{ transform: "translateY(5px)" }}
              >
                isAdmin
              </label>
            </div>
            <button
              className="btn btn-primary mt-2 w-100"
              onClick={handleEditUser}
            >
              UPDATE
            </button>
          </form>
        </div>
      </Mainlayout>
    </>
  );
}
export default dynamic(() => Promise.resolve(EditUserPage), { ssr: false });
