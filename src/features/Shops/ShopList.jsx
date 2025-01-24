import React from "react";
import AddShopForm from "./AddShopForm";

const ShopList = ({ shops }) => {
  if (!Array.isArray(shops) || shops.length === 0) {
    return (
      <div>
        <AddShopForm />
        <div>No shops available.</div>
      </div>
    );
  }

  return (
    <div>
      <AddShopForm />
      <h2>Shop List</h2>
      <ul>
        {shops.map((shop) => (
          <li key={shop.id}>
            {shop.name} - <a href={`/dashboard/shops/edit/${shop.id}`}>Edit</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShopList;
