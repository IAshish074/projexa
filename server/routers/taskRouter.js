const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  uploadTaskAttachment,
  addTaskComment,
  acceptTask
} = require('../controllers/taskController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

// Setup multer (use memory storage for ImageKit)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_UPLOAD) || 10000000 }
});

router.use(protect); // All task routes require authentication

router
  .route('/')
  .get(getTasks)
  .post(authorize('admin'), createTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

router.put('/:id/accept', acceptTask);
router.post('/:id/upload', upload.single('file'), uploadTaskAttachment);
router.post('/:id/comments', addTaskComment);

module.exports = router;
