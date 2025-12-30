import { Card, CardContent, Typography, Button } from "@mui/material";

const FilesOverview = () => {
  return (
    <Card sx={{ flex: 1 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h3" fontWeight={700}>
          12
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Total Files Uploaded
        </Typography>

        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Manage Cases →
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilesOverview;
