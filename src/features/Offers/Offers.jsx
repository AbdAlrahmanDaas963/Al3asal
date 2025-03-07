import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOffers } from "./offersSlice";

const Offers = () => {
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.offers);

  useEffect(() => {
    dispatch(fetchOffers()).then((response) => {
      console.log("Offers Response:", response);
    });
  }, [dispatch]);

  return <div>Check console for offers data</div>;
};

export default Offers;
