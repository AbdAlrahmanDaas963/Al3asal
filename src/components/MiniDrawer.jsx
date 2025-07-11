import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Outlet, Link } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import InventoryIcon from "@mui/icons-material/Inventory";
import Stack from "@mui/material/Stack";

import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AnalyticsIcon from "@mui/icons-material/Analytics";

// ? toggle
import LanguageToggleButton from "./common/LanguageToggleButton";

import { useTranslation } from "react-i18next";
import LogOutButton from "./common/LogOutButton";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    backgroundColor: "#292929",
    color: "white",
    ...(!open && closedMixin(theme)),
    ...(open && openedMixin(theme)),
  },
}));

const Dashboard = () => {
  const { t } = useTranslation("drawer");

  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setOpen(!open);
    }
  };

  const handleDrawerClose = () => {
    if (isMobile) {
      setMobileOpen(false);
    } else {
      setOpen(false);
    }
  };

  const handleDrawerOpen = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setOpen(true);
    }
  };

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.type === "super";

  // const menuItems = [
  //   { path: "Dashboard", text: t("dashboard"), icon: <DashboardIcon /> },
  //   { path: "orders", text: t("orders"), icon: <ShoppingCartIcon /> },
  //   // { path: "accounts", text: t("accounts"), icon: <AccountCircleIcon /> },
  //   ...(isAdmin
  //     ? [
  //         { path: "Statistics", text: t("Statistics"), icon: <PaymentIcon /> },
  //         {
  //           path: "accounts",
  //           text: t("accounts"),
  //           icon: <AccountCircleIcon />,
  //         },
  //         {
  //           path: "premium-settings",
  //           text: t("premiumSettings"),
  //           icon: <AccountCircleIcon />,
  //         },
  //       ]
  //     : []),
  //   { path: "products", text: t("products"), icon: <InventoryIcon /> },
  //   { path: "offers", text: t("offers"), icon: <InventoryIcon /> },
  //   { path: "category", text: t("category"), icon: <CategoryIcon /> },
  //   { path: "shops", text: t("shops"), icon: <StoreIcon /> },
  // ];

  const menuItems = [
    { path: "Dashboard", text: t("dashboard"), icon: <DashboardIcon /> },
    { path: "orders", text: t("orders"), icon: <ShoppingCartIcon /> },
    // { path: "accounts", text: t("accounts"), icon: <AccountCircleIcon /> },
    ...(isAdmin
      ? [
          {
            path: "Statistics",
            text: t("Statistics"),
            icon: <AnalyticsIcon />,
          },
          {
            path: "accounts",
            text: t("accounts"),
            icon: <AccountCircleIcon />,
          },
          {
            path: "premium-settings",
            text: t("premiumSettings"),
            icon: <StarIcon />,
          },
        ]
      : []),
    { path: "products", text: t("products"), icon: <InventoryIcon /> },
    { path: "offers", text: t("offers"), icon: <LocalOfferIcon /> },
    { path: "category", text: t("category"), icon: <CategoryIcon /> },
    { path: "shops", text: t("shops"), icon: <StoreIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "#292929",
          ...(!isMobile && {
            ...(theme.direction === "rtl"
              ? { marginRight: open ? `${drawerWidth}px` : 0 }
              : { marginLeft: open ? `${drawerWidth}px` : 0 }),
          }),
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              ...(theme.direction === "rtl"
                ? { marginLeft: 2 }
                : { marginRight: 2 }),
              ...(!isMobile && open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            sx={{ width: "100%" }}
          >
            <Typography variant="h6" noWrap>
              Dashboard
            </Typography>
            <LanguageToggleButton />
            <LogOutButton />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#292929",
            color: "white",
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  path === "Dashboard"
                    ? "/dashboard"
                    : `/dashboard/${path.toLowerCase()}`
                }
                onClick={handleDrawerClose}
                sx={{ textAlign: theme.direction === "rtl" ? "right" : "left" }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: theme.direction === "rtl" ? 2 : 3,
                    ml: theme.direction === "rtl" ? 3 : 0,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </MuiDrawer>

      {/* Desktop Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile && open}
        sx={{
          display: { xs: "none", sm: "block" },
          ...(theme.direction === "rtl"
            ? { right: 0, left: "auto" }
            : { left: 0, right: "auto" }),
          "& .MuiDrawer-paper": {
            ...(theme.direction === "rtl"
              ? { right: 0, left: "auto" }
              : { left: 0, right: "auto" }),
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                component={Link}
                to={
                  path === "Dashboard"
                    ? "/dashboard"
                    : `/dashboard/${path.toLowerCase()}`
                }
                sx={{ textAlign: theme.direction === "rtl" ? "right" : "left" }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: theme.direction === "rtl" ? 2 : 3,
                    ml: theme.direction === "rtl" ? 3 : 0,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${open ? drawerWidth : theme.spacing(8)}px)`,
          },
        }}
      >
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
