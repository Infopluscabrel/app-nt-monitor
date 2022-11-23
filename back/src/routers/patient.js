const express = require('express')
const Patient = require('../models/patient')
//const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/patients', async (req, res) => {
    const patient = new Patient({
        ...req.body
        //owner: req.user._id
    })

    try {
        await patient.save()
        res.status(201).send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /patients?completed=true
// GET /patients?limit=10&skip=20
// GET /patients?sortBy=createdAt:desc

router.get('/patients/all', async (req, res) => {
    const patients = await Patient.find()

    res.send(patients)
})

router.get('/patients', async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'patients',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.patients)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/patients/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const patient = await Patient.findOne({ _id, owner: req.user._id })

        if (!patient) {
            return res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/patients/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const patient = await Patient.findOne({ _id: req.params.id, owner: req.user._id})

        if (!patient) {
            return res.status(404).send()
        }

        updates.forEach((update) => patient[update] = req.body[update])
        await patient.save()
        res.send(patient)
    } catch (e) {
        res.status(400).send(e)
    }
})



router.delete('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!patient) {
            res.status(404).send()
        }

        res.send(patient)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router