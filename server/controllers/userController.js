const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');
const Project = require('../models/Project');
const imagekit = require('../utils/imageKit');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query = {};
  
  // Members cannot see admins in the team section
  // They can only see assigned members of their teams
  if (req.user.role !== 'admin') {
    query.role = { $ne: 'admin' };
    
    const projects = await Project.find({ teamMembers: req.user.id });
    const teammateIds = [...new Set(projects.flatMap(p => p.teamMembers.map(m => m.toString())))];
    
    // Include themselves
    teammateIds.push(req.user.id);
    
    query._id = { $in: teammateIds };
  }

  const users = await User.find(query);
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate('assignedTasks')
    .populate('createdProjects');

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ success: false, error: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found with id of ${req.params.id}` });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
  }
};

// @desc    Update profile picture
// @route   PUT /api/users/avatar
// @access  Private
exports.updateAvatar = asyncHandler(async (req, res, next) => {
  console.log('Avatar Upload File:', req.file);
  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  try {
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName: `avatar-${req.user.id}`,
      folder: '/taskflow/avatars'
    });

    const user = await User.findByIdAndUpdate(req.user.id, {
      avatar: uploadResponse.url
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Avatar Upload Error:', err);
    return next(new ErrorResponse(`ImageKit upload failed: ${err.message}`, 500));
  }
});

const { getIO } = require('../utils/socket');

// @desc    Invite a user
// @route   POST /api/users/invite
// @access  Private
exports.inviteUser = asyncHandler(async (req, res, next) => {
  const { email, role } = req.body;

  // Real-time notification to all connected users
  const io = getIO();
  io.emit('new-message', {
    _id: Date.now().toString(),
    sender: { name: 'System', avatar: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' },
    content: `${req.user.name} has invited ${email} to join as ${role}.`,
    createdAt: new Date()
  });

  res.status(200).json({
    success: true,
    data: `Invitation sent to ${email}`
  });
});

// @desc    Update user role (admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!role || !['admin', 'member'].includes(role)) {
    return next(new ErrorResponse('Role must be either "admin" or "member"', 400));
  }

  if (req.params.id === req.user.id.toString()) {
    return next(new ErrorResponse('You cannot change your own role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Emit real-time role change notification
  try {
    const io = getIO();
    io.emit('role-updated', { userId: user._id, newRole: user.role, updatedBy: req.user.name });
  } catch (e) { /* socket may not be ready */ }

  res.status(200).json({
    success: true,
    data: user
  });
});
