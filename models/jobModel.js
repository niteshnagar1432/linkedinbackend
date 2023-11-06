// Assuming your existing Job schema looks something like this:
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    closed: { type: Boolean, default: false },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' }],
    // Add the new fields
    jobPosition: String,
    companyName: String,
    requirements: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
