// import { Box } from "@mui/material";
// import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";

// const DashboardLayout = ({ children, title }) => {
//   return (
//     <Box
//       sx={{
//         display: "flex",
//         height: "100vh", // 🔥 fixed height, not minHeight
//         overflow: "hidden",
//       }}
//     >
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main area */}
//       <Box
//         sx={{
//           flexGrow: 1,
//           bgcolor: "#f8fafc",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Topbar title={title} />
//         <Box sx={{ p: 3, overflowY: "auto" }}>
//           {children}
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default DashboardLayout;
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = ({ children, title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Sidebar (collapsible) */}
      <Sidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0, // prevents horizontal scroll with tables / ag-grid
          bgcolor: "#ffffff",
        }}
      >
        {/* Topbar */}
        <Topbar title={title} />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            px: 2.5,
            py: 2,
            bgcolor: "#ffffff",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
