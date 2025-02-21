import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./categorySlice";

import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import { Button } from "@mui/material";

const Categories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, status, error } = useSelector(
    (state) => state.categories
  );
  const { categoryId } = useParams();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      fetch(`https://asool-gifts.com/api/categories/${categoryId}`)
        .then((response) => response.json())
        .then((data) => setInitialData(data))
        .catch(() => setInitialData(null));
    }
  }, [categoryId]);

  if (status === "loading") return <p>Loading categories...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="categories-container">
      <Button
        onClick={() => navigate("/dashboard/categories/add")}
        sx={{
          width: "100%",
          height: "100px",
          border: "4px dashed #fff",
          fontSize: "20px",
        }}
      >
        Add Category +
      </Button>

      {!categoryId ? (
        <>
          <h3>Categories</h3>
          <CategoryList categories={categories} />
        </>
      ) : (
        <>
          <h1>{categoryId ? "Edit Category" : "Create Category"}</h1>
          {initialData === null && categoryId ? (
            <p>Loading category data...</p>
          ) : (
            <CategoryForm
              isEdit={!!categoryId}
              categoryId={categoryId}
              initialData={initialData || {}}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Categories;
