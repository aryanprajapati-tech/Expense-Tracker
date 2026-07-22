import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

function Signup() {
   const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    
    const response = await fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.text();

  

  if (response.ok) {
    navigate("/login",{replace:true});
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
            boxShadow: 5,
            borderRadius: 3,
          }}
        >
          <CardContent>

            <Typography
              variant="h4"
              align="center"
              gutterBottom
              fontWeight="bold"
            >
              Sign Up
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
                label="Username"
                name="username"
                fullWidth
                required
                value={formData.username}
                onChange={handleChange}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                fullWidth
                required
                value={formData.password}
                onChange={handleChange}
                slotProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
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
                Sign Up
              </Button>
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
  <Typography variant="body2">
    Already have an account?{" "}
    <Link
      to="/login"
      style={{
        textDecoration: "none",
        color: "#1976d2",
        fontWeight: "bold",
      }}
    >
      Login
    </Link>
  </Typography>
</Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Signup;