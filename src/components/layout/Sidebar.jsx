// import {
//   Box,
//   Typography,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
// } from '@mui/material';
// import FolderIcon from '@mui/icons-material/Folder';
// import { useNavigate, useLocation } from 'react-router-dom';
// import LawIcon from '../icons/LawIcon';

// const Sidebar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   return (
//     <Box
//       sx={{
//         width: 240,

//         bgcolor: '#020617', // dark blue like screenshot
//         color: '#fff',
//         p: 2,
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <Box
//         sx={{
//           borderBottom: '1px solid #1f2937',
//           pb: 2,
//           mb: 2,
//           display: 'flex',
//           alignItems: 'center',
//           gap: 1.5,
//         }}
//       >
//         <Box
//           sx={{
//             width: 40,
//             height: 40,
//             borderRadius: 2,
//             bgcolor: '#1d4ed8', // blue accent
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: '#e5e7eb',
//           }}
//         >
//           <LawIcon sx={{ fontSize: 24 }} />
//         </Box>
//         <Box>
//           <Typography
//             sx={{
//               fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
//               fontSize: 20,
//               fontWeight: 600,
//               color: '#e5e7eb',
//               lineHeight: 1.1,
//             }}
//           >
//             CaseAdmin
//           </Typography>
//           <Typography
//             sx={{
//               fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
//               fontSize: 12,
//               color: '#6b7280',
//             }}
//           >
//             Case Management
//           </Typography>
//         </Box>
//       </Box>
//       <List>
//         {/* <ListItemButton selected> */}

//         <ListItemButton
//           selected={location.pathname === '/cases'}
//           onClick={() => navigate('/cases')}
//         >
//           <ListItemIcon sx={{ color: '#94a3b8' }}>
//             <FolderIcon />
//           </ListItemIcon>
//           <ListItemText primary='Cases' />
//         </ListItemButton>
//       </List>
//     </Box>
//   );
// };

// export default Sidebar;

import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import LawIcon from "../icons/LawIcon";

const SIDEBAR_EXPANDED_WIDTH = 220;
const SIDEBAR_COLLAPSED_WIDTH = 64;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;
  const isCasesActive = location.pathname.startsWith("/cases");

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        width: expanded
          ? SIDEBAR_EXPANDED_WIDTH
          : SIDEBAR_COLLAPSED_WIDTH,
        transition: "width 0.25s ease",
        bgcolor: "#ffffff",
        borderRight: "1px solid var(--border-light)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top / Brand */}
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          px: expanded ? 2 : 0,
          borderBottom: "1px solid var(--border-light)",
          transition: "padding 0.25s ease",
        }}
      >
        {expanded && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LawIcon sx={{ fontSize: 22, color: "var(--primary)" }} />
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-main)",
                whiteSpace: "nowrap",
              }}
            >
              CaseAdmin
            </Typography>
          </Box>
        )}

        <IconButton
          size="small"
          onClick={() => setPinned((v) => !v)}
          sx={{
            ml: expanded ? 0 : 0,
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ px: expanded ? 1 : 0.5, py: 1 }}>
        <Tooltip
          title={!expanded ? "Cases" : ""}
          placement="right"
        >
          <ListItemButton
            onClick={() => navigate("/cases")}
            selected={isCasesActive}
            sx={{
              height: 40,
              borderRadius: 1.5,
              justifyContent: expanded ? "flex-start" : "center",
              px: expanded ? 1.5 : 0,
              mb: 0.5,
              transition: "all 0.2s ease",

              "&.Mui-selected": {
                bgcolor: "var(--primary-soft)",
                "& .MuiListItemIcon-root": {
                  color: "var(--primary)",
                },
              },

              "&:hover": {
                bgcolor: "var(--bg-hover)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: expanded ? 1.5 : 0,
                color: "var(--text-muted)",
                justifyContent: "center",
                transition: "margin 0.2s ease",
              }}
            >
              <FolderIcon fontSize="small" />
            </ListItemIcon>

            {expanded && (
              <ListItemText
                primary="Cases"
                primaryTypographyProps={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-main)",
                  whiteSpace: "nowrap",
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );
};

export default Sidebar;
