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
