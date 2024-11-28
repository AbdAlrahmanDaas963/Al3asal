import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";

const DevDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 10,
        right: 10,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 1000,
        fontFamily: '"Roboto", sans-serif',
      }}
    >
      {`${dimensions.width}px * ${dimensions.height}px`}
    </Box>
  );
};

export default DevDimensions;
