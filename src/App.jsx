// import { useState, useEffect } from "react";
// import dayjs from "dayjs";

// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   IconButton,
//   Dialog,
//   DialogContent,
//   TextField,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   InputAdornment,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Chip,
//   Stack,
//   Divider,
//   ThemeProvider,
//   createTheme,
//   CssBaseline,
// } from "@mui/material";

// import CloseIcon from "@mui/icons-material/Close";
// import CategoryIcon from "@mui/icons-material/Category";
// import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
// import DescriptionIcon from "@mui/icons-material/Description";
// import AddIcon from "@mui/icons-material/Add";
// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";


// // ----- Consistent color palette pulled from the original design -----
// const theme = createTheme({
//   palette: {
//     primary: { main: "#162d6b" }, // heading / brand blue
//     secondary: { main: "#5b5b7a" }, // muted label grey-blue
//     error: { main: "#c81616" }, // save / expense red
//     background: { default: "#f5f6fa", paper: "#ffffff" },
//     text: { primary: "#1f2937", secondary: "#5b5b7a" },
//     success: { main: "#1e8e5a" },
//   },
//   shape: { borderRadius: 10 },
//   typography: {
//     fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
//     h4: { fontWeight: 700, color: "#162d6b" },
//     h6: { fontWeight: 600, color: "#1f2937" },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
//       },
//     },
//     MuiTextField: {
//       defaultProps: { size: "small" },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: { borderRadius: 12 },
//       },
//     },
//   },
// });

// function App() {
//   const [category, setCategory] = useState("");
//   const [amount, setAmount] = useState("");
//   const [type, setType] = useState("");
//   const [note, setNote] = useState("");
//   const [date, setDate] = useState(null);

//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [filter, setFilter] = useState("All");

//   const [showModal, setShowModal] = useState(false);
//   const today = dayjs();

//   const [transaction, setTransaction] = useState([]);

//   const loadTransaction = async () => {
//     const response = await fetch("http://localhost:8080/transaction");
//     const data = await response.json();
//     setTransaction(data);
//   };

//   useEffect(() => {
//     loadTransaction();
//   }, []);

//   const clearForm = () => {
//     setCategory("");
//     setAmount("");
//     setType("");
//     setNote("");
//     setDate(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newTransaction = {
//       category,
//       amount,
//       type,
//       note,
//       date: date ? date.format("YYYY-MM-DD") : "",
//     };

//     setShowModal(false);
//     clearForm();

//     await fetch("http://localhost:8080/addTransaction", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newTransaction),
//     });

//     loadTransaction();
//   };

//   const totalIncome = transaction
//     .filter((t) => t.type === "INCOME")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   const totalExpense = transaction
//     .filter((t) => t.type === "EXPENSE")
//     .reduce((sum, t) => sum + Number(t.amount), 0);

//   const balance = totalIncome - totalExpense;

//   const fromStr = fromDate ? fromDate.format("YYYY-MM-DD") : "";
//   const toStr = toDate ? toDate.format("YYYY-MM-DD") : "";

//   const filteredTransactions = transaction
//     .filter((t) => (fromStr === "" || t.date >= fromStr) && (toStr === "" || t.date <= toStr))
//     .filter((t) => filter === "All" || t.type === filter);

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <Box
//           sx={{
//             minHeight: "100vh",
//             bgcolor: "background.default",
//             py: 4,
//             px: { xs: 2, sm: 4, md: 6 },
//           }}
//         >
//           {/* ---------------- Add Transaction Modal ---------------- */}
//           <Dialog
//             open={showModal}
//             onClose={() => {
//               clearForm();
//               setShowModal(false);
//             }}
//             fullWidth
//             maxWidth="xs"
//             PaperProps={{ sx: { borderRadius: 3 } }}
//           >
//             <Box
//               sx={{
//                 bgcolor: "primary.main",
//                 color: "#fff",
//                 px: 3,
//                 py: 2,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
//                 Add Transaction
//               </Typography>
//               <IconButton
//                 size="small"
//                 onClick={() => {
//                   clearForm();
//                   setShowModal(false);
//                 }}
//                 sx={{ color: "#fff" }}
//               >
//                 <CloseIcon />
//               </IconButton>
//             </Box>

