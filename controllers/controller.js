const userModel = require('../models/user_model')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const categoryModel = require('../models/category_model')
const subcategoryModel = require('../models/subCategory')
const cloudinary = require('cloudinary').v2

// create user register api
const User_Register = async (req, res) => {
  try {
    const { username, email, gender, password, confirmpassword } = req.body

    if (!username || !email || !gender || !password || !confirmpassword) {
      return res.status(400).json({
        result: 'false',
        message:
          'username, email, password, confirmpassword Fields are Required'
      })
    }
    if (password !== confirmpassword) {
      return res.status(200).json({
        result: 'false',
        message: 'password and confirm password does not Match'
      })
    }

    // check existing user
    const user = await userModel.findOne({ email })

    if (!user) {
      const hashedpassword = await bcrypt.hash(password, 10)

      const userDetails = new userModel({
        username: username,
        email: email,
        password: hashedpassword,
        gender: gender
      })

      const saveuser = await userDetails.save()

      return res.status(200).json({
        result: 'true',
        message: 'User Registered Succesfully',
        data: saveuser
      })
    } else {
      return res.status(400).json({
        result: 'false',
        message: 'Email Already Registered'
      })
    }

    //create user
  } catch (error) {
    return res.status(400).json({ result: 'true', error: error.message })
  }
}

//create user login api
const Login_User = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        result: 'false',
        message: 'Username and password are required'
      })
    }

    const user = await userModel.findOne({ username })
    if (!user) {
      return res.status(400).json({
        result: 'false',
        message: 'Invalid username or password'
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({
        result: 'false',
        message: 'Invalid username or password'
      })
    }

    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10d'
    })

    return res.status(200).json({
      result: 'true',
      message: 'User logged in successfully',
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(500).json({
      result: 'false',
      message: 'Error In  Login',
      error: error.message
    })
  }
}

//create user Forget Password api
const User_Forget_password = async (req, res) => {
  try {
    const { userId } = req.params
    const { newPassword } = req.body

    if (!newPassword) {
      return res.status(400).json({
        result: 'false',
        message: ' Password, Confirm Password Fields are Required'
      })
    }

    const user = await userModel.findById({ _id: userId })

    if (!user) {
      return res.status(400).json({
        result: 'false',
        message: 'userId does not Find'
      })
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)
    const updatepassword = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { password: hashPassword } },
      { new: true }
    )

    res.status(200).json({
      result: 'true',
      message: 'Saved New Password SuccessFully'
    })
  } catch (error) {
    return res.status(500).json({
      result: 'false',
      message: 'Error In  Login',
      error: error.message
    })
  }
}

//create user Edit profile api
const User_Edit_ProFile = async (req, res) => {
  try {
    const { userId } = req.params
    const { newusername, gender } = req.body

    if (!newusername || !gender) {
      res.status(400).json({
        result: 'true',
        message: 'Please Provide newusername, gender'
      })
    }

    const user = await userModel.findById({ _id: userId })

    if (!user) {
      return res.status(400).json({
        result: 'false',
        message: 'userId does not Find'
      })
    }
    const Edituser = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { username: newusername, gender: gender } },
      { new: true }
    )

    res.status(200).json({
      result: 'true',
      message: 'Profile updated SuccesFully',
      data: {
        username: Edituser.username,
        gender: Edituser.gender,
        email: Edituser.email
      }
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//create user detail api

const Get_user_Details = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({
        result: 'false',
        message: 'userId does not Found'
      })
    }

    const user = await userModel.findById({ _id: userId })

    res.status(200).json({
      result: 'true',
      message: 'User Details',
      username: user.username,
      email: user.email,
      gender: user.gender
    })
  } catch (error) {
    return res.status(400).json({
      result: 'true',
      error: error.message
    })
  }
}
//create user by search api
const Get_User_Search = async (req, res) => {
  try {
    const { username } = req.query

    if (!username) {
      return res.status(400).json({
        result: 'false',
        message: 'Username query parameter is required'
      })
    }

    // const users = await userModel.find({
    //   username: { $regex: username, $options: 'i' }
    //   // to search  from starting  `^${username}
    // })
    // const users = await userModel.find({categoryId:username})

    if (users.length === 0) {
      return res.status(404).json({
        result: 'false',
        message: 'No users found with the given username'
      })
    }

    res.status(200).json({
      result: 'true',
      message: 'Users found',
      totalUsers: users.length,
      users
    })
  } catch (error) {
    return res.status(500).json({
      result: 'false',
      error: error.message
    })
  }
}

//creat category api
const Add_Category = async (req, res) => {
  try {
    const { category_name } = req.body

    if (!category_name) {
      res.status(400).json({
        result: 'false',
        message: 'category_name is required'
      })
    }

    const createcategory = new categoryModel({ category_name })
    const savecategory = await createcategory.save()

    res.status(200).json({
      result: 'true',
      message: 'category added Successfully',
      data: savecategory
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

const Add_Sub_Category = async (req, res) => {
  try {
    const { subcategory_name, categoryId, price } = req.body

    if (!subcategory_name || !categoryId || !price) {
      res.status(400).json({
        result: 'false',
        message: 'subcategory_name, categoryId,price is required'
      })
    }

    const createsubcategory = new subcategoryModel({
      subcategory_name,
      categoryId,
      price,
      image: req.file.filename
    })
    const savesubcategory = await createsubcategory.save()

    res.status(200).json({
      result: 'true',
      message: 'subcategory added Successfully',
      data: savesubcategory
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

// subcategory get
const Find_Sub_Category = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      return res.status(400).json({
        result: 'false',
        message: 'categoryId Id  required'
      })
    }

    const category = await subcategoryModel.find({ categoryId })

    res.status(200).json({
      result: 'true',
      message: 'data fetched succesfully',
      data: category
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

module.exports = {
  User_Register,
  Login_User,
  User_Forget_password,
  User_Edit_ProFile,
  Get_user_Details,
  Get_User_Search,
  Add_Sub_Category,
  Add_Category,
  Find_Sub_Category
}
