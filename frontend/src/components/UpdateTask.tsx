// src/components/UpdateTaskModal.tsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Modal,
    TextField,
    Button,
    Typography,
    MenuItem,
} from "@mui/material";
import { getTaskById, updateTask } from "../api/tasks"; // API call
import { getAllUsers } from "../api/users"; // For dropdown
import axios from "axios";

interface UpdateTaskModalProps {
    open: boolean;
    onClose: () => void;
    taskId: string;
    onUpdateSuccess: () => void;
}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    p: 4,
    borderRadius: 2,
};

const UpdateTaskModal: React.FC<UpdateTaskModalProps> = ({
    open,
    onClose,
    taskId,
    onUpdateSuccess,
}) => {
    const [task, setTask] = useState<any>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/auth", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setUsers(res.data);
                console.log("users:", users);

            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            };
        }
        fetchUsers();
    }, []);
    useEffect(() => {
        const fetchTask = async () => {
            if (!taskId) return;
            const res = await getTaskById(taskId);
            if (!res) return;

            setTask(res);
            setTitle(res.title);
            setDescription(res.description);
            setStatus(res.status);
            setAssignedTo(res.assignedTo._id);
            // console.log(res);
        };

        fetchTask();
    }, [taskId]);

    console.log("assignedTo:", assignedTo);


    const handleSubmit = async () => {
        await updateTask(taskId, { title, description, assignedTo, status });
        setLoading(true)
        onUpdateSuccess();
        setLoading(false) // reload task list
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    Update Task
                </Typography>
                <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    fullWidth
                    multiline
                    minRows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
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
                <TextField
                    select
                    label="Assigned To"
                    fullWidth
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    {users?.map((user: any) => (
                        <MenuItem key={user._id} value={user._id}>
                            {user.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isLoading ? "Updating..." : "Update Task"}
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdateTaskModal;
