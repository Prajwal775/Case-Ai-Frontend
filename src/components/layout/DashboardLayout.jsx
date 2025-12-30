import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children, title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // 🔥 fixed height, not minHeight
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#f8fafc",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar title={title} />
        <Box sx={{ p: 3, overflowY: "auto" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
