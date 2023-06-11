/* eslint-disable react-hooks/exhaustive-deps */
import filterSearch from "@/utils/filterSearch";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const FilterSearch = ({ state }) => {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const { categories } = state;
  const router = useRouter();

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };

  const handleChangeSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  useEffect(() => {
    filterSearch({ router, search: search ? search.toLowerCase() : "all" });
  }, [search]);

  return (
    <div className="d-flex">
      <div className="form-group col-md-3 px-0 mt-2">
        <select
          className="form-select text-capitalize"
          name="category"
          id="category"
          value={category}
          onChange={handleChangeCategory}
        >
          <option value="all">All category</option>
          {categories.map((cat) => (
            <option value={cat._id} key={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <form autoComplete="off" className="mt-2 col-md-6 px-0">
        <div className="form-group input-group-prepend">
          <input
            type="text"
            className="form-control rounded"
            style={{ paddingBottom: "6px", paddingTop: "6px" }}
            list="name_product"
            value={search.toLowerCase()}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>
      <div className="form-group col-md-3 px-0 mt-2">
        <select
          className="form-select text-capitalize"
          value={sort}
          onChange={handleChangeSort}
        >
          <option value="-createdAt">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="-sold">Terlaku</option>
          <option value="-price">Harga: Tinggi-Rendah</option>
          <option value="price">Harga: Rendah-Tinggi</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSearch;
