import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const {fullname, username, email, password} = req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: "Invalid email format"})
        }
        //Finding whether there is an existing username
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({error: "Username is already taken"})
        }
        //finding whether there is existing email
        const existingEmail = await User.findOne({email})
        if(existingEmail){
            return res.status(400).json({error: "Email is already taken"})
        }
        if(password.length < 6){
            return res.status(400).json({error: "Password must be at least 6 characters long"})
        }
        //Hash Password
        const salt = await bcrypt.genSalt(10)
        const hashPswd = await bcrypt.hash(password, salt)
        const newUser = new User({
            fullname,
            email,
            username,
            password: hashPswd
        })
        if(newUser){
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                username: newUser.username,
                email: newUser.email,
                id: newUser._id,
                fullname: newUser.fullname,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        } else{
            res.status(400).json({error: "Invalid user data"})
        }

    } catch (error) {
        res.status(500).json({error: "Internal Server Error"+ error.message})
    }
}
export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"})
        }
        generateTokenAndSetCookie(user._id, res)
        res.status(200).json({
                username: user.username,
                email: user.email,
                id: user._id,
                fullname: user.fullname,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg
        })
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({error: "Internal Server Error "+ error.message})
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message: "Logged out successfully"}) 
    } catch (error) {
        console.log("Error in login controller", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }

}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        console.log("Error in GetMe controller", error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}