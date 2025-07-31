import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type{ RootState } from "../store";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk(
  "task/createTask",
  async (
    taskData: { title: string; description: string; status: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.post("/tasks", taskData);
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response.data.message || "Failed to create task");
    }
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTaskFromSocket(state, action) {
      state.tasks.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addTaskFromSocket } = taskSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.tasks;

export default taskSlice.reducer;
