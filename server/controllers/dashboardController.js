const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');


exports.getAdminDashboard = asyncHandler(async (req, res, next) => {
  const totalProjects = await Project.countDocuments();
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const overdueTasks = await Task.countDocuments({
    status: { $ne: 'completed' },
    dueDate: { $lt: new Date() }
  });
  const teamMembersCount = await User.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      teamMembersCount
    }
  });
});


exports.getMemberDashboard = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const assignedTasks = await Task.countDocuments({ assignedTo: userId });
  const completedTasks = await Task.countDocuments({ assignedTo: userId, status: 'completed' });
  const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: { $ne: 'completed' } });
  

  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  
  const upcomingDeadlines = await Task.countDocuments({
    assignedTo: userId,
    status: { $ne: 'completed' },
    dueDate: { $gte: new Date(), $lte: sevenDaysFromNow }
  });

  res.status(200).json({
    success: true,
    data: {
      assignedTasks,
      completedTasks,
      pendingTasks,
      upcomingDeadlines
    }
  });
});
