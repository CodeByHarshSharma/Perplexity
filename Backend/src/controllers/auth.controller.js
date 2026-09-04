import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../services/mail.service.js";

export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with same credentials already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    })

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity!",
        html: `<p>Hi ${username},</p><p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
        <p>Please verify your email address by clicking the link below:</p>
        <a href='http://localhost:3000/api/auth/verifyEmail?token=${emailVerificationToken}'>Verify Email</a>
        <p>Best Regards,<br>Perplexity Team</p>`
    })

    res.status(201).json({
        message: "User registerd successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid credentials",
            success: false,
            err: "Incorrect Password "
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify you email before logging in!",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username
    }, process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie('token', token)

    res.status(200).json({
        message: "User LoggedIN",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function verifyEmail(req, res) {
    const { token } = req.query


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ email: decoded.email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid Token",
                success: false,
                err: "User not Found"
            })
        }

        user.verified = true;

        await user.save();

        const html = `
        <h1>Email Verified Successfully</h1>
        <p>Your email has been verified. You can now login to your account.
        <a href="http://localhost:3000/login">Go to login</a>`


        return res.send(html)

    }
    catch (err) {
        return res.status(400).json({
            message: "Invalid or Expired Token",
            success: false,
            err: err.message
        })
    }


}

export async function getMe(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password");

    if(!user){
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })
}