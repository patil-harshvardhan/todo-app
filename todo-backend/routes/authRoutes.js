const express = require('express');
const {register, login , getUser} = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.route('/user').get(protect, getUser);

module.exports = router;