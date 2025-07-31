export interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin"; // or whatever roles you support
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string; // JWT token
  }
  