const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const verifyToken = require('../verifyToken');

router.get('/:jobId', jobController.viewJob);
router.get('/own', jobController.viewJob);

router.post('/all-open-jobs', jobController.viewAllOpenJobs);
router.post('/create',verifyToken, jobController.createJob);

router.put('/update', jobController.updateJob);
router.put('/close/:jobId', jobController.closeJob);
router.put('/select', jobController.selectApplicant);

module.exports = router;
