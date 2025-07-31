// src/pages/TaskListPage.tsx
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Container,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  makeStyles,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import axios from "axios";
import socket from "../sockets/socket";
import { toast } from "sonner";
import UpdateTaskModal from "../components/UpdateTask";
import Masonry from 'react-masonry-css'
import { DeleteOutlined, EditAttributesRounded, EditAttributesSharp, EditOutlined, PersonPinCircle } from "@mui/icons-material";
import { yellow, green, pink, blue } from '@mui/material/colors'
import CreateTask from "./CreateTask";
import { cn } from "@sglara/cn";




interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedTo: { _id: string; name: string } | null;
}

const TaskListPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTaskID, setSelectedTaskID] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModal, setOpenCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const statusOptions = ["All", "Pending", "In Progress", "Completed"];

  interface Notification {
    message: string;
    read: boolean;
  }
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    const handleCreated = (task: Task) => {
      toast.success(`New task created: ${task.title}`);
      setTasks((prev) => [...prev, task]);
    };

    const handleUpdated = (updatedTask: Task) => {
      toast.info(`Task updated: ${updatedTask.title}`);
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    };

    const handleDeleted = (taskId: string) => {
      toast.warning(`Task deleted`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    };
    if (!socket) return;
    socket.on("taskCreated", handleCreated);
    socket.on("taskUpdated", handleUpdated);
    socket.on("taskDeleted", handleDeleted);

    socket.on("notification", (data) => {
      toast(data.message); // optional
      setNotifications((prev) => [...prev, { ...data, read: false }]);
    });
    return () => {
      socket.off("taskCreated", handleCreated);
      socket.off("taskUpdated", handleUpdated);
      socket.off("taskDeleted", handleDeleted);
    };
  }, [token]);

  const handleCreate = () => {
    setOpenCreateModal(true);
  };
  const handleEdit = (id: string) => {
    setSelectedTaskID(id);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedTaskID(null);
  };
  const handleCreateClose = () => {
    setOpenCreateModal(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
      });
      if (!socket) return;
      socket.emit("taskDeleted", id);
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete task");
    }
  };
  const filteredTasks = tasks.filter((task) =>
    statusFilter === "All" ? true : task.status === statusFilter
  );

  if (loading) return <CircularProgress />;

  return (
    <Box p={4}>
      <Typography variant="h6" mb={3}>
        Task List
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e)=> setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button variant="contained" color="primary" onClick={() => handleCreate()}>
          Create Task
        </Button>
      </Box>

      {tasks.length === 0 ? (
        <Typography>No tasks found.</Typography>
      ) : (

        <Container>
          <Masonry
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {filteredTasks.map(task => (
              <div key={task._id}>
                <Card elevation={1}>
                  <CardHeader
                    avatar={
                      <Avatar >
                        {task.assignedTo ? task.assignedTo.name.charAt(0).toUpperCase() : "U"}
                      </Avatar>}
                    action={
                      <div>
                        <IconButton onClick={() => handleDelete(task._id)} className="flex items-center gap-4">
                          <DeleteOutlined />
                        </IconButton>
                        <IconButton onClick={() => handleEdit(task._id)} className="flex items-center gap-4">
                          <EditOutlined />
                        </IconButton>
                      </div>
                    }
                    title={<div className="text-lg font-medium">{task.title}</div>}
                    subheader={<div className={cn("p-1 rounded-full text-white  text-xs max-w-[100px] text-center", task.status === 'Pending' ? 'bg-red-300' : task.status === "In Progress" ? "bg-yellow-400" : "bg-green-700"  )}>{task.status || "No description provided"}</div>}
                    
                  />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {task.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </Masonry>
        </Container>
      )}

      <CreateTask
        open={isCreateModal}
        onClose={handleCreateClose}
      />
      <UpdateTaskModal
        open={isModalOpen}
        onClose={handleClose}
        taskId={selectedTaskID ?? ""}
        onUpdateSuccess={fetchTasks}
      />
    </Box>
  );
};

export default TaskListPage;
