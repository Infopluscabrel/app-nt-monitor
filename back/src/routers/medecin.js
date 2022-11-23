const express = require('express')
const multer = require('multer')
//const sharp = require('sharp')
const Medecin = require('../models/medecin')
//const auth = require('../middleware/auth')
//const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/medecins', async (req, res) => {
    const medecin = new Medecin(req.body)

    try {
        await medecin.save()
        // sendWelcomeEmail(medecin.email, medecin.name)
       // const token = await medecin.generateAuthToken()
        res.status(201).send(medecin)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/medecins/login', async (req, res) => {
    try {
        console.log( " credentials " + req.body.email +  req.body.password)
        const medecin = await Medecin.findByCredentials(req.body.email, req.body.password)
       // const token = await medecin.generateAuthToken()
        res.send({ medecin })
    } catch (e) {
        res.status(400).send("Nom d'utilisateur ou mot de pass errone")
    }
})

router.post('/medecins/logout', async (req, res) => {
    try {
      //  req.medecin.tokens = req.medecin.tokens.filter((token) => {
       //     return token.token !== req.token})
        
        await req.medecin.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/medecins/logoutAll', async (req, res) => {
    try {
        req.medecin.tokens = []
        await req.medecin.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/medecins/all', async (req, res) => {
    const medecins = await Medecin.find()

    res.send(medecins)
})

router.get('/medecins/me', async (req, res) => {
    res.send(req.medecin)
})

router.patch('/medecins/me', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.medecin[update] = req.body[update])
        await req.medecin.save()
        res.send(req.medecin)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/medecins/me', async (req, res) => {
    try {
        await req.medecin.remove()
        sendCancelationEmail(req.medecin.email, req.medecin.name)
        res.send(req.medecin)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/medecins/me/avatar', upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.medecin.avatar = buffer
    await req.medecin.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/medecins/me/avatar', async (req, res) => {
    req.medecin.avatar = undefined
    await req.medecin.save()
    res.send()
})

router.get('/medecins/:id/avatar', async (req, res) => {
    try {
        const medecin = await Medecin.findById(req.params.id)

        if (!medecin || !medecin.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(medecin.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router