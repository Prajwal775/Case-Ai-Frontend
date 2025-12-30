import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate, useLocation } from 'react-router-dom';
import LawIcon from '../icons/LawIcon';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Box
      sx={{
        width: 240,
        // bgcolor: '#0f172a',
        // color: '#fff',
        // p: 2,
        bgcolor: '#020617', // dark blue like screenshot
        color: '#fff',
        p: 2,
        minHeight: '100vh', // <‑ full height
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* <Typography variant="h6" sx={{ mb: 3 }}>
        CaseAdmin
        <Typography variant="caption" display="block" color="gray">
          Case Management
        </Typography>
      </Typography> */}
      <Box
        sx={{
          borderBottom: '1px solid #1f2937',
          pb: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: '#1d4ed8', // blue accent
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e5e7eb',
          }}
        >
          <LawIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
              fontSize: 20,
              fontWeight: 600,
              color: '#e5e7eb',
              lineHeight: 1.1,
            }}
          >
            CaseAdmin
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
              fontSize: 12,
              color: '#6b7280',
            }}
          >
            Case Management
          </Typography>
        </Box>
      </Box>
      <List>
        {/* <ListItemButton selected> */}
        <ListItemButton
          selected={location.pathname === '/dashboard'}
          onClick={() => navigate('/dashboard')}
        >
          <ListItemIcon sx={{ color: '#60a5fa' }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItemButton>

        <ListItemButton
          selected={location.pathname === '/cases'}
          onClick={() => navigate('/cases')}
        >
          <ListItemIcon sx={{ color: '#94a3b8' }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary='Cases' />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;
