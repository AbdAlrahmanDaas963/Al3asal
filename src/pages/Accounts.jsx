import React from "react";

import {
  Stack,
  Box,
  Typography,
  TextField,
  Switch,
  Divider,
  Button,
} from "@mui/material";

import MyTextField from "../components/common/MyTextField";
import MyPaper from "../components/common/MyPaper";

function Accounts() {
  return (
    <Stack alignItems={"flex-start"} gap={"20px"}>
      <Stack sx={{ alignItems: "flex-start" }}>
        <Typography>Create Profile</Typography>
      </Stack>
      <MyPaper gap={"10px"} width={"100%"}>
        <Typography>Personal info</Typography>
        <Divider variant="fullWidth" color="white" />
        <Stack>
          <Stack direction={"row"}>
            <MyTextField label={"User Name"} />
            <MyTextField label={"Password"} type={"password"} />
          </Stack>
        </Stack>
      </MyPaper>
      <MyPaper width={"100%"}>
        <Typography>Personal info</Typography>
        <Stack direction={"row"} alignItems={"center"} gap={"10px"}>
          <Switch defaultChecked />
          <Typography>Admin Account</Typography>
        </Stack>
      </MyPaper>
      <Stack sx={{ alignItems: "flex-end", width: "100%" }}>
        <Button variant="contained" color="error">
          Save
        </Button>
      </Stack>
    </Stack>
  );
}

export default Accounts;
