// import {
//   Box,
//   TextField,
//   Avatar,
//   IconButton,
//   Button,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";

// const Topbar = () => {
//   return (
//     <Box
//       sx={{
//         height: 64,
//         bgcolor: "#fff",
//         borderBottom: "1px solid #e5e7eb",
//         px: 3,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//       }}
//     >
//       <TextField
//         size="small"
//         placeholder="Search..."
//         sx={{ width: 300 }}
//       />
//       <Button variant="contained" color="primary" onClick={() => {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("refreshToken");
//         window.location.href = "/login";
//       }}>
//        LOGOUT
//       </Button>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <IconButton>
//           <NotificationsIcon />
//         </IconButton>
//         <Avatar>AU</Avatar>
//       </Box>
//     </Box>
//   );
// };

// export default Topbar;
import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../context/AuthContext";

const getInitials = (name = "Admin User") => {
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
};

const Topbar = ({ title = "Dashboard" }) => {
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#ffffff",
        px: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* LEFT: Page Title */}
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>

      {/* RIGHT: Actions */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Notifications">
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Account">
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 36,
                height: 36,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {getInitials("Admin User")}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* DROPDOWN MENU */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem disabled>
            <Typography fontSize={14} fontWeight={500}>
              Admin User
            </Typography>
          </MenuItem>

          <Divider />

          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;

