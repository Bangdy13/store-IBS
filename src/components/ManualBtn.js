import { UpdateItem } from "@/store/Actions";
import { DataContext } from "@/store/GlobalContext";
import { patchData } from "@/utils/fetchData";
import React, { useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function ManualBtn({ order }) {
  let rupiahFormat = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(order.totalPrice);

  return (
    <>
      <Link
        target="_blank"
        href={`https://wa.me/+6282236900924?text=Saya%20ingin%20konfirmasi%20pembayaran%0ANo%20Pesanan%20:%20${order._id}%0ANama%20:%20${order.user.name}%0Aemail%20:%20${order.user.email}%0Ano%20telepon%20:%20${order.handphone}%20Nominal%20:%20${rupiahFormat}`}
      >
        <button className="mb-4">Bayar</button>
      </Link>
    </>
  );
}
