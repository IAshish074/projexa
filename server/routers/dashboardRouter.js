const express = require('express');
const { getAdminDashboard, getMemberDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('admin'), getAdminDashboard);
router.get('/member', getMemberDashboard);

module.exports = router;
