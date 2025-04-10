import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import AddCategoryForm from "./AddCategoryForm";
import CategoryList from "./CategoryList";

const Categories = ({ categoryId }) => {
  const navigate = useNavigate();

  return (
    <Stack gap={3}>
      {categoryId ? (
        <AddCategoryForm isEdit={!!categoryId} categoryId={categoryId} />
      ) : (
        <>
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
          <CategoryList />
        </>
      )}
    </Stack>
  );
};

export default Categories;
