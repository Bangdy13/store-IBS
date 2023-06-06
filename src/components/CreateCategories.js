import { UpdateItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { postData, putData } from "@/utils/fetchData";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

const Categories = () => {
  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;

  const [name, setName] = useState("");
  const [id, setId] = useState("");

  const handleCreateCategory = async () => {
    // e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authentication is not valid." },
      });
    if (!name) {
      dispatch({
        type: "NOTIFY",
        payload: { error: "Nama wajib diisi!." },
      });
      return toast.error("Nama wajib diisi!.");
    }
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    var res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err) {
        dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
        return toast.error(res.err);
      }
      dispatch(UpdateItem(categories, id, res.category, "ADD_TO_CATEGORY"));
    } else {
      res = await postData("categories", { name }, auth.token);
      if (res.err)
        return dispatch({
          type: "NOTIFY",
          payload: { error: res.err },
        });
      dispatch({
        type: "ADD_TO_CATEGORY",
        payload: [...categories, res.newCategory],
      });
    }

    setName("");
    setId("");

    dispatch({
      type: "NOTIFY",
      payload: { success: res.msg },
    });
    return toast.success(res.msg);
  };

  const handleEditCategory = (category) => {
    setId(category._id);
    setName(category.name);
  };
  return (
    <>
      <div className="col-md-6">
        <div className="cards py-4 px-3 rounded">
          <h1 className="fs-4 font-weight-bold text-center">
            CREATE NEW CATEGORY
          </h1>
          <div className="form-group d-flex align-items-center">
            <input
              type="text"
              className="form-control text-truncate"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Create new category product..."
            />
          </div>
          <div>
            <button
              className="btn btn-primary w-100"
              onClick={handleCreateCategory}
            >
              {id ? "UPDATE" : "CREATE"}
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        {categories.map((category) => (
          <div
            className="d-inline-block rounded text-truncate cards me-3 py-3 px-3 text-capitalize mb-2 d-flex justify-content-between align-items-center"
            key={category._id}
          >
            {category.name}
            <div style={{ cursor: "pointer" }}>
              <i
                className="bi bi-pencil-square text-info fs-4 me-3"
                title="edit"
                onClick={() => handleEditCategory(category)}
              ></i>
              <i
                className="bi bi-trash text-danger fs-4"
                title="delete"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() =>
                  dispatch({
                    type: "DEL_TO_MODAL",
                    payload: [
                      {
                        data: categories,
                        id: category._id,
                        name: category.name,
                        type: "ADD_TO_CATEGORY",
                      },
                    ],
                  })
                }
              ></i>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Categories;
