export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdBy: string;       // user ID
  assignedTo: string;      // user ID
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
    title: string;
    description: string;
    assignedTo: string;
  }
  
  export interface UpdateTaskPayload {
    title?: string;
    description?: string;
    assignedTo?: string;
    status?: TaskStatus;
  }
  
  
  export interface TaskCreatedEvent {
    taskId: string;
    title: string;
    assignedTo: string;
  }
  
  export interface TaskUpdatedEvent {
    taskId: string;
    newStatus: TaskStatus;
  }
  
  export interface NotificationEvent {
    message: string;
    taskId?: string;
  }
  