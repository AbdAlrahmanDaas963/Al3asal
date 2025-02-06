import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShops } from "./shopSlice";
import ShopList from "./ShopList";
import ShopForm from "./ShopForm";
import { Button } from "@mui/material";

const Shops = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shops, status, error } = useSelector((state) => state.shops);
  const { shopId } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  useEffect(() => {
    if (shopId) {
      fetch(`https://asool-gifts.com/api/shops/${shopId}`)
        .then((response) => response.json())
        .then((data) => setInitialData(data))
        .catch(() => setInitialData(null));
    }
  }, [shopId]);

  if (status === "loading") return <p>Loading shops...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="shops-container">
      <Button
        onClick={() => navigate("/dashboard/shops/add")}
        sx={{
          width: "100%",
          height: "100px",
          border: "4px dashed #fff",
          fontSize: "20px",
        }}
      >
        Add Shop +
      </Button>

      {!shopId ? (
        <>
          <h3>Shops</h3>
          <ShopList shops={shops} />
        </>
      ) : (
        <>
          <h1>{shopId ? "Edit Shop" : "Create Shop"}</h1>
          {initialData === null && shopId ? (
            <p>Loading shop data...</p>
          ) : (
            <ShopForm
              isEdit={!!shopId}
              shopId={shopId}
              initialData={initialData || {}}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Shops;
