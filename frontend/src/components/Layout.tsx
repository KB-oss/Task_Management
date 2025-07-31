// src/components/Layout.tsx
import React from "react";
import  type { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  ListItemButton,
} from "@mui/material";
import { Menu as MenuIcon, List as ListIcon, Add as AddIcon } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";



interface LayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const location = useLocation();

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
// const user = useSelector((state: RootState) => state.auth.user); 

// Adjust the type as per your auth state
  // Define menu items
  const menuItems = [
    { text: "All Tasks", icon: <ListIcon />, path: "/tasks" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar / Header */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        color="primary"
      >
        <Toolbar className="flex justify-between">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Task Manager
          </Typography>
          <Box className="flex items-center space-x-3">
            <Typography></Typography>
            <Avatar alt="Profile" src="/profile-placeholder.png" />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer / Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map(({ text, icon, path }) => (
              <ListItem
                key={text}
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Mobile drawer (optional) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <List>
          {menuItems.map(({ text, icon, path }) => (
            <ListItem
              key={text}
              disablePadding
            >
              <ListItemButton
                component={Link}
                to={path}
                onClick={toggleDrawer}
                selected={location.pathname === path}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
