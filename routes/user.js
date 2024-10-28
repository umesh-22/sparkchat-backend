

const express = require('express')
const authenticate = require('../middleware')
const { getUser, updateUser, deleteUser, deleteProfile } = require('../controller/user')

const router = express.Router()

router.get('/getuser',authenticate,getUser)
router.put('/update-profile',authenticate,updateUser)
router.put('/delete-profile',authenticate,deleteProfile)
router.delete('/delete-account',authenticate,deleteUser)



module.exports = router