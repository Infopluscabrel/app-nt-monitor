const express = require('express')
const request = require('request')
const functions = require('../controllers/functions')
const utils = require('../utils/utils')
const router = new express.Router()



router.get('/api/alldata', async (req, res) => {

   functions.getAllData(res) 
  

})

module.exports = router
