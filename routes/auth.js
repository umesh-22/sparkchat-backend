

const express = require('express')
const { signIn, signUp, logOut, sendOtpToMail, verifyOtp } = require('../controller/auth')
const router = express.Router()

router.post('/signin',signIn)
router.post('/signup',signUp)
router.post('/logout',logOut)
router.post('/send-otp',sendOtpToMail)
router.post('/verify-otp',verifyOtp)



module.exports = router