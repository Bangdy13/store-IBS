import { DeleteItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { deleteData } from "@/utils/fetchData";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { toast } from "react-toastify";

const Modal = () => {
  const { state, dispatch } = useContext(DataContext);
  const { modal, auth } = state;

  const router = useRouter();

  const handleDeleteUser = (item) => {
    dispatch(DeleteItem(item.data, item.id, item.type));
    deleteData(`user/${item.id}`, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
  };

  const handleDeleteCategory = (item) => {
    deleteData(`categories/${item.id}`, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }
      dispatch(DeleteItem(item.data, item.id, item.type));
      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      return toast.success(res.msg);
    });
  };

  const handleDeleteProduct = (item) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    deleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err) {
        dispatch({ type: "NOTIFY", payload: { error: res.err } });
        return toast.error(res.err);
      }

      dispatch({ type: "NOTIFY", payload: { success: res.msg } });
      router.push("/");
      return toast.success(res.msg);
    });
  };

  const handleSubmitDelete = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === "ADD_TO_CART") {
          dispatch(DeleteItem(item.data, item.id, item.type));
          return toast.success("Hapus berhasil!");
        }
        if (item.type === "ADD_TO_USER") handleDeleteUser(item);
        if (item.type === "ADD_TO_CATEGORY") handleDeleteCategory(item);
        if (item.type === "DELETE_TO_PRODUCT") handleDeleteProduct(item);
        dispatch({ type: "DEL_TO_MODAL", payload: [] });
      }
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          {auth.user?.role !== "admin" ? (
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title text-capitalize fs-5"
                  id="exampleModalLabel"
                >
                  {modal.length !== 0 && modal[0].name}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                Apakah anda ingin menghapus item ini?
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary w-25 me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary w-25"
                  onClick={handleSubmitDelete}
                  data-bs-dismiss="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  {modal.length !== 0 && modal[0].name}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">Apakah anda ingin menghapusnya?</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary w-25 me-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary w-25"
                  onClick={handleSubmitDelete}
                  data-bs-dismiss="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
