import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  TextField,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import { useChat } from "../../context/ChatContext";

const PAGE_SIZE = 10;
const DEBOUNCE_DELAY = 300;

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleString();
};

const Cases = () => {
  const navigate = useNavigate();
  const { openChat } = useChat();
  const gridRef = useRef(null);

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [caseNameInput, setCaseNameInput] = useState("");
  const [caseNameFilter, setCaseNameFilter] = useState("");

  // -----------------------------
  // Fetch cases (server-side)
  // -----------------------------
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const skip = (page - 1) * PAGE_SIZE;

      const { data } = await api.get("/api/v1/cases/list-cases", {
        params: {
          skip,
          limit: PAGE_SIZE,
          case_name: caseNameFilter || undefined,
        },
      });

      setRowData(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while fetching cases"
      );
    } finally {
      setLoading(false);
    }
  }, [page, caseNameFilter]);

  // Initial + pagination fetch
  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // -----------------------------
  // Debounce search input
  // -----------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setCaseNameFilter(caseNameInput.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [caseNameInput]);

  // -----------------------------
  // AG Grid Columns
  // -----------------------------
  const columnDefs = useMemo(
    () => [
      {
        headerName: "Case",
        field: "case_name",
        flex: 1.5,
        headerClass: "ag-header-text-lg",
        cellRenderer: (params) => (
          <Box>
            <Typography fontSize={13} fontWeight={500}>
              {params.data.case_name}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {params.data.case_no}
            </Typography>
          </Box>
        ),
      },
      {
        headerName: "Description",
        field: "description",
        flex: 2,
        headerClass: "ag-header-text-lg",
        valueFormatter: (p) => p.value || "-",
      },
      {
        headerName: "Created",
        field: "created_at",
        flex: 1,
        headerClass: "ag-header-text-lg",
        valueFormatter: (p) => formatDate(p.value),
      },
      {
        headerName: "",
        field: "actions",
        width: 120,
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Tooltip title="View case">
              <IconButton
                size="small"
                onClick={() => navigate(`/cases/${params.data.id}`)}
              >
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Open chat">
              <IconButton
                size="small"
                onClick={() =>
                  openChat({
                    caseId: params.data.id,
                    sessionId: null,
                  })
                }
              >
                <ChatBubbleOutlineOutlinedIcon
                  fontSize="small"
                  sx={{ color: "var(--primary)" }}
                />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [navigate, openChat]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
    }),
    []
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <DashboardLayout title="Cases">
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          size="small"
          placeholder="Search by case name"
          value={caseNameInput}
          onChange={(e) => setCaseNameInput(e.target.value)}
          sx={{ width: 260 }}
        />

        <Button
          variant="contained"
          sx={{
            height: 36,
            px: 2,
            fontSize: 13,
            fontWeight: 500,
            textTransform: "none",
            bgcolor: "var(--primary)",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "var(--primary)",
              opacity: 0.9,
              boxShadow: "none",
            },
          }}
          onClick={() => navigate("/cases/create")}
        >
          Create Case
        </Button>
      </Stack>

      {/* Loading / Error */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {/* AG Grid */}
      {!loading && !error && (
        <Box
          className="ag-theme-alpine"
          sx={{
            height: 520,
            width: "100%",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}
        >
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressPaginationPanel
            rowHeight={56}
            headerHeight={52}
          />
        </Box>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          mt={2}
        >
          <Button
            size="small"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>

          <Typography fontSize={13}>
            Page {page} of {totalPages}
          </Typography>

          <Button
            size="small"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </Stack>
      )}
    </DashboardLayout>
  );
};

export default Cases;
