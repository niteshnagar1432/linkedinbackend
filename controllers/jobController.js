const Job = require('../models/jobModel');
const userModel = require('../models/user');

exports.createJob = async (req, res) => {
    const { title, description, postedBy, jobPosition, companyName, requirements } = req.body;

    console.log(req.body);

    try {
        const job = await Job.create({ title, description, postedBy, jobPosition, companyName, requirements });
        const user = await userModel.findByIdAndUpdate(req.authData.data._id,{$push:{postedJobs:job._id}})
        res.json({ status: 200, success: true, msg: 'Job created successfully', data: job });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error creating job', error: error.message });
    }
}


exports.viewJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId).populate('applicants');
        if (!job) {
            return res.json({ status: 404, success: false, msg: 'Job not found' });
        }
        res.json({ status: 200, success: true, data: job });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error fetching job', error: error.message });
    }
}

exports.viewAllOpenJobs = async (req, res) => {
    try {
        const openJobs = await Job.find({ closed: false });
        res.json({ status: 200, success: true, data: openJobs });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error fetching open jobs', error: error.message });
    }
}



exports.updateJob = async (req, res) => {
    const { jobId, title, description, jobPosition, companyName, requirements } = req.body;

    try {
        const job = await Job.findByIdAndUpdate(jobId, { title, description, jobPosition, companyName, requirements }, { new: true });

        if (!job) {
            return res.json({ status: 404, success: false, msg: 'Job not found' });
        }

        res.json({ status: 200, success: true, msg: 'Job updated successfully', data: job });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error updating job', error: error.message });
    }
}


exports.closeJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findByIdAndUpdate(jobId, { closed: true }, { new: true });

        if (!job) {
            return res.json({ status: 404, success: false, msg: 'Job not found' });
        }

        res.json({ status: 200, success: true, msg: 'Job closed successfully', data: job });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error closing job', error: error.message });
    }
}


exports.selectApplicant = async (req, res) => {
    const { jobId, applicantId, status } = req.body;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.json({ status: 404, success: false, msg: 'Job not found' });
        }

        if (job.postedBy != req.authData.data._id) {
            return res.json({ status: 403, success: false, msg: 'You are not authorized to select applicants for this job' });
        }

        const selectedApplicant = await Applicant.findByIdAndUpdate(applicantId, { status });

        if (!selectedApplicant) {
            return res.json({ status: 404, success: false, msg: 'Applicant not found' });
        }

        res.json({ status: 200, success: true, msg: 'Applicant status updated successfully', data: selectedApplicant });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error updating applicant status', error: error.message });
    }
}
