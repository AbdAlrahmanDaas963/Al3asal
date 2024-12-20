import React, { useState } from "react";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DeleteIcon from "@mui/icons-material/Delete";

const ImageInput = ({ onChange, onRemove, hasImage }) => {
  const [fileName, setFileName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    setFileName("");
    onRemove();
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{
        width: "100%",
        padding: "8px",
        border: "1px dashed grey",
        borderRadius: "8px",
      }}
    >
      <Typography variant="body2" color="textSecondary" noWrap>
        {fileName || "Upload your image"}
      </Typography>
      <Box>
        {hasImage ? (
          <IconButton onClick={handleRemoveImage} color="error">
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton component="label">
            <AddAPhotoIcon />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
        )}
      </Box>
    </Stack>
  );
};

export default ImageInput;
