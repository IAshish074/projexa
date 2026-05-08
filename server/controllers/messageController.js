const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Message = require('../models/Message');
const User = require('../models/User');
const Project = require('../models/Project');
const { getIO } = require('../utils/socket');

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  // Get user's projects to include project messages
  const projects = await Project.find({ teamMembers: req.user.id });
  const projectIds = projects.map(p => p._id);

  const messages = await Message.find({
    $or: [
      { sender: req.user.id },
      { recipient: req.user.id },
      { project: { $in: projectIds } }
    ]
  }).populate('sender', 'name avatar').populate('recipient', 'name avatar').populate('project', 'title');

  res.status(200).json({
    success: true,
    data: messages
  });
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { recipientId, projectId, content } = req.body;

  let messageData = {
    sender: req.user.id,
    content
  };

  const io = getIO();

  if (projectId) {
    const project = await Project.findById(projectId);
    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${projectId}`, 404));
    }
   
    if (!project.teamMembers.includes(req.user.id) && req.user.role !== 'admin') {
      return next(new ErrorResponse('You are not a member of this project team', 403));
    }
    messageData.project = projectId;
  } else if (recipientId && recipientId !== 'undefined') {
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return next(new ErrorResponse(`Recipient not found with id of ${recipientId}`, 404));
    }
    messageData.recipient = recipientId;
  } else {
    return next(new ErrorResponse('Recipient ID or Project ID is missing or invalid', 400));
  }

  const message = await Message.create(messageData);
  const populatedMessage = await Message.findById(message._id)
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar')
    .populate('project', 'title');

 
  if (projectId) {
 
    io.to(projectId).emit('new-message', populatedMessage);
  } else {

    io.to(recipientId).emit('new-message', populatedMessage);
  }

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});