//             <DialogContent sx={{ pt: 3 }}>
//               <Box component="form" onSubmit={handleSubmit}>
//                 <Stack spacing={2.5}>
//                   <FormControl fullWidth required size="small">
//                     <InputLabel id="category-label">Category</InputLabel>
//                     <Select
//                       labelId="category-label"
//                       label="Category"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       startAdornment={
//                         <InputAdornment position="start">
//                           <CategoryIcon fontSize="small" sx={{ color: "secondary.main" }} />
//                         </InputAdornment>
//                       }
//                     >
//                       <MenuItem value="Salary">Salary</MenuItem>
//                       <MenuItem value="Food">Food</MenuItem>
//                       <MenuItem value="Travel">Travel</MenuItem>
//                       <MenuItem value="Shopping">Shopping</MenuItem>
//                     </Select>
//                   </FormControl>

//                   <TextField
//                     label="Amount"
//                     type="number"
//                     fullWidth
//                     required
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <CurrencyRupeeIcon fontSize="small" sx={{ color: "secondary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <FormControl>
//                     <Typography variant="body2" sx={{ color: "secondary.main", mb: 0.5 }}>
//                       Type
//                     </Typography>
//                     <RadioGroup
//                       row
//                       value={type}
//                       onChange={(e) => setType(e.target.value)}
//                     >
//                       <FormControlLabel
//                         value="INCOME"
//                         control={<Radio required color="success" />}
//                         label="Income"
//                       />
//                       <FormControlLabel
//                         value="EXPENSE"
//                         control={<Radio color="error" />}
//                         label="Expense"
//                       />
//                     </RadioGroup>
//                   </FormControl>

//                   <TextField
//                     label="Notes"
//                     fullWidth
//                     value={note}
//                     onChange={(e) => setNote(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <DescriptionIcon fontSize="small" sx={{ color: "secondary.main" }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                   />

//                   <DatePicker
//                     label="Date"
//                     value={date}
//                     onChange={(newValue) => setDate(newValue)}
//                     maxDate={today}
//                     slotProps={{ textField: { fullWidth: true, required: true, size: "small" } }}
//                   />

//                   <Button
//                     type="submit"
//                     variant="contained"
//                     color="error"
//                     size="large"
//                     fullWidth
//                     sx={{ py: 1.2, fontSize: "15px" }}
//                   >
//                     Save
//                   </Button>
//                 </Stack>
//               </Box>
//             </DialogContent>
//           </Dialog>

//           {/* ---------------- Header ---------------- */}
//           <Typography variant="h4" gutterBottom>
//             Expense Tracker
//           </Typography>

//           {/* ---------------- Filter Bar ---------------- */}
//           <Paper
//             elevation={0}
//             sx={{
//               display: "flex",
//               flexWrap: "wrap",
//               alignItems: "center",
//               justifyContent: "space-between",
//               gap: 2,
//               p: 2,
//               my: 3,
//               border: "1px solid #e0e0e6",
//             }}
//           >
//             <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
//               <DatePicker
//                 label="From"
//                 value={fromDate}
//                 onChange={(newValue) => setFromDate(newValue)}
//                 maxDate={today}
//                 slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
//               />
//               <DatePicker
//                 label="To"
//                 value={toDate}
//                 onChange={(newValue) => setToDate(newValue)}
//                 minDate={fromDate || undefined}
//                 maxDate={today}
//                 slotProps={{ textField: { size: "small", sx: { width: 170 } } }}
//               />
//             </Stack>

//             <FormControl size="small" sx={{ minWidth: 160 }}>
//               <InputLabel id="filter-label">Type</InputLabel>
//               <Select
//                 labelId="filter-label"
//                 label="Type"
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 startAdornment={
//                   <InputAdornment position="start">
//                     <FilterAltIcon fontSize="small" sx={{ color: "secondary.main" }} />
//                   </InputAdornment>
//                 }
//               >
//                 <MenuItem value="All">All</MenuItem>
//                 <MenuItem value="INCOME">Income</MenuItem>
//                 <MenuItem value="EXPENSE">Expense</MenuItem>
//               </Select>
//             </FormControl>

//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddIcon />}
//               onClick={() => {
//                 clearForm();
//                 setShowModal(true);
//               }}
//               sx={{ px: 2.5, py: 1.2 }}
//             >
//               Add Transaction
//             </Button>
//           </Paper>

//           {/* ---------------- Summary Cards ---------------- */}
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
//             <Paper
//               elevation={0}
//               sx={{
//                 flex: 1,
//                 p: 2.5,
//                 border: "1px solid #e0e0e6",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//               }}
//             >
//               <TrendingUpIcon sx={{ color: "success.main", fontSize: 32 }} />
//               <Box>
//                 <Typography variant="body2" color="secondary">
//                   Total Income
//                 </Typography>
//                 <Typography variant="h6" sx={{ color: "success.main" }}>
//                   ₹{totalIncome}
//                 </Typography>
//               </Box>
//             </Paper>

//             <Paper
//               elevation={0}
//               sx={{
//                 flex: 1,
//                 p: 2.5,
//                 border: "1px solid #e0e0e6",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//               }}
//             >
//               <TrendingDownIcon sx={{ color: "error.main", fontSize: 32 }} />
//               <Box>
//                 <Typography variant="body2" color="secondary">
//                   Total Expense
//                 </Typography>
//                 <Typography variant="h6" sx={{ color: "error.main" }}>
//                   ₹{totalExpense}
//                 </Typography>
//               </Box>
//             </Paper>

//             <Paper
//               elevation={0}
//               sx={{
//                 flex: 1,
//                 p: 2.5,
//                 border: "1px solid #e0e0e6",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1.5,
//               }}
//             >
//               <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 32 }} />
//               <Box>
//                 <Typography variant="body2" color="secondary">
//                   Balance
//                 </Typography>
//                 <Typography variant="h6" sx={{ color: "primary.main" }}>
//                   ₹{balance}
//                 </Typography>
//               </Box>
//             </Paper>
//           </Stack>

//           {/* ---------------- Transactions Table ---------------- */}
//           <Typography variant="h6" gutterBottom>
//             Transactions
//           </Typography>

//           <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e6" }}>
//             <Table>
//               <TableHead>
//                 <TableRow sx={{ bgcolor: "#eef1f8" }}>
//                   <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Date</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Category</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: "primary.main" }} align="right">
//                     Amount
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Type</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: "primary.main" }}>Note</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredTransactions.length === 0 && (
//                   <TableRow>
//                     <TableCell colSpan={5} align="center" sx={{ color: "secondary.main", py: 4 }}>
//                       No transactions found
//                     </TableCell>
//                   </TableRow>
//                 )}
//                 {filteredTransactions.map((t, idx) => (
//                   <TableRow key={t.id ?? idx} hover>
//                     <TableCell>{t.date}</TableCell>
//                     <TableCell>{t.category}</TableCell>
//                     <TableCell
//                       align="right"
//                       sx={{ color: t.type === "INCOME" ? "success.main" : "error.main", fontWeight: 600 }}
//                     >
//                       ₹{t.amount}
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={t.type}
//                         size="small"
//                         color={t.type === "INCOME" ? "success" : "error"}
//                         variant="outlined"
//                       />
//                     </TableCell>
//                     <TableCell>{t.note}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </LocalizationProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
import {  Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
 import Dashboard from "./Dashboard";

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
   
  );
}

export default App;