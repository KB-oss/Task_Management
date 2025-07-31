import { useState } from "react";
import {
  Typography, TextField, Button, Box
} from "@mui/material";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { loginSuccess } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../sockets/socket";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const { token, user } = res.data;
      console.log({ res });
      localStorage.setItem("token", token);
      dispatch(loginSuccess({ token, user }));
      socket.connect() 
      navigate("/tasks"); 
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="/FrontImage.jpg"
          alt="Login Visual"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <Box
          component="form"
          onSubmit={handleLogin}
          className="w-full max-w-md flex flex-col gap-4"
        >
          <Typography variant="h4" className="text-center font-bold">
            Login
          </Typography>

          <TextField
            fullWidth
            name="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
