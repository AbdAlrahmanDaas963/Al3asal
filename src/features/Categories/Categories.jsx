import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "./categorySlice";
import CategoryList from "./CategoryList";
import { Button } from "@mui/material";
import AddCategoryForm from "./AddCategoryForm";

const Categories = ({ categoryId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, status, error } = useSelector(
    (state) => state.categories
  );
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoryId) {
      const category = categories.find((cat) => cat.id === categoryId);
      setSelectedCategory(category);
    }
  }, [categoryId, categories]);

  if (status === "loading") return <p>Loading categories...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div className="categories-container">
      <Button
        onClick={() => navigate("/dashboard/category/add")}
        sx={{
          width: "100%",
          height: "100px",
          border: "4px dashed #fff",
          fontSize: "20px",
        }}
      >
        Add Category +
      </Button>

      {categoryId ? (
        <AddCategoryForm
          isEdit={!!categoryId}
          initialData={selectedCategory || {}}
        />
      ) : (
        <>
          <h3>Categories</h3>
          <CategoryList categories={categories} status={status} error={error} />
        </>
      )}
    </div>
  );
};

export default Categories;
