const express = require('express');
const { register, login, getMe, logout, updateDetails, updatePassword, updatePreferences } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { registerValidation, loginValidation } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.put('/updatepreferences', protect, updatePreferences);

module.exports = router;
