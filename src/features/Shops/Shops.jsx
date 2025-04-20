import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import ShopForm from "./ShopForm";
import ShopList from "./ShopList";
import { useTranslation } from "react-i18next";

const Shops = ({ shopId }) => {
  const { t } = useTranslation("shops");
  const navigate = useNavigate();

  return (
    <Stack gap={3}>
      {shopId ? (
        <ShopForm isEdit={!!shopId} shopId={shopId} />
      ) : (
        <>
          <Button
            onClick={() => navigate("/dashboard/shops/add")}
            sx={{
              width: "100%",
              height: "100px",
              border: "4px dashed #fff",
              fontSize: "20px",
            }}
          >
            {t("addShop")}
          </Button>
          <ShopList />
        </>
      )}
    </Stack>
  );
};

export default Shops;
