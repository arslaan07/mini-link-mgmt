const express = require('express')
const router = express.Router() 
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const Url = require('../models/url')
const { getInitials } = require('../utils/getInitials')
// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, mobile, password, confirmPassword } = req.body;
        // console.log(req.body)

        if (!name || !email || !mobile || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userInitials = getInitials(name)
        // console.log(userInitials)
        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            userInitials
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                userInitials: user.userInitials
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                mobile: user.mobile,
                email: user.email,
                userInitials: user.userInitials
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});
router.get('/logout', verifyToken, (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: process.env.NODE_ENV === 'production',
            expires: new Date(0)
        });
        res.json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
});
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId

        const user = await User.findOne({ _id: userId })
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(201).json({
            success: true,
            message: "User found successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User not found",
            error: error.message
        });
    }
});
router.put('/:userId', verifyToken, async (req, res) => {
    try {
        const { name, email, mobile } = req.body;
        const userId = req.params.userId
        const userInitials = getInitials(name)
        const user = await User.findOneAndUpdate({ _id: userId }, {
            name,
            email,
            mobile,
            userInitials
        }, { new: true })
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(201).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                userInitials: user.userInitials
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User update failed",
            error: error.message
        });
    }
});
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const userId = req.params.id
        await User.findOneAndDelete({ _id: userId })
        const urls = await Url.find({ createdBy: userId })
        await Promise.all(urls.map(url => url.deleteOne()))

        return res.status(201).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User delete failed",
            error: error.message
        });
    }
});

// Logout Route



// router.get('/:userId/analytics', async (req, res) => {
//     try {
//         const userId = req.params.userId
//         const urls = await Url.find({ createdBy: userId })
//         if(!urls) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No URLs found"
//             });
//         }

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "No analytics found",
//             error: error.message
//         });
//     }
// })

module.exports = router