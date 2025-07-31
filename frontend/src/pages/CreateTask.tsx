import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store"; // Adjust the import path as necessary
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
}
interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTask({ open, onClose }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth");
        setUsers(res.data); 
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/tasks/createTasks",
        {
          title,
          description,
          assignedTo,
          status: status || "Pending", 
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          },
        }

      );
      if (res.status !== 201) {
        setLoading(false)
        throw new Error("Failed to create task");
      }
      setLoading(false)
      toast.success("Task created successfully!");
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("");
      setAssignedTo("");
      onClose()
    } catch (err) {
      console.error("Task creation failed:", err);
    }
  };



  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          mx: "auto",
          mt: 4,
          p: 2,
          boxShadow: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" mb={2}>
          Create Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Status"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="assigned-to-label">Assign To</InputLabel>
            <Select
              labelId="assigned-to-label"
              value={assignedTo}
              label="Assign To"
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >

            {(isLoading) ? "loading..." : "Create Task"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}
