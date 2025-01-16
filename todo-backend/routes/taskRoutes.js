const express = require('express');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');
const router = express.Router();

router.route('/:collectionId').get(protect, getTasks).post(protect, createTask);
router.route('/:collectionId/:taskId').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
