// const Login_User = async (req, res) => {
//   try {
//     const { username, password } = req.body

//     if (!username || !password) {
//       return res.status(400).json({
//         result: 'false',
//         message: 'Username and password are required'
//       })
//     }

//     const user = await userModel.findOne({ username })
//     const isMatch = await bcrypt.compare(password, user.password)

//     if (user && isMatch) {
//       const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
//         expiresIn: '10d'
//       })

//       return res.status(200).json({
//         result: 'true',
//         message: 'User logged in successfully',
//         token,
//         data: {
//           id: user._id,
//           username: user.username,
//           email: user.email
//         }
//       })
//     } else {
//       return res.status(400).json({
//         result: 'false',
//         message: 'Invalid username or password'
//       })
//     }

//   } catch (error) {
//     return res.status(500).json({
//       result: 'false',
//       message: 'Error In  Login',
//       error: error.message
//     })
//   }
// }

//create  user Login  api
//create product add api
// const ADD_PRODUCT = async (req, res) => {
//   try {
//     const { categoryId, product_name, price, sub_category } = req.body

//     if (!product_name) {
//       return res.status(400).json({
//         result: 'false',
//         error: 'Product_name is Required '
//       })
//     }
//     // const response = await cloudinary.uploader.upload(req.file.path)

//     const newproduct = new productModel({
//       categoryId,
//       product_name,
//       price,
//       sub_category,
//       image: req.file.filename
//     })
//     const saveproduct = await newproduct.save()

//     res.status(200).json({
//       result: 'true',
//       message: 'product data ',
//       data: saveproduct
//     })
//   } catch (error) {
//     return res.status(400).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }

// const GET_PRODUCT_BY_CATEGORY = async (req, res) => {
//     try {
//       const searchproduct = await categoryModel.find({})

//       res.status(200).json({
//         result: 'true',
//         message: 'all products fetched successfully',
//         totalProducts: searchproduct.length,
//         searchproduct
//       })
//     } catch (error) {
//       return res.status(400).json({
//         result: 'false',
//         error: error.message
//       })
//     }
//   }

//create find product api
// const GET_PRODUCT = async (req, res) => {
//   try {
//     const searchproduct = await productModel.find({}).populate('categoryId')

//     res.status(200).json({
//       result: 'true',
//       message: 'all products fetched successfully',
//       totalProducts: searchproduct.length,
//       searchproduct
//     })
//   } catch (error) {
//     return res.status(400).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }
/////////////////get data with aggregation//////////////////
//getdata with aggregate
// const getdata = await subcategoryModel.aggregate([
//   {
//     $lookup: {
//       from: 'categories',
//       localField: 'categoryId',
//       foreignField: '_id',
//       as: 'categoryData'
//     }
//   },
//   {
//     $unwind: '$categoryData'
//   },
//   {
//     $project: {
//       _id: 0,
//       subcategory_name: 1,
//       price: 1,
//       'categoryData.category_name': 1
//     }
//   }
// ])

// const Update_Subcategory_Status = async (req, res) => {
//   try {
//     const { subcategoryId } = req.body

//     if (!subcategoryId) {
//       return res.status(400).json({
//         result: 'false',
//         message: 'subcategoryId is required'
//       })
//     }

//     const sub_category = await subcategoryModel.findOne({ _id: subcategoryId })

//     if (sub_category) {
//       const newStatus = sub_category.subcategory_status === 0 ? 1 : 0

//       const update_subcategory = await subcategoryModel.findByIdAndUpdate(
//         {_id:subcategoryId},
//         { $set: { subcategory_status: newStatus } },
//         { new: true }
//       )

//       const statusMessage =
//         newStatus === 0 ? 'Status is Deactivated' : 'Status is Active'

//       return res.status(200).json({
//         result: 'true',
//         message: `Sub_Category Updated Successfully. ${statusMessage}`,
//         data: update_subcategory
//       })
//     } else {
//       return res.status(400).json({
//         result: 'false',
//         message: 'subcategoryId does not exist'
//       })
//     }
//   } catch (error) {
//     return res.status(400).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }
// const Create_Otp = async (req, res) => {
//   try {
//     const { mobile_number } = req.body

//     if (!mobile_number) {
//       return res.status(400).json({
//         result: 'false',
//         message: 'mobile_number is required'
//       })
//     }

//     // Generate a 4-digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000)

//     // OTP valid for 5 minutes

//     // Check if an OTP already exists for the mobile number
//     const existOtp = await otpModel.findOne({ mobile: mobile_number })

//     if (existOtp) {
//       // Update existing OTP
//       existOtp.otp = otp
//       existOtp.expiresAt = expiresIn
//       await existOtp.save()
//     } else {
//       // Create a new OTP record
//       const addOtp = new otpModel({
//         mobile: mobile_number,
//         otp: otp,
//         expiresAt: expiresIn
//       })
//       await addOtp.save()
//     }

//     return res.status(200).json({
//       result: 'true',
//       message: 'OTP generated successfully'
//     })
//   } catch (error) {
//     return res.status(500).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }
//single
// const Send_Mailer = async (req, res) => {
//   try {
//     const { email } = req.body

//     if (!email) {
//       return res.status(400).json({
//         result: 'false',
//         message: 'email is required'
//       })
//     }
//     console.log(email)

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       // service: 'gmail',
//       port: SMPT_PORT,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
//       }
//     })

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'An Application from Node.js Task',
//       html: '<h1>Email Verification</h1>'
//     }

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error.message)
//       } else {
//         console.log(' sent email successfully')
//       }
//     })

//     res.status(200).json({
//       result: 'true',
//       message: 'message sent Successfully'
//     })
//   } catch (error) {
//     return res.status(400).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }

//mailsender all user with databse
// const Send_Mailer = async (req, res) => {
//   try {
//     const { email } = req.body

//     if (!email) {
//       return res.status(400).json({
//         result: 'false',
//         message: 'email is required'
//       })
//     }

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       // service: 'gmail',
//       port: process.env.SMPT_PORT,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.PASS
//       }
//     })

//     const User = await userModel.find({})

//     User.forEach(user => {
//       const mailOptions = {
//         from: process.env.EMAIL,
//         to: user.email,
//         subject: 'An Application for Node.js Task',
//         html: '<h1>Email Verification</h1>'
//       }

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error.message)
//         } else {
//           console.log(' sent email successfully')
//         }
//       })
//     })

//     res.status(200).json({
//       result: 'true',
//       message: 'message sent Successfully'
//     })
//   } catch (error) {
//     return res.status(400).json({
//       result: 'false',
//       error: error.message
//     })
//   }
// }
