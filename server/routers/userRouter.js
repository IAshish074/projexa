const express = require('express');
const { getUsers, getUser, updateUser, updateAvatar, inviteUser } = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_FILE_UPLOAD) || 10000000 }
});
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All user routes require authentication

router.route('/')
  .get(getUsers); // All authenticated users can get list of users (to see team members)

router.post('/invite', inviteUser);
router.put('/avatar', upload.single('avatar'), updateAvatar);

router.route('/:id')
  .get(getUser)
  .put(updateUser);

module.exports = router;
