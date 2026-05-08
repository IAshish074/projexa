const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Include other resource routers
const taskRouter = require('./taskRouter');

const { protect } = require('../middlewares/auth');

const router = express.Router();

// Re-route into other resource routers
router.use('/:projectId/tasks', taskRouter);

router.use(protect); // All project routes require authentication

router
  .route('/')
  .get(getProjects)
  .post(createProject);

router
  .route('/:id')
  .get(getProject)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
