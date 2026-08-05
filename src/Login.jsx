import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { loginSuccess } from "./redux/authSlice";
import { loginUser } from "./redux/authSlice";
import { useDispatch } from "react-redux";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
 
 const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [openAlert, setOpenAlert] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const dispatch = useDispatch();
const handleSubmit = async (e) => {
  e.preventDefault();

  const result = await dispatch(loginUser(formData));

  if (result.payload?.accessToken) {
    localStorage.setItem("loginTime", Date.now());
    setOpenAlert(true);

    setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 1500);
  }
};


  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          sx={{
            width: 400,
            p: 2,
            borderRadius: 3,
            boxShadow: 5,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              gutterBottom
            >
              Login
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                mt: 2,
              }}
            >
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                fullWidth
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
              >
                Login
              </Button>
              <Typography
  align="center"
  sx={{ mt: 2 }}
>
  Don't have an account?{" "}
  <Button
    variant="text"
    size="small"
    onClick={() => navigate("/")}
  >
    Sign Up
  </Button>
</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
  open={openAlert}
  autoHideDuration={1500}
  onClose={() => setOpenAlert(false)}
  anchorOrigin={{ vertical: "top", horizontal: "right" }}
>
  <Alert
    onClose={() => setOpenAlert(false)}
    severity="success"
    variant="filled"
    sx={{ width: "100%" }}
  >
    Login successful!
  </Alert>
</Snackbar>
    </Container>
  );
  }

export default Login;