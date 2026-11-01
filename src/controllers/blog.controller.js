import Blog from "../models/blog.model.js"
import "dotenv/config"
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken"



 

export const addBlog = async (req,res) => {
    try {
        const {title,description} = req.body
        const userId = req.user._id

        if(!title || !description ){
            return res.status(400).json({
                message:"all feilds are required"
                
            })

        }
    
        const blog = await Blog.create({
            title,
            description,
            userId 
        })

        return res.status(201).json({
            message:"add user successfully",
            data: blog
        })
        

    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
        
    }

}

export const getAllBlogs = async(req,res) => {
try {
    const Blogs = await Blog.find().populate("userId","email username")

    if(!Blogs)
        return res.status(404).json({
        message:"Blog not found"
    })
    
    return res.status(201).json({
        message:"Blog found Successfully"
    })
} catch (error) {
    return res.status(500).json({
        message: error.message
    })
    
}
}

export const getMyBlogs = async (req, res) => {
    try {
        const userId = req.user._id

        const blogs = await Blog.find({
            userId:userId
        })
        if(!blogs){
            return res.status(400).json({
                message: "Blogs not found"
            })
        }
        return res.status(200).json({
          message: "Blogs returned successfully",
          data: blogs
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}      


export const deleteBlog = async (req , res) => {
    try {
        const {blogId} = req.params
        const userId = req.user._id

        const blog = await Blog.findById(blogId)
        if(!blog){
          return res.status(400).json({
            message: "blog not found"
          })
        }

        const deleteBlog = await Blog.findOneAndDelete({
            _id: blogId,
            userId: userId
        })
        if(!deleteBlog){
            return res.status(401).json({
                message: "you are not allowed to delete this blog",
            })
        }
        return res.status(200).json({
            message:"Blog delete successfully",
            data: deleteBlog
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

export const editBlog = async (res,res) => {
    try {
        const {blogId} = req.params
        const userId = req.user._id

        const {title,description} = req.body

        if(!title && !description){
            return res.status(j400).json({
                message: "At least one field is required for editing a blog"
            })
        }
        let updatedData = {}

        if (title) updatedData.title = title
        if (description) updatedData.description = description

        const blog = await Blog.findOneAndUpdate(
            {
                _id: blogId,
                user_Id: userId
            },
            {
                $set: updatedData
            },
            {
                new: true,
            }
        )

        if(!blog){
            return res.status(404).json({
                message:"Unauthorized or blog not found"
            })
        }
        return res.status(201).json({
            message: "Blog updated Successfully",
            data: blog
        })
        
    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}

 export const forgotPassword = async (req,res) => {
    try {
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                message:"email is required"
            })
        }

        const user = await user.findOne({email})

        if (!user){
            return res.status(404).json({
                message:"User does not exist"
            })
        }

        const token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET,{
            expiresIn: "15m"
        })

        const expiresIn = Date.now() + 15 * 60 * 1000

        user.resetPasswordToken = token;
        user.resetPasswordExpiry = expiresIn
        await user.save()

        const resetPasswordUrl = 'http://localhost:3000/reset-password/${token}'




        return res.status(201).json({
            message:"reset password linl sent successfully",
            data: resetPasswordUrl
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
 }

 export const resetPasssword = async (req,res) => {
    try {
        const {token} = req.params

        const {password, confirmPassword} = req.body

        if(!password || !confirmPassword) {
            return res.status(400).json({
                message: "both fields are required"
            })
        }

        if(password !== confirmPassword) {
            return res.status(400).json({
                message: " password and confirm password must be same"
            })
        }

        const decoded = jwt.verity(token, process.env.JWT_SECRET)

        const userId = decoded.userId;

        const user = await User.findOne({
            _id: userId,
            resetPassswordToken: token,
            resetPassswordExpiry: { $gt: Date.now() },
        });

        if(!user) {
            return res.status(404).json({
                message: "Invalid or expiresd reset token",

            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPassswordExpiry = null;

        await user.save();

        return res.status(500).json({
            message:"password reset successfully"
        })    
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
        
    }
 }

