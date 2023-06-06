import Mainlayout from "@/components/Mainlayout";
import ProductItem from "@/components/ProductItem";
import { getData } from "@/utils/fetchData";
import React, { useState } from "react";

const Home = (props) => {
  const [products] = useState(props.products);
  return (
    <Mainlayout title="Home">
      <div className="product-content container">
        {products.length === 0 ? (
          <h2>Product not found</h2>
        ) : (
          products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))
        )}
      </div>
    </Mainlayout>
  );
};
export const getServerSideProps = async () => {
  const res = await getData("product");
  return { props: { products: res.products, result: res.result } };
};

export default Home;
