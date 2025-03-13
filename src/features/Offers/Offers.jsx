import React, { useState } from "react";
import OfferList from "./OfferList";
import AddOfferForm from "./AddOfferForm";
import { Button } from "@mui/material";

function Offers() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      {showForm ? (
        <AddOfferForm onClose={() => setShowForm(false)} />
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          sx={{
            width: "100%",
            height: "100px",
            border: "4px dashed #fff",
            fontSize: "20px",
          }}
        >
          Add Offer +
        </Button>
      )}
      <OfferList />
    </>
  );
}

export default Offers;
