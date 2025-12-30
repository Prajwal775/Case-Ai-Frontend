import { Box } from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCard from '../dashboard/StatsCard';
import RecentCases from '../dashboard/RecentCases';
import FilesOverview from '../dashboard/FilesOverview';
import FolderIcon from '@mui/icons-material/Folder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HourglassIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <StatsCard
          title='Total Cases'
          value={5}
          icon={<FolderIcon />}
          color='#e0f2fe'
        />
        <StatsCard
          title='Active Cases'
          value={3}
          icon={<PlayArrowIcon />}
          color='#fff7ed'
        />
        <StatsCard
          title='Pending Cases'
          value={1}
          icon={<HourglassIcon />}
          color='#f1f5f9'
        />
        <StatsCard
          title='Closed Cases'
          value={1}
          icon={<CheckCircleIcon />}
          color='#dcfce7'
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <RecentCases />
        <FilesOverview />
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
