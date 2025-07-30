const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById
} = require('../controllers/taskController');

// Protect all task routes
router.get('/', auth, getTasks);
router.post('/createTasks', auth, createTask);
router.put('/:id', auth, updateTask);
router.get("/:id", auth, getTaskById);
router.delete('/:id', auth, deleteTask);

module.exports = router;
