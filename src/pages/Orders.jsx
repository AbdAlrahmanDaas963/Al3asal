import React, { useState } from "react";

import PropTypes from "prop-types";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import MyTableTabs from "../components/common/MyTableTabs";

// const rows = Array.from({ length: 50 }, (_, index) => ({
//   customerName: `Customer ${index + 1}`,
//   accountId: `ID${index + 1}`,
//   category: index % 2 === 0 ? "Gold" : "Silver",
//   cardNumber: `**** **** **** ${1000 + index}`,
//   deliverDate: `2024-12-${(index % 30) + 1}`,
//   payment: (index + 1) * 10,
//   isPremium: index % 3 === 0 ? "Yes" : "No",
//   orderStatus: ["pending", "preparing", "done", "failed"][index % 4],
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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Orders() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDetails = (row) => {
    alert(`Details of ${row.customerName}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Products" {...a11yProps(0)} />
          <Tab label="Offers" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MyTableTabs
          title="Products"
          columns={columns}
          data={rows}
          actions={[{ label: "Details", onClick: handleDetails }]}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MyTableTabs
          title="Offers"
          columns={columns}
          data={rows}
          actions={[{ label: "Details", onClick: handleDetails }]}
        />
      </CustomTabPanel>
    </Box>
  );
}

export default Orders;
