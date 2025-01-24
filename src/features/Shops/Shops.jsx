import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShopList from "./ShopList";
import ShopForm from "./ShopForm";

const Shops = () => {
  const { shopId } = useParams(); // Get shopId from the URL if present
  const [shops, setShops] = useState([]);
  const [initialData, setInitialData] = useState(null);

  // Fetch the list of shops
  useEffect(() => {
    fetch("https://asool-gifts.com/api/shops")
      .then((response) => response.json())
      .then((data) => setShops(data))
      .catch((error) => console.error("Error fetching shops:", error));
  }, []);

  // Fetch data for a specific shop when editing
  useEffect(() => {
    if (shopId) {
      fetch(`https://asool-gifts.com/api/shops/${shopId}`)
        .then((response) => response.json())
        .then((data) => setInitialData(data))
        .catch((error) => console.error("Error fetching shop:", error));
    }
  }, [shopId]);

  if (shopId && !initialData) {
    return <div>Loading...</div>; // Show a loader while fetching data
  }

  return (
    <div>
      {!shopId ? (
        <>
          <h1>Shops</h1>
          <ShopList shops={shops} />
        </>
      ) : (
        <>
          <h1>{shopId ? "Edit Shop" : "Create Shop"}</h1>
          <ShopForm
            isEdit={!!shopId}
            shopId={shopId}
            initialData={initialData || {}}
          />
        </>
      )}
    </div>
  );
};

export default Shops;
