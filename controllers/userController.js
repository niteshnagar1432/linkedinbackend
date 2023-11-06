const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'kuiyfhgcvs9876tyfgvb';

exports.signup = async (req, res) => {
    const { name, email, password, userType } = req.body;

    if (!name || !email || !password || !userType) {
        return res.json({ status: 400, success: false, msg: 'All fields are required' });
    }

    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: 400, success: false, msg: 'Email address already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, userType });


        const data = {
            name: user.name,
            email: user.email,
            userType: user.userType
        };
        const token = jwt.sign({ data }, secretKey, { expiresIn: '3000m' });

        res.json({ status: 200, success: true, msg: 'User registered successfully', data: user, token });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error registering user', error: error.message });
    }
}

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ status: 400, success: false, msg: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ status: 404, success: false, msg: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const data = {
                _id:user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
            jwt.sign({ data }, secretKey, { expiresIn: '3000m' }, (err, token) => {
                res.json({ token, email: data.email, userType: data.userType });
            });
        } else {
            res.json({ status: 401, success: false, msg: 'Invalid email or password' });
        }
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error signing in', error: error.message });
    }
}

exports.GetUserDetails = async(req,res)=>{
    const {email}= req.body;
    try {
        const user = await User.findOne({ email }).populate('postedJobs');

        if (!user) {
            return res.json({ status: 404, success: false, msg: 'User not found' });
        }

        res.json({ status: 200, success: true, msg: 'User Found successfully', user });

    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error signing in', error: error.message });
    }
}


exports.updateProfile = async (req, res) => {
    const { name, email, userType } = req.body;

    try {
        console.log(req.body);
        const user = await User.findByIdAndUpdate(req.authData.data._id, { name, email, userType }, { new: true });
        await user.save();

        if (!user) {
            return res.json({ status: 404, success: false, msg: 'User not found' });
        }

        const data = {
            name: user.name,
            email: user.email,
            userType: user.userType
        }

        res.json({ status: 200, success: true, msg: 'Profile updated successfully', data });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error updating profile', error: error.message });
    }
}


exports.viewOwnJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.authData.data._id }).populate('applicants');

        res.json({ status: 200, success: true, data: jobs });
    } catch (error) {
        res.json({ status: 500, success: false, msg: 'Error fetching own job postings', error: error.message });
    }
}
