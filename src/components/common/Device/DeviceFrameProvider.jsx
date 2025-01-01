import React from "react";
import { Stack } from "@mui/material";
import frame from "../../../assets/frame.png";

function DeviceFrameProvider({ children }) {
  return (
    <Stack
      sx={{
        position: "relative",
        width: "300px",
        height: "600px",
        overflow: "hidden",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Frame */}
      <Stack
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        <img
          src={frame}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 2,
          }}
        />
      </Stack>

      {/* Content Container */}
      <Stack
        sx={{
          position: "absolute",
          width: "95%",
          height: "95%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "28px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}

export default DeviceFrameProvider;
