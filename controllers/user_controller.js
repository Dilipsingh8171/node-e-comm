const userModel = require('../models/user_model')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const categoryModel = require('../models/category_model')
const subcategoryModel = require('../models/subCategory')
const otpModel = require('../models/otpModel')
const cloudinary = require('cloudinary').v2
const nodemailer = require('nodemailer')
const twilio = require('twilio')

// create user register api
const User_Register = async (req, res) => {
  try {
    const { username, email, gender, mobile, password, confirmpassword } =
      req.body

    if (
      !username ||
      !email ||
      !gender ||
      !password ||
      !confirmpassword ||
      !mobile
    ) {
      return res.status(400).json({
        result: 'false',
        message:
          'username, email,mobile,gender, password,confirmpassword Fields are Required'
      })
    }
    if (password !== confirmpassword) {
      return res.status(200).json({
        result: 'false',
        message: 'password and confirm password does not match'
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
        gender: gender,
        mobile: mobile
      })

      const saveuser = await userDetails.save()

      res.status(200).json({
        result: 'true',
        message: 'User Registered Succesfully',
        data: saveuser
      })
    } else {
      res.status(400).json({
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

// mobile and otp login api
const Create_Otp = async (req, res) => {
  try {
    const { mobile_number } = req.body
    if (!mobile_number) {
      res.status(400),
        json({
          result: 'false',
          message: 'mobile_number is required '
        })
    }

    const otp = Math.floor(1000 + Math.random() * 9000)

    const addotp = new otpModel({
      mobile: mobile_number,
      otp: otp
    })
    const saveotp = await addotp.save()
    return res.status(200).json({
      result: 'true',
      message: 'Mobile and otp Added successflly',
      data: saveotp
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

// verify otp
const Verify_Otp = async (req, res) => {
  try {
    const { otp, mobile_number } = req.body

    if (!otp || !mobile_number) {
      return res.status(400).json({
        result: 'false',
        message: 'otp, mobile_number is required'
      })
    }
    const existmobile = await otpModel.findOne({ mobile: mobile_number })

    if (!existmobile) {
      return res.status(400).json({
        result: 'false',
        message: 'mobile_number does not exist'
      })
    }
    if (existmobile.otp === otp) {
      await otpModel.updateOne(
        { mobile: mobile_number },
        { $unset: { otp: '' } }
      )
      res.status(200).json({
        result: 'true',
        message: 'Otp Verified'
      })
    } else {
      res.status(400).json({
        result: 'false',
        message: 'otp did not match'
      })
    }
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

const Resend_Otp = async (req, res) => {
  try {
    const { mobile_number } = req.body
    if (!mobile_number) {
      res.status(400).json({
        result: 'false',
        message: 'mobile_number is required'
      })
    }

    const existnumber = await otpModel.findOne({ mobile: mobile_number })

    if (!existnumber) {
      return res.status(400).json({
        result: 'false',
        message: 'mobile_number does not exist'
      })
    }

    const genrateotp = Math.floor(1000 + Math.random() * 9000)

    const addotp = await otpModel.findByIdAndUpdate(
      { _id: existnumber._id },
      {
        $set: {
          mobile: mobile_number,
          otp: genrateotp
        }
      },
      { new: true }
    )
    return res.status(200).json({
      result: 'true',
      message: 'otp resent successflly',
      data: addotp
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//send otp on mail by nodemailer
const Send_Mail_Users = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        result: 'false',
        message: 'email is required'
      })
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      // service: 'gmail',
      port: process.env.SMPT_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    })

    const User = await userModel.find({})

    User.forEach(user => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'An Application for Node.js Task',
        html: '<h1>Email Verification</h1>'
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error.message)
        } else {
          console.log(' sent email successfully')
        }
      })
    })

    res.status(200).json({
      result: 'true',
      message: 'message sent Successfully'
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}
//send otp single user by mail
const Send_Otp_Gmail = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({
        result: 'false',
        message: 'email is required'
      })
    }

    const userdata = await userModel.findOne({ email })

    if (!userdata) {
      return res.status(400).json({
        result: 'false',
        message: 'email does not exist'
      })
    }

    const generateotp = Math.floor(1000 + Math.random() * 9000)

    const transporter = nodemailer.createTransport({
      service: 'gmail.com',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    })

    const mailOptions = {
      from: process.env.EMAIL,
      subject: 'An email message for particular user',
      to: userdata.email,
      html: `<h1> Welcome, ${userdata.username} </h1> <br> your otp is ${generateotp}`
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (err) {
        console.log(error.message)
      } else {
        console.log('message sent successfully')
      }
    })
    res.status(200).json({
      result: 'true',
      message: 'otp sent succssfully'
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//Send_otp_users_mobile

const User_Mobile_Otp = async (req, res) => {
  try {
    const { mobile_number, to } = req.body

    if (!mobile_number) {
      return res.status(400).json({
        result: 'false',
        message: 'mobile_number is required'
      })
    }
    const usermobile = await userModel.findOne({ mobile: mobile_number })

    if (!usermobile) {
      return res.status(400).json({
        result: 'false',
        message: 'mobile number does not exist'
      })
    }
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = twilio(accountSid, authToken)

    const message = await client.messages.create({
      body: 'This  message sent by logical softtech',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })

    res.status(200).json({
      result: 'true',
      message: 'message sent successfully',
      data: message.body
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message,
      message: 'error'
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

//create category api
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
//update category api
const Update_Category = async (req, res) => {
  try {
    const { categoryId, category_name } = req.body
    if (!categoryId || !category_name) {
      return res.status(400).json({
        result: 'true',
        message: 'Parameter required : categoryId  optional (category_name)'
      })
    }
    const cid = await categoryModel.findOne({ _id: categoryId })

    if (cid) {
      const category = await categoryModel.findByIdAndUpdate(
        { _id: categoryId },
        { $set: { category_name: category_name } },
        { new: true }
      )

      return res.status(200).json({
        result: 'true',
        message: 'category_name updated succesfully',
        data: category
      })
    } else {
      res.status(400).json({
        result: 'true',
        message: 'categoryId does not exit.'
      })
    }
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//delete_category
const Delete_Category = async (req, res) => {
  try {
    const { categoryId } = req.body

    if (!categoryId) {
      res.status(400).json({
        result: 'false',
        message: 'categoryId is required'
      })
    }

    const cId = await categoryModel.findOne({ _id: categoryId })

    if (!cId) {
      res.status(400).json({
        result: 'false',
        message: 'categoryId does not exist'
      })
    } else {
      const category = await categoryModel.findByIdAndDelete({
        _id: categoryId
      })

      return res.status(200).json({
        result: 'true',
        message: 'category deleted Successfully',
        data: category
      })
    }
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//create add subcatgory api
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

//get  subcategory from categoryid
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

//update subcatgory
const Update_Subcategory = async (req, res) => {
  try {
    const { subcategoryId, subcategory_name } = req.body
    if (!subcategoryId) {
      return res.status(400).json({
        result: 'true',
        message: 'Parameter required : categoryId  optional (subcategory_name)'
      })
    }

    const sub_category = await subcategoryModel.findOne({ _id: subcategoryId })
    if (sub_category) {
      const update_subcategory = await subcategoryModel.findByIdAndUpdate(
        { _id: subcategoryId },
        { $set: { subcategory_name: subcategory_name } },
        { new: true }
      )
      res.status(200).json({
        result: 'true',
        message: 'Sub_Category Updated Succesfully',
        data: update_subcategory
      })
    } else {
      res.status(400).json({
        result: 'false',
        message: 'sub_categoryId does not exist'
      })
    }
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//delete sub category
const Delete_Subcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.body

    if (!subcategoryId) {
      return res.status(400).json({
        result: 'false',
        message: 'subcategoryId is required'
      })
    }

    const sid = await subcategoryModel.findOne({ _id: subcategoryId })

    if (sid) {
      const delete_subsategory = await subcategoryModel.findByIdAndDelete({
        _id: subcategoryId
      })

      return res.status(200).json({
        result: 'true',
        message: 'Sub_category deleted Succesfully',
        data: delete_subsategory
      })
    } else {
      res.status(400).json({
        result: 'false',
        message: 'subcategoryId does not exist '
      })
    }
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

// get sub_category with category
const Find_All_Subcategory = async (req, res) => {
  try {
    const getdata = await subcategoryModel.find({}).populate('categoryId')

    res.status(200).json({
      result: 'true',
      message: 'fetch  category data sucessfully',
      data: getdata
    })
  } catch (error) {
    return res.status(400).json({
      result: 'false',
      error: error.message
    })
  }
}

//update sub_category_status
const Update_Subcategory_Status = async (req, res) => {
  try {
    const { subcategoryId } = req.body
    if (!subcategoryId) {
      return res.status(400).json({
        result: 'false',
        message: 'subcategoryId is required'
      })
    }

    const subcategory = await subcategoryModel.findOne({
      _id: subcategoryId
    })

    if (subcategory) {
      const changestatus = subcategory.subcategory_status == 0 ? 1 : 0

      console.log(changestatus)
      const updatestatus = await subcategoryModel.findByIdAndUpdate(
        { _id: subcategoryId },
        { $set: { subcategory_status: changestatus } },
        { new: true }
      )
      return res.status(200).json({
        result: 'true',
        message: 'status updated Successfully',
        data: updatestatus
      })
    } else {
      return res.status(400).json({
        result: 'false',
        message: 'subcategoryId does not exist'
      })
    }
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
  Find_Sub_Category,
  Find_All_Subcategory,
  Update_Category,
  Delete_Category,
  Update_Subcategory,
  Delete_Subcategory,
  Update_Subcategory_Status,
  Create_Otp,
  Verify_Otp,
  Resend_Otp,
  Send_Mail_Users,
  Send_Otp_Gmail,
  User_Mobile_Otp
}
