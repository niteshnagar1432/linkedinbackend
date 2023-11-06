const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    appliedFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    status: {
        type: String,
        enum: ['selected', 'rejected', 'pending'],
        default: 'pending'
    },
    resume:String
});

module.exports = mongoose.model('Applicant', applicantSchema);
