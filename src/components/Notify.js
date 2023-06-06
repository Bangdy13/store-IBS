import { DataContext } from "@/store/GlobalContext";
import React, { useContext } from "react";
import Loading from "./Loading";

const Notify = () => {
  const { state } = useContext(DataContext);
  const { notify } = state;
  return <>{notify.loading && <Loading />}</>;
};

export default Notify;
