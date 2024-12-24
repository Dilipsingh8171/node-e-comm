const express = require('express')
const router = express.Router()
// const upload = require('../middlewares/multer')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
    //   cb(null, file.originalname);
  }
})
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/webp' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'application/pdf' ||
      file.mimetype == 'video/mp4' ||
      file.mimetype == 'audio/mpeg'
    ) {
      callback(null, true)
    } else {
      console.log('only  png , jpg & jpeg,csv file supported')
      callback(null, false)
    }
  }
})

const contollers = require('../controllers/controller')
// post api
router.post('/registeruser', contollers.User_Register)
router.post('/loginuser', contollers.Login_User)
router.post('/forgotpassword/:userId', contollers.User_Forget_password)
// router.post('/addproduct', upload.single('image'), contollers.ADD_PRODUCT)
router.post('/addcategory', contollers.Add_Category)
router.post(
  '/addsubcategory',
  upload.single('image'),
  contollers.Add_Sub_Category
)

//put api
router.put('/editprofile/:userId', contollers.User_Edit_ProFile)

// get api
router.get('/searchuser', contollers.Get_User_Search)
router.get('/userdetails/:userId', contollers.Get_user_Details)
router.get('/find_sub_category', contollers.Find_Sub_Category)

module.exports = router
