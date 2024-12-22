import React from "react";

import { Box, Stack, Typography } from "@mui/material";

import MyTable from "../components/MyTable";
import MyGridChart from "../components/MyGridChart";
import MyBarChart from "../components/MyBarChart";

import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import { useTheme } from "@mui/material/styles";
import MyNewTable from "../components/common/MyNewTable";

// const rows = Array.from({ length: 50 }, (_, index) => ({
//   customerName: `Customer ${index + 1}`,
//   accountId: `ID${index + 1}`,
//   category: index % 2 === 0 ? "Gold" : "Silver",
//   cardNumber: `**** **** **** ${1000 + index}`,
//   deliverDate: `2024-12-${(index % 30) + 1}`,
//   payment: `$${(index + 1) * 10}`,
//   isPremium: index % 3 === 0 ? "Yes" : "No",
// }));
const rows = [
  {
    customerName: "Alice Johnson",
    accountId: "AC12345",
    category: "Gold",
    cardNumber: "**** **** **** 5678",
    deliverDate: "2024-12-05",
    payment: 129.99,
    isPremium: "Yes",
    orderStatus: "pending",
  },
  {
    customerName: "Michael Smith",
    accountId: "AC12346",
    category: "Silver",
    cardNumber: "**** **** **** 1234",
    deliverDate: "2024-12-06",
    payment: 79.99,
    isPremium: "No",
    orderStatus: "preparing",
  },
  {
    customerName: "Emma Brown",
    accountId: "AC12347",
    category: "Gold",
    cardNumber: "**** **** **** 7890",
    deliverDate: "2024-12-07",
    payment: 149.99,
    isPremium: "Yes",
    orderStatus: "done",
  },
  {
    customerName: "John Doe",
    accountId: "AC12348",
    category: "Silver",
    cardNumber: "**** **** **** 4321",
    deliverDate: "2024-12-08",
    payment: 59.99,
    isPremium: "No",
    orderStatus: "failed",
  },
  {
    customerName: "Sophia Davis",
    accountId: "AC12349",
    category: "Gold",
    cardNumber: "**** **** **** 9876",
    deliverDate: "2024-12-09",
    payment: 199.99,
    isPremium: "Yes",
    orderStatus: "pending",
  },
  {
    customerName: "James Wilson",
    accountId: "AC12350",
    category: "Silver",
    cardNumber: "**** **** **** 6543",
    deliverDate: "2024-12-10",
    payment: 99.99,
    isPremium: "No",
    orderStatus: "preparing",
  },
  {
    customerName: "Isabella Taylor",
    accountId: "AC12351",
    category: "Gold",
    cardNumber: "**** **** **** 3210",
    deliverDate: "2024-12-11",
    payment: 169.99,
    isPremium: "Yes",
    orderStatus: "done",
  },
  {
    customerName: "Oliver Anderson",
    accountId: "AC12352",
    category: "Silver",
    cardNumber: "**** **** **** 5678",
    deliverDate: "2024-12-12",
    payment: 49.99,
    isPremium: "No",
    orderStatus: "failed",
  },
  {
    customerName: "Mia Thompson",
    accountId: "AC12353",
    category: "Gold",
    cardNumber: "**** **** **** 8901",
    deliverDate: "2024-12-13",
    payment: 179.99,
    isPremium: "Yes",
    orderStatus: "pending",
  },
  {
    customerName: "William Martinez",
    accountId: "AC12354",
    category: "Silver",
    cardNumber: "**** **** **** 2345",
    deliverDate: "2024-12-14",
    payment: 69.99,
    isPremium: "No",
    orderStatus: "preparing",
  },
];
const columns = [
  { field: "customerName", headerName: "Customer Name", sortable: true },
  { field: "accountId", headerName: "Account ID", sortable: true },
  { field: "category", headerName: "Category", sortable: true },
  { field: "cardNumber", headerName: "Card Number", sortable: true },
  { field: "deliverDate", headerName: "Deliver Date", sortable: true },
  { field: "payment", headerName: "Payment", sortable: true },
  { field: "isPremium", headerName: "Premium Subscriber", sortable: true },
];

const TinyCard = ({ children, title, value }) => {
  const theme = useTheme();

  return (
    <Stack
      direction={"row"}
      sx={{
        padding: "20px",
        background: theme.palette.grey.main,
        borderRadius: "20px",
      }}
      gap={"20px"}
    >
      <Box
        sx={{
          backgroundColor: "#02b2af",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
      <Stack>
        <Typography>{title}</Typography>
        <Typography fontWeight={"bold"}>{value}</Typography>
      </Stack>
    </Stack>
  );
};

function HomeDash() {
  const theme = useTheme();
  const handleDetails = (row) => {
    alert(`Details of ${row.customerName}`);
  };
  return (
    <Stack direction={"column"} alignItems={"flex-start"} gap={"30px"}>
      <Stack direction={"row"} gap={"30px"}>
        <Box sx={{ border: "0px solid grey" }}>
          <MyBarChart />
        </Box>
        <Box sx={{ border: "0px solid grey" }}>
          <MyGridChart />
        </Box>
        <Stack gap={"5px"}>
          <TinyCard title={"Total Users"} value={"5000"}>
            <PersonIcon htmlColor={theme.palette.grey.main} />
          </TinyCard>
          <TinyCard title={"Top #10 Sales"} value={"I Phone 15 Pro "}>
            <LocalAtmIcon sx={{ color: "#000000" }} />
          </TinyCard>
        </Stack>
      </Stack>
      {/* <MyTable /> */}
      <MyNewTable
        title="Recent Orders"
        columns={columns}
        data={rows}
        actions={[{ label: "Details", onClick: handleDetails }]}
      />
    </Stack>
  );
}

export default HomeDash;
