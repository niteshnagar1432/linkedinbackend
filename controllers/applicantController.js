const Applicant = require('../models/applicantModel');
const Job = require('../models/jobModel');
const user = require('../models/user');
const upload = require('../upload');

exports.applyForJob = async (req, res) => {

    const { name, email, jobId } = req.body;
    try {
        const applicant = await Applicant.create({ name, email, appliedFor: jobId, resume: req.file.filename });
        const job = await Job.findByIdAndUpdate(jobId, { $push: { applicants: applicant._id } });
        const userUpdate = user.findByIdAndUpdate(req.authData.data._id, { $push: { applyJobs: jobId } })
        res.json({ status: 200, success: true, msg: 'Application submitted successfully', data: applicant });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error submitting application', error: error.message });
    }
}



exports.viewOwnApplications = async (req, res) => {
    try {
        const applications = await Applicant.find({ email: req.authData.data.email }).populate('appliedFor');

        if(applications){
            res.json({ status: 200, success: true, data: applications });
        }else{
            res.json({ status: 404, success: false, msg:'applicant not found' });
        }

    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error fetching own applications', error: error.message });
    }
}


exports.cancelApplication = async (req, res) => {
    const { applicantId } = req.params;

    try {
        const applicant = await Applicant.findByIdAndDelete(applicantId);

        if (!applicant) {
            return res.json({ status: 404, success: false, msg: 'Application not found' });
        }

        res.json({ status: 200, success: true, msg: 'Application cancelled successfully' });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error cancelling application', error: error.message });
    }
}

