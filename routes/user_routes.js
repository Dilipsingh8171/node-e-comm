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

const contollers = require('../controllers/user_controller')
// post api
router.post('/register_user', contollers.User_Register)
router.post('/login_user', contollers.Login_User)
router.post('/forgot_password/:userId', contollers.User_Forget_password)
router.post('/addcategory', contollers.Add_Category)
router.post('/create_otp', contollers.Create_Otp)
router.post('/verify_otp', contollers.Verify_Otp)
router.post('/resend_otp', contollers.Resend_Otp)
router.post('/send_mailer', contollers.Send_Mail_Users)
router.post('/send_otp_gmail', contollers.Send_Otp_Gmail)
router.post('/user_mobile_otp', contollers.User_Mobile_Otp)

// router.post(
//   '/addsubcategory',
//   upload.single('image'),
//   contollers.Add_Sub_Category
// )

//put api

router.put('/edit_profile/:userId', contollers.User_Edit_ProFile)
router.put('/update_category', contollers.Update_Category)
router.put('/update_subcategory', contollers.Update_Subcategory)
router.put('/update_subcategory_status', contollers.Update_Subcategory_Status)

// get api
router.get('/search_user', contollers.Get_User_Search)
router.get('/userdetails/:userId', contollers.Get_user_Details)
router.get('/find_sub_category', contollers.Find_Sub_Category)
router.get('/get_subcategory', contollers.Find_All_Subcategory)

//delete api
router.delete('/delete_category', contollers.Delete_Category)
router.delete('/delete_subcategory', contollers.Delete_Subcategory)

module.exports = router
