const Task = require('../models/Task');

// GET all tasks
exports.getTasks = async (req, res) => {
  const tasks = await Task.find().populate('createdBy assignedTo', 'name email');
  res.json(tasks);
};

// POST - Create new task
exports.createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  const task = await Task.create({
    title,
    description,
    assignedTo,
    createdBy: req.user.userId, 
  });

  // Emit to all clients
  const io = req.app.get("io")
  const populatedTask = await Task.findById(task._id).populate('assignedTo createdBy', 'name email');

  io.emit('taskCreated', populatedTask);

  if (populatedTask.assignedTo && populatedTask.assignedTo._id) {
    io.to(populatedTask.assignedTo._id.toString()).emit('notification', {
      message: `New Task Assigned: ${populatedTask.title}`,
      taskId: populatedTask._id,
      type: 'assigned',
    });
  }

  res.status(201).json(populatedTask);
};

// PUT - Update task
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, assignedTo } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { title, description, status, assignedTo },
    { new: true }
  );
  const io = req.app.get("io")
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { title, description, status, assignedTo },
    { new: true }
  ).populate('assignedTo createdBy', 'name email');

  io.emit('taskUpdated', updatedTask);


  res.json(updatedTask);
};

// DELETE - Remove task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete(id);
  const io = req.app.get("io")

  io.emit('taskDeleted', id);

  res.json({ message: 'Task deleted' });
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('createdBy assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ task }); 
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


