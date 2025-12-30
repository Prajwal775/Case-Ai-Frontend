import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";

const cases = [
  { name: "Johnson vs. Smith Corporation", code: "CASE-2024-001", status: "active" },
  { name: "Estate of Williams", code: "CASE-2024-002", status: "pending" },
  { name: "Martinez Employment Dispute", code: "CASE-2024-003", status: "active" },
];

const RecentCases = () => {
  return (
    <Card sx={{ flex: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Cases
        </Typography>

        <List>
          {cases.map((c) => (
            <ListItem key={c.code} divider>
              <ListItemText
                primary={c.name}
                secondary={c.code}
              />
              <Chip
                label={c.status}
                color={c.status === "active" ? "primary" : "warning"}
                size="small"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentCases;
