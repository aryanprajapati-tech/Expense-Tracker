import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Snackbar, Alert } from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { TablePagination } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CategoryIcon from "@mui/icons-material/Category";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DeleteIcon from "@mui/icons-material/Delete";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// ----- Consistent color palette pulled from the original design -----
const theme = createTheme({
  palette: {
    primary: { main: "#162d6b" }, // heading / brand blue
    secondary: { main: "#5b5b7a" }, // muted label grey-blue
    error: { main: "#c81616" }, // save / expense red
    background: { default: "#f5f6fa", paper: "#ffffff" },
    text: { primary: "#1f2937", secondary: "#5b5b7a" },
    success: { main: "#1e8e5a" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: { fontWeight: 700, color: "#162d6b" },
    h6: { fontWeight: 600, color: "#1f2937" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 12 },
      },
    },
  },
});

function Dashboard() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(null);
  const [editId, seteditId] = useState(null);
  const [chartFilter, setChartFilter] = useState("1M");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const today = dayjs();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [transactions,setTransactions]=useState([]);
  const[totalPages,setTotalPages]=useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
const [totalExpense, setTotalExpense] = useState(0);
const [balance, setBalance] = useState(0);
// const [pieData, setPieData] = useState([]);
const [categorySummary, setCategorySummary] = useState([]);
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState(0);
  const size = 10;
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
const [deleteId, setDeleteId] = useState(null);
 
  const loadTransactions = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:8080/transaction?page=0&size=10", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  setTransactions(data.content);
  setTotalPages(data.totalPages);
};

  useEffect(() => {
    loadTransactions();
 
    loadSummary();
  }, [page]);

  const clearForm = () => {
    setCategory("");
    setAmount("");
    setType("");
    setNote("");
    setDate(null);
  };


const handleSubmit = async () => {
  const token = localStorage.getItem("token");

  const transaction = {
    category,
    amount,
    type,
    note,
    date,
  };

  await fetch("http://localhost:8080/addTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });

  loadTransactions();
  loadSummary();
  setShowModal(false);
  
  clearForm();
  setSnackbarOpen(true);
};
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const fromStr = fromDate ? fromDate.format("YYYY-MM-DD") : "";
  const toStr = toDate ? toDate.format("YYYY-MM-DD") : "";
  const filteredTransactions = (transactions || [])
    .filter(
      (t) =>
        (fromStr === "" || t.date >= fromStr) &&
        (toStr === "" || t.date <= toStr)
    )
    .filter((t) => filter === "All" || t.type === filter);


  const handleLogout = () => {
    

    navigate("/login", { replace: true }); // Navigate to Login page
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
  
 useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.removeItem("token");
   // clear Redux state
    navigate("/login", { replace: true });
  },60 * 60 * 1000); // 1 hour

  return () => clearTimeout(timer);
}, [navigate]);
// const handleFilterClick = (filter) => {
//   setChartFilter(filter);
// };
const handleChartFilter = (value) => {
  setChartFilter(value);
};
  const loadSummary = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:8080/transaction/summary",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    const data = await response.json();

    setTotalIncome(data.totalIncome);
    setTotalExpense(data.totalExpense);
    setBalance(data.balance);
  };

 


 
