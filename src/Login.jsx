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
} from "@mui/material";
import { useEffect } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const[lastemail,setLastEmail]=useState("");
 const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // If backend returns JSON
    const result = await response.json();

    console.log(result);
 if (response.ok && result.accessToken) {

    // Save J
    localStorage.setItem("token", result.accessToken);
     localStorage.setItem("loginTime", Date.now());
    
    // Go to Dashboard
    navigate("/dashboard",{replace: true});

  } else {

    console.error(result.message || "Invalid Email or Password");
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
    </Container>
  );
}

export default Login;