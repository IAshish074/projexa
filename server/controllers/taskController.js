const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Task = require('../models/Task');
const Project = require('../models/Project');
const imagekit = require('../utils/imageKit');
const fs = require('fs');
const { getIO } = require('../utils/socket');


exports.getTasks = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.projectId) {
    query = Task.find({ project: req.params.projectId });
  } else {
  
    if (req.user.role === 'admin') {
      query = Task.find();
    } else {
      query = Task.find({ assignedTo: req.user.id });
    }
  }

  query = query.populate({
    path: 'project',
    select: 'title description status'
  }).populate({
    path: 'assignedTo',
    select: 'name avatar'
  });

  const tasks = await query;

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});


exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate({
      path: 'project',
      select: 'title description teamMembers'
    })
    .populate('assignedTo', 'name avatar')
    .populate('comments.user', 'name avatar');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});


exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.project = req.params.projectId;
  
  if (!req.body.assignedTo) {
    req.body.assignedTo = req.user.id;
  }

  const project = await Project.findById(req.params.projectId);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.projectId}`, 404));
  }

  if (
    project.createdBy.toString() !== req.user.id &&
    !project.teamMembers.includes(req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a task to this project`, 401));
  }

  if (req.body.assignedTo && req.body.assignedTo !== req.user.id) {
    req.body.status = 'pending';
  }

  const task = await Task.create(req.body);

 
  const io = getIO();
  io.to(task.project.toString()).emit('task-created', task);

  res.status(201).json({
    success: true,
    data: task
  });
});


exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id).populate('project');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }


  const isAssignee = task.assignedTo?.toString() === req.user.id;
  const isOwner = task.project.createdBy.toString() === req.user.id;
  const isTeamMember = task.project.teamMembers.includes(req.user.id);
  const isAdmin = req.user.role === 'admin';

  if (!isAssignee && !isOwner && !isTeamMember && !isAdmin) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this task`, 401));
  }


  if (!isOwner && !isAdmin) {
    const allowedFields = ['status'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return next(new ErrorResponse('You are only authorized to update the task status', 403));
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });


  const io = getIO();
  io.to(task.project.toString()).emit('task-updated', task);


  if (req.body.status) {
    await Task.updateProjectProgress(task.project._id);
  }

  res.status(200).json({
    success: true,
    data: task
  });
});


exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate('project');

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  if (
    task.project.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this task`, 401));
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});


exports.uploadTaskAttachment = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  console.log('Task Upload File:', req.file);
  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  try {
 
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: '/taskflow/attachments'
    });

    
    task.attachments.push({
      fileName: req.file.originalname,
      filePath: uploadResponse.url,
      fileId: uploadResponse.fileId
    });

    await task.save();

    res.status(200).json({
      success: true,
      data: uploadResponse.url
    });
  } catch (err) {
    console.error('ImageKit Upload Error:', err);
    return next(new ErrorResponse(`ImageKit upload failed: ${err.message}`, 500));
  }
});


exports.addTaskComment = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  const comment = {
    text: req.body.text,
    user: req.user.id
  };

  task.comments.push(comment);
  await task.save();

  res.status(201).json({
    success: true,
    data: task.comments
  });
});

exports.acceptTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }

  if (task.assignedTo.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to accept this task`, 401));
  }

  task = await Task.findByIdAndUpdate(req.params.id, { status: 'in-progress' }, {
    new: true,
    runValidators: true
  });

  const io = getIO();
  io.to(task.project.toString()).emit('task-updated', task);

  res.status(200).json({
    success: true,
    data: task
  });
});