const updateTransaction = async (e) => {
   e.preventDefault();
    const transaction = {
        category,
        amount,
        type,
        note,
        date
    };

    const response = await fetch(
        `http://localhost:8080/transaction/${editId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(transaction)
        }
    );

    if (response.ok) {
    loadTransactions();
    loadSummary();
    loadCategorySummary();
    clearForm();
    seteditId(null);
    setShowModal(false);
  }
};
const deleteTransaction = async (id) => {

    const token = localStorage.getItem("token");

   const response= await fetch(`http://localhost:8080/transaction/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
    loadTransactions();
    loadSummary();
    loadCategorySummary();
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }
};
const loadCategorySummary = async () => {
  const { fromDate, toDate } = getDateRange();
  
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:8080/category-summary",
    {
      method:"POST",
      headers: {
        
        Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      },
       body: JSON.stringify({
        fromDate,
        toDate,
      }),
    }
  );

 const data = await response.json();

    // setPieData(data);
      loadTransactions();
      
  setCategorySummary(data);
};
useEffect(() => {
  loadTransactions();
  loadSummary();
loadCategorySummary();
}, [chartFilter])
const pieData = categorySummary.map((item, index) => ({
  id: index,
  value: Number(item.totalAmount),
  label: item.category,
}));
  
  const getDateRange = () => {
    const today = dayjs();

    switch (chartFilter) {
      case "1M":
       
        return {
          fromDate: today.subtract(1, "month").format("YYYY-MM-DD"),
          toDate: today.format("YYYY-MM-DD"),
        };
        
      case "3M":
      
        return {
          fromDate: today.subtract(3, "month").format("YYYY-MM-DD"),
          toDate: today.format("YYYY-MM-DD"),
        };

      case "6M":
       
        return {
          fromDate: today.subtract(6, "month").format("YYYY-MM-DD"),
          toDate: today.format("YYYY-MM-DD"),
        };

      case "1Y":
        
        return {
          fromDate: today.subtract(1, "year").format("YYYY-MM-DD"),
          toDate: today.format("YYYY-MM-DD"),
        };

      case "CUSTOM":
        return {
          fromDate: fromDate?.format("YYYY-MM-DD"),
          toDate: toDate?.format("YYYY-MM-DD"),
        };

      default:
        return {};
    }
  };
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            py: 4,
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          {/* ---------------- Add Transaction Modal ---------------- */}
          <Dialog
            open={showModal}
            onClose={() => {
              clearForm();
              setShowModal(false);
            }}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 3 } }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "#fff",
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                {editId ? "Update Transaction" : "Add Transaction"}
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  clearForm();
                  setShowModal(false);
                }}
                sx={{ color: "#fff" }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
              <Box component="form"
                onSubmit={(e) => {
                  e.preventDefault();

                  if (editId) {
                    updateTransaction(e);
                  } else {
                    handleSubmit(e);
                  }
                }}

              >
                <Stack spacing={2.5}>
                  <FormControl fullWidth required size="small">
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      label="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon fontSize="small" sx={{ color: "secondary.main" }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Salary">Salary</MenuItem>
                      <MenuItem value="Food">Food</MenuItem>
                      <MenuItem value="Travel">Travel</MenuItem>
                      <MenuItem value="Shopping">Shopping</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Amount"
                    type="number"
                    fullWidth
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CurrencyRupeeIcon fontSize="small" sx={{ color: "secondary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl >
                    <Typography variant="body2" sx={{ color: "secondary.main", mb: 0.5 }}>
                      Type
                    </Typography>
                    <RadioGroup
                      row
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <FormControlLabel
                        value="INCOME"
                        control={<Radio required color="success" />}
                        label="Income"
                      />
                      <FormControlLabel
                        value="EXPENSE"
                        control={<Radio color="error" />}
                        label="Expense"
                      />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    label="Notes"
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon fontSize="small" sx={{ color: "secondary.main" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    maxDate={today}
                    slotProps={{
                      textField: { fullWidth: true, required: true, size: "small" }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    sx={{ py: 1.2, fontSize: "15px" }}
                  >

                    {editId ? "Update" : "Save"}
                  </Button>
                </Stack>
              </Box>
            </DialogContent>
          </Dialog>
       
          {/* ---------------- Header ---------------- */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4">
              Expense Tracker
            </Typography>

            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>


          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              mb: 3,
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Summary" />
              <Tab label="Transactions" />
            </Tabs>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => {
                clearForm();
                setShowModal(true);
              }}
              sx={{ mb: 1 }}
            >
              Add Transaction
            </Button>


          </Box>
          {tab === 0 && (
            <>
              <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                <Paper sx={{ flex: 1, p: 3, display: "flex", gap: 2 }}>
                  <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography color="text.secondary">Total Income</Typography>
                    <Typography variant="h5" color="success.main" fontWeight="bold">
                      ₹{totalIncome}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ flex: 1, p: 3, display: "flex", gap: 2 }}>
                  <TrendingDownIcon color="error" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography color="text.secondary">Total Expense</Typography>
                    <Typography variant="h5" color="error.main" fontWeight="bold">
                      ₹{totalExpense}
                    </Typography>
                  </Box>
                </Paper>

                <Paper sx={{ flex: 1, p: 3, display: "flex", gap: 2 }}>
                  <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography color="text.secondary">Balance</Typography>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                      ₹{balance}
                    </Typography>
                  </Box>
                </Paper>

              </Stack>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    width: 650,
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    mb={2}
                    fontWeight="bold"
                  >
                    Expense by Category
                  </Typography>

                 
              
                 

              
                  <Stack
  direction="row"
  spacing={2}
  justifyContent="center"
  sx={{ mb: 3 }}
>
  <Button
    variant={chartFilter === "1M" ? "contained" : "outlined"}
    onClick={() => handleChartFilter("1M")}
  >
    1 Month
  </Button>

  <Button
    variant={chartFilter === "3M" ? "contained" : "outlined"}
    onClick={() => handleChartFilter("3M")}
  >
    3 Months
  </Button>

  <Button
    variant={chartFilter === "6M" ? "contained" : "outlined"}
    onClick={() => handleChartFilter("6M")}
  >
    6 Months
  </Button>

  <Button
    variant={chartFilter === "1Y" ? "contained" : "outlined"}
    onClick={() => handleChartFilter("1Y")}
  >
    1 Year
  </Button>

  <Button
    variant={chartFilter === "CUSTOM" ? "contained" : "outlined"}
    onClick={() => handleChartFilter("CUSTOM")}
  >
    Custom
  </Button>
</Stack>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <PieChart
                      width={500}
                      height={300}
                      series={[
                        {
                          data: pieData,
                          innerRadius: 50,
                          outerRadius: 110,
                          paddingAngle: 2,
                          cornerRadius: 5,
                        },
                      ]}
                    />
                  </Box>
                 
                </Paper>
              </Box>
            </>
          )}
          {tab === 1 && (
            <>
              {/* ---------------- Filter Bar ---------------- */}


              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                  my: 3,
                  border: "1px solid #e0e0e6",
                }}
              >


                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <DatePicker
                    label="From"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    maxDate={today}
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => setFromDate(null),
                      },
                      textField: {
                        size: "small", sx: { width: 170 }
                      },
                      actionBar: {
                        actions: ["clear", "cancel"],
                      },

                    }}
                  />
                  <DatePicker
                    label="To"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    minDate={fromDate || undefined}
                    maxDate={today}
                    slotProps={{
                      field: {
                        clearable: true,
                        onClear: () => setFromDate(null),
                      },
                      textField: { size: "small", sx: { width: 170 } },
                      actionBar: {
                        actions: ["clear", "cancel"],
                      },
                    }}

                  />

                </Stack>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="filter-label">Type</InputLabel>
                  <Select
                    labelId="filter-label"
                    label="Type"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterAltIcon fontSize="small" sx={{ color: "secondary.main" }} />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="INCOME">Income</MenuItem>
                    <MenuItem value="EXPENSE">Expense</MenuItem>
                  </Select>
                </FormControl>


              </Paper>


              {/*---------------- Transactions Table ----------------*/}
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>

              <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e6" }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "#eef1f8" }}>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }} align="right">
                        Amount
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Note</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ color: "secondary.main", py: 4 }}>
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                    {filteredTransactions.map((t, idx) => (
                      <TableRow key={t.id ?? idx} hover>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>{t.category}</TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: t.type === "INCOME" ? "success.main" : "error.main", fontWeight: 600 }}
                        >
                          ₹{t.amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={t.type}
                            size="small"
                            color={t.type === "INCOME" ? "success" : "error"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{t.note}-</TableCell>
                        <TableCell>
                          <IconButton
                            variant="contained"

                            color="warning"
                            onClick={() => {

                              seteditId(t.id);

                              setCategory(t.category);
                              setAmount(t.amount);
                              setType(t.type);
                              setNote(t.note);
                              setDate(dayjs(t.date));

                              setShowModal(true);

                            }}
                          >

                            <EditIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => {
  setDeleteId(t.id);
  setDeleteDialogOpen(true);
}}
                            // onClick={() => {deleteTransaction(t.id); setDeleteDialogOpen(true);}}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                           <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogContent sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Delete Transaction
    </Typography>

    <Typography sx={{ mb: 3 }}>
      Are you sure you want to delete this transaction?
    </Typography>

    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
      <Button
        variant="outlined"
        onClick={() => {
  setDeleteDialogOpen(false);
  setDeleteId(null);
}}
        // onClick={() => setDeleteDialogOpen(false)}
      >
        No
      </Button>

      <Button
        variant="contained"
        color="error"
        onClick={() => deleteTransaction(deleteId)}
      >
        Yes
      </Button>
    </Box>
  </DialogContent>
</Dialog>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  mt: 3,
                  pr: 2,
                }}
              >
                <Button
                  variant="contained"
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>

                <Typography>
                  Page {page + 1} of {totalPages}
                </Typography>

                <Button
                  variant="contained"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>

              </Box>
            </>
          )}
        </Box>

      </LocalizationProvider>
<Snackbar
  open={snackbarOpen}
  autoHideDuration={3000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity="success"
    variant="filled"
    sx={{ width: "100%" }}
  >
    Transaction added successfully!
  </Alert>
</Snackbar>
    </ThemeProvider>

  );
}
export default Dashboard;
