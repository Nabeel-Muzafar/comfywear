import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setProduct } from "../store/productSlice";

export default function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    setIsLoading(true);

    try {
      const res = await axios.post(`/api/userlogin`, {
        username: data.get("username"),
        password: data.get("password"),
      });

      if (res.data.success) {
        dispatch(setProduct(res.data.payload.products));
        localStorage.setItem("token", res.data.payload.token);
        localStorage.setItem("user", JSON.stringify(res.data.payload.user));

        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            endIcon={
              isLoading && <CircularProgress size={20} color="inherit" />
            }
          >
            {isLoading ? "please wait" : "Login In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
