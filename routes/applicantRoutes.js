const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');
const upload = require('../upload');
const verifyToken = require('../verifyToken');

router.post('/apply',verifyToken,upload.single('resume'), applicantController.applyForJob);
router.get('/own',verifyToken, applicantController.viewOwnApplications);

router.delete('/cancel/:applicantId', applicantController.cancelApplication);

module.exports = router;
