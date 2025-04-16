import React from "react";
import { useNavigate } from "react-router-dom";
import OfferList from "./OfferList";
import { Button, Stack } from "@mui/material";

function Offers() {
  const navigate = useNavigate();

  return (
    <Stack gap={"25px"}>
      <Button
        onClick={() => navigate("/dashboard/offers/add")}
        sx={{
          width: "100%",
          height: "100px",
          border: "4px dashed #fff",
          fontSize: "20px",
        }}
      >
        Add Offer +
      </Button>
      <OfferList />
    </Stack>
  );
}

export default Offers;
