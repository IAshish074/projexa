const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Project = require('../models/Project');


exports.getProjects = asyncHandler(async (req, res, next) => {
  let query;


  if (req.user.role === 'admin') {
    query = Project.find().populate('createdBy', 'name email avatar').populate('teamMembers', 'name email avatar');
  } else {
    query = Project.find({
      $or: [{ createdBy: req.user.id }, { teamMembers: req.user.id }]
    }).populate('createdBy', 'name email avatar').populate('teamMembers', 'name email avatar');
  }

  const projects = await query;

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});


exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email avatar')
    .populate('teamMembers', 'name email avatar')
    .populate({
      path: 'tasks',
      select: 'title status priority dueDate assignedTo'
    });

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  
  if (
    project.createdBy._id.toString() !== req.user.id &&
    !project.teamMembers.some(m => m._id.toString() === req.user.id) &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this project`, 401));
  }

  res.status(200).json({
    success: true,
    data: project
  });
});


exports.createProject = asyncHandler(async (req, res, next) => {
 
  req.body.createdBy = req.user.id;

  
  if (req.body.teamMembers) {
    if (!req.body.teamMembers.includes(req.user.id)) {
      req.body.teamMembers.push(req.user.id);
    }
  } else {
    req.body.teamMembers = [req.user.id];
  }

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});


exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  const isOwner = project.createdBy.toString() === req.user.id;
  const isMember = project.teamMembers.map(m => m.toString()).includes(req.user.id);
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin && !isMember) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this project`, 401));
  }


  if (!isOwner && !isAdmin && isMember) {
    const allowedFields = ['status'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedFields.includes(update));
    
    if (!isValidOperation) {
      return next(new ErrorResponse('Members can only update the project status', 403));
    }
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});


exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
  }

  // Only the project creator or an admin can delete
  if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this project`, 401));
  }

  // Use deleteOne() so the pre('deleteOne') cascade hook fires and removes all tasks
  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
