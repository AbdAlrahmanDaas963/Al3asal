import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShops } from "./shopSlice";
import ShopList from "./ShopList";
import ShopForm from "./ShopForm";
import { Button } from "@mui/material";

const Shops = ({ shopId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shops, status, error, selectedShop } = useSelector(
    (state) => state.shops
  );

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

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
        <ShopForm isEdit={!!shopId} initialData={selectedShop || {}} />
      )}
    </div>
  );
};

export default Shops;
