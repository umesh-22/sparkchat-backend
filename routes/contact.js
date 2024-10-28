

const express = require('express')
const authenticate = require('../middleware')
const { searchContact, getContacts } = require('../controller/contact')


const router = express.Router()

router.post('/search',authenticate,searchContact)
router.get('/get-contact',authenticate,getContacts)



module.exports = router