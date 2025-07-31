// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import TaskListPage from "./pages/TaskListPage";
import CreateTaskPage from "./pages/CreateTask";
import LoginPage from "./pages/Login";
import RequireAuth from "./RequireAuth";


function App() {

  
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          path="/tasks"
          element={
            <RequireAuth>
              <Layout>
                <TaskListPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/tasks/create"
          element={
            <RequireAuth>
              <Layout>
                <CreateTaskPage />
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
