import axiosInstance from "./axiosInstance";

export const getAllTasks = async () => {
  const res = await axiosInstance.get("/tasks");
  return res.data.tasks;
};

export const createTask = async (data: {
  title: string;
  description: string;
  assignedTo?: string;
}) => {
  const res = await axiosInstance.post("/tasks/createTasks", data);
  return res.data.task;
};

export const getTaskById = async (taskId: string) => {
    const res = await axiosInstance.get(`/tasks/${taskId}`, {
    });
    
    return res.data.task;
  };
  export const updateTask = async (taskId: string, data: any) => {
    const res = await axiosInstance.put(`/tasks/${taskId}`, data);
    return res.data;
  };

export const deleteTask = async (id: string) => {
  const res = await axiosInstance.delete(`/tasks/${id}`);
  return res.data;
};
