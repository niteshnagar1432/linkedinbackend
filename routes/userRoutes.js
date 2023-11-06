const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../verifyToken');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/get-profile', userController.GetUserDetails);
router.post('/profile', verifyToken, (req, res) => {
    res.json({ status: 200, success: true, msg: 'User data found', data: req.authData.data });
});
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;
