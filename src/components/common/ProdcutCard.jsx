import { Box, Button, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteShop } from "../../features/Shops/shopSlice";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

function ProductCard({ item }) {
  const { id, name, image, is_interested } = item;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { language } = useContext(LanguageContext);

  const getDisplayName = () => {
    if (typeof name === "string") return name;
    return name?.[language] || name?.en || name?.ar || "Unnamed Product";
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      dispatch(deleteShop(id));
    }
  };

  return (
    <Box dir={language === "ar" ? "rtl" : "ltr"}>
      <Stack
        sx={{
          width: "300px",
          backgroundColor: "#252525",
          padding: "10px",
          borderRadius: "20px",
          position: "relative",
        }}
      >
        <img
          src={image}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "16px",
            backgroundColor: "grey",
          }}
          alt={getDisplayName()}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />

        {is_interested ? (
          <Chip
            label="Interested"
            color="primary"
            size="small"
            sx={{ position: "absolute", top: 10, right: 10 }}
          />
        ) : null}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
          sx={{ gap: 1 }}
        >
          <Typography variant="body2" color="textSecondary" noWrap>
            Product Name:
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            noWrap
            sx={{
              flexGrow: 1,
              textAlign: "end",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={getDisplayName()}
          >
            {getDisplayName()}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          mt={2}
          gap={"10px"}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              navigate(`/dashboard/shops/edit/${id}`, { state: { item } })
            }
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ProductCard;
